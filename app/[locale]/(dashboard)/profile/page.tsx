"use client";

import { useState } from "react";
import { User, Mail, Phone, Lock, Save, Camera, Loader2, KeyRound } from "lucide-react";
import { useLocale } from "next-intl";

export default function ProfilePage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const isRtl = locale === 'ar';

  // Stateful profile details
  const [name, setName] = useState("أحمد العتيبي");
  const [email, setEmail] = useState("ahmed@egitg.com");
  const [phone, setPhone] = useState("+966 50 111 2222");
  
  // Avatar preview upload
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      showToast(isAr ? "تم حفظ تغييرات الملف الشخصي بنجاح!" : "Profile changes saved successfully!");
    }, 1200);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        showToast(isAr ? "تم تحديث الصورة الشخصية بنجاح!" : "Profile photo updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-start">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{isAr ? "الملف الشخصي" : "My Profile"}</h2>
        <p className="text-slate-500 text-sm">
          {isAr ? "إدارة معلوماتك الشخصية وصورتك وكلمة المرور الخاصة بك." : "Manage your personal profile details, avatar, and security passwords."}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Side: Avatar and Info Summary (Always aligns correct to side columns in grid based on RTL/LTR) */}
        <div className="stat-card flex flex-col items-center justify-center p-8 text-center space-y-5 border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--primary)] to-emerald-500" />
          
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-slate-50 flex items-center justify-center font-bold text-3xl text-slate-600 overflow-hidden shadow-inner transition-transform duration-300 group-hover:scale-105">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif">{isAr ? 'أ' : 'A'}</span>
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer border-2 border-white shadow-md active:scale-90">
              <Camera className="w-4.5 h-4.5" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-800 text-lg">{name}</h4>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {isAr ? "مدير الشركة" : "Company Admin"}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed settings forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Info Card */}
          <div className="stat-card space-y-6 p-7">
            <h3 className="font-bold text-md text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100 justify-start">
              <User className="w-5 h-5 text-[var(--primary)]" />
              <span>{isAr ? "البيانات الشخصية" : "Personal Information"}</span>
            </h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-5 text-start">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{isAr ? "الاسم بالكامل" : "Full Name"}</label>
                  <div className="relative">
                    <User className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className={`input text-start ${isRtl ? 'pr-10' : 'pl-10'}`} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
                  <div className="relative">
                    <Mail className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                    <input 
                      type="email" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className={`input text-start font-mono ${isRtl ? 'pr-10' : 'pl-10'}`} 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{isAr ? "رقم الهاتف" : "Phone Number"}</label>
                <div className="relative">
                  <Phone className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                  <input 
                    type="text" 
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className={`input text-start ${isRtl ? 'pr-10' : 'pl-10'}`} 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
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
            </form>
          </div>

          {/* Security / Password Card */}
          <div className="stat-card space-y-6 p-7">
            <h3 className="font-bold text-md text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100 justify-start">
              <Lock className="w-5 h-5 text-[var(--primary)]" />
              <span>{isAr ? "تغيير كلمة المرور" : "Change Password"}</span>
            </h3>

            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                showToast(isAr ? "تم تحديث كلمة المرور بنجاح!" : "Password updated successfully!"); 
              }} 
              className="space-y-5 text-start"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{isAr ? "كلمة المرور الحالية" : "Current Password"}</label>
                  <div className="relative">
                    <KeyRound className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                    <input type="password" required className={`input text-start ${isRtl ? 'pr-10' : 'pl-10'}`} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{isAr ? "كلمة المرور الجديدة" : "New Password"}</label>
                  <div className="relative">
                    <Lock className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                    <input type="password" required className={`input text-start ${isRtl ? 'pr-10' : 'pl-10'}`} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{isAr ? "تأكيد كلمة المرور" : "Confirm Password"}</label>
                  <div className="relative">
                    <Lock className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                    <input type="password" required className={`input text-start ${isRtl ? 'pr-10' : 'pl-10'}`} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="btn-accent flex items-center gap-2 cursor-pointer shadow-md bg-slate-900 text-white hover:bg-slate-800">
                  <Lock className="w-4 h-4" />
                  {isAr ? "تحديث كلمة المرور" : "Update Password"}
                </button>
              </div>
            </form>
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
