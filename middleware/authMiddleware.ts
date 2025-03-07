import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cek apakah token ada di cookies
  const token = request.cookies.get('token');

  if (!token) {
    // Jika token tidak ada, arahkan pengguna ke halaman login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Mengatur URL yang perlu diperiksa middleware
export const config = {
  matcher: '/dashboard/*', // Hanya halaman dashboard yang dilindungi middleware ini
};
