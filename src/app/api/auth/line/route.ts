import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(request: Request) {
    const state = crypto.randomBytes(16).toString('hex')
    const clientId = process.env.LINE_CLIENT_ID

    // We can infer the redirect URI from the request URL if not provided
    const { origin } = new URL(request.url)
    const redirectUri = process.env.LINE_REDIRECT_URI || `${origin}/api/auth/callback/line`

    // Local Development Bypass for dummy credentials
    if (!clientId || clientId === 'dummy_line_id' || clientId === 'your_line_client_id') {
        const bypassUrl = new URL(redirectUri)
        bypassUrl.searchParams.append('code', 'dummy_code_for_local_dev')
        bypassUrl.searchParams.append('state', state)
        return NextResponse.redirect(bypassUrl.toString())
    }

    const lineAuthUrl = new URL('https://access.line.me/oauth2/v2.1/authorize')
    lineAuthUrl.searchParams.append('response_type', 'code')
    lineAuthUrl.searchParams.append('client_id', clientId)
    lineAuthUrl.searchParams.append('redirect_uri', redirectUri)
    lineAuthUrl.searchParams.append('state', state)
    lineAuthUrl.searchParams.append('scope', 'profile openid email')

    return NextResponse.redirect(lineAuthUrl.toString())
}
