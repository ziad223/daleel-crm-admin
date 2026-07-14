"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Phone, MessageCircle, Clock, CheckCircle, Calendar, Plus, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

type FollowUp = {
  id: number;
  lead: string;
  phone: string;
  time: string;
  date: string;
  type: "call" | "whatsapp";
  status: "pending" | "overdue" | "upcoming" | "completed";
  notes: string;
};

const initialFollowUps: FollowUp[] = [
  { id: 1, lead: "أحمد محمد", phone: "+971501234567", time: "10:30 ص", date: "اليوم", type: "call", status: "pending", notes: "تأكيد موعد الاجتماع" },
  { id: 2, lead: "شركة الأفق", phone: "+971509876543", time: "01:00 م", date: "اليوم", type: "whatsapp", status: "pending", notes: "إرسال عرض السعر المحدث" },
  { id: 3, lead: "سالم عبدالله", phone: "+966501112222", time: "04:15 م", date: "اليوم", type: "call", status: "pending", notes: "متابعة بعد التجربة المجانية" },
  { id: 4, lead: "خالد سعيد", phone: "+971554443333", time: "09:00 ص", date: "أمس", type: "call", status: "overdue", notes: "لم يرد، معاودة الاتصال" },
  { id: 5, lead: "مؤسسة النور", phone: "+971505556666", time: "11:00 ص", date: "غداً", type: "whatsapp", status: "upcoming", notes: "تهنئة وتذكير بالتجديد" },
];

export default function FollowUpsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === 'ar';
  const isRtl = locale === 'ar';

  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("today");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState<Partial<FollowUp>>({
    type: "call",
    date: "اليوم",
    status: "pending",
  });

  const handleComplete = (id: number) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status: "completed" } : f));
  };

  const handleReschedule = (id: number) => {
    // Simple reschedule to Tomorrow
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, date: "غداً", status: "upcoming" } : f));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(0, ...followUps.map(f => f.id)) + 1;
    const added: FollowUp = {
      id: newId,
      lead: newFollowUp.lead || (isAr ? "عميل جديد" : "New Lead"),
      phone: newFollowUp.phone || "+971000000000",
      time: newFollowUp.time || "12:00 م",
      date: newFollowUp.date || "اليوم",
      type: newFollowUp.type as "call" | "whatsapp" || "call",
      status: (newFollowUp.date === "غداً" || newFollowUp.date === "Tomorrow") ? "upcoming" : "pending",
      notes: newFollowUp.notes || "",
    };
    setFollowUps([added, ...followUps]);
    setIsAddModalOpen(false);
    setNewFollowUp({ type: "call", date: "اليوم", status: "pending" });
  };

  const filteredFollowUps = useMemo(() => {
    return followUps.filter(f => {
      // Exclude completed from main tabs unless a specific completed tab is added
      if (f.status === "completed") return false;
      
      const matchesSearch = f.lead.toLowerCase().includes(search.toLowerCase()) || 
                            f.phone.includes(search) || 
                            f.notes.toLowerCase().includes(search.toLowerCase());
      
      let matchesFilter = false;
      if (filter === "today") {
        matchesFilter = f.date === "اليوم" || f.date === "Today" || f.status === "pending";
      } else if (filter === "overdue") {
        matchesFilter = f.status === "overdue";
      } else if (filter === "upcoming") {
        matchesFilter = f.status === "upcoming";
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [followUps, search, filter]);

  // KPIs
  const totalToday = followUps.filter(f => f.date === "اليوم" || f.date === "Today").length;
  const pendingCount = followUps.filter(f => (f.date === "اليوم" || f.date === "Today") && f.status !== "completed").length;
  const completedCount = followUps.filter(f => f.status === "completed").length;
  const overdueCount = followUps.filter(f => f.status === "overdue").length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{isAr ? "متابعات اليوم" : "Today's Follow-ups"}</h2>
        <p className="text-sm text-slate-500">{isAr ? "إدارة المكالمات والرسائل المجدولة للعملاء" : "Manage scheduled calls and messages for leads"}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card border-l-4 border-l-blue-500">
          <p className="text-sm text-slate-500">{isAr ? "إجمالي متابعات اليوم" : "Total Today"}</p>
          <p className="text-3xl font-bold mt-1 text-slate-800">{totalToday}</p>
        </div>
        <div className="stat-card border-l-4 border-l-amber-500">
          <p className="text-sm text-slate-500">{isAr ? "قيد الانتظار" : "Pending"}</p>
          <p className="text-3xl font-bold mt-1 text-amber-600">{pendingCount}</p>
        </div>
        <div className="stat-card border-l-4 border-l-emerald-500">
          <p className="text-sm text-slate-500">{isAr ? "مكتملة" : "Completed"}</p>
          <p className="text-3xl font-bold mt-1 text-emerald-600">{completedCount}</p>
        </div>
        <div className="stat-card border-l-4 border-l-red-500">
          <p className="text-sm text-slate-500">{isAr ? "متأخرة" : "Overdue"}</p>
          <p className="text-3xl font-bold mt-1 text-red-600">{overdueCount}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder={isAr ? "بحث في المتابعات..." : "Search follow-ups..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`input ${isRtl ? 'pr-10' : 'pl-10'}`}
            />
          </div>
          <div className="flex gap-2">
            {['today', 'overdue', 'upcoming'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  filter === f 
                  ? "bg-[var(--primary)] text-white" 
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {isAr ? 
                  (f === 'today' ? 'اليوم' : f === 'overdue' ? 'متأخرة' : 'قادمة') : 
                  (f.charAt(0).toUpperCase() + f.slice(1))
                }
              </button>
            ))}
          </div>
        </div>
        <button className="btn-accent" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          {isAr ? "إضافة متابعة" : "Add Follow-up"}
        </button>
      </div>

      {/* Follow-ups List */}
      <div className="space-y-4">
        {filteredFollowUps.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-100 text-center shadow-sm">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-slate-700">{isAr ? "لا توجد متابعات هنا!" : "No follow-ups here!"}</h3>
            <p className="text-slate-500 mt-1">{isAr ? "لقد أنجزت جميع مهام هذه القائمة بنجاح." : "You have successfully completed all tasks in this list."}</p>
          </div>
        ) : (
          filteredFollowUps.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:shadow-md transition-shadow">
              
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === 'call' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>
                  {item.type === 'call' ? <Phone className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-800 text-lg hover:text-[var(--primary)] cursor-pointer transition-colors">
                    {item.lead}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Phone className="w-3.5 h-3.5" /> {item.phone}
                    </span>
                    <span className={`flex items-center gap-1 font-bold ${
                      item.status === 'overdue' ? 'text-red-500' : 
                      item.date === 'اليوم' || item.date === 'Today' ? 'text-amber-500' : 'text-slate-500'
                    }`}>
                      <Clock className="w-3.5 h-3.5" /> {item.date} • {item.time}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg inline-block border border-slate-100">
                    <span className="font-semibold">{isAr ? "الملاحظة:" : "Note:"}</span> {item.notes}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                <button 
                  onClick={() => window.open(item.type === 'call' ? `tel:${item.phone}` : `https://wa.me/${item.phone.replace('+', '')}`, '_blank')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  item.type === 'call' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}>
                  {item.type === 'call' ? <Phone className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                  {isAr ? (item.type === 'call' ? "اتصال الآن" : "مراسلة واتساب") : (item.type === 'call' ? "Call Now" : "WhatsApp")}
                </button>
                
                <button 
                  onClick={() => handleComplete(item.id)}
                  className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors" 
                  title={isAr ? "تحديد كمكتملة" : "Mark Complete"}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={() => handleReschedule(item.id)}
                  className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors" 
                  title={isAr ? "تأجيل للغد" : "Reschedule to Tomorrow"}
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Follow-up Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{isAr ? "إضافة متابعة جديدة" : "Add New Follow-up"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{isAr ? "اسم العميل" : "Lead Name"}</label>
                <input 
                  type="text" 
                  required 
                  className="input" 
                  value={newFollowUp.lead || ''}
                  onChange={e => setNewFollowUp({...newFollowUp, lead: e.target.value})}
                  placeholder={isAr ? "مثال: أحمد محمد" : "e.g. Ahmed Mohammed"} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{isAr ? "رقم الهاتف" : "Phone"}</label>
                  <input 
                    type="text" 
                    required 
                    className="input" 
                    value={newFollowUp.phone || ''}
                    onChange={e => setNewFollowUp({...newFollowUp, phone: e.target.value})}
                    placeholder="+971..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{isAr ? "النوع" : "Type"}</label>
                  <select 
                    className="input"
                    value={newFollowUp.type}
                    onChange={e => setNewFollowUp({...newFollowUp, type: e.target.value as "call" | "whatsapp"})}
                  >
                    <option value="call">{isAr ? "مكالمة هاتفية" : "Phone Call"}</option>
                    <option value="whatsapp">{isAr ? "رسالة واتساب" : "WhatsApp Message"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{isAr ? "اليوم" : "Date"}</label>
                  <select 
                    className="input"
                    value={newFollowUp.date}
                    onChange={e => setNewFollowUp({...newFollowUp, date: e.target.value})}
                  >
                    <option value="اليوم">{isAr ? "اليوم" : "Today"}</option>
                    <option value="غداً">{isAr ? "غداً" : "Tomorrow"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{isAr ? "الوقت" : "Time"}</label>
                  <input 
                    type="time" 
                    required 
                    className="input" 
                    value={newFollowUp.time ? newFollowUp.time.replace(' ص', '').replace(' م', '') : '12:00'}
                    onChange={e => {
                      const timeString = e.target.value;
                      const [hours] = timeString.split(':');
                      const ampm = Number(hours) >= 12 ? (isAr ? 'م' : 'PM') : (isAr ? 'ص' : 'AM');
                      setNewFollowUp({...newFollowUp, time: `${timeString} ${ampm}`})
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{isAr ? "ملاحظات وتفاصيل المتابعة" : "Notes"}</label>
                <textarea 
                  rows={3} 
                  required
                  className="input py-3 resize-none" 
                  value={newFollowUp.notes || ''}
                  onChange={e => setNewFollowUp({...newFollowUp, notes: e.target.value})}
                  placeholder={isAr ? "اكتب هنا ماذا تريد أن تقول للعميل..." : "Write details here..."}
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 btn-outline justify-center">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="flex-1 btn-accent justify-center">
                  {isAr ? "حفظ وإضافة" : "Save Follow-up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
