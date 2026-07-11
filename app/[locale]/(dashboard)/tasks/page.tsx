"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, CheckCircle, Edit, Trash2, Bell, X, AlertTriangle } from "lucide-react";
import { getMockData } from "@/lib/mock-data";
import { useTranslations, useLocale } from "next-intl";

export default function TasksPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const isAr = locale === 'ar';

  const { recentTasks } = getMockData(isAr);
  
  // Local state
  const [tasks, setTasks] = useState(recentTasks);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Modal & Toast States
  const [editingTask, setEditingTask] = useState<any>(null);
  const [remindingTask, setRemindingTask] = useState<any>(null);
  const [deletingTask, setDeletingTask] = useState<any>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Reset pagination on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, priorityFilter]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Search & Filter Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.lead.toLowerCase().includes(search.toLowerCase()) ||
      task.agent.toLowerCase().includes(search.toLowerCase());
      
    const matchesFilter = 
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    return matchesSearch && matchesFilter;
  });

  // Paginated Tasks
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredTasks.length / pageSize) || 1;

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask = {
      id: Date.now(),
      title: formData.get("title") as string,
      lead: formData.get("lead") as string,
      agent: isAr ? "أحمد" : "Ahmed",
      priority: formData.get("priority") as string || (isAr ? "متوسطة" : "Med"),
      due: formData.get("due") as string || (isAr ? "غداً" : "Tomorrow"),
      status: isAr ? "قيد التنفيذ" : "In Progress"
    };
    setTasks(prev => [newTask, ...prev]);
    setIsAddModalOpen(false);
    showToast(isAr ? "تم إضافة المهمة بنجاح!" : "Task added successfully!");
  };

  const handleEditTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setTasks(prev => prev.map(t => t.id === editingTask.id ? {
      ...t,
      title: formData.get("title") as string,
      lead: formData.get("lead") as string,
      priority: formData.get("priority") as string || t.priority,
      due: formData.get("due") as string || t.due
    } : t));
    setEditingTask(null);
    showToast(isAr ? "تم تعديل المهمة بنجاح!" : "Task updated successfully!");
  };

  const handleRemindTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRemindingTask(null);
    showToast(isAr ? "تم تعيين تذكير للمهمة بنجاح!" : "Reminder scheduled successfully!");
  };

  const handleCompleteTask = (id: number) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: isAr ? "مكتملة" : "Completed" } : t
    ));
    showToast(isAr ? "تم إكمال المهمة بنجاح!" : "Task marked as completed!");
  };

  const handleDeleteTaskConfirm = () => {
    if (deletingTask) {
      setTasks(prev => prev.filter(t => t.id !== deletingTask.id));
      setDeletingTask(null);
      showToast(isAr ? "تم حذف المهمة بنجاح!" : "Task deleted successfully!");
    }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder={t("tasks.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`input ${isRtl ? 'pr-10' : 'pl-10'}`}
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`btn-outline ${priorityFilter !== "All" ? "border-[var(--primary)] text-[var(--primary)]" : ""}`}
            >
              <Filter className="w-4 h-4" />
              {t("common.filters")} {priorityFilter !== "All" && `(${priorityFilter})`}
            </button>
            {showFilterDropdown && (
              <div className={`absolute top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 p-2 ${isRtl ? 'left-0' : 'right-0'}`}>
                <div className="text-xs font-bold text-slate-400 px-3 py-1.5 uppercase">
                  {isAr ? "حسب الأولوية" : "By Priority"}
                </div>
                {["All", isAr ? "عالية" : "High", isAr ? "متوسطة" : "Med", isAr ? "منخفضة" : "Low"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setPriorityFilter(opt);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-sm rounded-lg hover:bg-slate-50 text-slate-700 flex justify-between items-center ${priorityFilter === opt ? "bg-slate-50 font-bold" : ""}`}
                  >
                    <span>{opt}</span>
                    {priorityFilter === opt && <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn-accent">
          <Plus className="w-4 h-4" />
          {t("tasks.addTaskBtn")}
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>{t("tasks.tableName")}</th>
              <th>{t("tasks.tableLead")}</th>
              <th>{t("tasks.tableAgent")}</th>
              <th>{t("tasks.tablePriority")}</th>
              <th>{t("tasks.tableDue")}</th>
              <th>{t("tasks.tableStatus")}</th>
              <th className={isRtl ? 'text-left' : 'text-right'}>{t("tasks.tableActions")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map((task, index) => (
              <tr key={task.id}>
                <td className="w-12 text-center text-slate-400 font-semibold">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td>
                  <div className="font-medium">{task.title}</div>
                </td>
                <td className="text-sm text-[var(--primary)] font-medium hover:underline cursor-pointer">
                  {task.lead}
                </td>
                <td className="text-sm">{task.agent}</td>
                <td>
                  <span className={`badge ${
                    task.priority === "عالية" || task.priority === "High" ? "badge-danger" : 
                    task.priority === "متوسطة" || task.priority === "Med" ? "badge-warning" : "badge-info"
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="text-sm text-slate-500">{task.due}</td>
                <td>
                  <span className={`badge ${
                    task.status === "متأخرة" || task.status === "Overdue" ? "badge-danger" : 
                    task.status === "قيد التنفيذ" || task.status === "In Progress" ? "badge-info" : 
                    task.status === "مكتملة" || task.status === "Completed" ? "badge-success" : "badge-neutral"
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td>
                  <div className={`flex items-center gap-1.5 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                    <button 
                      onClick={() => handleCompleteTask(task.id)}
                      className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors cursor-pointer" 
                      title={t("tasks.actions.complete")}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <div className="relative group cursor-pointer">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title={t("leads.actions.more")}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
                        <button 
                          onClick={() => setEditingTask(task)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                        >
                          <Edit className="w-4 h-4" /> {t("leads.actions.edit")}
                        </button>
                        <button 
                          onClick={() => setRemindingTask(task)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                        >
                          <Bell className="w-4 h-4" /> {t("tasks.actions.remind")}
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button 
                          onClick={() => setDeletingTask(task)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" /> {t("leads.actions.delete")}
                        </button>
                      </div>
                    </div>
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
              ? `عرض ${Math.min((currentPage - 1) * pageSize + 1, filteredTasks.length)} - ${Math.min(currentPage * pageSize, filteredTasks.length)} من أصل ${filteredTasks.length} مهام`
              : `Showing ${Math.min((currentPage - 1) * pageSize + 1, filteredTasks.length)} - ${Math.min(currentPage * pageSize, filteredTasks.length)} of ${filteredTasks.length} tasks`
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

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden z-50">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "إضافة مهمة جديدة" : "Add New Task"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "اسم المهمة" : "Task Name"}</label>
                <input type="text" name="title" required className="input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "العميل المرتبط" : "Linked Lead"}</label>
                <input type="text" name="lead" required className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "تاريخ الاستحقاق" : "Due Date"}</label>
                  <input type="text" name="due" placeholder={isAr ? "غداً 10:00 ص" : "Tmrw 10 AM"} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الأولوية" : "Priority"}</label>
                  <select name="priority" className="input">
                    <option value={isAr ? "عالية" : "High"}>{isAr ? "عالية" : "High"}</option>
                    <option value={isAr ? "متوسطة" : "Med"}>{isAr ? "متوسطة" : "Med"}</option>
                    <option value={isAr ? "منخفضة" : "Low"}>{isAr ? "منخفضة" : "Low"}</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-outline">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent">
                  {isAr ? "حفظ" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden z-50">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "تعديل المهمة" : "Edit Task"}</h3>
              <button onClick={() => setEditingTask(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditTaskSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "اسم المهمة" : "Task Name"}</label>
                <input type="text" name="title" defaultValue={editingTask.title} required className="input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "العميل المرتبط" : "Linked Lead"}</label>
                <input type="text" name="lead" defaultValue={editingTask.lead} required className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "تاريخ الاستحقاق" : "Due Date"}</label>
                  <input type="text" name="due" defaultValue={editingTask.due} required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الأولوية" : "Priority"}</label>
                  <select name="priority" defaultValue={editingTask.priority} className="input">
                    <option value={isAr ? "عالية" : "High"}>{isAr ? "عالية" : "High"}</option>
                    <option value={isAr ? "متوسطة" : "Med"}>{isAr ? "متوسطة" : "Med"}</option>
                    <option value={isAr ? "منخفضة" : "Low"}>{isAr ? "منخفضة" : "Low"}</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setEditingTask(null)} className="btn-outline">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent">
                  {isAr ? "حفظ التعديلات" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remind Task Modal */}
      {remindingTask && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-md text-slate-800">{isAr ? "تعيين تذكير للمهمة" : "Set Task Reminder"}</h3>
              <button onClick={() => setRemindingTask(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRemindTaskSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "وقت التذكير" : "Reminder Time"}</label>
                <input type="datetime-local" required className="input" defaultValue="2026-07-12T09:00" />
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setRemindingTask(null)} className="btn-outline">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent">
                  {isAr ? "تأكيد" : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTask && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-800">{isAr ? "تأكيد الحذف" : "Confirm Delete"}</h3>
                <p className="text-sm text-slate-500">
                  {isAr 
                    ? `هل أنت متأكد من رغبتك في حذف المهمة "${deletingTask.title}"؟`
                    : `Are you sure you want to delete task "${deletingTask.title}"?`}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-center">
              <button 
                type="button" 
                onClick={() => setDeletingTask(null)} 
                className="btn-outline w-24"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                type="button" 
                onClick={handleDeleteTaskConfirm} 
                className="btn-danger w-24 bg-red-600 text-white hover:bg-red-700"
              >
                {isAr ? "حذف" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-955 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
