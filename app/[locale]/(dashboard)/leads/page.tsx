"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Download, Upload, Phone, MessageCircle, MoreHorizontal, Eye, Mail, MapPin, Edit, Trash2, Calendar, UserPlus, CheckCircle, X, Loader2, AlertTriangle } from "lucide-react";
import { getMockData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

export default function LeadsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const isAr = locale === 'ar';

  const { recentLeads } = getMockData(isAr);
  
  // Local state for interactive table
  const [leads, setLeads] = useState(recentLeads);
  const [search, setSearch] = useState("");
  const [interestFilter, setInterestFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [assigningLead, setAssigningLead] = useState<any>(null);
  const [changingStageLead, setChangingStageLead] = useState<any>(null);
  const [addTaskLead, setAddTaskLead] = useState<any>(null);
  const [viewingLead, setViewingLead] = useState<any>(null);
  const [deletingLead, setDeletingLead] = useState<any>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Import/Export States
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, interestFilter]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter & Search Logic
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search);
    
    const matchesFilter = 
      interestFilter === "All" || 
      lead.interest === interestFilter;

    return matchesSearch && matchesFilter;
  });

  // Paginated Leads
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;

  // Actions
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const headers = ["Name", "Email", "Phone", "City", "Country", "Source", "Stage", "Interest", "Value"];
      const rows = leads.map(l => [l.name, l.email, l.phone, l.city, l.country, l.source, l.stage, l.interest, l.value]);
      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `leads_${locale}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(isAr ? "تم تصدير البيانات بنجاح!" : "Data exported successfully!");
    }, 1500);
  };

  const handleImportClick = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      const dummyLead = {
        id: Date.now(),
        name: isAr ? "عميل مستورد" : "Imported Lead",
        email: "imported@daleel.com",
        phone: "050999999",
        city: isAr ? "الرياض" : "Riyadh",
        country: isAr ? "السعودية" : "Saudi Arabia",
        source: isAr ? "ملف خارجي" : "External File",
        campaign: "—",
        agent: isAr ? "سارة" : "Sarah",
        stage: "New",
        interest: isAr ? "دافئ" : "Warm",
        value: 15000,
        lastContact: isAr ? "الآن" : "Just now",
        status: isAr ? "نشط" : "Active"
      };
      setLeads(prev => [dummyLead, ...prev]);
      showToast(isAr ? "تم استيراد البيانات بنجاح!" : "Data imported successfully!");
    }, 2000);
  };

  const handleAddLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLead = {
      id: Date.now(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      source: formData.get("source") as string || (isAr ? "مباشر" : "Direct"),
      campaign: "—",
      agent: isAr ? "أحمد" : "Ahmed",
      stage: formData.get("stage") as string || "New",
      interest: formData.get("interest") as string || "Warm",
      value: Number(formData.get("value")) || 0,
      lastContact: isAr ? "الآن" : "Just now",
      status: isAr ? "نشط" : "Active"
    };
    setLeads(prev => [newLead, ...prev]);
    setIsAddModalOpen(false);
    showToast(isAr ? "تم إضافة العميل بنجاح!" : "Lead added successfully!");
  };

  const handleEditLeadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLeads(prev => prev.map(l => l.id === editingLead.id ? {
      ...l,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      value: Number(formData.get("value")) || 0,
      stage: formData.get("stage") as string || l.stage,
      interest: formData.get("interest") as string || l.interest,
    } : l));
    setEditingLead(null);
    showToast(isAr ? "تم تعديل بيانات العميل بنجاح!" : "Lead details updated successfully!");
  };

  const handleAssignLeadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const employeeName = formData.get("employee") as string;
    setLeads(prev => prev.map(l => l.id === assigningLead.id ? { ...l, agent: employeeName } : l));
    setAssigningLead(null);
    showToast(isAr ? "تم تعيين العميل للموظف بنجاح!" : "Lead assigned to employee successfully!");
  };

  const handleChangeStageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStage = formData.get("stage") as string;
    setLeads(prev => prev.map(l => l.id === changingStageLead.id ? { ...l, stage: newStage } : l));
    setChangingStageLead(null);
    showToast(isAr ? "تم تحديث مرحلة العميل بنجاح!" : "Lead stage updated successfully!");
  };

  const handleAddTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddTaskLead(null);
    showToast(isAr ? "تم إضافة المهمة/الملاحظة بنجاح!" : "Task/Note added successfully!");
  };

  const handleDeleteLeadConfirm = () => {
    if (deletingLead) {
      setLeads(prev => prev.filter(l => l.id !== deletingLead.id));
      setDeletingLead(null);
      showToast(isAr ? "تم حذف العميل بنجاح!" : "Lead deleted successfully!");
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
              placeholder={t("leads.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`input ${isRtl ? 'pr-10' : 'pl-10'}`}
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`btn-outline ${interestFilter !== "All" ? "border-[var(--primary)] text-[var(--primary)]" : ""}`}
            >
              <Filter className="w-4 h-4" />
              {t("common.filters")} {interestFilter !== "All" && `(${interestFilter})`}
            </button>
            {showFilterDropdown && (
              <div className={`absolute top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 p-2 ${isRtl ? 'left-0' : 'right-0'}`}>
                <div className="text-xs font-bold text-slate-400 px-3 py-1.5 uppercase">
                  {isAr ? "حسب الاهتمام" : "By Interest"}
                </div>
                {["All", isAr ? "ساخن" : "Hot", isAr ? "دافئ" : "Warm", isAr ? "بارد" : "Cold"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setInterestFilter(opt);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-sm rounded-lg hover:bg-slate-50 text-slate-700 flex justify-between items-center ${interestFilter === opt ? "bg-slate-50 font-bold" : ""}`}
                  >
                    <span>{opt}</span>
                    {interestFilter === opt && <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleImportClick} 
            disabled={isImporting}
            className="btn-outline"
          >
            {isImporting ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {isImporting ? (isAr ? "جاري الاستيراد..." : "Importing...") : t("common.import")}
          </button>
          <button 
            onClick={handleExport} 
            disabled={isExporting}
            className="btn-outline"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? (isAr ? "جاري التصدير..." : "Exporting...") : t("common.export")}
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-accent"
          >
            <Plus className="w-4 h-4" />
            {t("leads.addBtn")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>{t("leads.table.name")} / {t("leads.table.email")}</th>
              <th>{t("leads.table.phone")} / {t("leads.table.whatsapp")}</th>
              <th>{t("leads.table.city")} / {t("leads.table.country")}</th>
              <th>{t("leads.table.source")}</th>
              <th>{t("leads.table.campaign")}</th>
              <th>{t("leads.table.agent")}</th>
              <th>{t("leads.table.stage")}</th>
              <th>{t("leads.table.interest")}</th>
              <th>{t("leads.table.value")}</th>
              <th>{t("leads.table.lastContact")}</th>
              <th>{t("leads.table.status")}</th>
              <th className={isRtl ? 'text-left' : 'text-right'}>{t("leads.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.map((lead, index) => (
              <tr key={lead.id}>
                <td className="w-12 text-center text-slate-400 font-semibold">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td>
                  <Link href={`/${locale}/leads/${lead.id}`} className="font-medium text-[var(--primary)] hover:underline block cursor-pointer">
                    {lead.name}
                  </Link>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {lead.email}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{lead.phone}</span>
                    <button className="p-1 hover:bg-emerald-50 rounded text-emerald-600 transition-colors"><Phone className="w-3.5 h-3.5" /></button>
                    <button className="p-1 hover:bg-green-50 rounded text-green-600 transition-colors"><MessageCircle className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
                <td>
                  <div className="text-sm">{lead.city}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {lead.country}
                  </div>
                </td>
                <td className="text-sm">{lead.source}</td>
                <td className="text-sm">{lead.campaign}</td>
                <td className="text-sm">{lead.agent}</td>
                <td><span className="badge badge-info">{lead.stage}</span></td>
                <td>
                  <span className={`badge ${
                    lead.interest === "ساخن" || lead.interest === "Hot" ? "badge-danger" :
                    lead.interest === "دافئ" || lead.interest === "Warm" ? "badge-warning" : "badge-neutral"
                  }`}>
                    {lead.interest}
                  </span>
                </td>
                <td className="font-medium">{lead.value ? formatCurrency(lead.value) : "—"}</td>
                <td className="text-sm text-slate-500">{lead.lastContact}</td>
                <td>
                  <span className={`badge ${lead.status === "نشط" || lead.status === "Active" ? "badge-success" : lead.status === "مغلق" || lead.status === "Closed" ? "badge-neutral" : "badge-info"}`}>
                    {lead.status}
                  </span>
                </td>
                <td>
                  <div className={`flex items-center gap-1.5 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                    <Link 
                      href={`/${locale}/leads/${lead.id}`}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer flex" 
                      title={t("leads.actions.view")}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <div className="relative group cursor-pointer">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title={t("leads.actions.more")}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
                        <button 
                          onClick={() => setEditingLead(lead)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" /> {isAr ? "تعديل" : "Edit"}
                        </button>
                        <button 
                          onClick={() => setAssigningLead(lead)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" /> {isAr ? "نقل لموظف" : "Assign to Employee"}
                        </button>
                        <button 
                          onClick={() => setChangingStageLead(lead)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> {isAr ? "تغيير المرحلة" : "Change Stage"}
                        </button>
                        <button 
                          onClick={() => setAddTaskLead(lead)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" /> {isAr ? "إضافة مهمة/ملاحظة" : "Add Task/Note"}
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button 
                          onClick={() => setDeletingLead(lead)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> {isAr ? "حذف" : "Delete"}
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
              ? `عرض ${Math.min((currentPage - 1) * pageSize + 1, filteredLeads.length)} - ${Math.min(currentPage * pageSize, filteredLeads.length)} من أصل ${filteredLeads.length} عملاء`
              : `Showing ${Math.min((currentPage - 1) * pageSize + 1, filteredLeads.length)} - ${Math.min(currentPage * pageSize, filteredLeads.length)} of ${filteredLeads.length} leads`
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

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-50">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "إضافة عميل محتمل جديد" : "Add New Lead"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="p-6 space-y-4 text-right">
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
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "القيمة المتوقعة ($)" : "Expected Value ($)"}</label>
                  <input type="number" name="value" defaultValue={10000} className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "المدينة" : "City"}</label>
                  <input type="text" name="city" required defaultValue={isAr ? "دبي" : "Dubai"} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الدولة" : "Country"}</label>
                  <input type="text" name="country" required defaultValue={isAr ? "الإمارات" : "UAE"} className="input" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "المصدر" : "Source"}</label>
                  <select name="source" className="input">
                    <option value={isAr ? "إعلان فيسبوك" : "FB Ad"}>{isAr ? "إعلان فيسبوك" : "FB Ad"}</option>
                    <option value={isAr ? "مباشر" : "Direct"}>{isAr ? "مباشر" : "Direct"}</option>
                    <option value={isAr ? "واتساب" : "WhatsApp"}>{isAr ? "واتساب" : "WhatsApp"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "المرحلة" : "Stage"}</label>
                  <select name="stage" className="input">
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "درجة الاهتمام" : "Interest"}</label>
                  <select name="interest" className="input">
                    <option value={isAr ? "ساخن" : "Hot"}>{isAr ? "ساخن" : "Hot"}</option>
                    <option value={isAr ? "دافئ" : "Warm"}>{isAr ? "دافئ" : "Warm"}</option>
                    <option value={isAr ? "بارد" : "Cold"}>{isAr ? "بارد" : "Cold"}</option>
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

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-50">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "تعديل بيانات العميل" : "Edit Lead Details"}</h3>
              <button onClick={() => setEditingLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditLeadSubmit} className="p-6 space-y-4 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الاسم الكامل" : "Full Name"}</label>
                  <input type="text" name="name" defaultValue={editingLead.name} required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                  <input type="email" name="email" defaultValue={editingLead.email} required className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "رقم الهاتف" : "Phone"}</label>
                  <input type="text" name="phone" defaultValue={editingLead.phone} required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "القيمة ($)" : "Value ($)"}</label>
                  <input type="number" name="value" defaultValue={editingLead.value} className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "المدينة" : "City"}</label>
                  <input type="text" name="city" defaultValue={editingLead.city} required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الدولة" : "Country"}</label>
                  <input type="text" name="country" defaultValue={editingLead.country} required className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "المرحلة" : "Stage"}</label>
                  <select name="stage" defaultValue={editingLead.stage} className="input">
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Quotation">Quotation</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "درجة الاهتمام" : "Interest"}</label>
                  <select name="interest" defaultValue={editingLead.interest} className="input">
                    <option value={isAr ? "ساخن" : "Hot"}>{isAr ? "ساخن" : "Hot"}</option>
                    <option value={isAr ? "دافئ" : "Warm"}>{isAr ? "دافئ" : "Warm"}</option>
                    <option value={isAr ? "بارد" : "Cold"}>{isAr ? "بارد" : "Cold"}</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setEditingLead(null)} className="btn-outline">
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

      {/* Assign Modal */}
      {assigningLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-md text-slate-800">{isAr ? "نقل المتابعة إلى موظف" : "Assign to Employee"}</h3>
              <button onClick={() => setAssigningLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAssignLeadSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">{isAr ? "اختر الموظف المسؤول" : "Select Assignee"}</label>
                <select name="employee" defaultValue={assigningLead.agent} className="input">
                  {["أحمد", "سارة", "خالد", "نورة", "محمد", "Ahmed", "Sarah", "Khalid", "Noura", "Mohammed"].map((emp) => (
                    <option key={emp} value={emp}>{emp}</option>
                  ))}
                </select>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setAssigningLead(null)} className="btn-outline">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent">
                  {isAr ? "تعيين" : "Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Stage Modal */}
      {changingStageLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-md text-slate-800">{isAr ? "تغيير مرحلة العميل" : "Change Lead Stage"}</h3>
              <button onClick={() => setChangingStageLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleChangeStageSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">{isAr ? "اختر المرحلة الجديدة" : "Select Stage"}</label>
                <select name="stage" defaultValue={changingStageLead.stage} className="input">
                  {["New", "Contacted", "Interested", "Follow-up", "Quotation", "Negotiation", "Won", "Lost"].map((stg) => (
                    <option key={stg} value={stg}>{stg}</option>
                  ))}
                </select>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setChangingStageLead(null)} className="btn-outline">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent">
                  {isAr ? "تحديث" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task/Note Modal */}
      {addTaskLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden z-50">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-md text-slate-800">{isAr ? "إضافة مهمة أو ملاحظة للعميل" : "Add Task / Note to Lead"}</h3>
              <button onClick={() => setAddTaskLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTaskSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "العميل" : "Lead"}</label>
                <input type="text" disabled defaultValue={addTaskLead.name} className="input bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الملاحظة / تفاصيل المهمة" : "Note / Task Description"}</label>
                <textarea required rows={4} className="input resize-none py-2" placeholder={isAr ? "اكتب الملاحظة هنا..." : "Write details..."}></textarea>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setAddTaskLead(null)} className="btn-outline">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent">
                  {isAr ? "إضافة" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Delete Confirmation Modal */}
      {deletingLead && (
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
                    ? `هل أنت متأكد من رغبتك في حذف العميل "${deletingLead.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                    : `Are you sure you want to delete lead "${deletingLead.name}"? This action cannot be undone.`}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-center">
              <button 
                type="button" 
                onClick={() => setDeletingLead(null)} 
                className="btn-outline w-24"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                type="button" 
                onClick={handleDeleteLeadConfirm} 
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
        <div className="fixed bottom-5 right-5 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
