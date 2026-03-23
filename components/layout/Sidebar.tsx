"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield, Database, FileText, AlertTriangle, CalendarClock,
  ScrollText, Network, Bot, LayoutDashboard, Settings,
  ClipboardCheck, BarChart3, AlertOctagon, Cpu, Gauge,
  Scale, Gavel, CheckSquare, Lock, Info, Eye, Pencil,
  Trash2, PauseCircle, ArrowRightLeft, HandMetal,
  ShieldCheck, ShieldAlert, Bell, ClipboardList, UserCheck,
  Building2, Euro, FileSignature, Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore, getActiveModules } from "@/lib/store/appStore";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { NavItem } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  Shield, Database, FileText, AlertTriangle, CalendarClock,
  ScrollText, Network, Bot, LayoutDashboard, Settings,
  ClipboardCheck, BarChart3, AlertOctagon, Cpu, Gauge,
  Scale, Gavel, CheckSquare, Lock, Info, Eye, Pencil,
  Trash2, PauseCircle, ArrowRightLeft, HandMetal,
  ShieldCheck, ShieldAlert, Bell, ClipboardList, UserCheck,
  Building2, Euro, FileSignature, Download,
};

const MODULE_COLORS: Record<string, string> = {
  blue: "text-blue-600",
  orange: "text-orange-600",
  violet: "text-violet-600",
};

function groupNavItems(items: NavItem[]): { group: string; items: NavItem[] }[] {
  const map = new Map<string, NavItem[]>();
  for (const item of items) {
    const g = item.group ?? "";
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(item);
  }
  return Array.from(map.entries()).map(([group, items]) => ({ group, items }));
}

export function Sidebar() {
  const pathname = usePathname();
  const { enabledModules } = useAppStore();
  const activeModules = getActiveModules(enabledModules);

  return (
    <aside className="w-64 min-h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900 leading-none">Gamgi Compliance</p>
            <p className="text-xs text-gray-500 mt-0.5">GDPR · NIS2 · AI Act</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Startsida */}
        <NavLink href="/" icon={LayoutDashboard} label="Dashboard" active={pathname === "/"} />

        <Separator className="my-2" />

        {/* Aktiva moduler med grupperade artiklar */}
        {activeModules.map((module) => {
          const ModuleIcon = ICON_MAP[module.icon] ?? Shield;
          const colorClass = MODULE_COLORS[module.color] ?? "text-gray-600";
          const groups = groupNavItems(module.navItems);

          return (
            <div key={module.id} className="space-y-1">
              {/* Modulrubrik */}
              <div className="flex items-center gap-2 px-2 pt-3 pb-1">
                <ModuleIcon className={cn("w-3.5 h-3.5", colorClass)} />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {module.label}
                </p>
              </div>

              {groups.map(({ group, items }) => (
                <div key={group}>
                  {/* Grupprubrik */}
                  {group && (
                    <p className="px-2.5 pt-2 pb-0.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      {group}
                    </p>
                  )}
                  {items.map((item) => {
                    const Icon = ICON_MAP[item.icon] ?? Shield;
                    return (
                      <NavLink
                        key={item.id}
                        href={item.href}
                        icon={Icon}
                        label={item.label}
                        sublabel={item.sublabel}
                        badge={item.badge}
                        active={pathname === item.href || pathname.startsWith(item.href + "/")}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}

        <Separator className="my-2" />

        {/* Verktyg */}
        <p className="px-2 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Verktyg</p>
        <NavLink href="/settings" icon={Settings} label="Inställningar" active={pathname === "/settings"} />
        <NavLink href="/export" icon={Download} label="Export & Import" active={pathname === "/export"} />
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <p className="text-[10px] text-gray-400 text-center">
          Gamgi Compliance v1.0 · Lokalt läge
        </p>
      </div>
    </aside>
  );
}

function NavLink({
  href, icon: Icon, label, sublabel, badge, active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  badge?: number | string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors group",
        active
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <span className="flex items-center gap-2 min-w-0">
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">{label}</span>
        {sublabel && (
          <span className={cn(
            "text-[10px] flex-shrink-0 font-mono",
            active ? "text-blue-500" : "text-gray-400"
          )}>
            {sublabel}
          </span>
        )}
      </span>
      {badge !== undefined && (
        <Badge
          variant="secondary"
          className={cn(
            "text-[10px] h-4 px-1.5 flex-shrink-0",
            active ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"
          )}
        >
          {badge}
        </Badge>
      )}
    </Link>
  );
}
