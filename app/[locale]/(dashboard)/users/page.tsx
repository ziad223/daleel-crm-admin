"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, Shield, Edit, Trash2, X, AlertTriangle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function UsersPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const isAr = locale === 'ar';

  // Stateful users list with translated roles
  const [users, setUsers] = useState([
    { id: 1, name: isAr ? "عبدالرحمن المالك" : "Abdulrahman Almalik", email: "admin@egitg.com", role: isAr ? "مدير الشركة" : "Company Admin", lastLogin: isAr ? "اليوم 10:30 ص" : "Today 10:30 AM", status: isAr ? "نشط" : "Active" },
    { id: 2, name: isAr ? "أحمد العتيبي" : "Ahmed Alotaibi", email: "ahmed@egitg.com", role: isAr ? "مدير المبيعات" : "Sales Manager", lastLogin: isAr ? "اليوم 08:00 ص" : "Today 08:00 AM", status: isAr ? "نشط" : "Active" },
    { id: 3, name: isAr ? "سارة محمد" : "Sarah Mohammed", email: "sara@egitg.com", role: isAr ? "مسؤول مبيعات" : "Sales Agent", lastLogin: isAr ? "أمس 04:15 م" : "Yesterday 04:15 PM", status: isAr ? "نشط" : "Active" },
  ]);

  // Search & Pagination States
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [blockingUser, setBlockingUser] = useState<any>(null);
  const [toast, setToast] = useState<{message: string} | null>(null);

  // Reset pagination on search
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Toast Helper
  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Search Logic
  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  const handleAddUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser = {
      id: Date.now(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string || (isAr ? "مسؤول مبيعات" : "Sales Agent"),
      lastLogin: isAr ? "الآن" : "Just now",
      status: isAr ? "نشط" : "Active"
    };

    setUsers(prev => [newUser, ...prev]);
    setIsAddModalOpen(false);
    showToast(isAr ? "تم إضافة المستخدم بنجاح!" : "User added successfully!");
  };

  const handleEditRoleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedRole = formData.get("role") as string;
    
    setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, role: selectedRole } : u));
    setEditingUser(null);
    showToast(isAr ? "تم تحديث دور المستخدم بنجاح!" : "User role updated successfully!");
  };

  const handleBlockConfirm = () => {
    if (blockingUser) {
      setUsers(prev => prev.map(u => u.id === blockingUser.id ? { ...u, status: isAr ? "محظور" : "Blocked" } : u));
      setBlockingUser(null);
      showToast(isAr ? "تم حظر المستخدم بنجاح!" : "User blocked successfully!");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold">{t("users.title")}</h2>
          <p className="text-slate-500 text-sm mt-1">{t("users.subtitle")}</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input 
              type="text" 
              placeholder={t("users.searchPlaceholder")} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`input ${isRtl ? 'pr-10' : 'pl-10'}`} 
            />
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-accent flex items-center gap-2 whitespace-nowrap cursor-pointer">
            <Plus className="w-4 h-4" />
            {t("users.addBtn")}
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>{t("users.tableUser")}</th>
              <th>{t("leads.table.email")}</th>
              <th>{t("users.tableRole")}</th>
              <th>{t("users.tableLastLogin")}</th>
              <th>{t("leads.table.status")}</th>
              <th className={isRtl ? 'text-left' : 'text-right'}>{t("leads.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr key={user.id}>
                <td className="w-12 text-center text-slate-400 font-semibold">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="font-medium text-[var(--primary)]">{user.name}</td>
                <td className="text-sm">{user.email}</td>
                <td>
                  <span className="badge badge-info flex items-center gap-1 w-fit">
                    <Shield className="w-3 h-3" />
                    {user.role}
                  </span>
                </td>
                <td className="text-sm text-slate-500">{user.lastLogin}</td>
                <td>
                  <span className={`badge ${
                    user.status === "نشط" || user.status === "Active" 
                      ? "badge-success" 
                      : user.status === "محظور" || user.status === "Blocked"
                      ? "badge-danger"
                      : "badge-neutral"
                  }`}>{user.status}</span>
                </td>
                <td>
                  <div className={`flex items-center gap-1.5 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer" 
                      title={t("users.actions.editRole")}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setBlockingUser(user)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors cursor-pointer" 
                      title={t("users.actions.block")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-slate-500">
          <div>
            {isAr 
              ? `عرض ${Math.min((currentPage - 1) * pageSize + 1, filteredUsers.length)} - ${Math.min(currentPage * pageSize, filteredUsers.length)} من أصل ${filteredUsers.length} مستخدمين`
              : `Showing ${Math.min((currentPage - 1) * pageSize + 1, filteredUsers.length)} - ${Math.min(currentPage * pageSize, filteredUsers.length)} of ${filteredUsers.length} users`
            }
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-outline btn-sm disabled:opacity-50"
            >
              {isAr ? "السابق" : "Prev"}
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`${currentPage === i + 1 ? "btn-primary" : "btn-outline"} btn-sm`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-outline btn-sm disabled:opacity-50"
            >
              {isAr ? "التالي" : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "إضافة مستخدم جديد" : "Add New User"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الاسم" : "Name"}</label>
                <input type="text" name="name" required className="input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                <input type="email" name="email" required className="input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الدور الوظيفي" : "Role"}</label>
                <select name="role" className="input">
                  {(isAr 
                    ? ["مدير الشركة", "مدير المبيعات", "مسؤول مبيعات", "وكيل الدعم", "المالية"]
                    : ["Company Admin", "Sales Manager", "Sales Agent", "Support Agent", "Finance"]
                  ).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-outline cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent cursor-pointer">
                  {isAr ? "حفظ" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-md text-slate-800">{isAr ? "تغيير صلاحيات المستخدم" : "Edit User Role"}</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditRoleSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">{isAr ? "اختر الدور الوظيفي الجديد" : "Select Role"}</label>
                <select name="role" defaultValue={editingUser.role} className="input">
                  {(isAr 
                    ? ["مدير الشركة", "مدير المبيعات", "مسؤول مبيعات", "وكيل الدعم", "المالية"]
                    : ["Company Admin", "Sales Manager", "Sales Agent", "Support Agent", "Finance"]
                  ).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setEditingUser(null)} className="btn-outline cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent cursor-pointer">
                  {isAr ? "تحديث" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Block User Confirmation Modal */}
      {blockingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-800">{isAr ? "تأكيد الحظر" : "Confirm Block"}</h3>
                <p className="text-sm text-slate-500">
                  {isAr 
                    ? `هل أنت متأكد من رغبتك في حظر المستخدم "${blockingUser.name}"؟ لن يتمكن من دخول النظام.`
                    : `Are you sure you want to block user "${blockingUser.name}"? They will not be able to login.`}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-center">
              <button 
                type="button" 
                onClick={() => setBlockingUser(null)} 
                className="btn-outline w-24 cursor-pointer"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                type="button" 
                onClick={handleBlockConfirm} 
                className="btn-danger w-24 bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                {isAr ? "حظر" : "Block"}
              </button>
            </div>
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
