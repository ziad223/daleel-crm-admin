"use client";

import { useState } from "react";
import { Sparkles, Flame, AlertTriangle, MessageCircle, TrendingUp, Loader2, Copy, Send } from "lucide-react";
import { useLocale } from "next-intl";

export default function AIPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [toast, setToast] = useState<{message: string} | null>(null);
  
  // Interactive Prompt Generator states
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMsg, setGeneratedMsg] = useState("");

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(isAr ? "تم نسخ الرسالة للحافظة بنجاح!" : "Message copied to clipboard successfully!");
  };

  const handleGenerateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    setGeneratedMsg("");

    setTimeout(() => {
      setIsGenerating(false);
      const responses = isAr ? [
        `أهلاً بك! بناءً على طلبك بخصوص "${promptInput}":\n\nنود أن نعرض عليك عرضنا الخاص والحصري لنظام الدعم المتكامل لدينا بخصم 20% سارٍ حتى نهاية الأسبوع. يسعدنا ترتيب اجتماع قصير لمناقشة التفاصيل.`,
        `مرحباً! رداً على استفسارك عن "${promptInput}":\n\nيسعدنا تزويدك بكافة الملفات التقنية وباقات الأسعار المخصصة لشركتكم الموقرة. يرجى إعلامنا بالوقت المناسب للاتصال بك.`,
      ] : [
        `Hello! Regarding your inquiry about "${promptInput}":\n\nWe prepared a special custom package for your enterprise with a 20% discount valid until this Friday. Let us know if we can schedule a quick call?`,
        `Hi there! Following up on your request for "${promptInput}":\n\nOur team has finalized the custom deployment proposal. Please review the attached details and let us know your feedback.`,
      ];
      const randomIdx = Math.floor(Math.random() * responses.length);
      setGeneratedMsg(responses[randomIdx]);
      showToast(isAr ? "تم توليد الرسالة الذكية!" : "Smart message generated!");
    }, 1500);
  };

  const hotLeads = isAr 
    ? ["منى الحربي - 210,000 ر.س", "نورة السبيعي - 120,000 ر.س", "فهد العتيبي - 85,000 ر.س"] 
    : ["Mona Alharbi - 210,000 SAR", "Noura Alsubaie - 120,000 SAR", "Fahad Alotaibi - 85,000 SAR"];

  const neglectedLeads = isAr 
    ? ["سعود الدوسري - 5 أيام بدون تواصل", "ريم العتيبي - 4 أيام", "لينا الشمري - 3 أيام"] 
    : ["Saud Aldossari - 5 days inactive", "Reem Alotaibi - 4 days", "Lina Alshammari - 3 days"];

  const salesSuggestions = isAr 
    ? ["أرسل عرض محدود لـ 12 عميل ساخن", "وزع 8 leads جديدة على الفريق", "تابع 5 عروض أسعار معلقة"] 
    : ["Send promo to 12 hot leads", "Distribute 8 new leads to team", "Follow up on 5 pending quotes"];

  const waSuggestions = [
    { 
      lead: isAr ? "فهد العتيبي" : "Fahad Alotaibi", 
      msg: isAr 
        ? "مرحباً أستاذ فهد، بناءً على اهتمامك بباقة Growth، جهزنا لك عرض خاص ينتهي خلال 48 ساعة. هل يناسبك نناقش التفاصيل اليوم؟" 
        : "Hi Fahad, regarding your interest in the Growth Plan, we prepared a special offer expiring in 48 hours. Let's discuss?"
    },
    { 
      lead: isAr ? "منى الحربي" : "Mona Alharbi", 
      msg: isAr 
        ? "أهلين منى، العقد جاهز للمراجعة. متى يناسبك نمر عليه معاً؟ يمكنني إرساله الآن." 
        : "Hi Mona, the contract is ready for review. When can we discuss it? I can send it now."
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="stat-card bg-gradient-to-r from-violet-600 to-emerald-600 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{isAr ? "المساعد الذكي" : "AI Assistant"}</h2>
        </div>
        <p className="text-white/80">{isAr ? "تحليلات واقتراحات مدعومة بالذكاء الاصطناعي لزيادة مبيعاتك" : "AI-powered analytics and recommendations to boost your sales."}</p>
      </div>

      {/* Analytics stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-red-500" />
            <h3 className="font-bold">{isAr ? "عملاء ساخنون اليوم" : "Hot Leads Today"}</h3>
          </div>
          <div className="space-y-2">
            {hotLeads.map((item, i) => (
              <div key={i} className="text-sm p-2 bg-red-50 rounded-lg text-red-800 text-right">{item}</div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold">{isAr ? "عملاء مهملون" : "Neglected Leads"}</h3>
          </div>
          <div className="space-y-2">
            {neglectedLeads.map((item, i) => (
              <div key={i} className="text-sm p-2 bg-amber-50 rounded-lg text-amber-800 text-right">{item}</div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold">{isAr ? "اقتراحات البيع" : "Sales Suggestions"}</h3>
          </div>
          <div className="space-y-2">
            {salesSuggestions.map((item, i) => (
              <div key={i} className="text-sm p-2 bg-emerald-50 rounded-lg text-emerald-800 text-right">{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Generator Section */}
      <div className="stat-card space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h3 className="font-bold text-slate-800">{isAr ? "توليد رسائل تسويقية ذكية" : "AI Marketing Message Generator"}</h3>
        </div>
        <form onSubmit={handleGenerateMessage} className="flex gap-2">
          <button 
            type="submit" 
            disabled={isGenerating}
            className="btn-accent flex items-center justify-center min-w-[120px] cursor-pointer"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>{isAr ? "توليد" : "Generate"}</>
            )}
          </button>
          <input 
            type="text" 
            required
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder={isAr ? "اكتب توجيهاً (مثال: رسالة ترحيب بعميل مهتم بباقة الأعمال)" : "Enter prompt (e.g. follow-up promo message)"} 
            className="input text-right"
          />
        </form>

        {generatedMsg && (
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 animate-in fade-in duration-200 text-right">
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed font-sans">{generatedMsg}</p>
            <div className="flex justify-end">
              <button 
                onClick={() => copyToClipboard(generatedMsg)}
                className="btn-outline btn-sm flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                {isAr ? "نسخ الرسالة" : "Copy Message"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Template Suggestions */}
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-green-600" />
          <h3 className="font-bold">{isAr ? "اقتراحات رسائل واتساب" : "WhatsApp Recommendations"}</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {waSuggestions.map((item, i) => (
            <div key={i} className="border border-slate-100 rounded-xl p-4 text-right">
              <div className="text-sm font-medium text-slate-400 mb-2">{isAr ? `لـ ${item.lead}` : `For ${item.lead}`}</div>
              <p className="text-sm text-slate-700 mb-4 leading-relaxed">{item.msg}</p>
              <button 
                onClick={() => copyToClipboard(item.msg)}
                className="btn-accent btn-sm cursor-pointer"
              >
                {isAr ? "نسخ واستخدام" : "Copy & Use"}
              </button>
            </div>
          ))}
        </div>
      </div>

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
