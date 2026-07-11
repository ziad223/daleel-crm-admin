"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Clock, CheckCircle, Plus, LogIn, LogOut } from "lucide-react";
import { useLocale } from "next-intl";

export default function AttendancePage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const isRtl = locale === 'ar';

  // Stateful records
  const [records, setRecords] = useState([
    { id: 1, name: isAr ? "أحمد العتيبي" : "Ahmed Alotaibi", dept: isAr ? "المبيعات" : "Sales", checkIn: "08:00 AM", checkOut: "05:05 PM", hours: "9h 5m", status: isAr ? "حاضر" : "Present" },
    { id: 2, name: isAr ? "سارة محمد" : "Sarah Mohammed", dept: isAr ? "المبيعات" : "Sales", checkIn: "08:15 AM", checkOut: "04:30 PM", hours: "8h 15m", status: isAr ? "تأخير" : "Late" },
    { id: 3, name: isAr ? "خالد سعيد" : "Khalid Saeed", dept: isAr ? "الدعم الفني" : "Support", checkIn: "—", checkOut: "—", hours: "0h", status: isAr ? "إجازة" : "Leave" },
  ]);

  // Current User Clock In/Out State
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentUserCheckIn, setCurrentUserCheckIn] = useState("");
  
  // Filtering & Pagination
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [toast, setToast] = useState<{message: string} | null>(null);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, deptFilter]);

  // Toast Helper
  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Clock In / Out simulation
  const handleClockToggle = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (!isClockedIn) {
      // Clock In
      setIsClockedIn(true);
      setCurrentUserCheckIn(timeStr);
      
      const newRecord = {
        id: Date.now(),
        name: isAr ? "أنت (المدير)" : "You (Admin)",
        dept: isAr ? "الإدارة" : "Management",
        checkIn: timeStr,
        checkOut: "—",
        hours: "—",
        status: isAr ? "حاضر" : "Present"
      };
      
      setRecords(prev => [newRecord, ...prev]);
      showToast(isAr ? `تم تسجيل الحضور في الساعة ${timeStr}!` : `Clocked in at ${timeStr}!`);
    } else {
      // Clock Out
      setIsClockedIn(false);
      setRecords(prev => prev.map(r => {
        if (r.name.includes("أنت") || r.name.includes("You")) {
          return {
            ...r,
            checkOut: timeStr,
            hours: "8h" // Simulated full day
          };
        }
        return r;
      }));
      showToast(isAr ? `تم تسجيل الانصراف في الساعة ${timeStr}!` : `Clocked out at ${timeStr}!`);
    }
  };

  // Filter Logic
  const filteredRecords = records.filter(rec => {
    const matchesSearch = rec.name.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All" || rec.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold">{isAr ? "الحضور والانصراف" : "Attendance & Clocking"}</h2>
          <p className="text-slate-500 text-sm mt-1">{isAr ? "متابعة حضور وانصراف وساعات عمل الموظفين." : "Track employee clock-ins, clock-outs and working hours."}</p>
        </div>

        <button 
          onClick={handleClockToggle}
          className={`btn flex items-center gap-2 cursor-pointer shadow-md ${
            isClockedIn 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          } px-5 py-2.5 text-sm rounded-xl`}
        >
          {isClockedIn ? (
            <>
              <LogOut className="w-4 h-4" />
              {isAr ? "تسجيل انصراف" : "Clock Out"}
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              {isAr ? "تسجيل حضور" : "Clock In"}
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder={isAr ? "بحث عن موظف..." : "Search employee..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`input ${isRtl ? 'pr-10' : 'pl-10'}`}
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowDeptDropdown(!showDeptDropdown)}
              className={`btn-outline ${deptFilter !== "All" ? "border-[var(--primary)] text-[var(--primary)]" : ""}`}
            >
              <Filter className="w-4 h-4" /> {isAr ? "فلترة بالقسم" : "Filter by Dept"}
            </button>
            
            {showDeptDropdown && (
              <div className={`absolute top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 p-2 ${isRtl ? 'left-0' : 'right-0'}`}>
                {["All", isAr ? "المبيعات" : "Sales", isAr ? "الدعم الفني" : "Support", isAr ? "الإدارة" : "Management"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setDeptFilter(opt);
                      setShowDeptDropdown(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-sm rounded-lg hover:bg-slate-50 text-slate-700 flex justify-between items-center ${deptFilter === opt ? "bg-slate-50 font-bold" : ""}`}
                  >
                    <span>{opt === "All" ? (isAr ? "الكل" : "All") : opt}</span>
                    {deptFilter === opt && <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <input type="date" className="input max-w-[200px]" defaultValue="2026-07-10" />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>{isAr ? "الموظف" : "Employee"}</th>
              <th>{isAr ? "القسم" : "Department"}</th>
              <th>{isAr ? "وقت الحضور" : "Clock In"}</th>
              <th>{isAr ? "وقت الانصراف" : "Clock Out"}</th>
              <th>{isAr ? "إجمالي الساعات" : "Total Hours"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((record, index) => (
              <tr key={record.id}>
                <td className="w-12 text-center text-slate-400 font-semibold">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="font-medium">{record.name}</td>
                <td className="text-sm">{record.dept}</td>
                <td className="text-sm font-medium text-emerald-600">{record.checkIn}</td>
                <td className="text-sm font-medium text-blue-600">{record.checkOut}</td>
                <td className="text-sm font-medium">{record.hours}</td>
                <td>
                  <span className={`badge ${
                    record.status === "حاضر" || record.status === "Present" ? "badge-success" : 
                    record.status === "تأخير" || record.status === "Late" ? "badge-warning" : "badge-neutral"
                  }`}>
                    {record.status}
                  </span>
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
              ? `عرض ${Math.min((currentPage - 1) * pageSize + 1, filteredRecords.length)} - ${Math.min(currentPage * pageSize, filteredRecords.length)} من أصل ${filteredRecords.length} سجلات`
              : `Showing ${Math.min((currentPage - 1) * pageSize + 1, filteredRecords.length)} - ${Math.min(currentPage * pageSize, filteredRecords.length)} of ${filteredRecords.length} records`
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
