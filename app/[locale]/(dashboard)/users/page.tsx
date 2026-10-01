"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, Shield, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";

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

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
          <EmptyState isSearch={search.length > 0} searchQuery={search} />
        </div>
      ) : (
        <>
          <div className="table-container mt-4">
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
          <div className="flex justify-between items-center text-sm text-slate-500 mt-4">
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
      </>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={isAr ? "إضافة مستخدم جديد" : "Add New User"}
        maxWidth="sm"
        footer={
          <>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">{isAr ? "إلغاء" : "Cancel"}</button>
            <button onClick={() => (document.getElementById('addUserForm') as HTMLFormElement)?.requestSubmit()} className="px-6 py-2 bg-[var(--primary)] hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all">{isAr ? "حفظ" : "Save"}</button>
          </>
        }
      >
        <form id="addUserForm" onSubmit={handleAddUserSubmit} className="space-y-4">
          <div><label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الاسم" : "Name"}</label><input type="text" name="name" required className="input" /></div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "البريد الإلكتروني" : "Email"}</label><input type="email" name="email" required className="input" /></div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الدور الوظيفي" : "Role"}</label>
            <select name="role" className="input">
              {(isAr ? ["مدير الشركة", "مدير المبيعات", "مسؤول مبيعات", "وكيل الدعم", "المالية"] : ["Company Admin", "Sales Manager", "Sales Agent", "Support Agent", "Finance"]).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={isAr ? "تغيير صلاحيات المستخدم" : "Edit User Role"}
        maxWidth="sm"
        footer={
          <>
            <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">{isAr ? "إلغاء" : "Cancel"}</button>
            <button onClick={() => (document.getElementById('editRoleForm') as HTMLFormElement)?.requestSubmit()} className="px-6 py-2 bg-[var(--primary)] hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all">{isAr ? "تحديث" : "Update"}</button>
          </>
        }
      >
        <form id="editRoleForm" onSubmit={handleEditRoleSubmit}>
          <label className="block text-xs font-semibold text-slate-500 mb-2">{isAr ? "اختر الدور الوظيفي الجديد" : "Select Role"}</label>
          <select name="role" defaultValue={editingUser?.role} className="input">
            {(isAr ? ["مدير الشركة", "مدير المبيعات", "مسؤول مبيعات", "وكيل الدعم", "المالية"] : ["Company Admin", "Sales Manager", "Sales Agent", "Support Agent", "Finance"]).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </form>
      </Modal>

      {/* Block User Modal */}
      <Modal
        isOpen={!!blockingUser}
        onClose={() => setBlockingUser(null)}
        title={isAr ? "تأكيد الحظر" : "Confirm Block"}
        maxWidth="sm"
        footer={
          <>
            <button onClick={() => setBlockingUser(null)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">{isAr ? "إلغاء" : "Cancel"}</button>
            <button onClick={handleBlockConfirm} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl shadow-lg shadow-red-500/30 transition-all">{isAr ? "حظر" : "Block"}</button>
          </>
        }
      >
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="w-8 h-8" /></div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">{isAr ? "هل أنت متأكد؟" : "Are you sure?"}</h3>
          <p className="text-slate-500">{isAr ? `سيتم حظر "‏${blockingUser?.name}" ولن يتمكن من دخول النظام.` : `User "${blockingUser?.name}" will be blocked and cannot login.`}</p>
        </div>
      </Modal>

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
