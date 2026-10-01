"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Mail, Lock, LogIn, ArrowRight, ArrowLeft, BarChart3, Users, Zap, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const locale = useLocale();
  const isAr = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
      document.cookie = "isAuthenticated=true; path=/; max-age=86400;";
      window.location.href = `/${locale}`;
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white flex" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Visual / Branding Side (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-between p-12">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[var(--primary)]/20 blur-[120px] mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-2xl tracking-wide">{isAr ? "دليل الشرق" : "East Guide"}</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-blue-300 text-xs font-bold mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span>{isAr ? "الجيل الجديد من أنظمة إدارة العملاء" : "Next Generation CRM System"}</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-[1.15] tracking-tight mb-6">
            {isAr ? "تحكم بمبيعاتك بذكاء وفعالية" : "Control your sales with intelligence"}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            {isAr 
              ? "منصة متكاملة مصممة خصيصاً للشركات الطموحة لإدارة علاقات العملاء، تحليل البيانات، وتحقيق أهداف المبيعات بدقة عالية."
              : "An integrated platform designed specifically for ambitious companies to manage CRM, analyze data, and hit sales targets with high precision."}
          </p>

          {/* Floating Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <BarChart3 className="w-6 h-6 text-emerald-400 mb-3" />
              <h3 className="text-white font-bold mb-1">{isAr ? "تحليلات دقيقة" : "Precise Analytics"}</h3>
              <p className="text-slate-400 text-sm">{isAr ? "تقارير مبيعات لحظية" : "Real-time sales reports"}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <Users className="w-6 h-6 text-blue-400 mb-3" />
              <h3 className="text-white font-bold mb-1">{isAr ? "إدارة الفريق" : "Team Management"}</h3>
              <p className="text-slate-400 text-sm">{isAr ? "تتبع المهام والأداء" : "Track tasks and performance"}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto pt-12">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} East Guide IT Group. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-slate-900 font-bold text-2xl tracking-wide">{isAr ? "دليل الشرق" : "East Guide"}</span>
          </div>

          <div className="text-center lg:text-start">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{isAr ? "تسجيل الدخول" : "Welcome Back"}</h2>
            <p className="text-slate-500">{isAr ? "أدخل بيانات حسابك للوصول إلى لوحة التحكم" : "Enter your credentials to access the dashboard"}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 mt-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 flex items-center pointer-events-none px-4 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@daleel.com"
                  className="w-full bg-white border-2 border-slate-200 rounded-xl py-3.5 px-12 text-slate-800 focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all font-medium"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">{isAr ? "كلمة المرور" : "Password"}</label>
                <a href="#" className="text-sm text-[var(--primary)] hover:underline font-bold transition-all hover:text-blue-700">
                  {isAr ? "نسيت كلمة المرور؟" : "Forgot Password?"}
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 flex items-center pointer-events-none px-4 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white border-2 border-slate-200 rounded-xl py-3.5 px-12 text-slate-800 focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all font-medium"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="relative w-full overflow-hidden bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-4 font-bold shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span className="text-lg">{isAr ? "تسجيل الدخول" : "Sign In"}</span>
                  {isAr ? (
                    <ArrowLeft className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all absolute left-6" />
                  ) : (
                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all absolute right-6" />
                  )}
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 bg-slate-50 inline-block px-4 py-2 rounded-lg border border-slate-200 font-medium">
              💡 {isAr ? "للنسخة التجريبية: أدخل أي إيميل وكلمة مرور" : "For Demo: Enter any email & password"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
