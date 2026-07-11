"use client";

import { useState } from "react";
import { Download, UploadCloud, RefreshCw, Database, Loader2, X, AlertTriangle } from "lucide-react";
import { useLocale } from "next-intl";

export default function BackupsPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  // Stateful backups list
  const [backups, setBackups] = useState([
    { id: 1, date: "2026-07-10 00:00", type: isAr ? "تلقائي (يومي)" : "Automatic (Daily)", size: "45.2 MB", status: isAr ? "مكتمل" : "Completed" },
    { id: 2, date: "2026-07-09 00:00", type: isAr ? "تلقائي (يومي)" : "Automatic (Daily)", size: "44.8 MB", status: isAr ? "مكتمل" : "Completed" },
    { id: 3, date: "2026-07-08 14:30", type: isAr ? "يدوي" : "Manual", size: "44.5 MB", status: isAr ? "مكتمل" : "Completed" },
  ]);

  // Loading & Modal states
  const [isCreating, setIsCreating] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState<any>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Create Backup
  const handleCreateBackup = () => {
    setIsCreating(true);
    showToast(isAr ? "جاري إنشاء نسخة احتياطية جديدة..." : "Creating new backup...");
    
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
      const newBackup = {
        id: Date.now(),
        date: dateStr,
        type: isAr ? "يدوي" : "Manual",
        size: "45.0 MB",
        status: isAr ? "مكتمل" : "Completed"
      };
      
      setBackups(prev => [newBackup, ...prev]);
      setIsCreating(false);
      showToast(isAr ? "تم إنشاء النسخة الاحتياطية بنجاح!" : "Backup created successfully!");
    }, 2000);
  };

  // Restore Backup Confirmation
  const handleRestoreConfirm = () => {
    if (!restoringBackup) return;
    setIsRestoring(true);
    
    setTimeout(() => {
      setIsRestoring(false);
      setRestoringBackup(null);
      showToast(isAr ? "تم استعادة البيانات وإعادة ضبط النظام بنجاح!" : "System data restored successfully!");
    }, 2000);
  };

  // Download File Simulation
  const handleDownload = (id: number) => {
    showToast(isAr ? "جاري تنزيل ملف النسخة الاحتياطية..." : "Downloading backup archive...");
    setTimeout(() => {
      const csvContent = "data:text/plain;charset=utf-8,MOCK_BACKUP_SQL_DATA_DaleelCRM";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `backup_${id}.sql`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(isAr ? "تم تنزيل النسخة الاحتياطية بنجاح!" : "Backup archive downloaded!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-right">{isAr ? "النسخ الاحتياطي" : "Backups"}</h2>
          <p className="text-slate-500 text-sm mt-1 text-right">
            {isAr ? "حماية بيانات شركتك من خلال النسخ الاحتياطي التلقائي واليدوي." : "Protect your company data with automatic and manual backups."}
          </p>
        </div>
        <button 
          onClick={handleCreateBackup}
          disabled={isCreating}
          className="btn-accent flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4" />
          )}
          {isAr ? "إنشاء نسخة الآن" : "Create Backup Now"}
        </button>
      </div>

      <div className="stat-card bg-emerald-50 border-emerald-100 flex items-start gap-3 text-right">
        <div className="w-full">
          <h3 className="font-bold text-emerald-800 flex items-center gap-2 justify-end">
            <span>{isAr ? "النسخ الاحتياطي التلقائي مفعل" : "Automatic Backups Enabled"}</span>
            <Database className="w-5 h-5 text-emerald-600" />
          </h3>
          <p className="text-sm text-emerald-700 mt-1">
            {isAr
              ? "يتم أخذ نسخة احتياطية من جميع بياناتك (العملاء، المبيعات، الفواتير) يومياً في الساعة 12:00 منتصف الليل بتوقيت مكة المكرمة."
              : "A daily backup of all your data (leads, sales, invoices) is taken automatically at 12:00 AM AST."}
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isAr ? "تاريخ النسخة" : "Backup Date"}</th>
              <th>{isAr ? "النوع" : "Type"}</th>
              <th>{isAr ? "الحجم" : "Size"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
              <th className={isAr ? 'text-left pl-10' : 'text-right pr-10'}>{isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((backup) => (
              <tr key={backup.id}>
                <td className="font-medium text-slate-700">{backup.date}</td>
                <td className="text-sm">{backup.type}</td>
                <td className="text-sm text-slate-500">{backup.size}</td>
                <td>
                  <span className={`badge ${backup.status === "مكتمل" || backup.status === "Completed" ? "badge-success" : "badge-neutral"}`}>
                    {backup.status}
                  </span>
                </td>
                <td>
                  <div className={`flex gap-1.5 ${isAr ? 'justify-start pl-4' : 'justify-end pr-4'}`}>
                    <button 
                      onClick={() => handleDownload(backup.id)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer" 
                      title={isAr ? "تحميل النسخة" : "Download Backup"}
                    >
                      <Download className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      onClick={() => setRestoringBackup(backup)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors cursor-pointer" 
                      title={isAr ? "استعادة هذه النسخة" : "Restore Backup"}
                    >
                      <RefreshCw className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Restore Backup Warning Confirmation Modal */}
      {restoringBackup && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-6 text-center space-y-4 text-right">
              <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-bold text-lg text-slate-800">{isAr ? "استعادة البيانات" : "Restore Backup"}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-2">
                  {isAr 
                    ? `هل أنت متأكد من رغبتك في استعادة النسخة الاحتياطية بتاريخ "${restoringBackup.date}"؟ تحذير: سيتم استبدال وحذف أي تعديلات حالية.`
                    : `Are you sure you want to restore backup from "${restoringBackup.date}"? Warning: all current data will be overwritten.`}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-center">
              <button 
                type="button" 
                onClick={() => setRestoringBackup(null)} 
                disabled={isRestoring}
                className="btn-outline w-24 cursor-pointer disabled:opacity-50"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                type="button" 
                onClick={handleRestoreConfirm} 
                disabled={isRestoring}
                className="btn-danger w-32 bg-red-600 text-white hover:bg-red-700 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isRestoring ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isAr ? "جاري الاستعادة..." : "Restoring..."}</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isAr ? "تأكيد الاستعادة" : "Confirm Restore"}</span>
                  </>
                )}
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
