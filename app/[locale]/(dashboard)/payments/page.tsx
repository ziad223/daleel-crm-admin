"use client";

import { CreditCard, CheckCircle, Plus } from "lucide-react";
import { useLocale } from "next-intl";

export default function PaymentsPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{isAr ? "طرق الدفع (Payments)" : "Payment Methods"}</h2>
          <p className="text-slate-500 text-sm mt-1">{isAr ? "إدارة البطاقات الائتمانية وطرق الدفع المحفوظة." : "Manage your credit cards and saved payment methods."}</p>
        </div>
        <button className="btn-accent flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {isAr ? "إضافة بطاقة جديدة" : "Add New Card"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Primary Card */}
        <div className="stat-card border-[var(--primary)] relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute top-4 left-4">
            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> {isAr ? "أساسية" : "Primary"}
            </span>
          </div>
          <div className="mb-8">
            <CreditCard className="w-8 h-8 text-white/50" />
          </div>
          <div className="text-xl font-mono tracking-widest mb-4">
            **** **** **** 4242
          </div>
          <div className="flex justify-between items-end text-white/70 text-sm">
            <div>
              <div className="text-xs mb-1">{isAr ? "الاسم على البطاقة" : "Cardholder Name"}</div>
              <div className="font-medium text-white">East Guide IT Group</div>
            </div>
            <div>
              <div className="text-xs mb-1">{isAr ? "تاريخ الانتهاء" : "Expiry Date"}</div>
              <div className="font-medium text-white">12/28</div>
            </div>
          </div>
        </div>

        {/* Expired Card */}
        <div className="stat-card border-red-200 bg-red-50 relative overflow-hidden text-red-900">
          <div className="absolute top-4 left-4">
            <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
              {isAr ? "منتهية الصلاحية" : "Expired"}
            </span>
          </div>
          <div className="mb-8">
            <CreditCard className="w-8 h-8 text-red-300" />
          </div>
          <div className="text-xl font-mono tracking-widest mb-4 opacity-50">
            **** **** **** 1234
          </div>
          <div className="flex justify-between items-end text-red-900/70 text-sm">
            <div>
              <div className="text-xs mb-1">{isAr ? "الاسم على البطاقة" : "Cardholder Name"}</div>
              <div className="font-medium opacity-70">East Guide IT Group</div>
            </div>
            <div>
              <div className="text-xs mb-1">{isAr ? "تاريخ الانتهاء" : "Expiry Date"}</div>
              <div className="font-medium opacity-70">05/25</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
