import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar'
});

export default function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get('isAuthenticated')?.value === 'true';

  const pathname = req.nextUrl.pathname;
  const isLoginPage = pathname.includes('/login');

  if (!isAuthenticated && !isLoginPage) {
    const localeMatch = pathname.match(/^\/(ar|en)/);
    const locale = localeMatch ? localeMatch[1] : 'ar';
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  if (isAuthenticated && isLoginPage) {
    const localeMatch = pathname.match(/^\/(ar|en)/);
    const locale = localeMatch ? localeMatch[1] : 'ar';
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return intlMiddleware(req);
}
 
export const config = {
  matcher: ['/', '/(ar|en)', '/(ar|en)/:path*']
};
