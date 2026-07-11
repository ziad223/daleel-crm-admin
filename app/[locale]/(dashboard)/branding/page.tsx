"use client";

import { useState } from "react";
import { Palette, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { useLocale } from "next-intl";

export default function BrandingPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  // Branding states
  const [displayName, setDisplayName] = useState("East Guide CRM");
  const [primaryColor, setPrimaryColor] = useState("#1E3A8A"); // Default primary
  const [copyrightText, setCopyrightText] = useState("© 2026 East Guide IT Group");
  
  // Simulated upload states
  const [logoName, setLogoName] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [faviconName, setFaviconName] = useState<string | null>(null);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Dynamic style changes to root variables
  const handleSaveChanges = () => {
    // Set --primary color variable on document element to immediately skin the CRM theme
    document.documentElement.style.setProperty("--primary", primaryColor);
    
    // Auto-calculate a slightly darker variation for hover states
    const hoverColor = primaryColor + "e0"; // hex transparent overlay
    document.documentElement.style.setProperty("--primary-dark", hoverColor);

    showToast(
      isAr 
        ? "تم تطبيق وحفظ الهوية البصرية بنجاح!" 
        : "Brand identity applied and saved successfully!"
    );
  };

  // Mock file uploader simulation
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'logo') {
      setIsUploadingLogo(true);
      setLogoName(null);
      setTimeout(() => {
        setIsUploadingLogo(false);
        setLogoName(file.name);
        showToast(isAr ? "تم رفع شعار الشركة بنجاح!" : "Company logo uploaded successfully!");
      }, 1500);
    } else {
      setIsUploadingFavicon(true);
      setFaviconName(null);
      setTimeout(() => {
        setIsUploadingFavicon(false);
        setFaviconName(file.name);
        showToast(isAr ? "تم رفع الأيقونة بنجاح!" : "Favicon uploaded successfully!");
      }, 1200);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{isAr ? "الهوية البصرية (Branding)" : "Branding & Identity"}</h2>
        <p className="text-slate-500 text-sm mt-1">{isAr ? "تخصيص النظام ليطابق هوية شركتك بالكامل." : "Customize the system to fully match your brand identity."}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Logos Section */}
        <div className="stat-card space-y-5 text-right">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 justify-end">
            <h3 className="font-bold">{isAr ? "الشعارات والصور" : "Logos & Media"}</h3>
            <ImageIcon className="w-5 h-5 text-[var(--primary)]" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{isAr ? "شعار الشركة (الأساسي)" : "Primary Company Logo"}</label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors text-center overflow-hidden">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleLogoUpload(e, 'logo')}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              
              {isUploadingLogo ? (
                <div className="flex flex-col items-center py-2">
                  <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin mb-2" />
                  <p className="text-sm text-slate-500">{isAr ? "جاري رفع الشعار..." : "Uploading logo..."}</p>
                </div>
              ) : logoName ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">{logoName}</p>
                  <p className="text-xs text-slate-400 mt-1">{isAr ? "انقر لتغيير الملف" : "Click to change file"}</p>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm font-medium">{isAr ? "اضغط أو اسحب لرفع الشعار" : "Click or drag to upload logo"}</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG (Max 2MB)</p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{isAr ? "الأيقونة (Favicon)" : "Favicon"}</label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors text-center overflow-hidden">
              <input 
                type="file" 
                accept="image/x-icon,image/png"
                onChange={(e) => handleLogoUpload(e, 'favicon')}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              
              {isUploadingFavicon ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[var(--primary)] animate-spin" />
                  <span className="text-sm text-slate-500">{isAr ? "جاري الرفع..." : "Uploading..."}</span>
                </div>
              ) : faviconName ? (
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{faviconName}</span>
                </div>
              ) : (
                <span className="text-sm font-medium">{isAr ? "اضغط لرفع الأيقونة" : "Click to upload favicon"}</span>
              )}
            </div>
          </div>
        </div>

        {/* Styling Configuration Section */}
        <div className="stat-card space-y-5 text-right">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 justify-end">
            <h3 className="font-bold">{isAr ? "الألوان والنصوص" : "Colors & Styling"}</h3>
            <Palette className="w-5 h-5 text-[var(--primary)]" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{isAr ? "اسم النظام الظاهر" : "System Display Name"}</label>
            <input 
              type="text" 
              className="input text-right" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{isAr ? "اللون الأساسي (Primary Color)" : "Primary Color"}</label>
            <div className="flex gap-3 items-center">
              <input 
                type="color" 
                className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer p-0.5" 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
              <input 
                type="text" 
                className="input flex-1 font-mono text-sm" 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{isAr ? "نص حقوق النشر (الفوتر)" : "Footer Copyright Text"}</label>
            <input 
              type="text" 
              className="input text-right" 
              value={copyrightText} 
              onChange={(e) => setCopyrightText(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <button 
              onClick={handleSaveChanges}
              className="btn-primary w-full cursor-pointer shadow-md"
            >
              {isAr ? "حفظ وتطبيق التغييرات" : "Save & Apply Changes"}
            </button>
          </div>
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
