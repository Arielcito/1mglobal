import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('🔄 Middleware ejecutándose en:', request.nextUrl.pathname);
  const token = request.cookies.get('token')?.value
  console.log('🔑 Token presente:', !!token);
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

  console.log('📍 Tipo de página:', { isAuthPage, isDashboardPage });

  if (isDashboardPage && !token) {
    console.log('❌ Acceso a dashboard sin token, redirigiendo a login');
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  if (isAuthPage && token) {
    console.log('✅ Token presente en página de auth, redirigiendo a dashboard');
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    response.cookies.set('token', token, {
      secure: true,
      sameSite: 'strict',
      path: '/'
    })
    return response
  }

  console.log('✅ Continuando con la solicitud');
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
};
