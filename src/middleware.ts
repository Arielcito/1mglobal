import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/forget-password']
  const isPublicRoute = publicRoutes.includes(pathname)
  const isDashboardRoute = pathname.startsWith('/dashboard')
  
  // Verificar token si existe
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      await jwtVerify(token, secret)
    } catch (error) {
      // Si el token es inválido o ha expirado, eliminar la cookie y redirigir al login
      const response = NextResponse.redirect(new URL('/auth/signin', request.url))
      response.cookies.delete('token')
      response.cookies.delete('userEmail')
      response.cookies.delete('userId')
      return response
    }
  }

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
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/auth/signin', request.url))
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
