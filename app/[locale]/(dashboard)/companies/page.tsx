"use client";

import { useState } from "react";
import { Plus, Search, Download, LogIn, MoreHorizontal, Building2, X } from "lucide-react";
import { getMockData } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function CompaniesPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const isRtl = locale === 'ar';
  const { companies } = getMockData(isAr);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddCompany = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to add company goes here
    setIsAddModalOpen(false);
    showToast(isAr ? "تمت إضافة الشركة بنجاح!" : "Company added successfully!");
  };

  return (
    <div className="space-y-5 relative">
      {/* Stats for Super Admin */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-sm text-slate-500">{isAr ? "إجمالي الشركات" : "Total Companies"}</p>
          <p className="text-3xl font-bold mt-1">48</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-slate-500">{isAr ? "عملاء حاليون" : "Active Clients"}</p>
          <p className="text-3xl font-bold mt-1 text-emerald-600">41</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-slate-500">{isAr ? "شركات محتملة" : "Prospects"}</p>
          <p className="text-3xl font-bold mt-1 text-blue-500">7</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-slate-500">{isAr ? "إجمالي الصفقات" : "Total Deals"}</p>
          <p className="text-3xl font-bold mt-1 text-amber-500">124</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
          <input type="text" placeholder={isAr ? "بحث عن شركة..." : "Search company..."} className={`input ${isRtl ? 'pr-10' : 'pl-10'}`} />
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Download className="w-4 h-4" /> {isAr ? "تصدير" : "Export"}</button>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-accent"><Plus className="w-4 h-4" /> {isAr ? "إضافة شركة" : "Add Company"}</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isAr ? "الشركة" : "Company"}</th>
              <th>{isAr ? "صاحب الشركة" : "Owner"}</th>
              <th>{isAr ? "البريد / الهاتف" : "Email / Phone"}</th>
              <th>{isAr ? "المستخدمين" : "Users"}</th>
              <th>{isAr ? "الـ Leads" : "Leads"}</th>
              <th>{isAr ? "الباقة" : "Plan"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
              <th>{isAr ? "تاريخ الإنشاء" : "Created Date"}</th>
              <th>{isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="text-sm">{c.owner}</td>
                <td>
                  <div className="text-sm">{c.email}</div>
                  <div className="text-xs text-slate-400">{c.phone}</div>
                </td>
                <td className="text-center font-medium">{c.users}</td>
                <td className="text-center font-medium">{formatNumber(c.leads)}</td>
                <td><span className="badge badge-info">{c.plan}</span></td>
                <td>
                  <span className={`badge ${c.status === "نشط" || c.status === "Active" ? "badge-success" : "badge-danger"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="text-sm text-slate-500">{c.created}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600" title="Login As">
                      <LogIn className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                      <MoreHorizontal className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-2xl w-full my-8 relative z-50">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "إضافة شركة جديدة" : "Add New Company"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCompany} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{isAr ? "البيانات الأساسية" : "Basic Information"}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "اسم الشركة" : "Company Name"}</label>
                    <input type="text" required className="input" placeholder={isAr ? "مثال: شركة الأفق" : "e.g. Horizon Inc."} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الشخص المسؤول (Contact Person)" : "Contact Person"}</label>
                    <input type="text" required className="input" placeholder={isAr ? "الاسم الكامل" : "Full Name"} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                    <input type="email" required className="input" placeholder="info@company.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "رقم الهاتف" : "Phone"}</label>
                    <input type="text" required className="input" placeholder="+971..." />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100"></div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{isAr ? "تفاصيل إضافية" : "Additional Details"}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "المجال (الصناعة)" : "Industry"}</label>
                    <select className="input">
                      <option value="tech">{isAr ? "تكنولوجيا" : "Technology"}</option>
                      <option value="real_estate">{isAr ? "عقارات" : "Real Estate"}</option>
                      <option value="health">{isAr ? "صحة وطب" : "Healthcare"}</option>
                      <option value="education">{isAr ? "تعليم" : "Education"}</option>
                      <option value="other">{isAr ? "أخرى" : "Other"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الموقع الإلكتروني" : "Website"}</label>
                    <input type="text" className="input" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "حجم الشركة" : "Company Size"}</label>
                    <select className="input">
                      <option value="small">1-10 {isAr ? "موظفين" : "Employees"}</option>
                      <option value="medium">11-50 {isAr ? "موظف" : "Employees"}</option>
                      <option value="large">51-200 {isAr ? "موظف" : "Employees"}</option>
                      <option value="enterprise">200+ {isAr ? "موظف" : "Employees"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "المدينة" : "City"}</label>
                    <input type="text" className="input" placeholder={isAr ? "دبي" : "Dubai"} />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 flex gap-3 justify-end sticky bottom-0 bg-white/80 backdrop-blur-md pb-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-outline px-6">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent px-6">
                  {isAr ? "حفظ وإضافة الشركة" : "Save & Add Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
