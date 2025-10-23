import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createSupabaseMiddlewareClient } from './lib/supabaseServer'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createSupabaseMiddlewareClient(request, response)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/api/generate') ||
    pathname.startsWith('/api/delete')

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')

  if (!session && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (session && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/generate/:path*', '/api/delete/:path*', '/login', '/signup'],
}
