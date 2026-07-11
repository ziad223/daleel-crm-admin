"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Users, Target, Phone, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function ReportsPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [timeframe, setTimeframe] = useState("This Month");
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Adjust mock multipliers based on timeframe to simulate reactive database reports
  const multiplier = timeframe === "This Year" ? 12 : timeframe === "Last Month" ? 0.95 : 1;

  const stats = [
    { title: isAr ? "العملاء الجدد" : "New Leads", val: Math.round(1248 * multiplier).toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: isAr ? "المبيعات" : "Sales", val: formatCurrency(Math.round(1250000 * multiplier)), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: isAr ? "نسبة الإغلاق" : "Closure Rate", val: timeframe === "This Year" ? "21%" : timeframe === "Last Month" ? "17%" : "18%", icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
    { title: isAr ? "الاتصالات" : "Calls", val: Math.round(8430 * multiplier).toLocaleString(), icon: Phone, color: "text-amber-600", bg: "bg-amber-50" },
    { title: isAr ? "المهام المنجزة" : "Completed Tasks", val: Math.round(1120 * multiplier).toLocaleString(), icon: Target, color: "text-sky-600", bg: "bg-sky-50" },
    { title: isAr ? "العملاء المهملين" : "Neglected Leads", val: Math.round(45 * multiplier).toLocaleString(), icon: BarChart3, color: "text-red-600", bg: "bg-red-50" },
  ];

  const handleExport = (type: 'pdf' | 'excel') => {
    showToast(
      isAr 
        ? `جاري تجهيز وتصدير تقرير ${type === 'pdf' ? 'PDF' : 'Excel'}...` 
        : `Preparing and exporting ${type === 'pdf' ? 'PDF' : 'Excel'} report...`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{isAr ? "التقارير والتحليلات" : "Reports & Analytics"}</h2>
          <p className="text-slate-500 text-sm mt-1">{isAr ? "نظرة شاملة على أداء المبيعات والموظفين والحملات." : "A comprehensive overview of sales, employees, and campaigns."}</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="input text-sm cursor-pointer"
          >
            <option value="This Month">{isAr ? "هذا الشهر" : "This Month"}</option>
            <option value="Last Month">{isAr ? "الشهر الماضي" : "Last Month"}</option>
            <option value="This Year">{isAr ? "هذا العام" : "This Year"}</option>
          </select>
          <button onClick={() => handleExport('pdf')} className="btn-outline whitespace-nowrap cursor-pointer">{isAr ? "تصدير PDF" : "Export PDF"}</button>
          <button onClick={() => handleExport('excel')} className="btn-outline whitespace-nowrap cursor-pointer">{isAr ? "تصدير Excel" : "Export Excel"}</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card flex flex-col items-center text-center">
            <div className={`w-10 h-10 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-500 mb-1">{stat.title}</div>
            <div className="font-bold text-lg">{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="font-bold mb-4">{isAr ? "أداء الموظفين" : "Employee Performance"}</h3>
          <div className="table-container border-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isAr ? "الموظف" : "Employee"}</th>
                  <th>{isAr ? "الاتصالات" : "Calls"}</th>
                  <th>{isAr ? "المبيعات" : "Sales"}</th>
                  <th>{isAr ? "نسبة التحويل" : "Conv. Rate"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{isAr ? "أحمد" : "Ahmed"}</td>
                  <td>{Math.round(1200 * multiplier).toLocaleString()}</td>
                  <td>{formatCurrency(Math.round(450000 * multiplier))}</td>
                  <td>22%</td>
                </tr>
                <tr>
                  <td>{isAr ? "سارة" : "Sarah"}</td>
                  <td>{Math.round(950 * multiplier).toLocaleString()}</td>
                  <td>{formatCurrency(Math.round(380000 * multiplier))}</td>
                  <td>19%</td>
                </tr>
                <tr>
                  <td>{isAr ? "خالد" : "Khalid"}</td>
                  <td>{Math.round(800 * multiplier).toLocaleString()}</td>
                  <td>{formatCurrency(Math.round(290000 * multiplier))}</td>
                  <td>15%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="stat-card">
          <h3 className="font-bold mb-4">{isAr ? "أفضل مصادر العملاء (الحملات)" : "Top Lead Sources (Campaigns)"}</h3>
          <div className="table-container border-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isAr ? "المصدر" : "Source"}</th>
                  <th>Leads</th>
                  <th>{isAr ? "المبيعات" : "Sales"}</th>
                  <th>{isAr ? "العائد (ROI)" : "ROI"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{isAr ? "سناب شات" : "Snapchat"}</td>
                  <td>{Math.round(890 * multiplier).toLocaleString()}</td>
                  <td>{formatCurrency(Math.round(550000 * multiplier))}</td>
                  <td className="text-emerald-600">+120%</td>
                </tr>
                <tr>
                  <td>{isAr ? "فيسبوك" : "Facebook"}</td>
                  <td>{Math.round(450 * multiplier).toLocaleString()}</td>
                  <td>{formatCurrency(Math.round(320000 * multiplier))}</td>
                  <td className="text-emerald-600">+85%</td>
                </tr>
                <tr>
                  <td>{isAr ? "جوجل بحث" : "Google Search"}</td>
                  <td>{Math.round(320 * multiplier).toLocaleString()}</td>
                  <td>{formatCurrency(Math.round(280000 * multiplier))}</td>
                  <td className="text-emerald-600">+95%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
