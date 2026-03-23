"use client";

import { useAppStore } from "@/lib/store/appStore";
import { getRoleConfig, ROLES } from "@/lib/config/roles";
import { MODULES } from "@/lib/config/modules";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, User, Check, Shield, Network, Bot } from "lucide-react";
import type { Role, ModuleId } from "@/lib/types";

const MODULE_ICONS: Record<string, React.ElementType> = { Shield, Network, Bot };

const MODULE_TOGGLE_COLORS: Record<string, { on: string; off: string }> = {
  blue:   { on: "bg-blue-600",   off: "bg-gray-200" },
  orange: { on: "bg-orange-500", off: "bg-gray-200" },
  violet: { on: "bg-violet-600", off: "bg-gray-200" },
};

export function Header({ title }: { title?: string }) {
  const { activeRole, setActiveRole, settings, enabledModules, toggleModule } = useAppStore();
  const roleConfig = getRoleConfig(activeRole);
  const canManageModules = roleConfig.permissions.includes("manage_modules");

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-gray-900">
          {title ?? "Dashboard"}
        </h1>
        <span className="text-xs text-gray-400">·</span>
        <span className="text-xs text-gray-500">{settings.organizationName}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Lokalt läge */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Lokalt läge
        </div>

        {/* Kombinerad roll + modulväljare */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(
            "flex items-center gap-2 border rounded-full px-3 py-1 text-xs font-medium transition-colors hover:opacity-80 cursor-pointer",
            roleConfig.color
          )}>
            <User className="w-3.5 h-3.5" />
            {roleConfig.label}
            <ChevronDown className="w-3 h-3 opacity-60" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-72">

            {/* ── Roller ─────────────────────────────────────────────── */}
            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
              Aktiv roll
            </DropdownMenuLabel>

            {ROLES.map((role) => (
              <DropdownMenuItem
                key={role.id}
                onClick={() => setActiveRole(role.id as Role)}
                className="flex items-start gap-2.5 py-2.5 cursor-pointer"
              >
                <div className={cn(
                  "mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                  activeRole === role.id
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300"
                )}>
                  {activeRole === role.id && (
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-[10px]", role.color)}>
                      {role.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
                </div>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            {/* ── Moduler ────────────────────────────────────────────── */}
            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
              Aktiva regelverk
              {!canManageModules && (
                <span className="ml-1 text-[10px] text-gray-400">(kräver Admin)</span>
              )}
            </DropdownMenuLabel>

            {MODULES.map((module) => {
              const Icon = MODULE_ICONS[module.icon] ?? Shield;
              const isEnabled = enabledModules.includes(module.id as ModuleId);
              const colors = MODULE_TOGGLE_COLORS[module.color];

              return (
                <DropdownMenuItem
                  key={module.id}
                  onClick={(e) => {
                    e.preventDefault();
                    if (canManageModules) toggleModule(module.id as ModuleId);
                  }}
                  className={cn(
                    "flex items-center gap-3 py-2.5 cursor-pointer",
                    !canManageModules && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{module.label}</span>
                      {module.badge && (
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                          {module.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 truncate">{module.description}</p>
                  </div>
                  {/* Toggle */}
                  <div className={cn(
                    "w-8 h-4 rounded-full transition-colors flex-shrink-0 relative",
                    isEnabled ? colors.on : colors.off
                  )}>
                    <div className={cn(
                      "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform",
                      isEnabled ? "translate-x-4" : "translate-x-0.5"
                    )} />
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
