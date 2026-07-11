"use client";

import { Bell, Search, Plus, Menu, Globe, ChevronDown, User, Target, CheckSquare, LogOut, Settings, CreditCard, FileText, Phone } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { getMockData } from "@/lib/mock-data";

const pageKeys: Record<string, string> = {
  "/": "nav.dashboard",
  "/leads": "nav.leads",
  "/customers": "nav.customers",
  "/pipeline": "nav.pipeline",
  "/campaigns": "nav.campaigns",
  "/tasks": "nav.tasks",
  "/calls": "nav.calls",
  "/whatsapp": "nav.whatsapp",
  "/reports": "nav.reports",
  "/users": "nav.users",
  "/roles": "nav.roles",
  "/attendance": "nav.attendance",
  "/ai": "nav.ai",
  "/branding": "nav.branding",
  "/subscription": "nav.subscription",
  "/billing": "nav.billing",
  "/backups": "nav.backups",
  "/settings": "nav.settings",
  "/profile": "header.profile",
};

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  let pathWithoutLocale = (pathname || '').replace(/^\/(ar|en)/, '');
  if (!pathWithoutLocale.startsWith('/')) pathWithoutLocale = '/' + pathWithoutLocale;
  const titleKey = pageKeys[pathWithoutLocale] || "nav.dashboard";
  const title = t(titleKey);

  const { recentLeads, customersData, recentTasks } = getMockData(locale === 'ar');

  const filteredLeads = searchQuery
    ? recentLeads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.includes(searchQuery) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredCustomers = searchQuery
    ? customersData.filter(
        (cust) =>
          cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cust.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cust.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredTasks = searchQuery
    ? recentTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.lead.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalResults = filteredLeads.length + filteredCustomers.length + filteredTasks.length;

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    const newPath = pathWithoutLocale === '/' ? `/${nextLocale}` : `/${nextLocale}${pathWithoutLocale}`;
    window.location.href = newPath; 
  };

  const handleNavigate = (path: string) => {
    router.push(`/${locale}${path}`);
    setIsAddMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsNotifOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
          <Menu strokeWidth={1.5} className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-wide">{title}</h1>
          <div className="text-sm text-slate-500 hidden md:flex items-center gap-2 mt-1 font-medium">
            <span>{t("nav.dashboard")}</span> 
            <span className="text-slate-300">/</span> 
            <span className="text-blue-600">{title}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search strokeWidth={1.5} className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10`} />
          <input
            type="text"
            placeholder={t("header.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className={`w-[400px] py-2 bg-slate-50 rounded-full border border-slate-200 text-slate-700 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
          />

          {/* Floating Search Results Modal */}
          {isSearchFocused && searchQuery && (
            <div className={`absolute top-full mt-3 w-[500px] bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-[400px] overflow-y-auto ${isRtl ? 'left-0' : 'right-0'} z-50 animate-in fade-in slide-in-from-top-2 duration-200 py-2`}>
              <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>{isRtl ? "نتائج البحث" : "Search Results"}</span>
                <span>{totalResults} {isRtl ? "نتائج" : "results"}</span>
              </div>
              
              {totalResults === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  {isRtl ? "لا توجد نتائج مطابقة لبحثك." : "No matching results found."}
                </div>
              ) : (
                <div className="p-2 space-y-3">
                  {/* Leads Section */}
                  {filteredLeads.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isRtl ? "العملاء المحتملين" : "Leads"}
                      </div>
                      <div className="mt-1 space-y-1">
                        {filteredLeads.map((lead) => (
                          <div 
                            key={lead.id} 
                            onMouseDown={() => handleNavigate(`/leads`)}
                            className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {lead.name.charAt(0)}
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-slate-700">{lead.name}</div>
                                <div className="text-xs text-slate-400">{lead.email} | {lead.phone}</div>
                              </div>
                            </div>
                            <span className="badge badge-info">{lead.stage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customers Section */}
                  {filteredCustomers.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isRtl ? "العملاء الدائمين" : "Customers"}
                      </div>
                      <div className="mt-1 space-y-1">
                        {filteredCustomers.map((cust) => (
                          <div 
                            key={cust.id} 
                            onMouseDown={() => handleNavigate(`/customers`)}
                            className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                                {cust.name.charAt(0)}
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-slate-700">{cust.name}</div>
                                <div className="text-xs text-slate-400">{cust.contact} | {cust.email}</div>
                              </div>
                            </div>
                            <span className="badge badge-success">{cust.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks Section */}
                  {filteredTasks.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isRtl ? "المهام" : "Tasks"}
                      </div>
                      <div className="mt-1 space-y-1">
                        {filteredTasks.map((task) => (
                          <div 
                            key={task.id} 
                            onMouseDown={() => handleNavigate(`/tasks`)}
                            className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                <CheckSquare className="w-4 h-4" />
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-slate-700 truncate max-w-[280px]">{task.title}</div>
                                <div className="text-xs text-slate-400">{isRtl ? "العميل: " : "Lead: "}{task.lead}</div>
                              </div>
                            </div>
                            <span className="text-xs text-slate-400">{task.due}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-slate-100 hidden lg:block mx-1"></div>

        {/* Quick Add */}
        <div className="relative hidden md:block">
          <button 
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            onBlur={() => setTimeout(() => setIsAddMenuOpen(false), 200)}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm"
          >
            <Plus strokeWidth={2} className="w-4 h-4" />
            <span>{t("common.add")}</span>
            <ChevronDown strokeWidth={1.5} className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isAddMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isAddMenuOpen && (
            <div className={`absolute top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 ${isRtl ? 'left-0' : 'right-0'} animate-in fade-in slide-in-from-top-2 duration-200 z-50`}>
              <button onMouseDown={() => handleNavigate('/leads')} className="w-full px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-3 transition-colors">
                <User strokeWidth={1.5} className="w-4 h-4" />
                <span className="font-semibold">{t("header.addLead")}</span>
              </button>
              <button onMouseDown={() => handleNavigate('/tasks')} className="w-full px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-3 transition-colors">
                <CheckSquare strokeWidth={1.5} className="w-4 h-4" />
                <span className="font-semibold">{t("header.addTask")}</span>
              </button>
              <button onMouseDown={() => handleNavigate('/pipeline')} className="w-full px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-purple-600 flex items-center gap-3 transition-colors">
                <Target strokeWidth={1.5} className="w-4 h-4" />
                <span className="font-semibold">{t("header.addDeal")}</span>
              </button>
            </div>
          )}
        </div>

        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="p-2.5 rounded-full hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 transition-colors font-bold text-xs uppercase"
        >
          <Globe strokeWidth={1.5} className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline pt-0.5">{locale === 'ar' ? 'EN' : 'AR'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            onBlur={() => setTimeout(() => setIsNotifOpen(false), 200)}
            className="relative p-2.5 rounded-full hover:bg-slate-50 text-slate-500 transition-colors"
          >
            <Bell strokeWidth={1.5} className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          {isNotifOpen && (
            <div className={`absolute top-full mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 ${isRtl ? 'left-0' : 'right-0'} animate-in fade-in slide-in-from-top-2 duration-200 z-50`}>
              <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">{t("header.notifications")}</span>
                <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">{t("header.markRead")}</span>
              </div>
              <div className="p-2">
                <div className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <User strokeWidth={1.5} className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-800 font-bold">{t("header.newLeadNotif")}</p>
                    <p className="text-xs text-slate-500 mt-1">{t("header.timeAgo")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-slate-100 mx-1"></div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            onBlur={() => setTimeout(() => setIsProfileMenuOpen(false), 200)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
              {isRtl ? 'أ' : 'A'}
            </div>
            <div className="hidden md:block text-start">
              <div className="text-sm font-bold text-slate-800 leading-tight">{t("sidebar.adminName")}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{t("sidebar.adminRole")}</div>
            </div>
            <ChevronDown strokeWidth={1.5} className="w-3.5 h-3.5 text-slate-400 hidden md:block ml-1" />
          </button>

          {isProfileMenuOpen && (
            <div className={`absolute top-full mt-3 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 ${isRtl ? 'left-0' : 'right-0'} animate-in fade-in slide-in-from-top-2 duration-200 z-50`}>
              <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg">
                  {isRtl ? 'أ' : 'A'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{t("sidebar.adminName")}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{t("sidebar.adminRole")}</p>
                </div>
              </div>
              <div className="py-2">
                <button onMouseDown={() => handleNavigate('/profile')} className="w-full px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-4 justify-start text-start transition-colors">
                  <User strokeWidth={1.5} className="w-4 h-4" />
                  <span className="font-semibold">{t("header.profile")}</span>
                </button>
                <button onMouseDown={() => handleNavigate('/subscription')} className="w-full px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-4 justify-start text-start transition-colors">
                  <CreditCard strokeWidth={1.5} className="w-4 h-4" />
                  <span className="font-semibold">{t("nav.subscription")}</span>
                </button>
                <button onMouseDown={() => handleNavigate('/settings')} className="w-full px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-4 justify-start text-start transition-colors">
                  <Settings strokeWidth={1.5} className="w-4 h-4" />
                  <span className="font-semibold">{t("nav.settings")}</span>
                </button>
              </div>
              <div className="border-t border-slate-50 py-2">
                <button className="w-full px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-4 justify-start text-start transition-colors">
                  <LogOut strokeWidth={1.5} className={`w-4 h-4 text-red-500 ${isRtl ? 'rotate-180' : ''}`} />
                  <span className="font-bold">{t("header.logout")}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
