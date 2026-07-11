"use client";

import { Sparkles, Save, BrainCircuit, Bot, Zap } from "lucide-react";
import { useLocale } from "next-intl";

export default function AISettingsPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-violet-900">
          <Sparkles className="w-6 h-6" />
          {isAr ? "إعدادات الذكاء الاصطناعي (AI Assistant)" : "AI Assistant Settings"}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {isAr ? "تخصيص مساعد الذكاء الاصطناعي ليتناسب مع أسلوب مبيعات شركتك." : "Customize the AI Assistant to align with your company's sales tone."}
        </p>
      </div>

      <div className="stat-card bg-gradient-to-r from-violet-50 to-fuchsia-50 border-violet-100 p-6 flex items-start gap-4">
        <BrainCircuit className="w-10 h-10 text-violet-600 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-violet-900 text-lg">{isAr ? "محرك East Guide AI (مُفعل)" : "East Guide AI Engine (Active)"}</h3>
          <p className="text-sm text-violet-700 mt-2 leading-relaxed">
            {isAr 
              ? "المساعد الذكي يقوم حالياً بقراءة سجلات العملاء، اقتراح الردود على واتساب، وتحليل احتمالية إغلاق الصفقات لموظفيك."
              : "The smart assistant is currently scanning lead records, suggesting WhatsApp replies, and predicting win probability for your team."}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="stat-card space-y-4">
          <h3 className="font-bold flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bot className="w-5 h-5 text-violet-600" />
            {isAr ? "نبرة الصوت والصياغة" : "Tone & Messaging"}
          </h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">{isAr ? "أسلوب التحدث للعملاء (Tone of Voice)" : "Tone of Voice"}</label>
            <select className="input text-sm">
              <option>{isAr ? "احترافي ورسمي" : "Professional & Formal"}</option>
              <option>{isAr ? "ودود وغير رسمي" : "Friendly & Casual"}</option>
              <option>{isAr ? "مباشر وموجه للمبيعات" : "Direct & Sales-Oriented"}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{isAr ? "تعليمات إضافية للذكاء الاصطناعي" : "Additional AI Instructions"}</label>
            <textarea 
              className="input text-sm h-24 resize-none" 
              placeholder={isAr ? "مثال: ركز دائماً على إبراز جودة الدعم الفني لدينا..." : "e.g. Always focus on highlighting our customer support quality..."}
              defaultValue={isAr 
                ? "نحن نركز على تقديم قيمة مضافة بدلاً من الخصومات المباشرة. الرجاء عدم اقتراح خصومات في الرسائل إلا إذا طلب العميل ذلك صراحة."
                : "We focus on providing value rather than direct discounts. Please do not suggest discounts in messages unless the client explicitly requests it."}
            ></textarea>
          </div>
        </div>

        <div className="stat-card space-y-4">
          <h3 className="font-bold flex items-center gap-2 border-b border-slate-100 pb-3">
            <Zap className="w-5 h-5 text-violet-600" />
            {isAr ? "تفعيل الخصائص" : "Feature Configuration"}
          </h3>
          
          <div className="space-y-3 mt-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-100">
              <input type="checkbox" className="w-4 h-4 text-violet-600 rounded" defaultChecked />
              <div>
                <div className="font-medium text-sm">{isAr ? "تلخيص سجل العميل تلقائياً" : "Auto-Summarize Lead History"}</div>
                <div className="text-xs text-slate-500">{isAr ? "يقوم بتلخيص المحادثات والملاحظات السابقة." : "Automatically condenses previous notes and chats."}</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-100">
              <input type="checkbox" className="w-4 h-4 text-violet-600 rounded" defaultChecked />
              <div>
                <div className="font-medium text-sm">{isAr ? "اقتراح رسائل واتساب (Smart Reply)" : "WhatsApp Smart Reply Suggestions"}</div>
                <div className="text-xs text-slate-500">{isAr ? "تجهيز قوالب ذكية للرد على كل عميل حسب حالته." : "Drafts tailored templates based on client status."}</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-100">
              <input type="checkbox" className="w-4 h-4 text-violet-600 rounded" defaultChecked />
              <div>
                <div className="font-medium text-sm">{isAr ? "التنبؤ بنسبة الإغلاق (Win Probability)" : "Win Probability Predictions"}</div>
                <div className="text-xs text-slate-500">{isAr ? "تحليل تفاعل العميل وإعطاء نسبة مئوية لنجاح الصفقة." : "Analyzes customer interaction to calculate win percentage."}</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary bg-violet-600 hover:bg-violet-700 flex items-center gap-2">
          <Save className="w-4 h-4" />
          حفظ إعدادات الذكاء الاصطناعي
        </button>
      </div>
    </div>
  );
}
