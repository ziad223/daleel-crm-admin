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
    { id: "calls", label: isAr ? "المكالمات" : "Calls" },
    { id: "whatsapp", label: isAr ? "رسائل واتساب" : "WhatsApp" },
    { id: "tasks", label: isAr ? "المهام والملاحظات" : "Tasks & Notes" },
    { id: "ai", label: isAr ? "تحليل الذكاء الاصطناعي" : "AI Insights" },
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

            {activeTab === "calls" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">{isAr ? "سجل المكالمات" : "Call History"}</h3>
                  <button className="btn-accent btn-sm"><Phone className="w-4 h-4" /> {isAr ? "اتصال جديد" : "New Call"}</button>
                </div>
                {/* Call items */}
                {[
                  { date: "اليوم 10:30 ص", duration: "00:00", result: "لم يرد (No Answer)", agent: "سارة" },
                  { date: "قبل 3 أيام 02:15 م", duration: "04:32", result: "مهتم، طلب عرض سعر", agent: "سارة" },
                  { date: "قبل 5 أيام 11:00 ص", duration: "01:15", result: "مكالمة تعريفية", agent: "أحمد" }
                ].map((call, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${call.duration === "00:00" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm mb-0.5">{call.result}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span>{call.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {call.duration}</span>
                          <span className="flex items-center gap-1"><Bot className="w-3 h-3" /> {call.agent}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "whatsapp" && (
              <div className="flex flex-col h-[500px]">
                <div className="flex-1 bg-slate-50 rounded-t-xl border border-slate-100 p-4 overflow-y-auto space-y-4">
                  {/* Chat bubbles */}
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                      <p className="text-sm text-slate-800">مرحباً أستاذ أحمد، معك سارة من مجموعة دليل الشرق. أرسلت لك عرض السعر كما طلبتم.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">أمس 04:15 م</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-green-100 border border-green-200 p-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                      <p className="text-sm text-green-900">شكراً سارة. هل يمكن الحصول على خصم 10٪ إضافي؟</p>
                      <span className="text-[10px] text-green-700/70 mt-1 block text-left">أمس 05:00 م</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white border border-t-0 border-slate-100 rounded-b-xl flex gap-2">
                  <input type="text" className="input flex-1 bg-slate-50" placeholder={isAr ? "اكتب رسالة واتساب..." : "Type WhatsApp message..."} />
                  <button className="btn-accent bg-green-500 hover:bg-green-600"><MessageCircle className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                  <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-4">
                    <Bot className="w-5 h-5" /> {isAr ? "تحليل الذكاء الاصطناعي الشامل" : "Comprehensive AI Analysis"}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                      <div className="text-xs text-slate-500 mb-1">{isAr ? "احتمالية الإغلاق" : "Closing Probability"}</div>
                      <div className="text-2xl font-bold text-indigo-600">82%</div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[82%]"></div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                      <div className="text-xs text-slate-500 mb-1">{isAr ? "تصنيف العميل" : "Lead Scoring"}</div>
                      <div className="text-2xl font-bold text-emerald-600">{isAr ? "عميل A+" : "A+ Lead"}</div>
                      <div className="text-xs text-slate-400 mt-1">{isAr ? "بناءً على التفاعل السريع" : "Based on fast engagement"}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                      <h4 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" /> {isAr ? "اقتراح الخطوة القادمة" : "Suggested Next Step"}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {isAr ? "العميل ينتظر رد بخصوص خصم 10%. ينصح بالاتصال هاتفياً لمنحه الخصم كعرض محدود لمدة 24 ساعة لإغلاق الصفقة اليوم." : "Client is waiting for a response regarding a 10% discount. Recommend calling to offer it as a 24-hour limited offer to close today."}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                      <h4 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-indigo-500" /> {isAr ? "اقتراح رسالة واتساب" : "Suggested WhatsApp Message"}
                      </h4>
                      <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm text-slate-700 font-medium italic relative">
                        "مرحباً أستاذ أحمد، بناءً على طلبك وبسبب اهتمامك بخدماتنا، حصلت لك على موافقة استثنائية لخصم 10% صالح اليوم فقط. هل نعتمد العقد؟"
                        <button className="absolute top-2 left-2 text-xs text-indigo-600 font-bold hover:underline">{isAr ? "استخدام" : "Use"}</button>
                      </div>
                    </div>
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
