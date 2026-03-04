import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(request: Request) {
    const state = crypto.randomBytes(16).toString('hex')

    const lineAuthUrl = new URL('https://access.line.me/oauth2/v2.1/authorize')
    lineAuthUrl.searchParams.append('response_type', 'code')
    lineAuthUrl.searchParams.append('client_id', process.env.LINE_CLIENT_ID!)

    // We can infer the redirect URI from the request URL if not provided
    const { origin } = new URL(request.url)
    const redirectUri = process.env.LINE_REDIRECT_URI || `${origin}/api/auth/line/callback`

    lineAuthUrl.searchParams.append('redirect_uri', redirectUri)
    lineAuthUrl.searchParams.append('state', state)
    lineAuthUrl.searchParams.append('scope', 'profile openid email')

    return NextResponse.redirect(lineAuthUrl.toString())
}
