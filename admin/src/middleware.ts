import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname === '/login') {
    const token = request.cookies.get('admin-session')?.value;
    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch {
        // Invalid token, continue to login
      }
    }
    return NextResponse.next();
  }

  // Protected routes (/admin/*)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-session')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);

      // Check role-based access
      const role = payload.role as 'ADMIN' | 'OPERATOR';

      // ADMIN-only routes
      const adminOnlyRoutes = ['/admin/plans', '/admin/audit'];
      const isAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));

      if (isAdminRoute && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
