"use client";

import { MODULES } from "@/lib/config/modules";
import { useAppStore } from "@/lib/store/appStore";
import { hasPermission } from "@/lib/config/roles";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Shield, Network, Bot, Check, Lock,
} from "lucide-react";
import type { ModuleId } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = { Shield, Network, Bot };

const COLOR_MAP: Record<string, { card: string; icon: string; toggle: string }> = {
  blue: {
    card: "border-blue-200 bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    toggle: "bg-blue-600",
  },
  orange: {
    card: "border-orange-200 bg-orange-50",
    icon: "bg-orange-100 text-orange-600",
    toggle: "bg-orange-500",
  },
  violet: {
    card: "border-violet-200 bg-violet-50",
    icon: "bg-violet-100 text-violet-600",
    toggle: "bg-violet-500",
  },
};

export function ModuleSelector() {
  const { enabledModules, toggleModule, activeRole } = useAppStore();
  const canManage = hasPermission(activeRole, "manage_modules");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Regelverk & Moduler</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Aktivera de regelverk som gäller för din organisation
          </p>
        </div>
        {!canManage && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock className="w-3.5 h-3.5" />
            Kräver Admin-roll
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MODULES.map((module) => {
          const Icon = ICON_MAP[module.icon] ?? Shield;
          const isEnabled = enabledModules.includes(module.id);
          const colors = COLOR_MAP[module.color] ?? COLOR_MAP.blue;

          return (
            <div
              key={module.id}
              onClick={() => canManage && toggleModule(module.id as ModuleId)}
              className={cn(
                "relative border rounded-xl p-4 transition-all",
                isEnabled ? colors.card : "border-gray-200 bg-white",
                canManage ? "cursor-pointer hover:shadow-sm" : "cursor-not-allowed opacity-70"
              )}
            >
              {/* Status-chip */}
              <div className="flex items-center justify-between mb-3">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", colors.icon)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  isEnabled ? `${colors.toggle} border-transparent` : "border-gray-300 bg-white"
                )}>
                  {isEnabled && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900">{module.label}</h3>
                  {module.badge && (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                      {module.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{module.description}</p>
              </div>

              {/* Antal nav-items */}
              <div className="mt-3 text-[10px] text-gray-400">
                {module.navItems.length} funktioner
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
