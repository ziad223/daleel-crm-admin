"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, BarChart3, Users, Play, Square, Edit, Trash2, X, AlertTriangle } from "lucide-react";
import { getMockData } from "@/lib/mock-data";
import { useLocale } from "next-intl";

export default function CampaignsPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const isRtl = locale === 'ar';

  const { campaignsData } = getMockData(isAr);
  
  // Local state
  const [campaigns, setCampaigns] = useState(campaignsData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [addingLeadsCampaign, setAddingLeadsCampaign] = useState<any>(null);
  const [viewingReportCampaign, setViewingReportCampaign] = useState<any>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<any>(null);
  const [toast, setToast] = useState<{message: string} | null>(null);

  // Reset pagination on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Toast Helper
  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter & Search Logic
  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesSearch = camp.name.toLowerCase().includes(search.toLowerCase()) || 
                          camp.source.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = 
      statusFilter === "All" ||
      (statusFilter === "Active" && (camp.status === "نشطة" || camp.status === "Active")) ||
      (statusFilter === "Completed" && (camp.status === "مكتملة" || camp.status === "Completed"));

    return matchesSearch && matchesFilter;
  });

  // Paginated Campaigns
  const paginatedCampaigns = filteredCampaigns.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredCampaigns.length / pageSize) || 1;

  const handleAddCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCamp = {
      id: Date.now(),
      name: formData.get("name") as string,
      source: formData.get("source") as string || "Social Media",
      startDate: formData.get("startDate") as string || "2026-07-12",
      endDate: formData.get("endDate") as string || "2026-08-12",
      leadsCount: 0,
      employees: isAr ? ["أحمد", "سارة"] : ["Ahmed", "Sarah"],
      successRate: 0,
      status: isAr ? "نشطة" : "Active"
    };
    setCampaigns(prev => [newCamp, ...prev]);
    setIsAddModalOpen(false);
    showToast(isAr ? "تم إنشاء الحملة بنجاح!" : "Campaign created successfully!");
  };

  const handleEditCampaignSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? {
      ...c,
      name: formData.get("name") as string,
      source: formData.get("source") as string || c.source,
      startDate: formData.get("startDate") as string || c.startDate,
      endDate: formData.get("endDate") as string || c.endDate,
      status: formData.get("status") as string || c.status
    } : c));
    setEditingCampaign(null);
    showToast(isAr ? "تم تعديل بيانات الحملة بنجاح!" : "Campaign details updated successfully!");
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const isCurrentlyActive = currentStatus === "نشطة" || currentStatus === "Active";
    const nextStatus = isCurrentlyActive 
      ? (isAr ? "غير نشطة" : "Inactive") 
      : (isAr ? "نشطة" : "Active");
      
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
    showToast(isAr ? "تم تغيير حالة الحملة بنجاح!" : "Campaign status toggled successfully!");
  };

  const handleAddLeadsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const count = Number(formData.get("leadsCount")) || 0;
    
    setCampaigns(prev => prev.map(c => c.id === addingLeadsCampaign.id ? {
      ...c,
      leadsCount: c.leadsCount + count
    } : c));
    setAddingLeadsCampaign(null);
    showToast(isAr ? "تمت إضافة العملاء المحتملين للحملة!" : "Leads added to campaign successfully!");
  };

  const handleDeleteConfirm = () => {
    if (deletingCampaign) {
      setCampaigns(prev => prev.filter(c => c.id !== deletingCampaign.id));
      setDeletingCampaign(null);
      showToast(isAr ? "تم حذف الحملة بنجاح!" : "Campaign deleted successfully!");
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
              placeholder={isAr ? "بحث في الحملات..." : "Search campaigns..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`input ${isRtl ? 'pr-10' : 'pl-10'}`}
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`btn-outline ${statusFilter !== "All" ? "border-[var(--primary)] text-[var(--primary)]" : ""}`}
            >
              <Filter className="w-4 h-4" />
              {isAr ? "تصفية" : "Filter"} {statusFilter !== "All" && `(${statusFilter})`}
            </button>
            {showFilterDropdown && (
              <div className={`absolute top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 p-2 ${isRtl ? 'left-0' : 'right-0'}`}>
                <div className="text-xs font-bold text-slate-400 px-3 py-1.5 uppercase">
                  {isAr ? "حسب الحالة" : "By Status"}
                </div>
                {["All", "Active", "Completed"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setStatusFilter(opt);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-sm rounded-lg hover:bg-slate-50 text-slate-700 flex justify-between items-center ${statusFilter === opt ? "bg-slate-50 font-bold" : ""}`}
                  >
                    <span>{opt === "All" ? (isAr ? "الكل" : "All") : opt === "Active" ? (isAr ? "نشطة" : "Active") : (isAr ? "مكتملة" : "Completed")}</span>
                    {statusFilter === opt && <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn-accent">
          <Plus className="w-4 h-4" />
          {isAr ? "إنشاء حملة" : "Create Campaign"}
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>{isAr ? "اسم الحملة" : "Campaign Name"}</th>
              <th>{isAr ? "المصدر" : "Source"}</th>
              <th>{isAr ? "تاريخ البداية" : "Start Date"}</th>
              <th>{isAr ? "تاريخ النهاية" : "End Date"}</th>
              <th>{isAr ? "العملاء (Leads)" : "Leads"}</th>
              <th>{isAr ? "الموظفون" : "Employees"}</th>
              <th>{isAr ? "نسبة النجاح" : "Success Rate"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
              <th className={isRtl ? 'text-left' : 'text-right'}>{isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCampaigns.map((campaign, index) => (
              <tr key={campaign.id}>
                <td className="w-12 text-center text-slate-400 font-semibold">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td>
                  <div className="font-medium text-[var(--primary)]">{campaign.name}</div>
                </td>
                <td className="text-sm">{campaign.source}</td>
                <td className="text-sm">{campaign.startDate}</td>
                <td className="text-sm">{campaign.endDate}</td>
                <td className="text-sm font-medium">{campaign.leadsCount}</td>
                <td className="text-sm">
                  <div className="flex -space-x-2 space-x-reverse">
                    {campaign.employees.map((emp, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 cursor-pointer" title={emp}>
                        {emp.substring(0, 1)}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-100 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${campaign.successRate}%` }}></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600">{campaign.successRate}%</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    campaign.status === "نشطة" || campaign.status === "Active" ? "badge-success" : 
                    campaign.status === "مكتملة" || campaign.status === "Completed" ? "badge-info" : "badge-warning"
                  }`}>
                    {campaign.status}
                  </span>
                </td>
                <td>
                  <div className={`flex items-center gap-1.5 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                    <button 
                      onClick={() => setViewingReportCampaign(campaign)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer" 
                      title={isAr ? "التقارير" : "Reports"}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <div className="relative group cursor-pointer">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title={isAr ? "إجراءات إضافية" : "More Actions"}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
                        <button 
                          onClick={() => setEditingCampaign(campaign)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                        >
                          <Edit className="w-4 h-4" /> {isAr ? "تعديل الحملة" : "Edit Campaign"}
                        </button>
                        <button 
                          onClick={() => setAddingLeadsCampaign(campaign)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                        >
                          <Users className="w-4 h-4" /> {isAr ? "إضافة Leads" : "Add Leads"}
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 text-amber-600 flex items-center gap-2 cursor-pointer"
                        >
                          {campaign.status === "نشطة" || campaign.status === "Active" ? (
                            <><Square className="w-4 h-4" /> {isAr ? "إيقاف الحملة" : "Stop Campaign"}</>
                          ) : (
                            <><Play className="w-4 h-4" /> {isAr ? "تفعيل الحملة" : "Activate Campaign"}</>
                          )}
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button 
                          onClick={() => setDeletingCampaign(campaign)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
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
      <div className="flex justify-between items-center text-sm text-slate-500">
        <div>
          {isAr 
            ? `عرض ${Math.min((currentPage - 1) * pageSize + 1, filteredCampaigns.length)} - ${Math.min(currentPage * pageSize, filteredCampaigns.length)} من أصل ${filteredCampaigns.length} حملات`
            : `Showing ${Math.min((currentPage - 1) * pageSize + 1, filteredCampaigns.length)} - ${Math.min(currentPage * pageSize, filteredCampaigns.length)} of ${filteredCampaigns.length} campaigns`
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

      {/* Add Campaign Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "إنشاء حملة تسويقية جديدة" : "Create New Campaign"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCampaign} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "اسم الحملة" : "Campaign Name"}</label>
                <input type="text" name="name" required className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "المصدر" : "Source"}</label>
                  <input type="text" name="source" required placeholder="Facebook, Google, Snapchat, etc." className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الحالة" : "Status"}</label>
                  <select name="status" className="input">
                    <option value={isAr ? "نشطة" : "Active"}>{isAr ? "نشطة" : "Active"}</option>
                    <option value={isAr ? "مكتملة" : "Completed"}>{isAr ? "مكتملة" : "Completed"}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "تاريخ البداية" : "Start Date"}</label>
                  <input type="date" name="startDate" required defaultValue="2026-07-12" className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "تاريخ النهاية" : "End Date"}</label>
                  <input type="date" name="endDate" required defaultValue="2026-08-12" className="input" />
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

      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "تعديل بيانات الحملة" : "Edit Campaign"}</h3>
              <button onClick={() => setEditingCampaign(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditCampaignSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "اسم الحملة" : "Campaign Name"}</label>
                <input type="text" name="name" defaultValue={editingCampaign.name} required className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "المصدر" : "Source"}</label>
                  <input type="text" name="source" defaultValue={editingCampaign.source} required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الحالة" : "Status"}</label>
                  <select name="status" defaultValue={editingCampaign.status} className="input">
                    <option value={isAr ? "نشطة" : "Active"}>{isAr ? "نشطة" : "Active"}</option>
                    <option value={isAr ? "مكتملة" : "Completed"}>{isAr ? "مكتملة" : "Completed"}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "تاريخ البداية" : "Start Date"}</label>
                  <input type="date" name="startDate" defaultValue={editingCampaign.startDate} required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "تاريخ النهاية" : "End Date"}</label>
                  <input type="date" name="endDate" defaultValue={editingCampaign.endDate} required className="input" />
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setEditingCampaign(null)} className="btn-outline">
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

      {/* Add Leads to Campaign Modal */}
      {addingLeadsCampaign && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-md text-slate-800">{isAr ? "إضافة عملاء محتملين للحملة" : "Add Leads to Campaign"}</h3>
              <button onClick={() => setAddingLeadsCampaign(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddLeadsSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "عدد العملاء المراد إضافتهم" : "Number of Leads"}</label>
                <input type="number" name="leadsCount" required defaultValue={50} min={1} className="input" />
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setAddingLeadsCampaign(null)} className="btn-outline">
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

      {/* Campaign Detailed Report Modal */}
      {viewingReportCampaign && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-lg text-slate-800 font-sans">
                  {isAr ? `تقرير الحملة: ${viewingReportCampaign.name}` : `Report: ${viewingReportCampaign.name}`}
                </h3>
              </div>
              <button onClick={() => setViewingReportCampaign(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="block text-xs font-semibold text-slate-400 mb-0.5">{isAr ? "إجمالي العملاء" : "Total Leads"}</span>
                  <span className="text-xl font-bold text-slate-800">{viewingReportCampaign.leadsCount}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="block text-xs font-semibold text-slate-400 mb-0.5">{isAr ? "نسبة النجاح" : "Success Rate"}</span>
                  <span className="text-xl font-bold text-emerald-600">{viewingReportCampaign.successRate}%</span>
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-400 mb-2">{isAr ? "الموظفون المشرفون" : "Assigned Employees"}</span>
                <div className="flex flex-wrap gap-2 justify-end">
                  {viewingReportCampaign.employees.map((emp: string, i: number) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                      {emp}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-400 mb-2">{isAr ? "التاريخ والمدة" : "Timeline"}</span>
                <div className="text-sm text-slate-600">
                  {isAr 
                    ? `من ${viewingReportCampaign.startDate} إلى ${viewingReportCampaign.endDate}`
                    : `From ${viewingReportCampaign.startDate} to ${viewingReportCampaign.endDate}`}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setViewingReportCampaign(null)} 
                className="btn-primary w-24"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCampaign && (
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
                    ? `هل أنت متأكد من رغبتك في حذف الحملة "${deletingCampaign.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                    : `Are you sure you want to delete campaign "${deletingCampaign.name}"? This action cannot be undone.`}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-center">
              <button 
                type="button" 
                onClick={() => setDeletingCampaign(null)} 
                className="btn-outline w-24"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                type="button" 
                onClick={handleDeleteConfirm} 
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
