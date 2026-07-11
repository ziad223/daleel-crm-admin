import { Plus, Search, Download, LogIn, MoreHorizontal, Building2 } from "lucide-react";
import { getMockData } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function CompaniesPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const isRtl = locale === 'ar';
  const { companies } = getMockData(isAr);

  return (
    <div className="space-y-5">
      {/* Stats for Super Admin */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-sm text-slate-500">{isAr ? "إجمالي الشركات" : "Total Companies"}</p>
          <p className="text-3xl font-bold mt-1">48</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-slate-500">{isAr ? "نشطة" : "Active"}</p>
          <p className="text-3xl font-bold mt-1 text-emerald-600">41</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-slate-500">{isAr ? "موقوفة" : "Suspended"}</p>
          <p className="text-3xl font-bold mt-1 text-red-500">7</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-slate-500">{isAr ? "إجمالي المستخدمين" : "Total Users"}</p>
          <p className="text-3xl font-bold mt-1">312</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
          <input type="text" placeholder={isAr ? "بحث عن شركة..." : "Search company..."} className={`input ${isRtl ? 'pr-10' : 'pl-10'}`} />
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Download className="w-4 h-4" /> {isAr ? "تصدير" : "Export"}</button>
          <button className="btn-accent"><Plus className="w-4 h-4" /> {isAr ? "إضافة شركة" : "Add Company"}</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isAr ? "الشركة" : "Company"}</th>
              <th>{isAr ? "صاحب الشركة" : "Owner"}</th>
              <th>{isAr ? "البريد / الهاتف" : "Email / Phone"}</th>
              <th>{isAr ? "المستخدمين" : "Users"}</th>
              <th>{isAr ? "الـ Leads" : "Leads"}</th>
              <th>{isAr ? "الباقة" : "Plan"}</th>
              <th>{isAr ? "الحالة" : "Status"}</th>
              <th>{isAr ? "تاريخ الإنشاء" : "Created Date"}</th>
              <th>{isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="text-sm">{c.owner}</td>
                <td>
                  <div className="text-sm">{c.email}</div>
                  <div className="text-xs text-slate-400">{c.phone}</div>
                </td>
                <td className="text-center font-medium">{c.users}</td>
                <td className="text-center font-medium">{formatNumber(c.leads)}</td>
                <td><span className="badge badge-info">{c.plan}</span></td>
                <td>
                  <span className={`badge ${c.status === "نشط" || c.status === "Active" ? "badge-success" : "badge-danger"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="text-sm text-slate-500">{c.created}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600" title="Login As">
                      <LogIn className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                      <MoreHorizontal className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
