// ─── Roller ───────────────────────────────────────────────────────────────────
export type Role = "admin" | "dpo" | "employee";

export interface RoleConfig {
  id: Role;
  label: string;
  description: string;
  color: string;
  permissions: Permission[];
}

export type Permission =
  | "view_register"
  | "edit_register"
  | "view_policy"
  | "edit_policy"
  | "view_incidents"
  | "create_incident"
  | "manage_incidents"
  | "view_routines"
  | "execute_routine"
  | "manage_routines"
  | "view_audit_log"
  | "export_pdf"
  | "manage_modules"
  | "manage_roles"
  | "manage_settings";

// ─── Moduler ──────────────────────────────────────────────────────────────────
export type ModuleId = "gdpr" | "nis2" | "ai_act";

export interface ModuleConfig {
  id: ModuleId;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
  color: string;
  badge?: string;
  navItems: NavItem[];
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  sublabel?: string;       // t.ex. artikelnummer "Art. 30"
  href: string;
  icon: string;
  badge?: number | string;
  moduleId: ModuleId;
  group?: string;          // grupperingsrubrik i sidebaren
}

// ─── App-inställningar ────────────────────────────────────────────────────────
export interface AppSettings {
  organizationName: string;
  organizationNumber?: string;
  dpoName?: string;
  dpoEmail?: string;
  enabledModules: ModuleId[];
}
