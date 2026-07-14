"use client";

import { useState } from "react";
import { Search, Plus, MoreHorizontal, Mail, Phone, MapPin, Award, Target, TrendingUp, Users } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function TeamPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === 'ar';
  const isRtl = locale === 'ar';

  const [search, setSearch] = useState("");

  const team = [
    { id: 1, name: "أحمد محمد", role: "Sales Manager", email: "ahmed@daleel.com", phone: "+971501112222", activeLeads: 45, wonDeals: 12, conversionRate: "28%", avatar: "أ" },
    { id: 2, name: "سارة عبدالله", role: "Senior Sales Agent", email: "sarah@daleel.com", phone: "+971503334444", activeLeads: 82, wonDeals: 18, conversionRate: "35%", avatar: "س" },
    { id: 3, name: "خالد سعيد", role: "Sales Agent", email: "khalid@daleel.com", phone: "+971505556666", activeLeads: 30, wonDeals: 5, conversionRate: "15%", avatar: "خ" },
    { id: 4, name: "نورة علي", role: "Sales Agent", email: "noura@daleel.com", phone: "+971507778888", activeLeads: 65, wonDeals: 14, conversionRate: "22%", avatar: "ن" },
    { id: 5, name: "محمد حسن", role: "Sales Agent", email: "mohammed@daleel.com", phone: "+971509990000", activeLeads: 40, wonDeals: 8, conversionRate: "18%", avatar: "م" },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{isAr ? "فريق المبيعات" : "Sales Team"}</h2>
          <p className="text-sm text-slate-500">{isAr ? "إدارة ومتابعة أداء موظفي المبيعات" : "Manage and track sales team performance"}</p>
        </div>
        <button className="btn-accent">
          <Plus className="w-4 h-4" />
          {isAr ? "إضافة موظف مبيعات" : "Add Sales Agent"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[var(--primary)] to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 text-sm">{isAr ? "إجمالي الموظفين" : "Total Agents"}</p>
              <h3 className="text-3xl font-bold mt-1">12</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-xl"><Users className="w-5 h-5 text-white" /></div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">{isAr ? "متوسط نسبة التحويل" : "Avg Conversion Rate"}</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-800 flex items-center gap-2">24.5% <TrendingUp className="w-4 h-4 text-emerald-500" /></h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl"><Target className="w-5 h-5 text-[var(--primary)]" /></div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">{isAr ? "الصفقات المغلقة هذا الشهر" : "Won Deals This Month"}</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-800 flex items-center gap-2">128 <TrendingUp className="w-4 h-4 text-emerald-500" /></h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl"><Award className="w-5 h-5 text-amber-500" /></div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">{isAr ? "إجمالي العملاء المحتملين" : "Total Active Leads"}</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-800">2,450</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl"><Users className="w-5 h-5 text-blue-500" /></div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
          <input
            type="text"
            placeholder={isAr ? "بحث عن موظف..." : "Search agent..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`input ${isRtl ? 'pr-10' : 'pl-10'}`}
          />
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-[var(--primary)] text-2xl font-bold flex items-center justify-center border-4 border-white shadow-sm">
                  {member.avatar}
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800">{member.name}</h3>
              <p className="text-sm font-medium text-[var(--primary)] mb-4">{member.role}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" /> {member.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" /> <span dir="ltr">{member.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-100">
                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-400 uppercase">{isAr ? "العملاء" : "Leads"}</div>
                  <div className="font-bold text-slate-800 mt-1">{member.activeLeads}</div>
                </div>
                <div className="text-center border-x border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 uppercase">{isAr ? "مغلقة" : "Won"}</div>
                  <div className="font-bold text-emerald-600 mt-1">{member.wonDeals}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-400 uppercase">{isAr ? "نسبة التحويل" : "Win Rate"}</div>
                  <div className="font-bold text-[var(--primary)] mt-1">{member.conversionRate}</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex gap-2">
              <button className="flex-1 btn-outline bg-white justify-center text-slate-700">
                {isAr ? "تعديل" : "Edit"}
              </button>
              <button className="flex-1 btn-primary justify-center">
                {isAr ? "التقارير" : "Reports"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
