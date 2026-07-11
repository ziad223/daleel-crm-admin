"use client";

import { useState } from "react";
import { Save, Globe, Building2, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";

export default function SettingsPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  // Form states
  const [companyName, setCompanyName] = useState("East Guide IT Group");
  const [officialEmail, setOfficialEmail] = useState("info@egitg.com");
  const [phoneNumber, setPhoneNumber] = useState("+971 50 123 4567");
  const [vatNumber, setVatNumber] = useState("123456789012345");
  const [timezone, setTimezone] = useState("Asia/Riyadh (GMT+3)");
  const [currency, setCurrency] = useState("SAR");

  // Save changes loader & toast
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      showToast(isAr ? "تم حفظ جميع الإعدادات بنجاح!" : "System settings saved successfully!");
    }, 1200);
  };

  return (
    <form onSubmit={handleSaveChanges} className="space-y-6 max-w-4xl mx-auto text-start">
      <div>
        <h2 className="text-xl font-bold text-slate-800 text-start">{isAr ? "إعدادات النظام" : "System Settings"}</h2>
        <p className="text-slate-500 text-sm mt-1 text-start">
          {isAr ? "إعدادات الشركة، المنطقة الزمنية، والإشعارات." : "Company settings, timezone, and notifications."}
        </p>
      </div>

      {/* Company Profile Card */}
      <div className="stat-card space-y-6 text-start">
        <h3 className="font-bold flex items-center gap-2 border-b border-slate-100 pb-3 justify-start">
          <Building2 className="w-5 h-5 text-[var(--primary)]" />
          <span>{isAr ? "البيانات الأساسية للشركة" : "Company Profile"}</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-start">{isAr ? "اسم الشركة" : "Company Name"}</label>
            <input 
              type="text" 
              required
              className="input text-start" 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-start">{isAr ? "البريد الإلكتروني الرسمي" : "Official Email"}</label>
            <input 
              type="email" 
              required
              className="input text-start font-mono" 
              value={officialEmail} 
              onChange={(e) => setOfficialEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-start">{isAr ? "رقم الهاتف" : "Phone Number"}</label>
            <input 
              type="text" 
              required
              className="input text-start" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-start">{isAr ? "الرقم الضريبي (VAT)" : "VAT Number"}</label>
            <input 
              type="text" 
              required
              className="input text-start" 
              value={vatNumber} 
              onChange={(e) => setVatNumber(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Regional Card */}
      <div className="stat-card space-y-6 text-start">
        <h3 className="font-bold flex items-center gap-2 border-b border-slate-100 pb-3 justify-start">
          <Globe className="w-5 h-5 text-[var(--primary)]" />
          <span>{isAr ? "الإعدادات الإقليمية" : "Regional Settings"}</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-start">{isAr ? "المنطقة الزمنية (Timezone)" : "Timezone"}</label>
            <select 
              className="input text-start"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="Asia/Riyadh (GMT+3)">Asia/Riyadh (GMT+3)</option>
              <option value="Asia/Dubai (GMT+4)">Asia/Dubai (GMT+4)</option>
              <option value="Africa/Cairo (GMT+2)">Africa/Cairo (GMT+2)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-start">{isAr ? "العملة الافتراضية" : "Default Currency"}</label>
            <select 
              className="input text-start"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="SAR">{isAr ? "ريال سعودي (SAR)" : "Saudi Riyal (SAR)"}</option>
              <option value="AED">{isAr ? "درهم إماراتي (AED)" : "UAE Dirham (AED)"}</option>
              <option value="USD">{isAr ? "دولار أمريكي (USD)" : "US Dollar (USD)"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 cursor-pointer shadow-md"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isAr ? "حفظ التغييرات" : "Save Changes"}
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl z-55 flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}
    </form>
  );
}
