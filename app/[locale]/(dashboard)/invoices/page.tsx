"use client";

import { useState } from "react";
import { Download, Receipt, ExternalLink, X, Printer, CheckCircle } from "lucide-react";
import { useLocale } from "next-intl";
import { formatCurrency } from "@/lib/utils";

export default function InvoicesPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [invoices, setInvoices] = useState([
    { id: "INV-2026-08", date: "2026-07-15", due: "2026-07-15", desc: isAr ? "اشتراك باقة Growth (شهر أغسطس)" : "Growth Plan Subscription (August)", amount: 299.00, status: isAr ? "مدفوعة" : "Paid" },
    { id: "INV-2026-07", date: "2026-06-15", due: "2026-06-15", desc: isAr ? "اشتراك باقة Growth (شهر يوليو)" : "Growth Plan Subscription (July)", amount: 299.00, status: isAr ? "مدفوعة" : "Paid" },
    { id: "INV-2026-06", date: "2026-05-15", due: "2026-05-15", desc: isAr ? "اشتراك باقة Growth (شهر يونيو)" : "Growth Plan Subscription (June)", amount: 299.00, status: isAr ? "مدفوعة" : "Paid" },
  ]);

  // Modal & Toast States
  const [viewingInvoice, setViewingInvoice] = useState<any>(null);
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownload = (id: string) => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + `Invoice ID,${id}\nDate,2026-07-15\nDescription,Growth Subscription\nAmount,299.00$\nStatus,Paid\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `invoice_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(isAr ? "تم تحميل الفاتورة بصيغة PDF بنجاح!" : "Invoice PDF downloaded successfully!");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-right">{isAr ? "الفواتير (Invoices)" : "Invoices"}</h2>
        <p className="text-slate-500 text-sm mt-1 text-right">{isAr ? "عرض وتنزيل فواتير الاشتراك الشهري أو السنوي الخاص بشركتك." : "View and download your monthly or yearly subscription invoices."}</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isAr ? "رقم الفاتورة" : "Invoice No."}</th>
              <th>{isAr ? "تاريخ الإصدار" : "Issue Date"}</th>
              <th>{isAr ? "تاريخ الاستحقاق" : "Due Date"}</th>
              <th>{isAr ? "الوصف" : "Description"}</th>
              <th>{isAr ? "المبلغ" : "Amount"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
              <th className={isAr ? 'text-left pl-10' : 'text-right pr-10'}>{isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="font-semibold text-[var(--primary)] flex items-center gap-1.5 justify-end">
                  {inv.id}
                  <Receipt className="w-4 h-4 text-slate-400" />
                </td>
                <td className="text-sm">{inv.date}</td>
                <td className="text-sm text-slate-500">{inv.due}</td>
                <td className="text-sm">{inv.desc}</td>
                <td className="font-bold text-slate-800">{formatCurrency(inv.amount)}</td>
                <td>
                  <span className={`badge ${inv.status === "مدفوعة" || inv.status === "Paid" ? "badge-success" : "badge-neutral"}`}>
                    {inv.status}
                  </span>
                </td>
                <td>
                  <div className={`flex gap-1.5 ${isAr ? 'justify-start pl-4' : 'justify-end pr-4'}`}>
                    <button 
                      onClick={() => setViewingInvoice(inv)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer" 
                      title={isAr ? "عرض الفاتورة" : "View Invoice"}
                    >
                      <ExternalLink className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      onClick={() => handleDownload(inv.id)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer" 
                      title={isAr ? "تحميل PDF" : "Download PDF"}
                    >
                      <Download className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HTML Invoice View Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex gap-2">
                <button 
                  onClick={() => showToast(isAr ? "جاري تشغيل الطباعة..." : "Printing...")}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors cursor-pointer"
                >
                  <Printer className="w-4.5 h-4.5" />
                </button>
              </div>
              <h3 className="font-bold text-lg text-slate-800 font-sans">{isAr ? "تفاصيل الفاتورة" : "Invoice Invoice"}</h3>
              <button onClick={() => setViewingInvoice(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6 text-right font-sans">
              <div className="flex justify-between items-start flex-row-reverse border-b border-slate-100 pb-4">
                <div className="text-right">
                  <h4 className="font-bold text-xl text-slate-800">{isAr ? "دليل الشرق" : "East Guide"}</h4>
                  <p className="text-xs text-slate-400 mt-1">{isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</p>
                </div>
                <div className="text-left bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>{isAr ? "مدفوعة" : "Paid"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                <div>
                  <span className="block font-semibold text-slate-400">{isAr ? "مفوترة إلى:" : "Billed To:"}</span>
                  <span className="text-slate-700 font-medium mt-0.5 block">{isAr ? "أحمد العتيبي" : "Ahmed Alotaibi"}</span>
                  <span className="text-slate-500 block">info@egitg.com</span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-400">{isAr ? "رقم الفاتورة:" : "Invoice ID:"}</span>
                  <span className="text-slate-700 font-bold block mt-0.5">{viewingInvoice.id}</span>
                  <span className="text-slate-500 block">{isAr ? `تاريخ الإصدار: ${viewingInvoice.date}` : `Date: ${viewingInvoice.date}`}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-3 bg-slate-50 p-2.5 font-bold text-slate-600 border-b border-slate-100">
                  <div className="text-left">{isAr ? "المبلغ" : "Total"}</div>
                  <div className="text-center">{isAr ? "العدد" : "Qty"}</div>
                  <div className="text-right">{isAr ? "الوصف" : "Item"}</div>
                </div>
                <div className="grid grid-cols-3 p-3 text-slate-700 border-b border-slate-50">
                  <div className="text-left font-semibold">{formatCurrency(viewingInvoice.amount)}</div>
                  <div className="text-center">1</div>
                  <div className="text-right font-medium">{viewingInvoice.desc}</div>
                </div>
              </div>

              {/* Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-48 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500 flex-row-reverse">
                    <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                    <span>{formatCurrency(viewingInvoice.amount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 flex-row-reverse">
                    <span>{isAr ? "الضريبة (0%)" : "Tax (0%)"}</span>
                    <span>0.00$</span>
                  </div>
                  <div className="border-t border-slate-100 my-2 pt-2 flex justify-between font-bold text-sm text-slate-800 flex-row-reverse">
                    <span>{isAr ? "الإجمالي الكلي" : "Total Amount"}</span>
                    <span className="text-[var(--primary)]">{formatCurrency(viewingInvoice.amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setViewingInvoice(null)} 
                className="btn-primary w-24 cursor-pointer"
              >
                {isAr ? "إغلاق" : "Close"}
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
