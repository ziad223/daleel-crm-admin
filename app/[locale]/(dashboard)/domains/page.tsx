"use client";

import { Globe, CheckCircle, AlertCircle } from "lucide-react";
import { useLocale } from "next-intl";

export default function DomainsPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold">{isAr ? "ربط الدومين الخاص (Custom Domain)" : "Custom Domain"}</h2>
        <p className="text-slate-500 text-sm mt-1">
          {isAr ? "اجعل النظام يعمل على رابط شركتك الخاص (مثال: crm.yourcompany.com)." : "Run the system under your custom business link (e.g. crm.yourcompany.com)."}
        </p>
      </div>

      <div className="stat-card border-[var(--primary)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{isAr ? "الدومين الحالي" : "Current Domain"}</h3>
          <span className="badge badge-success flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {isAr ? "متصل" : "Connected"}
          </span>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
          <Globe className="w-6 h-6 text-slate-400" />
          <div className="text-xl font-mono text-slate-700">crm.egitg.com</div>
        </div>
      </div>

      <div className="stat-card">
        <h3 className="font-bold mb-4">{isAr ? "إضافة دومين جديد" : "Connect New Domain"}</h3>
        <p className="text-sm text-slate-600 mb-4">
          {isAr 
            ? "لربط دومين جديد، يجب عليك أولاً إضافة سجل CNAME في إعدادات DNS الخاصة بك وتوجيهه إلى " 
            : "To connect a new domain, you must first add a CNAME record in your DNS settings pointing to "}
          <code>app.eastguidecrm.com</code>.
        </p>
        
        <div className="flex gap-3">
          <input type="text" className="input flex-1" placeholder={isAr ? "مثال: sales.company.com" : "e.g., sales.company.com"} />
          <button className="btn-accent">{isAr ? "إضافة وربط" : "Add & Connect"}</button>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <strong>{isAr ? "ملاحظة هامة:" : "Important Note:"}</strong>{" "}
            {isAr 
              ? "بعد إضافة الدومين، قد يستغرق انتشار سجلات DNS وتفعيل شهادة SSL المجانية (HTTPS) ما يصل إلى 24 ساعة."
              : "After adding the domain, DNS propagation and auto-SSL installation (HTTPS) may take up to 24 hours."}
          </div>
        </div>
      </div>
    </div>
  );
}
