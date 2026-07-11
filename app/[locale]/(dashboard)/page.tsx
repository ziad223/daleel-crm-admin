"use client";

import {
  UserPlus, Users, Phone, MessageCircle, Target, TrendingUp,
  AlertTriangle, CheckCircle2, Clock, DollarSign, BarChart3, Zap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { getMockData } from "@/lib/mock-data";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

function StatCard({ title, value, icon: Icon, color, change }: {
  title: string; value: string | number; icon: any; color: string; change?: string;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {change && <p className="text-xs text-emerald-600 mt-1">{change}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === 'ar';
  
  const { stats, leadsByDay, monthlySales, employeePerformance, pipelineData, recentLeads, recentTasks, recentCalls, bestCampaigns, conversionRateHistory, recentNotifications } = getMockData(isAr);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard title={t("stat.totalLeads")} value={formatNumber(stats.totalLeads)} icon={UserPlus} color="bg-blue-100 text-blue-600" change={t("dash.thisMonth")} />
        <StatCard title={t("stat.newLeadsToday")} value={stats.newLeadsToday} icon={Zap} color="bg-emerald-100 text-emerald-600" />
        <StatCard title={t("stat.following")} value={formatNumber(stats.following)} icon={Clock} color="bg-amber-100 text-amber-600" />
        <StatCard title={t("stat.neglected")} value={stats.neglected} icon={AlertTriangle} color="bg-red-100 text-red-600" />
        <StatCard title={t("stat.openDeals")} value={stats.openDeals} icon={Target} color="bg-violet-100 text-violet-600" />
        <StatCard title={t("stat.closedDeals")} value={stats.closedDeals} icon={CheckCircle2} color="bg-emerald-100 text-emerald-600" change="+8%" />
        <StatCard title={t("stat.salesValue")} value={formatCurrency(stats.salesValue)} icon={DollarSign} color="bg-green-100 text-green-700" />
        <StatCard title={t("stat.conversionRate")} value={`${stats.conversionRate}%`} icon={TrendingUp} color="bg-cyan-100 text-cyan-600" />
        <StatCard title={t("stat.callsCount")} value={formatNumber(stats.callsCount)} icon={Phone} color="bg-indigo-100 text-indigo-600" />
        <StatCard title={t("stat.whatsappCount")} value={formatNumber(stats.whatsappCount)} icon={MessageCircle} color="bg-teal-100 text-teal-600" />
        <StatCard title={t("stat.overdueTasks")} value={stats.overdueTasks} icon={AlertTriangle} color="bg-orange-100 text-orange-600" />
        <StatCard title={t("stat.employees")} value={stats.employees} icon={Users} color="bg-slate-100 text-slate-600" />
      </div>

      {/* 2x2 Balanced Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 1. Leads Chart */}
        <div className="stat-card">
          <h3 className="font-bold text-lg mb-4 text-start">{t("dash.leadsChartTitle")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsByDay}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="leads" stroke="#10B981" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Sales Chart */}
        <div className="stat-card">
          <h3 className="font-bold text-lg mb-4 text-start">{t("dash.salesChartTitle")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="sales" fill="#1E3A8A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Conversion Rate Chart */}
        <div className="stat-card">
          <h3 className="font-bold text-lg mb-4 text-start">{t("dash.conversionChartTitle")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conversionRateHistory}>
                <defs>
                  <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Area type="monotone" dataKey="rate" stroke="#06B6D4" fillOpacity={1} fill="url(#colorConv)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Pipeline Distribution */}
        <div className="stat-card text-start">
          <h3 className="font-bold text-lg mb-4 text-start">{t("dash.pipelineTitle")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineData}
                  dataKey="count"
                  nameKey="stage"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ count }) => `${count}`}
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Employee Performance + Best Campaigns */}
      <div className="grid lg:grid-cols-3 gap-6 text-start">
        {/* Employee Performance */}
        <div className="stat-card lg:col-span-1">
          <h3 className="font-bold text-lg mb-4 text-start">{t("dash.performanceTitle")}</h3>
          <div className="space-y-3">
            {employeePerformance.map((emp, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">{i + 1}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{emp.name}</span>
                    <span className="text-slate-500">{emp.deals} {t("dash.deals")} · {formatCurrency(emp.value)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(emp.deals / 28) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Campaigns */}
        <div className="stat-card lg:col-span-2">
          <h3 className="font-bold text-lg mb-4 text-start">{t("dash.bestCampaignsTitle")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bestCampaigns.map((camp, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-start">
                <div className="font-medium mb-2">{camp.name}</div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">{t("dash.leadsCount")}: {camp.leads}</span>
                  <span className="text-emerald-600 font-medium">{t("dash.return")}: {camp.roas}x</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(camp.conversion / 30) * 100}%` }}></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1.5 text-start">{t("dash.conversion")}: {camp.conversion}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 1: Recent Leads + Recent Tasks (Perfect Height Alignment) */}
      <div className="grid lg:grid-cols-3 gap-6 text-start">
        {/* Recent Leads */}
        <div className="table-container lg:col-span-2">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold">{t("dash.recentLeads")}</h3>
            <a href="/leads" className="text-sm text-[var(--primary)] hover:underline">{t("dash.viewAll")}</a>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("dash.table.name")}</th>
                <th>{t("dash.table.source")}</th>
                <th>{t("dash.table.stage")}</th>
                <th>{t("dash.table.interest")}</th>
                <th className={isAr ? 'text-left pl-10' : 'text-right pr-10'}>{t("dash.table.value")}</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-slate-400">{lead.phone}</div>
                  </td>
                  <td className="text-sm">{lead.source}</td>
                  <td><span className="badge badge-info">{lead.stage}</span></td>
                  <td>
                    <span className={`badge ${lead.interest === "ساخن" || lead.interest === "Hot" ? "badge-danger" : lead.interest === "دافئ" || lead.interest === "Warm" ? "badge-warning" : "badge-neutral"}`}>
                      {lead.interest}
                    </span>
                  </td>
                  <td className={`font-semibold ${isAr ? 'text-left pl-10' : 'text-right pr-10'}`}>{lead.value ? formatCurrency(lead.value) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Tasks */}
        <div className="table-container lg:col-span-1">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold">{t("dash.recentTasks")}</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {recentTasks.map((task) => (
              <div key={task.id} className="px-5 py-3.5">
                <div className="font-medium text-sm">{task.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{task.lead} · {task.agent}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`badge ${task.status === "متأخرة" ? "badge-danger" : "badge-info"}`}>{task.status}</span>
                  <span className="text-[11px] text-slate-400">{task.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Recent Calls + Recent Notifications (Aligned Side-by-Side!) */}
      <div className="grid lg:grid-cols-2 gap-6 text-start">
        {/* Recent Calls */}
        <div className="table-container">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold">{t("dash.recentCalls")}</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {recentCalls.map((call) => (
              <div key={call.id} className="px-5 py-3 text-start">
                <div className="flex justify-between">
                  <span className="font-medium text-sm">{call.lead}</span>
                  <span className="text-xs text-slate-400">{call.duration}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{call.result}</div>
                <div className="text-[11px] text-slate-400 mt-1">{call.time} · {call.agent}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="table-container">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold">{t("dash.recentNotifications")}</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {recentNotifications.map((notif) => (
              <div key={notif.id} className="px-5 py-3.5 flex gap-3 items-start justify-start">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.type === 'success' ? 'bg-emerald-500' :
                    notif.type === 'warning' ? 'bg-amber-500' :
                      notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                <div>
                  <div className="font-medium text-sm">{notif.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{notif.desc}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{notif.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
