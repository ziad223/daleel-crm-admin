"use client";

import { useState } from "react";
import { ShieldAlert, Check, X, ShieldCheck, Edit } from "lucide-react";
import { useLocale } from "next-intl";

export default function RolesPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  // Stateful roles list
  const [roles, setRoles] = useState(
    isAr 
      ? ["مدير الشركة", "مدير المبيعات", "مسؤول مبيعات", "وكيل الدعم", "المالية"] 
      : ["Company Admin", "Sales Manager", "Sales Agent", "Support Agent", "Finance"]
  );
  
  // Stateful permissions list
  const [permissions, setPermissions] = useState([
    { name: isAr ? "رؤية كل العملاء (Leads)" : "View all leads", values: [true, true, false, false, false] },
    { name: isAr ? "تصدير البيانات (Excel)" : "Export data (Excel)", values: [true, false, false, false, false] },
    { name: isAr ? "حذف العملاء" : "Delete leads", values: [true, false, false, false, false] },
    { name: isAr ? "تعديل بيانات العملاء" : "Edit leads details", values: [true, true, true, false, false] },
    { name: isAr ? "نقل العملاء بين الموظفين" : "Transfer leads between employees", values: [true, true, false, false, false] },
    { name: isAr ? "رؤية رقم الهاتف كاملاً" : "View full phone number", values: [true, true, false, false, false] },
    { name: isAr ? "إرسال رسائل واتساب" : "Send WhatsApp messages", values: [true, true, true, true, false] },
    { name: isAr ? "رؤية فواتير الشركة" : "View company invoices", values: [true, false, false, false, true] },
  ]);

  // Modal & Toast States
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<{ index: number; name: string } | null>(null);
  const [toast, setToast] = useState<{message: string} | null>(null);

  // Toast Helper
  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle permission value directly in matrix
  const togglePermission = (permIdx: number, roleIdx: number) => {
    setPermissions(prev => prev.map((perm, idx) => {
      if (idx === permIdx) {
        const newValues = [...perm.values];
        newValues[roleIdx] = !newValues[roleIdx];
        return { ...perm, values: newValues };
      }
      return perm;
    }));
    showToast(isAr ? "تم تحديث صلاحية الوصول بنجاح!" : "Access permission updated successfully!");
  };

  // Add New Role with custom checklist values
  const handleAddRoleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roleName = formData.get("roleName") as string;
    
    if (roleName.trim()) {
      setRoles(prev => [...prev, roleName.trim()]);
      setPermissions(prev => prev.map((perm, idx) => {
        // Read if checkbox was checked
        const hasAccess = formData.get(`perm_${idx}`) === "on";
        return {
          ...perm,
          values: [...perm.values, hasAccess]
        };
      }));
      setIsAddRoleModalOpen(false);
      showToast(isAr ? `تم إضافة الدور "${roleName}" بنجاح!` : `Role "${roleName}" added successfully!`);
    }
  };

  // Edit Existing Permission Name
  const handleEditPermissionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get("permissionName") as string;
    
    if (newName.trim() && editingPermission) {
      setPermissions(prev => prev.map((p, idx) => 
        idx === editingPermission.index ? { ...p, name: newName.trim() } : p
      ));
      setEditingPermission(null);
      showToast(isAr ? "تم تعديل اسم الصلاحية بنجاح!" : "Permission name updated successfully!");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{isAr ? "الأدوار والصلاحيات" : "Roles & Permissions"}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {isAr ? "إدارة مستويات الوصول والمشاهدة لكل دور وظيفي." : "Manage access levels and visibility for each job role."}
          </p>
        </div>
        <button onClick={() => setIsAddRoleModalOpen(true)} className="btn-accent cursor-pointer">
          {isAr ? "إضافة دور جديد" : "Add New Role"}
        </button>
      </div>

      <div className="stat-card bg-amber-50 border-amber-100 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5" />
        <div className="text-sm text-amber-800 text-right w-full">
          <strong>{isAr ? "تنبيه الأمان:" : "Security Warning:"}</strong>{" "}
          {isAr
            ? "لمنع سرقة الأرقام، الموظف بمستوى (مسؤول مبيعات) لا يرى أرقام الهواتف كاملة وتظهر له مخفية جزئياً مثل 050****123 ولا يمكنه تصدير البيانات."
            : "To prevent lead theft, the Sales Agent role cannot view full phone numbers (masked as 050****123) and cannot export data."}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-1/3">{isAr ? "الصلاحية" : "Permission"}</th>
              {roles.map((role, i) => (
                <th key={i} className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    {role}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm, permIdx) => (
              <tr key={permIdx}>
                <td className="font-medium text-slate-700 text-right">
                  <div className="flex items-center justify-between gap-2">
                    <button 
                      onClick={() => setEditingPermission({ index: permIdx, name: perm.name })}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title={isAr ? "تعديل اسم الصلاحية" : "Edit permission name"}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <span>{perm.name}</span>
                  </div>
                </td>
                {perm.values.map((hasAccess, roleIdx) => (
                  <td key={roleIdx} className="text-center">
                    <button 
                      onClick={() => togglePermission(permIdx, roleIdx)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                        hasAccess 
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                          : "bg-red-50 text-red-400 hover:bg-red-100"
                      }`}
                      title={isAr ? "اضغط للتغيير" : "Click to toggle"}
                    >
                      {hasAccess ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Role Modal */}
      {isAddRoleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-md text-slate-800">{isAr ? "إضافة دور وظيفي جديد" : "Add New Role"}</h3>
              <button onClick={() => setIsAddRoleModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRoleSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">{isAr ? "اسم الدور الوظيفي" : "Role Name"}</label>
                <input type="text" name="roleName" required placeholder="e.g. Sales Coordinator" className="input" />
              </div>
              
              {/* Permission Checklist */}
              <div className="space-y-2 mt-3 max-h-48 overflow-y-auto pr-1 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">{isAr ? "اختر صلاحيات الدور الجديد:" : "Select permissions for this role:"}</label>
                {permissions.map((perm, idx) => (
                  <label key={idx} className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer py-1.5 hover:bg-white rounded px-2 justify-between">
                    <span className="font-medium">{perm.name}</span>
                    <input 
                      type="checkbox" 
                      name={`perm_${idx}`} 
                      className="w-4 h-4 accent-[var(--primary)] cursor-pointer" 
                    />
                  </label>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setIsAddRoleModalOpen(false)} className="btn-outline cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent cursor-pointer">
                  {isAr ? "إضافة" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Permission Name Modal */}
      {editingPermission && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-md text-slate-800">{isAr ? "تعديل اسم الصلاحية" : "Edit Permission Name"}</h3>
              <button onClick={() => setEditingPermission(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditPermissionSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">{isAr ? "اسم الصلاحية" : "Permission Name"}</label>
                <input 
                  type="text" 
                  name="permissionName" 
                  required 
                  defaultValue={editingPermission.name} 
                  className="input" 
                />
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setEditingPermission(null)} className="btn-outline cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent cursor-pointer">
                  {isAr ? "حفظ التعديل" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
