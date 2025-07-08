import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('authToken')
  const userData = request.cookies.get('userData')
  
  if (!token && !userData) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/csvupload/:path*', '/dashboard/:path*']
}