"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  LayoutDashboard, Users, UserPlus, Target, BarChart3, Phone, MessageCircle,
  CheckSquare, Megaphone, Settings, CreditCard, FileText, Database,
  Sparkles, Palette, Shield, Clock, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  href: string;
  key: string;
  icon: any;
}

const companyMenu: MenuItem[] = [
  { href: "/", key: "nav.dashboard", icon: LayoutDashboard },
  { href: "/leads", key: "nav.leads", icon: UserPlus },
  { href: "/customers", key: "nav.customers", icon: Users },
  { href: "/pipeline", key: "nav.pipeline", icon: Target },
  { href: "/campaigns", key: "nav.campaigns", icon: Megaphone },
  { href: "/follow-ups", key: "nav.followups", icon: CheckSquare },
  { href: "/tasks", key: "nav.tasks", icon: CheckSquare },
  { href: "/calls", key: "nav.calls", icon: Phone },
  { href: "/whatsapp", key: "nav.whatsapp", icon: MessageCircle },
  { href: "/reports", key: "nav.reports", icon: BarChart3 },
  { href: "/team", key: "nav.team", icon: Users },
  { href: "/users", key: "nav.users", icon: Users },
  { href: "/roles", key: "nav.roles", icon: Shield },
  { href: "/attendance", key: "nav.attendance", icon: Clock },
  { href: "/ai", key: "nav.ai", icon: Sparkles },
  { href: "/branding", key: "nav.branding", icon: Palette },
  { href: "/subscription", key: "nav.subscription", icon: CreditCard },
  { href: "/billing", key: "nav.billing", icon: FileText },
  { href: "/backups", key: "nav.backups", icon: Database },
  { href: "/settings", key: "nav.settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  return (
    <aside className={cn(
      `fixed top-0 z-40 h-screen w-64 bg-[var(--sidebar)] text-white flex flex-col transition-transform duration-300 ${isRtl ? 'right-0' : 'left-0'}`,
      isOpen ? "translate-x-0" : (isRtl ? "translate-x-full md:translate-x-0" : "-translate-x-full md:translate-x-0")
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center font-bold text-lg">
          {isRtl ? 'د' : 'E'}
        </div>
        <div>
          <div className="font-bold text-lg tracking-tight">
            {t('sidebar.logoText')}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium tracking-wider">{t('sidebar.system')}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 custom-scrollbar">
        {companyMenu.map((item) => {
          const isActive = pathWithoutLocale === item.href || (item.href !== "/" && pathWithoutLocale.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href === '/' ? '' : item.href}`}
              onClick={() => onClose()}
              className={cn("sidebar-link", isActive && "active")}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{t(item.key as any)}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/30 flex items-center justify-center text-sm font-bold">
            {isRtl ? 'أ' : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {t('sidebar.adminName')}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {t('sidebar.adminRole')}
            </div>
          </div>
          <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <LogOut className={`w-4 h-4 text-slate-400 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </aside>
  );
}
