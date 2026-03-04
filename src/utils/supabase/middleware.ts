import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    supabaseResponse.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    supabaseResponse.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Fetch session to refresh auth token
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const publicRoutes = ['/login', '/terms', '/privacy']
    const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route)) || request.nextUrl.pathname === '/logo.png'

    if (!user && !isPublicRoute && !request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/auth/')) {
        // Redirect to login if unauthenticated
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user && request.nextUrl.pathname.startsWith('/login')) {
        // Redirect to dashboard if logged in
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
