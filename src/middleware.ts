import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/forget-password']
  const isPublicRoute = publicRoutes.includes(pathname)
  const isDashboardRoute = pathname.startsWith('/dashboard')
  
  // Si el usuario está autenticado y trata de acceder a rutas públicas
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Si el usuario no está autenticado y trata de acceder a rutas protegidas
  if (!token && isDashboardRoute) {
    const signinUrl = new URL('/auth/signin', request.url)
    signinUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname))
    return NextResponse.redirect(signinUrl)
  }
  
  // Si el usuario accede a la raíz
  if (pathname === '/') {
    if (token) {
      // Evitamos redireccionar si ya estamos en /dashboard
      if (pathname !== '/dashboard') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } else {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/auth/signin',
    '/auth/signup',
    '/auth/forget-password'
  ]
}
