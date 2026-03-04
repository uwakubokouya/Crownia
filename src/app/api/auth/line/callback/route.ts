import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error || !code) {
        return NextResponse.redirect(`${origin}/login?error=LineAuthFailed`)
    }

    const redirectUri = process.env.LINE_REDIRECT_URI || `${origin}/api/auth/line/callback`

    // 1. Exchange code for LINE token
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: process.env.LINE_CLIENT_ID!,
            client_secret: process.env.LINE_CLIENT_SECRET!,
        }),
    })

    const tokenData = await tokenResponse.json()
    if (!tokenData.id_token) {
        console.error('LINE token error:', tokenData)
        return NextResponse.redirect(`${origin}/login?error=LineTokenFailed`)
    }

    // 2. Decode LINE ID Token (JWT)
    const payloadBase64 = tokenData.id_token.split('.')[1]
    const payloadString = Buffer.from(payloadBase64, 'base64').toString('utf-8')
    const idTokenPayload = JSON.parse(payloadString)

    const lineUserId = idTokenPayload.sub
    // If user hasn't granted email permission or LINE doesn't have it, create a proxy email
    const email = idTokenPayload.email || `${lineUserId}@line-proxy.crownia.app`
    const name = idTokenPayload.name || 'ゲスト'
    const picture = idTokenPayload.picture || ''

    // 3. Generate Deterministic Password using Service Role Key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const password = crypto
        .createHmac('sha256', serviceRoleKey)
        .update(lineUserId)
        .digest('hex')

    // 4. Upsert User in Supabase using Admin API
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Attempt to create user
    await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: name,
            avatar_url: picture,
            provider: 'line',
            line_id: lineUserId
        }
    })
    // Note: If user already exists, the above will fail silently which is fine 
    // because their password is deterministic and hasn't changed.

    // 5. Sign In the user to set cookies for the current session
    const supabaseClient = await createClient()
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    })

    if (signInError) {
        console.error('SignIn error:', signInError)
        return NextResponse.redirect(`${origin}/login?error=SupabaseSignInFailed`)
    }

    return NextResponse.redirect(`${origin}/dashboard`)
}
