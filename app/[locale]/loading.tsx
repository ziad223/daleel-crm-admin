"use client";

import { useLocale } from "next-intl";

export default function Loading() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-20 h-20 rounded-full border-4 border-slate-200/20 border-t-[var(--primary)] animate-spin" />
        
        {/* Inner glowing ring spinning reverse */}
        <div className="absolute w-14 h-14 rounded-full border-4 border-slate-200/20 border-b-[var(--accent)] animate-spin [animation-direction:reverse] [animation-duration:1s]" />
        
        {/* Center pulsing mark */}
        <div className="absolute w-6 h-6 rounded-full bg-[var(--primary)] animate-ping" />
      </div>

      <div className="text-center space-y-1.5">
        <h4 className="text-white font-bold text-md tracking-wider animate-pulse">
          {isAr ? "جاري تحميل النظام..." : "Loading System..."}
        </h4>
        <p className="text-slate-300 text-[10px] uppercase tracking-widest">
          {isAr ? "دليل الشرق لإدارة المبيعات" : "East Guide CRM Suite"}
        </p>
      </div>
    </div>
  );
}
