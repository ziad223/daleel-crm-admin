"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Phone, FileText, PhoneForwarded, X, Clock, Video, Mic, Volume2, PhoneOff, Calendar } from "lucide-react";
import { getMockData } from "@/lib/mock-data";
import { useTranslations, useLocale } from "next-intl";

export default function CallsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const isAr = locale === 'ar';

  const { recentCalls } = getMockData(isAr);
  
  // Local state
  const [calls, setCalls] = useState(recentCalls);
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Premium Modal States
  const [activeCallLead, setActiveCallLead] = useState<any>(null);
  const [callbackLead, setCallbackLead] = useState<any>(null);
  const [callResultLead, setCallResultLead] = useState<any>(null);
  const [callTime, setCallTime] = useState(0);
  const [toast, setToast] = useState<{message: string} | null>(null);

  // Reset page when filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, resultFilter]);

  // Timer for active call simulation
  useEffect(() => {
    let interval: any;
    if (activeCallLead) {
      setCallTime(0);
      interval = setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
    } else {
      setCallTime(0);
    }
    return () => clearInterval(interval);
  }, [activeCallLead]);

  // Toast Helper
  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Search & Filter Logic
  const filteredCalls = calls.filter((call) => {
    const matchesSearch = 
      call.lead.toLowerCase().includes(search.toLowerCase()) ||
      call.agent.toLowerCase().includes(search.toLowerCase());
      
    const matchesFilter = 
      resultFilter === "All" ||
      (resultFilter === "Interested" && (call.result.includes("مهتم") || call.result.includes("Interested"))) ||
      (resultFilter === "Call Back" && (call.result.includes("إعادة اتصا") || call.result.includes("Call back"))) ||
      (resultFilter === "No Answer" && (call.result.includes("لا يرد") || call.result.includes("No answer")));

    return matchesSearch && matchesFilter;
  });

  // Paginated Calls
  const paginatedCalls = filteredCalls.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredCalls.length / pageSize) || 1;

  const handleSaveResult = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newResult = formData.get("result") as string;
    if (newResult) {
      setCalls(prev => prev.map(c => 
        c.id === callResultLead.id ? { ...c, result: newResult } : c
      ));
      setCallResultLead(null);
      showToast(isAr ? "تم تحديث نتيجة المكالمة بنجاح!" : "Call result updated successfully!");
    }
  };

  const handleScheduleCallbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCallbackLead(null);
    showToast(isAr ? "تم جدولة إعادة الاتصال بنجاح!" : "Callback scheduled successfully!");
  };

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
              placeholder={t("calls.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`input ${isRtl ? 'pr-10' : 'pl-10'}`}
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`btn-outline ${resultFilter !== "All" ? "border-[var(--primary)] text-[var(--primary)]" : ""}`}
            >
              <Filter className="w-4 h-4" />
              {t("common.filters")} {resultFilter !== "All" && `(${resultFilter})`}
            </button>
            {showFilterDropdown && (
              <div className={`absolute top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 p-2 ${isRtl ? 'left-0' : 'right-0'}`}>
                <div className="text-xs font-bold text-slate-400 px-3 py-1.5 uppercase">
                  {isAr ? "نتيجة الاتصال" : "Call Result"}
                </div>
                {["All", "Interested", "Call Back", "No Answer"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setResultFilter(opt);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-sm rounded-lg hover:bg-slate-50 text-slate-700 flex justify-between items-center ${resultFilter === opt ? "bg-slate-50 font-bold" : ""}`}
                  >
                    <span>{opt === "All" ? (isAr ? "الكل" : "All") : opt === "Interested" ? (isAr ? "مهتم" : "Interested") : opt === "Call Back" ? (isAr ? "إعادة اتصال" : "Call Back") : (isAr ? "لا يرد" : "No Answer")}</span>
                    {resultFilter === opt && <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>{t("tasks.tableLead")}</th>
              <th>{t("calls.tableTime")}</th>
              <th>{t("calls.tableDuration")}</th>
              <th>{t("calls.tableResult")}</th>
              <th>{t("tasks.tableAgent")}</th>
              <th className={isRtl ? 'text-left' : 'text-right'}>{t("tasks.tableActions")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCalls.map((call, index) => (
              <tr key={call.id}>
                <td className="w-12 text-center text-slate-400 font-semibold">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td>
                  <div className="font-medium text-[var(--primary)] hover:underline cursor-pointer">{call.lead}</div>
                </td>
                <td className="text-sm text-slate-500">{call.time}</td>
                <td>
                  <span className="badge badge-neutral">{call.duration}</span>
                </td>
                <td className="text-sm">
                  <span className={`badge ${
                    call.result.includes("لا يرد") || call.result.includes("No answer") ? "badge-danger" : 
                    call.result.includes("مهتم") || call.result.includes("Interested") ? "badge-success" : "badge-info"
                  }`}>
                    {call.result}
                  </span>
                </td>
                <td className="text-sm">{call.agent}</td>
                <td>
                  <div className={`flex items-center gap-2 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                    <button 
                      onClick={() => setActiveCallLead(call)}
                      className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors cursor-pointer" 
                      title={t("calls.actions.call")}
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setCallResultLead(call)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer" 
                      title={t("calls.actions.addResult")}
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setCallbackLead(call)}
                      className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors cursor-pointer" 
                      title={t("calls.actions.callback")}
                    >
                      <PhoneForwarded className="w-4 h-4" />
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
              ? `عرض ${Math.min((currentPage - 1) * pageSize + 1, filteredCalls.length)} - ${Math.min(currentPage * pageSize, filteredCalls.length)} من أصل ${filteredCalls.length} مكالمات`
              : `Showing ${Math.min((currentPage - 1) * pageSize + 1, filteredCalls.length)} - ${Math.min(currentPage * pageSize, filteredCalls.length)} of ${filteredCalls.length} calls`
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

      {/* Dialer simulation modal */}
      {activeCallLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl max-w-sm w-full p-8 text-center space-y-8 animate-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Phone className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold font-sans mt-4">{activeCallLead.lead}</h3>
              <p className="text-slate-400 text-sm">{isAr ? "اتصال جارٍ..." : "On Call..."}</p>
            </div>

            <div className="text-3xl font-mono tracking-wider font-semibold text-emerald-400">
              {formatTime(callTime)}
            </div>

            <div className="flex justify-center gap-6 text-slate-400">
              <button className="w-12 h-12 bg-slate-900 hover:bg-slate-800 rounded-full flex items-center justify-center transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 bg-slate-900 hover:bg-slate-800 rounded-full flex items-center justify-center transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 bg-slate-900 hover:bg-slate-800 rounded-full flex items-center justify-center transition-colors">
                <Video className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={() => {
                setActiveCallLead(null);
                showToast(isAr ? "تم إنهاء المكالمة" : "Call ended");
              }}
              className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center mx-auto transition-colors shadow-lg shadow-red-600/30 cursor-pointer"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Call Result Modal */}
      {callResultLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-md text-slate-800">{isAr ? "تسجيل نتيجة المكالمة" : "Log Call Result"}</h3>
              <button onClick={() => setCallResultLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveResult} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">{isAr ? "اختر النتيجة" : "Select Result"}</label>
                <select name="result" defaultValue={callResultLead.result} className="input">
                  <option value={isAr ? "مهتم بالاشتراك" : "Interested in Plan"}>{isAr ? "مهتم بالاشتراك" : "Interested in Plan"}</option>
                  <option value={isAr ? "طلب إعادة اتصال" : "Requested callback"}>{isAr ? "طلب إعادة اتصال" : "Requested callback"}</option>
                  <option value={isAr ? "لا يرد / مغلق" : "No answer / Closed"}>{isAr ? "لا يرد / مغلق" : "No answer / Closed"}</option>
                  <option value={isAr ? "الرقم خاطئ" : "Wrong number"}>{isAr ? "الرقم خاطئ" : "Wrong number"}</option>
                </select>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setCallResultLead(null)} className="btn-outline">
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

      {/* Schedule Callback Modal */}
      {callbackLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-md text-slate-800">{isAr ? "جدولة إعادة الاتصال" : "Schedule Callback"}</h3>
              <button onClick={() => setCallbackLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleScheduleCallbackSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "التاريخ والوقت" : "Date & Time"}</label>
                <input type="datetime-local" required defaultValue="2026-07-12T10:00" className="input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "ملاحظات للتذكير" : "Reminder Notes"}</label>
                <textarea rows={2} className="input resize-none py-1.5" placeholder={isAr ? "مثال: مراجعة الأسعار المعروضة" : "e.g. Discuss custom pricing"}></textarea>
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setCallbackLead(null)} className="btn-outline">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="btn-accent">
                  {isAr ? "جدولة" : "Schedule"}
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
