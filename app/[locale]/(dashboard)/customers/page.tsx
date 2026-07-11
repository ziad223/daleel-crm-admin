"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone, Edit, Trash2, FileText, X, Loader2, Download, Upload, Receipt, AlertTriangle } from "lucide-react";
import { getMockData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

export default function CustomersPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const isAr = locale === 'ar';

  const { customersData } = getMockData(isAr);
  
  // Local state
  const [customers, setCustomers] = useState(customersData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [addingServiceCustomer, setAddingServiceCustomer] = useState<any>(null);
  const [viewingInvoicesCustomer, setViewingInvoicesCustomer] = useState<any>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<any>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Reset page when filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter & Search Logic
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.contact.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase());
      
    const matchesFilter = 
      statusFilter === "All" ||
      (statusFilter === "Active" && (customer.status === "نشط" || customer.status === "Active")) ||
      (statusFilter === "Inactive" && (customer.status === "مغلق" || customer.status === "Inactive" || customer.status === "غير نشط"));

    return matchesSearch && matchesFilter;
  });

  // Paginated Customers
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;

  // Actions
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const headers = ["Company", "Contact Person", "Email", "Phone", "Service", "Sales Value", "Join Date", "Status"];
      const rows = customers.map(c => [c.name, c.contact, c.email, c.phone, c.service, c.value, c.joinDate, c.status]);
      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `customers_${locale}.csv`);
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
      const dummyCustomer = {
        id: Date.now(),
        name: isAr ? "شركة النخبة للتجارة" : "Al-Nokhba Trading Co.",
        email: "contact@nokhba.com",
        contact: isAr ? "صالح محمد" : "Saleh Mohammed",
        phone: "056111222",
        service: isAr ? "باقة الأعمال المتكاملة" : "Enterprise Suite",
        value: 120000,
        joinDate: "2026-07-11",
        status: isAr ? "نشط" : "Active"
      };
      setCustomers(prev => [dummyCustomer, ...prev]);
      showToast(isAr ? "تم استيراد البيانات بنجاح!" : "Data imported successfully!");
    }, 2000);
  };

  const handleAddCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCustomer = {
      id: Date.now(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      contact: formData.get("contact") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as string || (isAr ? "باقة أساسية" : "Basic Plan"),
      value: Number(formData.get("value")) || 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: formData.get("status") as string || (isAr ? "نشط" : "Active")
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setIsAddModalOpen(false);
    showToast(isAr ? "تم إضافة العميل بنجاح!" : "Customer added successfully!");
  };

  const handleEditCustomerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? {
      ...c,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      contact: formData.get("contact") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as string || c.service,
      value: Number(formData.get("value")) || 0,
      status: formData.get("status") as string || c.status
    } : c));
    setEditingCustomer(null);
    showToast(isAr ? "تم تعديل بيانات العميل بنجاح!" : "Customer details updated successfully!");
  };

  const handleAddServiceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const serviceName = formData.get("service") as string;
    const servicePrice = Number(formData.get("price")) || 0;
    
    setCustomers(prev => prev.map(c => c.id === addingServiceCustomer.id ? {
      ...c,
      service: c.service ? `${c.service} + ${serviceName}` : serviceName,
      value: c.value + servicePrice
    } : c));
    setAddingServiceCustomer(null);
    showToast(isAr ? "تم إضافة الخدمة للعميل بنجاح!" : "Service added successfully!");
  };

  const handleDeleteCustomerConfirm = () => {
    if (deletingCustomer) {
      setCustomers(prev => prev.filter(c => c.id !== deletingCustomer.id));
      setDeletingCustomer(null);
      showToast(isAr ? "تم حذف العميل بنجاح!" : "Customer deleted successfully!");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder={t("customers.searchPlaceholder")}
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
              {t("common.filters")} {statusFilter !== "All" && `(${statusFilter})`}
            </button>
            {showFilterDropdown && (
              <div className={`absolute top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 p-2 ${isRtl ? 'left-0' : 'right-0'}`}>
                <div className="text-xs font-bold text-slate-400 px-3 py-1.5 uppercase">
                  {isAr ? "حسب الحالة" : "By Status"}
                </div>
                {["All", "Active", "Inactive"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setStatusFilter(opt);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-sm rounded-lg hover:bg-slate-50 text-slate-700 flex justify-between items-center ${statusFilter === opt ? "bg-slate-50 font-bold" : ""}`}
                  >
                    <span>{opt === "All" ? (isAr ? "الكل" : "All") : opt === "Active" ? (isAr ? "نشط" : "Active") : (isAr ? "غير نشط" : "Inactive")}</span>
                    {statusFilter === opt && <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />}
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
          <button onClick={() => setIsAddModalOpen(true)} className="btn-accent">
            <Plus className="w-4 h-4" />
            {t("customers.addBtn")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>{t("customers.tableCompany")}</th>
              <th>{t("customers.tableContact")}</th>
              <th>{t("customers.tableService")}</th>
              <th>{t("customers.tableSales")}</th>
              <th>{t("customers.tableJoinDate")}</th>
              <th>{t("leads.table.status")}</th>
              <th className={isRtl ? 'text-left' : 'text-right'}>{t("leads.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer, index) => (
              <tr key={customer.id}>
                <td className="w-12 text-center text-slate-400 font-semibold">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td>
                  <div className="font-medium text-[var(--primary)]">{customer.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" /> {customer.email}
                  </div>
                </td>
                <td>
                  <div className="text-sm font-medium">{customer.contact}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {customer.phone}
                  </div>
                </td>
                <td className="text-sm">{customer.service}</td>
                <td className="font-semibold text-emerald-600">{formatCurrency(customer.value)}</td>
                <td className="text-sm text-slate-500">{customer.joinDate}</td>
                <td>
                  <span className={`badge ${customer.status === "نشط" || customer.status === "Active" ? "badge-success" : "badge-neutral"}`}>
                    {customer.status}
                  </span>
                </td>
                <td>
                  <div className={`flex items-center gap-1.5 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                    <button 
                      onClick={() => setViewingInvoicesCustomer(customer)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer" 
                      title={t("customers.actions.invoices")}
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <div className="relative group cursor-pointer">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title={t("leads.actions.more")}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
                        <button 
                          onClick={() => setEditingCustomer(customer)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" /> {t("customers.actions.editDetails")}
                        </button>
                        <button 
                          onClick={() => setAddingServiceCustomer(customer)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> {t("customers.actions.addService")}
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button 
                          onClick={() => setDeletingCustomer(customer)}
                          className="w-full text-right px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> {t("customers.actions.deleteCustomer")}
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
              ? `عرض ${Math.min((currentPage - 1) * pageSize + 1, filteredCustomers.length)} - ${Math.min(currentPage * pageSize, filteredCustomers.length)} من أصل ${filteredCustomers.length} عملاء`
              : `Showing ${Math.min((currentPage - 1) * pageSize + 1, filteredCustomers.length)} - ${Math.min(currentPage * pageSize, filteredCustomers.length)} of ${filteredCustomers.length} customers`
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

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-50">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "إضافة عميل دائم جديد" : "Add New Customer"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "اسم الشركة" : "Company Name"}</label>
                  <input type="text" name="name" required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                  <input type="email" name="email" required className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الشخص المسؤول" : "Contact Person"}</label>
                  <input type="text" name="contact" required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "رقم الهاتف" : "Phone"}</label>
                  <input type="text" name="phone" required className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الخدمة / الباقة" : "Service / Plan"}</label>
                  <input type="text" name="service" required defaultValue={isAr ? "باقة الأعمال المتكاملة" : "Enterprise Suite"} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "إجمالي المبيعات ($)" : "Total Sales ($)"}</label>
                  <input type="number" name="value" defaultValue={50000} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الحالة" : "Status"}</label>
                <select name="status" className="input">
                  <option value={isAr ? "نشط" : "Active"}>{isAr ? "نشط" : "Active"}</option>
                  <option value={isAr ? "غير نشط" : "Inactive"}>{isAr ? "غير نشط" : "Inactive"}</option>
                </select>
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

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-50">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "تعديل بيانات العميل" : "Edit Customer Details"}</h3>
              <button onClick={() => setEditingCustomer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditCustomerSubmit} className="p-6 space-y-4 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "اسم الشركة" : "Company Name"}</label>
                  <input type="text" name="name" defaultValue={editingCustomer.name} required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                  <input type="email" name="email" defaultValue={editingCustomer.email} required className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الشخص المسؤول" : "Contact Person"}</label>
                  <input type="text" name="contact" defaultValue={editingCustomer.contact} required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "رقم الهاتف" : "Phone"}</label>
                  <input type="text" name="phone" defaultValue={editingCustomer.phone} required className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الخدمة / الباقة" : "Service / Plan"}</label>
                  <input type="text" name="service" defaultValue={editingCustomer.service} required className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "إجمالي المبيعات ($)" : "Total Sales ($)"}</label>
                  <input type="number" name="value" defaultValue={editingCustomer.value} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "الحالة" : "Status"}</label>
                <select name="status" defaultValue={editingCustomer.status} className="input">
                  <option value={isAr ? "نشط" : "Active"}>{isAr ? "نشط" : "Active"}</option>
                  <option value={isAr ? "غير نشط" : "Inactive"}>{isAr ? "غير نشط" : "Inactive"}</option>
                </select>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setEditingCustomer(null)} className="btn-outline">
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

      {/* Add Service Modal */}
      {addingServiceCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-md text-slate-800">{isAr ? "إضافة خدمة أو باقة جديدة" : "Add Service / Plan"}</h3>
              <button onClick={() => setAddingServiceCustomer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddServiceSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "اسم الخدمة / الباقة الجديدة" : "Service/Plan Name"}</label>
                <input type="text" name="service" required className="input" placeholder={isAr ? "مثال: دعم فني إضافي" : "e.g. Extra Support"} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "سعر الخدمة ($)" : "Price ($)"}</label>
                <input type="number" name="price" defaultValue={500} required className="input" />
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setAddingServiceCustomer(null)} className="btn-outline">
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

      {/* Invoices List Modal */}
      {viewingInvoicesCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-2xl w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-lg text-slate-800 font-sans">
                  {isAr ? `فواتير العميل: ${viewingInvoicesCustomer.name}` : `Invoices: ${viewingInvoicesCustomer.name}`}
                </h3>
              </div>
              <button onClick={() => setViewingInvoicesCustomer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold">
                    <th className="pb-3 text-right">{isAr ? "رقم الفاتورة" : "Invoice No"}</th>
                    <th className="pb-3 text-right">{isAr ? "التاريخ" : "Date"}</th>
                    <th className="pb-3 text-right">{isAr ? "القيمة" : "Amount"}</th>
                    <th className="pb-3 text-right">{isAr ? "الحالة" : "Status"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { no: "#INV-9023", date: "2026-06-15", amount: viewingInvoicesCustomer.value * 0.4, status: isAr ? "مدفوعة" : "Paid" },
                    { no: "#INV-8491", date: "2026-05-10", amount: viewingInvoicesCustomer.value * 0.3, status: isAr ? "مدفوعة" : "Paid" },
                    { no: "#INV-7230", date: "2026-04-01", amount: viewingInvoicesCustomer.value * 0.3, status: isAr ? "معلقة" : "Pending" },
                  ].map((inv, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 font-semibold text-slate-700">{inv.no}</td>
                      <td className="py-3 text-slate-500">{inv.date}</td>
                      <td className="py-3 font-medium text-slate-800">{formatCurrency(inv.amount)}</td>
                      <td className="py-3">
                        <span className={`badge ${inv.status === "مدفوعة" || inv.status === "Paid" ? "badge-success" : "badge-warning"}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setViewingInvoicesCustomer(null)} 
                className="btn-primary w-24"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCustomer && (
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
                    ? `هل أنت متأكد من رغبتك في حذف العميل "${deletingCustomer.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                    : `Are you sure you want to delete customer "${deletingCustomer.name}"? This action cannot be undone.`}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-center">
              <button 
                type="button" 
                onClick={() => setDeletingCustomer(null)} 
                className="btn-outline w-24"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                type="button" 
                onClick={handleDeleteCustomerConfirm} 
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
