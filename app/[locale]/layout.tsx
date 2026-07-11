import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  
  return {
    title: {
      default: isAr ? "دليل الشرق CRM | لوحة التحكم وإدارة العملاء" : "East Guide CRM | Smart Lead Management Suite",
      template: isAr ? "%s | دليل الشرق CRM" : "%s | East Guide CRM"
    },
    description: isAr 
      ? "نظام دليل الشرق المتكامل لإدارة العلاقات مع العملاء (CRM)، مبيعات الشركات، إدارة المهام والموظفين، والتحليلات المدعومة بالذكاء الاصطناعي." 
      : "Integrated East Guide CRM suite for lead management, corporate sales, tasks tracking, employee analytics, and AI recommendations.",
    keywords: [
      "CRM", "دليل الشرق", "إدارة العملاء", "برنامج مبيعات", "واتساب CRM", 
      "متابعة العملاء", "Sales CRM", "Lead Management", "AI CRM"
    ],
    authors: [{ name: "East Guide IT Group" }],
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: isAr ? "دليل الشرق CRM | النظام المتكامل لإدارة المبيعات" : "East Guide CRM Suite",
      description: isAr 
        ? "أدر مبيعاتك وعملائك وموظفيك من مكان واحد بأقصى كفاءة فنية وبتقارير تفصيلية." 
        : "Manage your sales, leads, and employees from a single place with detailed reports.",
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
    }
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={cairo.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans antialiased transition-colors duration-300">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
