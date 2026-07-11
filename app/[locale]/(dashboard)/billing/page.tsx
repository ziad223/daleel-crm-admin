"use client";

import { useState } from "react";
import { Download, CreditCard, Receipt, Plus, X, Trash2, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";

export default function BillingPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const isRtl = locale === 'ar';

  // Stateful payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "Visa", last4: "4242", holder: isAr ? "أحمد العتيبي" : "Ahmed Alotaibi", expiry: "12/28", primary: true },
  ]);

  const invoices = [
    { id: "INV-2026-08", date: "2026-07-15", amount: "299.00$", status: isAr ? "مدفوعة" : "Paid" },
    { id: "INV-2026-07", date: "2026-06-15", amount: "299.00$", status: isAr ? "مدفوعة" : "Paid" },
    { id: "INV-2026-06", date: "2026-05-15", amount: "299.00$", status: isAr ? "مدفوعة" : "Paid" },
  ];

  // Modal and Toast States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Add Card Handler
  const handleAddCardSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdding(true);

    const formData = new FormData(e.currentTarget);
    const cardNum = formData.get("cardNumber") as string;
    const holder = formData.get("cardHolder") as string;
    const expiry = formData.get("expiry") as string;
    const brand = formData.get("cardBrand") as string || "Visa";
    
    const cleanLast4 = cardNum.replace(/\s/g, '').slice(-4) || "9999";

    setTimeout(() => {
      const newCard = {
        id: Date.now(),
        type: brand,
        last4: cleanLast4,
        holder: holder || "Card Holder",
        expiry: expiry || "12/30",
        primary: paymentMethods.length === 0, // make primary if first card
      };

      setPaymentMethods(prev => [...prev, newCard]);
      setIsAdding(false);
      setIsAddModalOpen(false);
      showToast(isAr ? "تم إضافة وسيلة الدفع بنجاح!" : "Payment method added successfully!");
    }, 1500);
  };

  const handleMakePrimary = (id: number) => {
    setPaymentMethods(prev => prev.map(m => ({ ...m, primary: m.id === id })));
    showToast(isAr ? "تم تعيين وسيلة الدفع كأساسية!" : "Set as primary payment method!");
  };

  const handleDeleteCard = (id: number) => {
    const cardToDelete = paymentMethods.find(m => m.id === id);
    if (cardToDelete?.primary && paymentMethods.length > 1) {
      showToast(isAr ? "لا يمكنك حذف وسيلة الدفع الأساسية مباشرة! اختر وسيلة أخرى أولاً." : "Cannot delete primary card! Set another card as primary first.");
      return;
    }
    setPaymentMethods(prev => prev.filter(m => m.id !== id));
    showToast(isAr ? "تم حذف وسيلة الدفع بنجاح!" : "Payment method removed successfully!");
  };

  // Simulate file download
  const handleDownload = (id: string) => {
    showToast(isAr ? "جاري تنزيل الفاتورة..." : "Downloading invoice...");
  };

  return (
    <div className="space-y-6">
      <div className={`flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h2 className="text-xl font-bold">{isAr ? "الفواتير والمدفوعات" : "Billing & Payments"}</h2>
          <p className="text-slate-500 text-sm mt-1">{isAr ? "إدارة طرق الدفع وسجل الفواتير الخاصة باشتراكك." : "Manage payment methods and view subscription invoice history."}</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn-accent flex items-center gap-2 cursor-pointer">
          <CreditCard className="w-4 h-4" />
          {isAr ? "إضافة طريقة دفع" : "Add Payment Method"}
        </button>
      </div>

      <div className={`grid md:grid-cols-3 gap-6`}>
        {/* Left Side: Active payment methods */}
        <div className="stat-card md:col-span-1 space-y-4 text-start">
          <h3 className={`font-bold flex items-center gap-2 border-b border-slate-50 pb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <CreditCard className="w-5 h-5 text-[var(--primary)]" />
            <span>{isAr ? "وسائل الدفع المسجلة" : "Saved Payment Methods"}</span>
          </h3>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div 
                key={method.id} 
                className={`border rounded-2xl p-4 transition-all ${
                  method.primary 
                    ? "border-[var(--primary)] bg-slate-50/50" 
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className={`flex justify-between items-center mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <span className="font-extrabold text-slate-800 text-sm uppercase">{method.type}</span>
                  {method.primary ? (
                    <span className="badge badge-success text-[10px] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {isAr ? "أساسي" : "Primary"}
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleMakePrimary(method.id)}
                      className="text-[10px] font-bold text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      {isAr ? "تعيين كأساسي" : "Make Primary"}
                    </button>
                  )}
                </div>
                
                <div className="text-md font-mono tracking-widest text-slate-600 mb-2 text-center">
                  **** **** **** {method.last4}
                </div>

                <div className={`flex justify-between items-center text-xs text-slate-500 mt-3 pt-2 border-t border-slate-50 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <span>{isAr ? `ينتهي: ${method.expiry}` : `Expires: ${method.expiry}`}</span>
                  {!method.primary && (
                    <button 
                      onClick={() => handleDeleteCard(method.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Invoice history */}
        <div className="stat-card md:col-span-2 text-start">
          <h3 className={`font-bold mb-4 flex items-center gap-2 border-b border-slate-5 pb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Receipt className="w-5 h-5 text-[var(--primary)]" />
            <span>{isAr ? "سجل الفواتير" : "Invoice History"}</span>
          </h3>
          <div className="table-container border-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isAr ? "رقم الفاتورة" : "Invoice No."}</th>
                  <th>{isAr ? "التاريخ" : "Date"}</th>
                  <th>{isAr ? "المبلغ" : "Amount"}</th>
                  <th>{isAr ? "الحالة" : "Status"}</th>
                  <th className={isAr ? 'text-left pl-10' : 'text-right pr-10'}>{isAr ? "تحميل" : "Download"}</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-semibold text-slate-700">{inv.id}</td>
                    <td className="text-sm text-slate-500">{inv.date}</td>
                    <td className="font-medium text-slate-800">{inv.amount}</td>
                    <td>
                      <span className={`badge ${inv.status === "مدفوعة" || inv.status === "Paid" ? "badge-success" : "badge-neutral"}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDownload(inv.id)}
                        className={`p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer ${isAr ? 'mr-auto block ml-4' : 'ml-auto block mr-4'}`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className={`px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
              <h3 className="font-bold text-md text-slate-800">{isAr ? "إضافة وسيلة دفع جديدة" : "Add Payment Method"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCardSubmit} className="p-6 space-y-4 text-start">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "نوع البطاقة" : "Card Brand"}</label>
                {/* Clean styled Select input */}
                <select name="cardBrand" className="input text-start">
                  <option value="Visa">Visa</option>
                  <option value="MasterCard">MasterCard</option>
                  <option value="Mada">Mada (مدى)</option>
                  <option value="American Express">American Express</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "اسم صاحب البطاقة" : "Cardholder Name"}</label>
                <input type="text" name="cardHolder" required className="input text-start" placeholder={isAr ? "مثال: أحمد العتيبي" : "e.g. Ahmed Alotaibi"} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "رقم البطاقة" : "Card Number"}</label>
                <input type="text" name="cardNumber" required className="input text-center font-mono" placeholder="4000 1234 5678 9010" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isAr ? "تاريخ الانتهاء" : "Expiry"}</label>
                  <input type="text" name="expiry" required className="input text-center font-mono" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">CVV</label>
                  <input type="password" name="cvv" required maxLength={3} className="input text-center font-mono" placeholder="***" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-outline cursor-pointer">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                
                <button 
                  type="submit" 
                  disabled={isAdding}
                  className="btn-accent flex items-center gap-2 cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isAr ? "جاري الحفظ..." : "Saving..."}</span>
                    </>
                  ) : (
                    <>{isAr ? "حفظ البطاقة" : "Save Card"}</>
                  )}
                </button>
              </div>
            </form>
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
