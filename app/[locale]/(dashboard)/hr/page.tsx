"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Edit, Trash2, Mail, Phone, Plus, X, AlertTriangle } from "lucide-react";
import { useLocale } from "next-intl";

export default function HRPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const isRtl = locale === 'ar';

  // Stateful employees list
  const [employees, setEmployees] = useState([
    { id: 1, name: isAr ? "أحمد العتيبي" : "Ahmed Alotaibi", email: "ahmed@egitg.com", phone: "0501112222", dept: isAr ? "المبيعات" : "Sales", role: isAr ? "مدير المبيعات" : "Sales Manager", salary: 8500, date: "2024-01-15", status: isAr ? "نشط" : "Active" },
    { id: 2, name: isAr ? "سارة محمد" : "Sara Mohammed", email: "sara@egitg.com", phone: "0503334444", dept: isAr ? "المبيعات" : "Sales", role: isAr ? "مسؤول مبيعات" : "Sales Agent", salary: 5000, date: "2025-05-10", status: isAr ? "نشط" : "Active" },
    { id: 3, name: isAr ? "خالد سعيد" : "Khalid Saeed", email: "khalid@egitg.com", phone: "0505556666", dept: isAr ? "الدعم الفني" : "Support", role: isAr ? "وكيل الدعم" : "Support Agent", salary: 4500, date: "2025-11-20", status: isAr ? "إجازة" : "On Leave" },
  ]);

  // Pagination & Search States
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<any>(null);
  const [toast, setToast] = useState<{message: string} | null>(null);

  // Reset pagination on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Toast Helper
  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Search Logic
  const filteredEmployees = employees.filter((emp) => {
    return (
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) ||
      emp.dept.toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;

  const handleAddEmployeeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEmp = {
      id: Date.now(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      dept: formData.get("dept") as string || (isAr ? "المبيعات" : "Sales"),
      role: formData.get("role") as string || "Sales Agent",
      salary: Number(formData.get("salary")) || 4000,
      date: new Date().toISOString().split('T')[0],
      status: isAr ? "نشط" : "Active"
    };

    setEmployees(prev => [newEmp, ...prev]);
    setIsAddModalOpen(false);
    showToast(isAr ? "تم إضافة الموظف بنجاح!" : "Employee added successfully!");
  };

  const handleEditEmployeeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? {
      ...emp,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      dept: formData.get("dept") as string || emp.dept,
      role: formData.get("role") as string || emp.role,
      salary: Number(formData.get("salary")) || emp.salary,
      status: formData.get("status") as string || emp.status
    } : emp));
    setEditingEmployee(null);
    showToast(isAr ? "تم تعديل بيانات الموظف بنجاح!" : "Employee profile updated successfully!");
  };

  const handleDeleteConfirm = () => {
    if (deletingEmployee) {
      setEmployees(prev => prev.filter(emp => emp.id !== deletingEmployee.id));
      setDeletingEmployee(null);
      showToast(isAr ? "تم إيقاف/حذف الموظف بنجاح!" : "Employee suspended successfully!");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold">{isAr ? "إدارة الموظفين (HR)" : "HR & Employee Management"}</h2>
          <p className="text-slate-500 text-sm mt-1">{isAr ? "إدارة بيانات الموظفين وفرق العمل داخل الشركة." : "Manage employee profiles and team departments within the company."}</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder={isAr ? "بحث عن موظف..." : "Search employee..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`input ${isRtl ? 'pr-10' : 'pl-10'}`}
            />
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-accent flex items-center gap-2 whitespace-nowrap cursor-pointer">
            <Plus className="w-4 h-4" />
            {isAr ? "إضافة موظف" : "Add Employee"}
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>{isAr ? "الموظف" : "Employee"}</th>
              <th>{isAr ? "القسم" : "Department"}</th>
              <th>{isAr ? "الدور الوظيفي" : "Role"}</th>
              <th>{isAr ? "الراتب الأساسي" : "Basic Salary"}</th>
              <th>{isAr ? "تاريخ التعيين" : "Hire Date"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
              <th className={isRtl ? 'text-left' : 'text-right'}>{isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((emp, index) => (
              <tr key={emp.id}>
                <td className="w-12 text-center text-slate-400 font-semibold">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td>
                  <div className="font-medium text-[var(--primary)]">{emp.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {emp.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {emp.phone}</span>
                  </div>
                </td>
                <td className="text-sm">{emp.dept}</td>
                <td className="text-sm">{emp.role}</td>
                <td className="font-medium">{emp.salary} {isAr ? "ر.س" : "SAR"}</td>
                <td className="text-sm text-slate-500">{emp.date}</td>
                <td>
                  <span className={`badge ${emp.status === "نشط" || emp.status === "Active" ? "badge-success" : "badge-warning"}`}>
                    {emp.status}
                  </span>
                </td>
                <td>
                  <div className={`flex items-center gap-1.5 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                    <button 
                      onClick={() => setEditingEmployee(emp)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer" 
                      title={isAr ? "تعديل البيانات" : "Edit Profile"}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeletingEmployee(emp)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors cursor-pointer" 
                      title={isAr ? "إيقاف الموظف" : "Suspend Employee"}
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
              ? `عرض ${Math.min((currentPage - 1) * pageSize + 1, filteredEmployees.length)} - ${Math.min(currentPage * pageSize, filteredEmployees.length)} من أصل ${filteredEmployees.length} موظفين`
              : `Showing ${Math.min((currentPage - 1) * pageSize + 1, filteredEmployees.length)} - ${Math.min(currentPage * pageSize, filteredEmployees.length)} of ${filteredEmployees.length} employees`
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

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "إضافة موظف جديد" : "Add New Employee"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddEmployeeSubmit} className="p-6 space-y-4 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الاسم الكامل" : "Full Name"}</label>
                  <input type="text" name="name" required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                  <input type="email" name="email" required className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "رقم الهاتف" : "Phone"}</label>
                  <input type="text" name="phone" required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الراتب الأساسي ($)" : "Salary ($)"}</label>
                  <input type="number" name="salary" defaultValue={5000} className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "القسم" : "Department"}</label>
                  <select name="dept" className="input">
                    <option value={isAr ? "المبيعات" : "Sales"}>{isAr ? "المبيعات" : "Sales"}</option>
                    <option value={isAr ? "الدعم الفني" : "Support"}>{isAr ? "الدعم الفني" : "Support"}</option>
                    <option value={isAr ? "التسويق" : "Marketing"}>{isAr ? "التسويق" : "Marketing"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الدور الوظيفي" : "Role"}</label>
                  <input type="text" name="role" required defaultValue={isAr ? "مسؤول مبيعات" : "Sales Agent"} className="input" />
                </div>
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

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "تعديل بيانات الموظف" : "Edit Profile"}</h3>
              <button onClick={() => setEditingEmployee(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditEmployeeSubmit} className="p-6 space-y-4 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الاسم الكامل" : "Full Name"}</label>
                  <input type="text" name="name" defaultValue={editingEmployee.name} required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                  <input type="email" name="email" defaultValue={editingEmployee.email} required className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "رقم الهاتف" : "Phone"}</label>
                  <input type="text" name="phone" defaultValue={editingEmployee.phone} required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الراتب الأساسي" : "Salary"}</label>
                  <input type="number" name="salary" defaultValue={editingEmployee.salary} className="input" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "القسم" : "Department"}</label>
                  <select name="dept" defaultValue={editingEmployee.dept} className="input">
                    <option value={isAr ? "المبيعات" : "Sales"}>{isAr ? "المبيعات" : "Sales"}</option>
                    <option value={isAr ? "الدعم الفني" : "Support"}>{isAr ? "الدعم الفني" : "Support"}</option>
                    <option value={isAr ? "التسويق" : "Marketing"}>{isAr ? "التسويق" : "Marketing"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الدور الوظيفي" : "Role"}</label>
                  <input type="text" name="role" defaultValue={editingEmployee.role} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الحالة" : "Status"}</label>
                  <select name="status" defaultValue={editingEmployee.status} className="input">
                    <option value={isAr ? "نشط" : "Active"}>{isAr ? "نشط" : "Active"}</option>
                    <option value={isAr ? "إجازة" : "On Leave"}>{isAr ? "إجازة" : "On Leave"}</option>
                    <option value={isAr ? "معطل" : "Suspended"}>{isAr ? "معطل" : "Suspended"}</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setEditingEmployee(null)} className="btn-outline cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent cursor-pointer">
                  {isAr ? "حفظ التعديلات" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Suspend Confirmation Modal */}
      {deletingEmployee && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-800">{isAr ? "تأكيد الإجراء" : "Confirm Action"}</h3>
                <p className="text-sm text-slate-500">
                  {isAr 
                    ? `هل أنت متأكد من رغبتك في إيقاف/حذف الموظف "${deletingEmployee.name}" عن العمل؟`
                    : `Are you sure you want to suspend/delete employee "${deletingEmployee.name}"?`}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-center">
              <button 
                type="button" 
                onClick={() => setDeletingEmployee(null)} 
                className="btn-outline w-24 cursor-pointer"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                type="button" 
                onClick={handleDeleteConfirm} 
                className="btn-danger w-24 bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                {isAr ? "إيقاف" : "Suspend"}
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
