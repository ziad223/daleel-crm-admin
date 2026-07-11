import { Phone, MessageCircle, Mail, MapPin, User, Calendar, Sparkles, CheckCircle, Clock, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function Lead360Page() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const timeline = [
    { type: "call", title: isAr ? "مكالمة هاتفية" : "Phone Call", desc: isAr ? "مدة 4:32 - مهتم وطلب عرض سعر" : "Duration 4:32 - Interested, requested quotation", time: isAr ? "منذ 30 دقيقة" : "30m ago", icon: Phone, color: "bg-blue-100 text-blue-600" },
    { type: "whatsapp", title: isAr ? "رسالة واتساب" : "WhatsApp Message", desc: isAr ? "تم إرسال قالب: عرض خاص لباقة Growth" : "Sent Template: Growth Special Offer", time: isAr ? "منذ ساعتين" : "2h ago", icon: MessageCircle, color: "bg-green-100 text-green-600" },
    { type: "note", title: isAr ? "ملاحظة" : "Note", desc: isAr ? "العميل يقارن بين باقتين. يفضل الاتصال بعد العصر." : "Client comparing two plans. Prefers calling in the afternoon.", time: isAr ? "منذ 3 ساعات" : "3h ago", icon: FileText, color: "bg-amber-100 text-amber-600" },
    { type: "stage", title: isAr ? "تغيير المرحلة" : "Stage Changed", desc: isAr ? "من Contacted إلى Interested" : "From Contacted to Interested", time: isAr ? "أمس" : "Yesterday", icon: CheckCircle, color: "bg-emerald-100 text-emerald-600" },
    { type: "task", title: isAr ? "مهمة مجدولة" : "Scheduled Task", desc: isAr ? "متابعة عرض السعر - غداً 4:00 م" : "Follow up quote - Tomorrow 4:00 PM", time: isAr ? "أمس" : "Yesterday", icon: Clock, color: "bg-violet-100 text-violet-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="stat-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
              {isAr ? "ف" : "F"}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{isAr ? "فهد العتيبي" : "Fahad Alotaibi"}</h1>
              <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> 0501234567</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {isAr ? "واتساب" : "WhatsApp"}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> fahd@email.com</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {isAr ? "الرياض" : "Riyadh"}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary"><Phone className="w-4 h-4" /> {isAr ? "اتصال" : "Call"}</button>
            <button className="btn-accent"><MessageCircle className="w-4 h-4" /> {isAr ? "واتساب" : "WhatsApp"}</button>
            <button className="btn-outline">{isAr ? "تعديل" : "Edit"}</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-500">{isAr ? "المرحلة" : "Stage"}</div>
            <div className="font-semibold mt-0.5"><span className="badge badge-info">Interested</span></div>
          </div>
          <div>
            <div className="text-xs text-slate-500">{isAr ? "الاهتمام" : "Interest"}</div>
            <div className="font-semibold mt-0.5"><span className={`badge badge-danger`}>{isAr ? "ساخن" : "Hot"}</span></div>
          </div>
          <div>
            <div className="text-xs text-slate-500">{isAr ? "قيمة الصفقة" : "Deal Value"}</div>
            <div className="font-semibold mt-0.5">{formatCurrency(85000)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">{isAr ? "الموظف المسؤول" : "Assigned Agent"}</div>
            <div className="font-semibold mt-0.5">{isAr ? "أحمد العتيبي" : "Ahmed Alotaibi"}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">{isAr ? "المصدر" : "Source"}</div>
            <div className="font-semibold mt-0.5">{isAr ? "إعلان فيسبوك" : "Facebook Ad"}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="stat-card">
            <h3 className="font-bold text-lg mb-4">{isAr ? "السجل الكامل (Timeline)" : "Activity Timeline"}</h3>
            <div className="space-y-4">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 pb-4 border-b border-slate-50 last:border-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{item.title}</span>
                      <span className="text-xs text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI + Details */}
        <div className="space-y-4">
          {/* AI Card */}
          <div className="stat-card bg-gradient-to-br from-violet-50 to-emerald-50 border-violet-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-violet-600" />
              <h3 className="font-bold text-violet-900">{isAr ? "المساعد الذكي" : "AI Assistant"}</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-violet-600 font-medium">{isAr ? "ملخص العميل" : "Lead Summary"}</div>
                <p className="text-slate-700 mt-0.5">
                  {isAr 
                    ? "مهتم بباقة Growth، آخر تواصل قبل 3 ساعات، لم يتم إرسال عرض سعر بعد. احتمال الإغلاق 78%."
                    : "Interested in Growth Plan, last contacted 3 hours ago, no quotation sent yet. Conversion probability 78%."}
                </p>
              </div>
              <div>
                <div className="text-xs text-violet-600 font-medium">{isAr ? "اقتراح الخطوة التالية" : "Next Step Recommendation"}</div>
                <p className="text-slate-700 mt-0.5">
                  {isAr 
                    ? "يفضل الاتصال اليوم بين 4-6 مساءً وإرسال عرض محدود المدة."
                    : "Call today between 4-6 PM and present a limited-time discount."}
                </p>
              </div>
              <div>
                <div className="text-xs text-violet-600 font-medium">{isAr ? "اقتراح رسالة واتساب" : "WhatsApp Recommendation"}</div>
                <div className="bg-white rounded-xl p-3 mt-1 text-slate-700 border border-violet-100">
                  {isAr 
                    ? "مرحباً أستاذ فهد، بناءً على اهتمامك بباقة Growth، جهزنا لك عرض خاص ينتهي خلال 48 ساعة. هل يناسبك نناقش التفاصيل اليوم؟"
                    : "Hi Fahad, regarding your interest in the Growth Plan, we prepared a special offer expiring in 48 hours. Let's discuss?"}
                </div>
              </div>
              <button className="btn-accent w-full mt-2">{isAr ? "استخدام الاقتراح" : "Use Suggestion"}</button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="stat-card">
            <h3 className="font-bold mb-3">{isAr ? "معلومات إضافية" : "Additional Info"}</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">{isAr ? "المدينة" : "City"}</span><span>{isAr ? "الرياض" : "Riyadh"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{isAr ? "الدولة" : "Country"}</span><span>{isAr ? "السعودية" : "Saudi Arabia"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{isAr ? "اللغة" : "Language"}</span><span>{isAr ? "العربية" : "Arabic"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{isAr ? "الخدمة" : "Service"}</span><span>{isAr ? "باقة Growth" : "Growth Plan"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{isAr ? "تاريخ الإضافة" : "Created Date"}</span><span>2026-06-28</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
