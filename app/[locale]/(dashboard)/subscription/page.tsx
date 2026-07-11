"use client";

import { useState } from "react";
import { CheckCircle, Zap, Building, Crown, X, Loader2, Users, ShieldAlert } from "lucide-react";
import { useLocale } from "next-intl";

export default function SubscriptionPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  // Stateful subscription plan
  const [currentPlan, setCurrentPlan] = useState<'Growth' | 'Enterprise'>('Growth');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpgradeConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpgrading(true);

    setTimeout(() => {
      setIsUpgrading(false);
      setCurrentPlan('Enterprise');
      setShowUpgradeModal(false);
      showToast(isAr ? "تمت ترقية الباقة إلى باقة Enterprise بنجاح!" : "Successfully upgraded to Enterprise Plan!");
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header section */}
      <div className="text-center py-6 space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
          {isAr ? "باقة الاشتراك والترقيات" : "Subscription Plan & Upgrades"}
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
          {isAr 
            ? "تحكم في اشتراكك الشهري، وتابع معدلات استهلاك الموارد المحددة لشركتك." 
            : "Manage your active subscription and track resource usage limits for your team."}
        </p>
      </div>

      {/* Current Active Plan Banner */}
      <div className="stat-card bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 rounded-2xl shadow-xl overflow-hidden relative border-t-4 border-[var(--primary)] text-start">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="text-start">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold w-fit mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isAr ? "الاشتراك النشط حالياً" : "Currently Active Subscription"}
            </div>
            
            <h3 className="text-3xl font-black tracking-tight flex items-center gap-2">
              {currentPlan === 'Growth' ? (
                <>
                  <Building className="w-8 h-8 text-[var(--primary)]" />
                  <span>{isAr ? "باقة Growth" : "Growth Plan"}</span>
                </>
              ) : (
                <>
                  <Crown className="w-8 h-8 text-amber-400 animate-bounce" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                    {isAr ? "باقة Enterprise" : "Enterprise Plan"}
                  </span>
                </>
              )}
            </h3>
            
            <p className="mt-2 text-slate-300 text-sm max-w-md leading-relaxed">
              {currentPlan === 'Growth' 
                ? (isAr ? "باقة متكاملة تم إعدادها لتغطية احتياجات فرق العمل المتوسطة وإدارة المبيعات بكفاءة." : "A complete plan configured to support mid-sized business teams and sales managers.")
                : (isAr ? "أعلى باقات النظام؛ تمنحك وصولاً غير محدود للموارد واستخداماً كاملاً لجميع أدوات المساعد الذكي." : "The ultimate tier of our system. Grants unlimited resource usage and full access to AI recommendations.")}
            </p>
          </div>

          <div className="text-start md:text-end">
            <div className="text-4xl font-extrabold">
              {currentPlan === 'Growth' ? "299$" : "599$"} 
              <span className="text-sm font-normal text-slate-400"> / {isAr ? "شهرياً" : "month"}</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">
              {isAr ? "الدفعة القادمة: 15 أغسطس 2026" : "Next Payment: August 15, 2026"}
            </div>
          </div>
        </div>

        {/* Live Limits Usage Metrics */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-start">
            {isAr ? "معدلات استخدام الموارد المتاحة:" : "Active Resource Usage:"}
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Users Limit */}
            <div className="space-y-2 text-start">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">{isAr ? "عدد المستخدمين النشطين" : "Active Users"}</span>
                <span>{currentPlan === 'Growth' ? "7 / 10" : "7 / Unlimited"}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-500" style={{ width: currentPlan === 'Growth' ? '70%' : '15%' }} />
              </div>
            </div>

            {/* Leads Limit */}
            <div className="space-y-2 text-start">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">{isAr ? "العملاء المحتملين (Leads)" : "Active Leads"}</span>
                <span>{currentPlan === 'Growth' ? "4,230 / 10,000" : "4,230 / Unlimited"}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: currentPlan === 'Growth' ? '42.3%' : '5%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Comparison */}
      <div className="grid md:grid-cols-3 gap-6 pt-6">
        {/* Starter Plan */}
        <div className="stat-card border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-all duration-300 opacity-60 text-start">
          <div>
            <h3 className="font-bold text-lg mb-1 text-slate-700">{isAr ? "باقة Starter" : "Starter Plan"}</h3>
            <p className="text-xs text-slate-400 mb-4">{isAr ? "للشركات الناشئة" : "For startup businesses"}</p>
            <div className="text-3xl font-extrabold text-slate-800 mb-5">99$ <span className="text-sm font-normal text-slate-400">/ {isAr ? "شهرياً" : "mo"}</span></div>
            
            <ul className="space-y-3 mb-6 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{isAr ? "3 مستخدمين للنظام" : "3 Users"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{isAr ? "1,000 عميل محتمل" : "1,000 Leads"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{isAr ? "تقارير وتحليلات أساسية" : "Basic Reports"}</span>
              </li>
            </ul>
          </div>
          <button className="btn-outline w-full cursor-not-allowed opacity-50 text-sm" disabled>
            {isAr ? "الرجوع لهذه الباقة" : "Downgrade"}
          </button>
        </div>

        {/* Growth Plan */}
        <div className={`stat-card border-2 ${currentPlan === 'Growth' ? 'border-[var(--primary)] shadow-md' : 'border-slate-100'} flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative text-start`}>
          {currentPlan === 'Growth' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--primary)] text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold">
              {isAr ? "الباقة الحالية" : "Current Plan"}
            </div>
          )}
          
          <div>
            <h3 className="font-bold text-lg mb-1 text-[var(--primary)]">{isAr ? "باقة Growth" : "Growth Plan"}</h3>
            <p className="text-xs text-slate-400 mb-4">{isAr ? "الباقة الأكثر شعبية" : "Most popular plan"}</p>
            <div className="text-3xl font-extrabold text-slate-800 mb-5">299$ <span className="text-sm font-normal text-slate-400">/ {isAr ? "شهرياً" : "mo"}</span></div>
            
            <ul className="space-y-3 mb-6 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{isAr ? "10 مستخدمين نشطين" : "10 Users"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{isAr ? "10,000 عميل محتمل" : "10,000 Leads"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{isAr ? "ربط واتساب API مجاناً" : "WhatsApp API Integration"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{isAr ? "المساعد الذكي (الذكاء الاصطناعي)" : "AI Assistant (Basic)"}</span>
              </li>
            </ul>
          </div>
          
          {currentPlan === 'Growth' ? (
            <button className="w-full py-2 bg-slate-100 text-slate-500 rounded-xl font-semibold cursor-default text-sm">
              {isAr ? "مفعلة حالياً" : "Active Now"}
            </button>
          ) : (
            <button 
              onClick={() => {
                setCurrentPlan('Growth');
                showToast(isAr ? "تم خفض الباقة إلى Growth" : "Downgraded to Growth Plan");
              }}
              className="btn-outline w-full cursor-pointer font-semibold text-sm"
            >
              {isAr ? "التحويل لباقة Growth" : "Switch to Growth"}
            </button>
          )}
        </div>

        {/* Enterprise Plan */}
        <div className={`stat-card ${currentPlan === 'Enterprise' ? 'border-amber-500' : 'border-slate-100'} bg-gradient-to-b from-amber-50/50 to-white flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden text-start`}>
          <div className="absolute -right-5 top-5 rotate-45 bg-amber-500 text-white text-[9px] uppercase tracking-widest px-8 py-1 font-extrabold text-center w-32">
            {isAr ? "الترقية الأفضل" : "Best Value"}
          </div>

          <div>
            <h3 className="font-bold text-lg mb-1 text-amber-700 flex items-center gap-1.5 justify-start">
              <Crown className="w-5 h-5 text-amber-500" />
              <span>{isAr ? "باقة Enterprise" : "Enterprise Plan"}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">{isAr ? "للمؤسسات والشركات الكبيرة" : "For large enterprises"}</p>
            <div className="text-3xl font-extrabold text-slate-800 mb-5">599$ <span className="text-sm font-normal text-slate-400">/ {isAr ? "شهرياً" : "mo"}</span></div>
            
            <ul className="space-y-3 mb-6 text-sm text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{isAr ? "مستخدمين نشطين لامحدود" : "Unlimited Users"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{isAr ? "عملاء محتملين لامحدود" : "Unlimited Leads"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{isAr ? "ربط دومين خاص (Custom Domain)" : "Custom Domain Support"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{isAr ? "المساعد الذكي الفائق بمميزات كاملة" : "Advanced AI Assistant"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{isAr ? "مدير حساب خاص للدعم التقني 24/7" : "Dedicated Support Manager"}</span>
              </li>
            </ul>
          </div>

          {currentPlan === 'Enterprise' ? (
            <button className="w-full py-2 bg-slate-100 text-slate-500 rounded-xl font-semibold cursor-default text-sm">
              {isAr ? "مفعلة حالياً" : "Active Now"}
            </button>
          ) : (
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold hover:shadow-md hover:from-amber-600 hover:to-yellow-600 transition-all flex justify-center items-center gap-2 cursor-pointer text-sm shadow-sm"
            >
              <Zap className="w-4 h-4 animate-pulse" /> {isAr ? "ترقية الآن" : "Upgrade Now"}
            </button>
          )}
        </div>
      </div>

      {/* Upgrade Checkout Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-md text-slate-800">{isAr ? "تأكيد ترقية الاشتراك" : "Confirm Subscription Upgrade"}</h3>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpgradeConfirm} className="p-6 space-y-4 text-start">
              <div className="bg-amber-50 p-4 rounded-xl text-xs text-amber-800 flex gap-2 items-start leading-relaxed">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  {isAr 
                    ? "ستتم ترقية حسابك مباشرة لباقة Enterprise وسيتم الفوترة بالقيمة الجديدة بقيمة 599$ شهرياً."
                    : "Your account will be upgraded immediately to Enterprise Plan. Billing value updates to 599$/mo."}
                </span>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 text-start">
                  {isAr ? "رقم بطاقة الدفع (شكل افتراضي)" : "Card Number (Mock)"}
                </label>
                <input type="text" required defaultValue="4000 1234 5678 9010" className="input font-mono text-center" />
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowUpgradeModal(false)} className="btn-outline cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  type="submit" 
                  disabled={isUpgrading}
                  className="btn-accent flex items-center gap-2 cursor-pointer bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isUpgrading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isAr ? "جاري الدفع..." : "Processing..."}</span>
                    </>
                  ) : (
                    <>{isAr ? "دفع وتأكيد" : "Pay & Upgrade"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl z-55 flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
