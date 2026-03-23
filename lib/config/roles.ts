import type { RoleConfig, Permission } from "@/lib/types";

const ALL_PERMISSIONS: Permission[] = [
  "view_register", "edit_register",
  "view_policy", "edit_policy",
  "view_incidents", "create_incident", "manage_incidents",
  "view_routines", "execute_routine", "manage_routines",
  "view_audit_log", "export_pdf",
  "manage_modules", "manage_roles", "manage_settings",
];

export const ROLES: RoleConfig[] = [
  {
    id: "admin",
    label: "Admin",
    description: "Full åtkomst till alla moduler och inställningar",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    permissions: ALL_PERMISSIONS,
  },
  {
    id: "dpo",
    label: "DPO",
    description: "Dataskyddsombud — kan hantera register, policy och incidenter",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    permissions: [
      "view_register", "edit_register",
      "view_policy", "edit_policy",
      "view_incidents", "create_incident", "manage_incidents",
      "view_routines", "execute_routine", "manage_routines",
      "view_audit_log", "export_pdf",
    ],
  },
  {
    id: "employee",
    label: "Medarbetare",
    description: "Kan rapportera incidenter och läsa dokumentation",
    color: "bg-green-100 text-green-800 border-green-200",
    permissions: [
      "view_register",
      "view_policy",
      "view_incidents", "create_incident",
      "view_routines",
    ],
  },
];

export function getRoleConfig(id: string): RoleConfig {
  return ROLES.find((r) => r.id === id) ?? ROLES[0];
}

export function hasPermission(role: string, permission: Permission): boolean {
  const config = getRoleConfig(role);
  return config.permissions.includes(permission);
}
