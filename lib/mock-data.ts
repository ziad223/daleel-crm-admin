export const getMockData = (isAr: boolean) => {
  return {
    stats: {
      totalLeads: 12480,
      newLeadsToday: 47,
      following: 892,
      neglected: 156,
      openDeals: 234,
      closedDeals: 89,
      salesValue: 2450000,
      conversionRate: 18.4,
      callsCount: 1240,
      whatsappCount: 3850,
      overdueTasks: 23,
      employees: 18,
    },
    leadsByDay: [
      { day: isAr ? "السبت" : "Sat", leads: 42 },
      { day: isAr ? "الأحد" : "Sun", leads: 58 },
      { day: isAr ? "الاثنين" : "Mon", leads: 71 },
      { day: isAr ? "الثلاثاء" : "Tue", leads: 65 },
      { day: isAr ? "الأربعاء" : "Wed", leads: 89 },
      { day: isAr ? "الخميس" : "Thu", leads: 76 },
      { day: isAr ? "الجمعة" : "Fri", leads: 34 },
    ],
    monthlySales: [
      { month: isAr ? "يناير" : "Jan", sales: 180000 },
      { month: isAr ? "فبراير" : "Feb", sales: 220000 },
      { month: isAr ? "مارس" : "Mar", sales: 195000 },
      { month: isAr ? "أبريل" : "Apr", sales: 310000 },
      { month: isAr ? "مايو" : "May", sales: 280000 },
      { month: isAr ? "يونيو" : "Jun", sales: 340000 },
    ],
    employeePerformance: [
      { name: isAr ? "أحمد العتيبي" : "Ahmed Alotaibi", deals: 28, value: 420000 },
      { name: isAr ? "سارة المنصوري" : "Sarah Almansouri", deals: 24, value: 380000 },
      { name: isAr ? "خالد الشمري" : "Khalid Alshammari", deals: 21, value: 310000 },
      { name: isAr ? "نورة القحطاني" : "Noura Alqahtani", deals: 19, value: 290000 },
      { name: isAr ? "محمد الدوسري" : "Mohammed Aldossari", deals: 15, value: 210000 },
    ],
    pipelineData: [
      { stage: "New Lead", count: 320, color: "#94A3B8" },
      { stage: "Contacted", count: 210, color: "#60A5FA" },
      { stage: "Interested", count: 145, color: "#34D399" },
      { stage: "Follow-up", count: 98, color: "#FBBF24" },
      { stage: "Quotation", count: 67, color: "#F97316" },
      { stage: "Negotiation", count: 42, color: "#A78BFA" },
      { stage: "Won", count: 89, color: "#10B981" },
      { stage: "Lost", count: 56, color: "#EF4444" },
    ],
    recentLeads: [
      { id: 1, name: isAr ? "فهد العتيبي" : "Fahad Alotaibi", phone: "0501234567", email: "fahad@example.com", city: isAr ? "دبي" : "Dubai", country: isAr ? "الإمارات" : "UAE", source: isAr ? "إعلان فيسبوك" : "FB Ad", campaign: isAr ? "حملة فيسبوك" : "FB Campaign", stage: "Interested", interest: isAr ? "ساخن" : "Hot", value: 85000, lastContact: isAr ? "منذ ساعتين" : "2h ago", agent: isAr ? "أحمد" : "Ahmed", status: isAr ? "نشط" : "Active" },
      { id: 2, name: isAr ? "نورة السبيعي" : "Noura Alsubaie", phone: "0559876543", email: "noura@example.com", city: isAr ? "أبوظبي" : "Abu Dhabi", country: isAr ? "الإمارات" : "UAE", source: isAr ? "واتساب" : "WhatsApp", campaign: isAr ? "إيميل تسويقي" : "Email Campaign", stage: "Quotation", interest: isAr ? "ساخن" : "Hot", value: 120000, lastContact: isAr ? "منذ 1 يوم" : "1d ago", agent: isAr ? "سارة" : "Sarah", status: isAr ? "نشط" : "Active" },
      { id: 3, name: isAr ? "عبدالله القحطاني" : "Abdullah Alqahtani", phone: "0534567890", email: "abdullah@example.com", city: isAr ? "الشارقة" : "Sharjah", country: isAr ? "الإمارات" : "UAE", source: isAr ? "إعلان سناب" : "Snap Ad", campaign: isAr ? "سناب شات" : "Snapchat", stage: "Contacted", interest: isAr ? "دافئ" : "Warm", value: 45000, lastContact: isAr ? "منذ 3 ساعات" : "3h ago", agent: isAr ? "خالد" : "Khalid", status: isAr ? "مغلق" : "Closed" },
      { id: 4, name: isAr ? "منى الحربي" : "Mona Alharbi", phone: "0543210987", email: "mona@example.com", city: isAr ? "العين" : "Al Ain", country: isAr ? "الإمارات" : "UAE", source: isAr ? "إحالة" : "Referral", campaign: "—", stage: "Negotiation", interest: isAr ? "ساخن" : "Hot", value: 210000, lastContact: isAr ? "منذ 30 دقيقة" : "30m ago", agent: isAr ? "أحمد" : "Ahmed", status: isAr ? "نشط" : "Active" },
    ],
    recentTasks: [
      { id: 1, title: isAr ? "متابعة عرض سعر" : "Follow up quote", lead: isAr ? "نورة السبيعي" : "Noura", agent: isAr ? "سارة" : "Sarah", priority: isAr ? "عالية" : "High", due: isAr ? "اليوم 4:00 م" : "Today 4 PM", status: isAr ? "قيد التنفيذ" : "In Progress" },
      { id: 2, title: isAr ? "اتصال ترحيبي" : "Welcome call", lead: isAr ? "فهد العتيبي" : "Fahad", agent: isAr ? "أحمد" : "Ahmed", priority: isAr ? "متوسطة" : "Med", due: isAr ? "غداً 10:00 ص" : "Tmrw 10 AM", status: isAr ? "مجدولة" : "Scheduled" },
      { id: 3, title: isAr ? "إرسال عقد" : "Send contract", lead: isAr ? "منى الحربي" : "Mona", agent: isAr ? "أحمد" : "Ahmed", priority: isAr ? "عالية" : "High", due: isAr ? "اليوم 6:00 م" : "Today 6 PM", status: isAr ? "متأخرة" : "Overdue" },
    ],
    recentCalls: [
      { id: 1, lead: isAr ? "منى الحربي" : "Mona Alharbi", agent: isAr ? "أحمد" : "Ahmed", duration: "4:32", result: isAr ? "مهتم - طلب عرض" : "Interested - Quote", time: isAr ? "منذ 30 دقيقة" : "30m ago" },
      { id: 2, lead: isAr ? "فهد العتيبي" : "Fahad Alotaibi", agent: isAr ? "أحمد" : "Ahmed", duration: "2:15", result: isAr ? "إعادة اتصال" : "Call back", time: isAr ? "منذ ساعتين" : "2h ago" },
      { id: 3, lead: isAr ? "عبدالله القحطاني" : "Abdullah Alqahtani", agent: isAr ? "خالد" : "Khalid", duration: "1:45", result: isAr ? "لا يرد" : "No answer", time: isAr ? "منذ 3 ساعات" : "3h ago" },
    ],
    bestCampaigns: [
      { name: isAr ? "سناب شات رمضان" : "Snapchat Ramadan", leads: 450, conversion: 22, roas: 3.5 },
      { name: isAr ? "جوجل بحث" : "Google Search", leads: 320, conversion: 18, roas: 4.2 },
      { name: isAr ? "فيسبوك العقارية" : "FB Real Estate", leads: 280, conversion: 15, roas: 2.8 },
      { name: isAr ? "إيميل للعملاء" : "Email Newsletter", leads: 150, conversion: 25, roas: 5.1 },
    ],
    conversionRateHistory: [
      { month: isAr ? "يناير" : "Jan", rate: 12 },
      { month: isAr ? "فبراير" : "Feb", rate: 14 },
      { month: isAr ? "مارس" : "Mar", rate: 15.5 },
      { month: isAr ? "أبريل" : "Apr", rate: 18 },
      { month: isAr ? "مايو" : "May", rate: 17 },
      { month: isAr ? "يونيو" : "Jun", rate: 18.4 },
    ],
    recentNotifications: [
      { id: 1, title: isAr ? "تم إغلاق صفقة جديدة" : "New deal closed", desc: isAr ? "أحمد العتيبي أغلق صفقة بـ 85ك" : "Ahmed closed 85k deal", time: isAr ? "منذ 10 دقائق" : "10m ago", type: "success" },
      { id: 2, title: isAr ? "مهمة متأخرة" : "Overdue task", desc: isAr ? "يجب الاتصال بفهد" : "Call Fahad immediately", time: isAr ? "منذ ساعة" : "1h ago", type: "warning" },
      { id: 3, title: isAr ? "عميل جديد (واتساب)" : "New WhatsApp lead", desc: isAr ? "تم إضافة عميل من سناب" : "Added from Snapchat", time: isAr ? "منذ ساعتين" : "2h ago", type: "info" },
    ],
    pipelineStages: [
      { id: "new", name: isAr ? "جديد" : "New Lead", color: "bg-slate-400" },
      { id: "contacted", name: isAr ? "تم التواصل" : "Contacted", color: "bg-blue-400" },
      { id: "interested", name: isAr ? "مهتم" : "Interested", color: "bg-emerald-400" },
      { id: "followup", name: isAr ? "متابعة" : "Follow-up", color: "bg-amber-400" },
      { id: "quotation", name: isAr ? "عرض سعر" : "Quotation", color: "bg-orange-400" },
      { id: "negotiation", name: isAr ? "تفاوض" : "Negotiation", color: "bg-violet-400" },
      { id: "won", name: isAr ? "مغلقة (ربح)" : "Won", color: "bg-emerald-600" },
      { id: "lost", name: isAr ? "مغلقة (خسارة)" : "Lost", color: "bg-red-500" },
    ],
    kanbanLeads: {
      new: [{ id: 1, name: isAr ? "سعود الدوسري" : "Saud Aldossari", value: 0, phone: "0567890123", interest: isAr ? "بارد" : "Cold" }],
      contacted: [{ id: 3, name: isAr ? "عبدالله القحطاني" : "Abdullah", value: 45000, phone: "0534567890", interest: isAr ? "دافئ" : "Warm" }],
      interested: [{ id: 4, name: isAr ? "فهد العتيبي" : "Fahad", value: 85000, phone: "0501234567", interest: isAr ? "ساخن" : "Hot" }],
      followup: [{ id: 5, name: isAr ? "لينا الشمري" : "Lina", value: 62000, phone: "0544445566", interest: isAr ? "دافئ" : "Warm" }],
      quotation: [{ id: 6, name: isAr ? "نورة السبيعي" : "Noura", value: 120000, phone: "0559876543", interest: isAr ? "ساخن" : "Hot" }],
      negotiation: [{ id: 7, name: isAr ? "منى الحربي" : "Mona", value: 210000, phone: "0543210987", interest: isAr ? "ساخن" : "Hot" }],
      won: [{ id: 8, name: isAr ? "سلطان العتيبي" : "Sultan", value: 175000, phone: "0512345678", interest: isAr ? "ساخن" : "Hot" }],
      lost: [{ id: 9, name: isAr ? "هيا الدوسري" : "Haya", value: 40000, phone: "0523456789", interest: isAr ? "بارد" : "Cold" }],
    },
    campaignsData: [
      { id: 1, name: isAr ? "حملة فيسبوك العقارية" : "FB Real Estate Campaign", source: "Facebook Ads", startDate: "2026-06-01", endDate: "2026-07-01", leadsCount: 450, employees: [isAr ? "أحمد" : "Ahmed", isAr ? "سارة" : "Sarah"], successRate: 15, status: isAr ? "نشطة" : "Active" },
      { id: 2, name: isAr ? "إعلانات جوجل بحث" : "Google Search Ads", source: "Google Ads", startDate: "2026-05-15", endDate: "2026-08-15", leadsCount: 320, employees: [isAr ? "خالد" : "Khalid"], successRate: 18, status: isAr ? "نشطة" : "Active" },
      { id: 3, name: isAr ? "حملة رمضان سناب شات" : "Snapchat Ramadan Campaign", source: "Snapchat", startDate: "2026-03-01", endDate: "2026-04-05", leadsCount: 890, employees: [isAr ? "أحمد" : "Ahmed", isAr ? "نورة" : "Noura"], successRate: 22, status: isAr ? "مكتملة" : "Completed" },
      { id: 4, name: isAr ? "إيميل تسويقي للعملاء" : "Email Newsletter", source: "Email", startDate: "2026-07-10", endDate: "2026-07-20", leadsCount: 150, employees: [isAr ? "محمد" : "Mohammed"], successRate: 25, status: isAr ? "مجدولة" : "Scheduled" },
    ],
    whatsappTemplatesData: [
      { id: 1, title: isAr ? "ترحيب بالعميل الجديد" : "Welcome New Lead", content: isAr ? "مرحباً {{name}}، نشكرك على تواصلك مع شركة {{company}}. كيف يمكننا مساعدتك اليوم؟" : "Hi {{name}}, thanks for contacting {{company}}. How can we help you today?", category: isAr ? "ترحيب" : "Welcome", type: isAr ? "نص" : "Text", status: isAr ? "نشط" : "Active" },
      { id: 2, title: isAr ? "عرض سعر مبدئي" : "Initial Quotation", content: isAr ? "أهلاً {{name}}، بناءً على طلبك، تم تجهيز عرض سعر مبدئي لخدمة {{service}}. يرجى مراجعة المرفقات." : "Hello {{name}}, based on your request, we prepared the quote for {{service}}. Please review.", category: isAr ? "مبيعات" : "Sales", type: isAr ? "نص + ملف" : "Text + File", status: isAr ? "نشط" : "Active" },
      { id: 3, title: isAr ? "متابعة بعد الاتصال" : "Follow-up Call", content: isAr ? "سعدنا بالحديث معك اليوم أستاذ {{name}}. هل لديك أي استفسارات إضافية بخصوص ما تمت مناقشته؟" : "Great talking to you {{name}}. Do you have any other questions regarding our discussion?", category: isAr ? "متابعة" : "Follow-up", type: isAr ? "نص" : "Text", status: isAr ? "نشط" : "Active" },
      { id: 4, title: isAr ? "تذكير بالدفع" : "Payment Reminder", content: isAr ? "عزيزي {{name}}، نود تذكيرك بأن موعد سداد الفاتورة رقم {{invoice_number}} قد حان." : "Dear {{name}}, this is a reminder that payment for invoice {{invoice_number}} is due.", category: isAr ? "مالية" : "Finance", type: isAr ? "نص" : "Text", status: isAr ? "غير نشط" : "Inactive" },
    ],
    customersData: [
      { id: 1, name: isAr ? "شركة النور العقارية" : "Al Noor Real Estate", contact: isAr ? "عبدالله السعيد" : "Abdullah Alsaeed", phone: "0501112223", email: "info@alnoor.com", service: isAr ? "باقة Growth" : "Growth Plan", value: 120000, joinDate: "2025-10-15", status: isAr ? "نشط" : "Active" },
      { id: 2, name: isAr ? "مؤسسة القمة للتقنية" : "Al Qimmah Tech", contact: isAr ? "فاطمة أحمد" : "Fatima Ahmed", phone: "0504445556", email: "contact@alqimma.com", service: isAr ? "باقة Starter" : "Starter Plan", value: 45000, joinDate: "2026-02-10", status: isAr ? "نشط" : "Active" },
      { id: 3, name: isAr ? "مدارس رواد المستقبل" : "Future Pioneers Schools", contact: isAr ? "عمر خالد" : "Omar Khalid", phone: "0507778889", email: "admin@rowad.edu", service: isAr ? "باقة Enterprise" : "Enterprise Plan", value: 350000, joinDate: "2024-08-01", status: isAr ? "منتهي" : "Expired" },
    ],
    companies: [
      { id: 1, name: isAr ? "عقارات الرياض" : "Riyadh Real Estate", owner: isAr ? "فهد العتيبي" : "Fahad Alotaibi", email: "info@riyadh-re.com", phone: "0112345678", users: 12, leads: 4500, plan: isAr ? "الاحترافية" : "Professional", status: isAr ? "نشط" : "Active", created: "2025-11-12" },
      { id: 2, name: isAr ? "معهد الشرق للتدريب" : "East Training Institute", owner: isAr ? "سارة المنصوري" : "Sarah Almansouri", email: "admin@east-inst.com", phone: "0509876543", users: 8, leads: 2100, plan: isAr ? "الأساسية" : "Basic", status: isAr ? "نشط" : "Active", created: "2026-01-05" },
      { id: 3, name: isAr ? "تسويق الخليج" : "Gulf Marketing", owner: isAr ? "خالد الشمري" : "Khalid Alshammari", email: "hello@gulfmkt.com", phone: "0551234567", users: 25, leads: 9800, plan: isAr ? "المؤسسية" : "Enterprise", status: isAr ? "نشط" : "Active", created: "2025-08-20" },
      { id: 4, name: isAr ? "عيادات النور" : "Al Noor Clinics", owner: isAr ? "د. نورة" : "Dr. Noura", email: "info@noor-clinic.com", phone: "0534567890", users: 6, leads: 890, plan: isAr ? "الأساسية" : "Basic", status: isAr ? "موقوف" : "Suspended", created: "2026-03-15" },
    ],
    plans: [
      { id: 1, name: isAr ? "الأساسية" : "Basic", monthly: 299, yearly: 2990, users: 5, leads: 1000, campaigns: 5, ai: false, whatsapp: true, api: false, backup: false, status: isAr ? "فعالة" : "Active" },
      { id: 2, name: isAr ? "الاحترافية" : "Professional", monthly: 599, yearly: 5990, users: 15, leads: 10000, campaigns: 999, ai: true, whatsapp: true, api: true, backup: true, status: isAr ? "فعالة" : "Active" },
      { id: 3, name: isAr ? "المؤسسية" : "Enterprise", monthly: 1199, yearly: 11990, users: 999, leads: 999999, campaigns: 999, ai: true, whatsapp: true, api: true, backup: true, status: isAr ? "فعالة" : "Active" },
    ]
  };
};

// Legacy exports for un-translated pages (Will be removed after Phase 2/3)
export const legacyData = getMockData(true);
export const stats = legacyData.stats;
export const leadsByDay = legacyData.leadsByDay;
export const monthlySales = legacyData.monthlySales;
export const employeePerformance = legacyData.employeePerformance;
export const pipelineData = legacyData.pipelineData;
export const recentLeads = legacyData.recentLeads;
export const recentTasks = legacyData.recentTasks;
export const recentCalls = legacyData.recentCalls;
export const bestCampaigns = legacyData.bestCampaigns;
export const conversionRateHistory = legacyData.conversionRateHistory;
export const recentNotifications = legacyData.recentNotifications;
export const companies = legacyData.companies;
export const plans = legacyData.plans;
export const pipelineStages = legacyData.pipelineStages;
export const kanbanLeads = legacyData.kanbanLeads;
export const campaignsData = legacyData.campaignsData;
export const whatsappTemplatesData = legacyData.whatsappTemplatesData;
export const customersData = legacyData.customersData;
