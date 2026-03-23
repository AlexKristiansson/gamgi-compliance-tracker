"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Role, ModuleId, AppSettings } from "@/lib/types";
import { MODULES } from "@/lib/config/modules";

interface AppState {
  // Aktiv roll
  activeRole: Role;
  setActiveRole: (role: Role) => void;

  // Moduler
  enabledModules: ModuleId[];
  toggleModule: (id: ModuleId) => void;

  // Org-inställningar
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;

  // Export/Import
  exportData: () => string;
  importData: (json: string) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  organizationName: "Gamgi",
  enabledModules: ["gdpr"],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeRole: "admin",
      setActiveRole: (role) => set({ activeRole: role }),

      enabledModules: ["gdpr"],
      toggleModule: (id) =>
        set((state) => ({
          enabledModules: state.enabledModules.includes(id)
            ? state.enabledModules.filter((m) => m !== id)
            : [...state.enabledModules, id],
        })),

      settings: DEFAULT_SETTINGS,
      updateSettings: (s) =>
        set((state) => ({ settings: { ...state.settings, ...s } })),

      exportData: () => {
        const state = get();
        return JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            version: "1.0",
            activeRole: state.activeRole,
            enabledModules: state.enabledModules,
            settings: state.settings,
          },
          null,
          2
        );
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          set({
            activeRole: data.activeRole ?? "admin",
            enabledModules: data.enabledModules ?? ["gdpr"],
            settings: data.settings ?? DEFAULT_SETTINGS,
          });
        } catch {
          console.error("Import misslyckades: ogiltig JSON");
        }
      },
    }),
    {
      name: "gamgi-compliance-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
    }
  )
);

// Hjälpfunktion: hämta aktiva modulkonfigurationer
export function getActiveModules(enabledModules: ModuleId[]) {
  return MODULES.filter((m) => enabledModules.includes(m.id));
}
