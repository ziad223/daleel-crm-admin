"use client";

import { Plus, Check, X } from "lucide-react";
import { getMockData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function PlansPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const { plans } = getMockData(isAr);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-slate-600">{isAr ? "إدارة باقات الاشتراك المتاحة للشركات" : "Manage subscription plans available for companies"}</p>
        <button className="btn-accent"><Plus className="w-4 h-4" /> {isAr ? "إضافة باقة" : "Add Plan"}</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`stat-card relative ${plan.name === "الاحترافية" || plan.name === "Professional" ? "ring-2 ring-emerald-500" : ""}`}>
            {(plan.name === "الاحترافية" || plan.name === "Professional") && (
              <div className="absolute -top-3 right-6 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {isAr ? "الأكثر طلباً" : "Most Popular"}
              </div>
            )}
            <h3 className="text-2xl font-bold tracking-tight">{plan.name}</h3>
            <div className="my-4">
              <span className="text-4xl font-bold">{plan.monthly}</span>
              <span className="text-slate-500"> {isAr ? " ر.س / شهر" : " SAR / mo"}</span>
            </div>
            <div className="text-sm text-slate-500 mb-6">
              {isAr ? `أو ${formatCurrency(plan.yearly)} سنوياً` : `or ${formatCurrency(plan.yearly)} / year`}
            </div>

            <ul className="space-y-2.5 text-sm mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />{" "}
                {plan.users === 999 
                  ? (isAr ? "غير محدود" : "Unlimited") 
                  : plan.users}{" "}
                {isAr ? "مستخدم" : "Users"}
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />{" "}
                {plan.leads === 999999 
                  ? (isAr ? "غير محدود" : "Unlimited") 
                  : plan.leads.toLocaleString()}{" "}
                {isAr ? "عميل محتمل" : "Leads"}
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />{" "}
                {plan.campaigns === 999 
                  ? (isAr ? "غير محدود" : "Unlimited") 
                  : plan.campaigns}{" "}
                {isAr ? "حملة" : "Campaigns"}
              </li>
              <li className="flex items-center gap-2">
                {plan.ai ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-slate-300" />}
                {isAr ? "الذكاء الاصطناعي" : "AI Assistant"}
              </li>
              <li className="flex items-center gap-2">
                {plan.whatsapp ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-slate-300" />}
                {isAr ? "واتساب API" : "WhatsApp API"}
              </li>
              <li className="flex items-center gap-2">
                {plan.api ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-slate-300" />}
                API Access
              </li>
              <li className="flex items-center gap-2">
                {plan.backup ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-slate-300" />}
                {isAr ? "نسخ احتياطي يومي" : "Daily Backup"}
              </li>
            </ul>

            <div className="flex gap-2">
              <button className="btn-outline flex-1">{isAr ? "تعديل" : "Edit"}</button>
              <button className="btn-ghost text-red-500">{isAr ? "إيقاف" : "Deactivate"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
