import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar'
});
 
export const config = {
  matcher: ['/', '/(ar|en)', '/(ar|en)/:path*']
};
