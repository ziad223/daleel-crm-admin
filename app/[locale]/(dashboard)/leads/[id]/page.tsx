"use client";

import { useState, use } from "react";
import Link from "next/link";
import { 
  ArrowRight, ArrowLeft, Phone, MessageCircle, Mail, MapPin, 
  Calendar, Clock, CheckCircle, FileText, Bot, Plus, AlertCircle,
  MoreHorizontal, Edit
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

export default function Lead360Page({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === 'ar';
  const isRtl = locale === 'ar';

  // Mock lead data
  const lead = {
    id: unwrappedParams.id,
    name: isAr ? "أحمد محمد" : "Ahmed Mohammed",
    email: "ahmed@example.com",
    phone: "+971501234567",
    city: isAr ? "دبي" : "Dubai",
    country: isAr ? "الإمارات" : "UAE",
    source: isAr ? "إعلان انستجرام" : "Instagram Ad",
    campaign: isAr ? "حملة الصيف" : "Summer Campaign",
    agent: isAr ? "سارة" : "Sarah",
    stage: "Negotiation",
    interest: isAr ? "ساخن" : "Hot",
    value: 25000,
    status: isAr ? "نشط" : "Active",
    created: "2026-07-01",
    lastContact: isAr ? "اليوم 10:30 ص" : "Today 10:30 AM",
  };

  const [activeTab, setActiveTab] = useState("timeline");

  const tabs = [
    { id: "timeline", label: isAr ? "السجل (Timeline)" : "Timeline" },
    { id: "tasks", label: isAr ? "المهام والملاحظات" : "Tasks & Notes" },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/leads`} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{isAr ? "ملف العميل (Lead 360)" : "Lead 360 Profile"}</h2>
          <p className="text-sm text-slate-500">{isAr ? "عرض شامل لجميع تفاصيل ونشاطات العميل" : "Comprehensive view of all lead details and activities"}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-[var(--primary)]"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-[var(--primary)]">
                {lead.name.charAt(0)}
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-1">{lead.name}</h3>
            <span className={`badge ${lead.interest === "ساخن" || lead.interest === "Hot" ? "badge-danger" : "badge-warning"} mb-4`}>
              {lead.interest}
            </span>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">{isAr ? "رقم الهاتف" : "Phone"}</div>
                  <div className="font-medium text-slate-700">{lead.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">{isAr ? "البريد الإلكتروني" : "Email"}</div>
                  <div className="font-medium text-slate-700">{lead.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">{isAr ? "الموقع" : "Location"}</div>
                  <div className="font-medium text-slate-700">{lead.city}, {lead.country}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 my-6"></div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">{isAr ? "الموظف المسؤول" : "Assignee"}</div>
                <div className="text-sm font-medium text-slate-700">{lead.agent}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">{isAr ? "المرحلة الحالية" : "Stage"}</div>
                <div className="text-sm font-medium text-[var(--primary)]">{lead.stage}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">{isAr ? "المصدر" : "Source"}</div>
                <div className="text-sm font-medium text-slate-700">{lead.source}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">{isAr ? "القيمة المتوقعة" : "Expected Value"}</div>
                <div className="text-sm font-bold text-emerald-600">{formatCurrency(lead.value)}</div>
              </div>
            </div>

            <button className="w-full mt-6 btn-outline border-slate-200 text-slate-600 justify-center">
              <Edit className="w-4 h-4" /> {isAr ? "تعديل بيانات العميل" : "Edit Lead Details"}
            </button>
          </div>

          {/* Quick AI Summary Widget */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-indigo-100">
              <Bot className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-indigo-900">{isAr ? "ملخص الذكاء الاصطناعي" : "AI Summary"}</h4>
              </div>
              <p className="text-sm text-indigo-800 leading-relaxed font-medium">
                {isAr 
                  ? "العميل مهتم جداً بخدمات التسويق، تم التواصل معه مرتين. احتمالية الإغلاق عالية (80%). يفضل الاتصال به غداً لتقديم العرض النهائي."
                  : "Lead is highly interested in marketing services, contacted twice. High closing probability (80%). Recommended to call tomorrow for final offer."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Tabs & Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] py-4 px-2 text-sm font-bold text-center border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? "border-[var(--primary)] text-[var(--primary)] bg-slate-50" 
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 min-h-[500px]">
            {activeTab === "timeline" && (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-6 md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent rtl:before:mr-5 rtl:before:ml-auto rtl:md:before:mr-6 rtl:before:translate-x-px">
                {[
                  { type: "call", title: isAr ? "مكالمة صادرة (لم يرد)" : "Outbound Call (No Answer)", date: "اليوم 10:30 ص", icon: <Phone className="w-4 h-4" />, color: "bg-red-50 text-red-600" },
                  { type: "whatsapp", title: isAr ? "إرسال عرض سعر عبر واتساب" : "Sent Quotation via WhatsApp", date: "أمس 04:15 م", icon: <MessageCircle className="w-4 h-4" />, color: "bg-green-50 text-green-600" },
                  { type: "note", title: isAr ? "إضافة ملاحظة: العميل طلب خصم 10%" : "Note added: Client requested 10% discount", date: "أمس 02:00 م", icon: <FileText className="w-4 h-4" />, color: "bg-amber-50 text-amber-600" },
                  { type: "stage", title: isAr ? "تغيير المرحلة إلى (Negotiation)" : "Stage changed to (Negotiation)", date: "أمس 02:00 م", icon: <CheckCircle className="w-4 h-4" />, color: "bg-blue-50 text-blue-600" },
                  { type: "created", title: isAr ? "تم إنشاء العميل من إعلان انستجرام" : "Lead created from Instagram Ad", date: "2026-07-01", icon: <Plus className="w-4 h-4" />, color: "bg-slate-100 text-slate-600" },
                ].map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${item.color} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 rtl:md:group-odd:translate-x-1/2 rtl:md:group-even:-translate-x-1/2 z-10 absolute ${isRtl ? 'right-0' : 'left-0'}`}>
                      {item.icon}
                    </div>
                    <div className={`w-full ${isRtl ? 'pr-14' : 'pl-14'} md:w-full md:pl-16`}>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">{isAr ? "المهام والملاحظات" : "Tasks & Notes"}</h3>
                  <button className="btn-accent btn-sm"><Plus className="w-4 h-4" /> {isAr ? "إضافة" : "Add"}</button>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-sm">الاتصال لتأكيد العرض النهائي</div>
                      <span className="badge badge-warning">متوسطة</span>
                   </div>
                   <div className="text-xs text-slate-500 flex gap-4">
                      <span>الاستحقاق: غداً 10:00 ص</span>
                      <span>بواسطة: سارة</span>
                   </div>
                </div>
              </div>
            )}
            
            {activeTab === "tasks" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">{isAr ? "المهام والملاحظات" : "Tasks & Notes"}</h3>
                  <button className="btn-accent btn-sm"><Plus className="w-4 h-4" /> {isAr ? "إضافة" : "Add"}</button>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-sm">الاتصال لتأكيد العرض النهائي</div>
                      <span className="badge badge-warning">متوسطة</span>
                   </div>
                   <div className="text-xs text-slate-500 flex gap-4">
                      <span>الاستحقاق: غداً 10:00 ص</span>
                      <span>بواسطة: سارة</span>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
