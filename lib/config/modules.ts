import type { ModuleConfig } from "@/lib/types";

export const MODULES: ModuleConfig[] = [
  {
    id: "gdpr",
    label: "GDPR",
    description: "Dataskyddsförordningen — registerförteckning, integritetspolicy, incidenthantering och rutiner",
    icon: "Shield",
    enabled: true,
    color: "blue",
    navItems: [
      // ── Vyer ──────────────────────────────────────────────────────────
      { id: "dashboard",  label: "Dashboard",         href: "/gdpr",           icon: "LayoutDashboard", moduleId: "gdpr", group: "Vyer" },
      { id: "audit",      label: "Revisionslogg",     href: "/gdpr/audit",     icon: "ScrollText",      moduleId: "gdpr", group: "Vyer" },

      // ── Grundprinciper ─────────────────────────────────────────────────
      { id: "art5",  label: "Principer",           sublabel: "Art. 5",    href: "/gdpr/artiklar/art5",  icon: "Scale",        moduleId: "gdpr", group: "Grundprinciper" },
      { id: "art6",  label: "Laglig grund",        sublabel: "Art. 6",    href: "/gdpr/artiklar/art6",  icon: "Gavel",        moduleId: "gdpr", group: "Grundprinciper" },
      { id: "art7",  label: "Samtycke",            sublabel: "Art. 7",    href: "/gdpr/artiklar/art7",  icon: "CheckSquare",  moduleId: "gdpr", group: "Grundprinciper" },
      { id: "art9",  label: "Känsliga uppgifter",  sublabel: "Art. 9",    href: "/gdpr/artiklar/art9",  icon: "Lock",         moduleId: "gdpr", group: "Grundprinciper" },

      // ── Registrerades rättigheter ──────────────────────────────────────
      { id: "art13", label: "Information (direkt)",   sublabel: "Art. 13",  href: "/gdpr/artiklar/art13", icon: "Info",         moduleId: "gdpr", group: "Rättigheter" },
      { id: "art14", label: "Information (indirekt)", sublabel: "Art. 14",  href: "/gdpr/artiklar/art14", icon: "Info",         moduleId: "gdpr", group: "Rättigheter" },
      { id: "art15", label: "Rätt till tillgång",     sublabel: "Art. 15",  href: "/gdpr/artiklar/art15", icon: "Eye",          moduleId: "gdpr", group: "Rättigheter" },
      { id: "art16", label: "Rättelse",               sublabel: "Art. 16",  href: "/gdpr/artiklar/art16", icon: "Pencil",       moduleId: "gdpr", group: "Rättigheter" },
      { id: "art17", label: "Radering",               sublabel: "Art. 17",  href: "/gdpr/artiklar/art17", icon: "Trash2",       moduleId: "gdpr", group: "Rättigheter" },
      { id: "art18", label: "Begränsning",            sublabel: "Art. 18",  href: "/gdpr/artiklar/art18", icon: "PauseCircle",  moduleId: "gdpr", group: "Rättigheter" },
      { id: "art20", label: "Dataportabilitet",       sublabel: "Art. 20",  href: "/gdpr/artiklar/art20", icon: "ArrowRightLeft", moduleId: "gdpr", group: "Rättigheter" },
      { id: "art21", label: "Invändning",             sublabel: "Art. 21",  href: "/gdpr/artiklar/art21", icon: "HandMetal",    moduleId: "gdpr", group: "Rättigheter" },

      // ── Ansvar & Säkerhet ──────────────────────────────────────────────
      { id: "art25", label: "Inbyggt dataskydd",      sublabel: "Art. 25",  href: "/gdpr/artiklar/art25", icon: "ShieldCheck",  moduleId: "gdpr", group: "Ansvar & Säkerhet" },
      { id: "art28", label: "PUB-avtal",              sublabel: "Art. 28",  href: "/gdpr/artiklar/art28", icon: "FileSignature", moduleId: "gdpr", group: "Ansvar & Säkerhet" },
      { id: "art30", label: "Registerförteckning",    sublabel: "Art. 30",  href: "/gdpr/register",       icon: "Database",     moduleId: "gdpr", group: "Ansvar & Säkerhet" },
      { id: "art32", label: "Säkerhetsåtgärder",      sublabel: "Art. 32",  href: "/gdpr/artiklar/art32", icon: "ShieldAlert",  moduleId: "gdpr", group: "Ansvar & Säkerhet" },
      { id: "art33", label: "Incidentanmälan (72h)",  sublabel: "Art. 33",  href: "/gdpr/incidents",      icon: "AlertTriangle", moduleId: "gdpr", group: "Ansvar & Säkerhet" },
      { id: "art34", label: "Underrättelse",          sublabel: "Art. 34",  href: "/gdpr/artiklar/art34", icon: "Bell",         moduleId: "gdpr", group: "Ansvar & Säkerhet" },
      { id: "art35", label: "Konsekvensbedömning",    sublabel: "Art. 35",  href: "/gdpr/artiklar/art35", icon: "ClipboardList", moduleId: "gdpr", group: "Ansvar & Säkerhet" },

      // ── DPO & Tillsyn ──────────────────────────────────────────────────
      { id: "art37", label: "Dataskyddsombud",        sublabel: "Art. 37–39", href: "/gdpr/artiklar/art37", icon: "UserCheck",   moduleId: "gdpr", group: "DPO & Tillsyn" },
      { id: "art58", label: "IMY:s befogenheter",     sublabel: "Art. 58",    href: "/gdpr/artiklar/art58", icon: "Building2",   moduleId: "gdpr", group: "DPO & Tillsyn" },
      { id: "art83", label: "Sanktionsavgifter",      sublabel: "Art. 83",    href: "/gdpr/artiklar/art83", icon: "Euro",        moduleId: "gdpr", group: "DPO & Tillsyn" },

      // ── Rutiner ────────────────────────────────────────────────────────
      { id: "routines", label: "Rutiner & Årshjul",   href: "/gdpr/routines", icon: "CalendarClock", moduleId: "gdpr", group: "Rutiner" },
      { id: "policy",   label: "Integritetspolicy",   href: "/gdpr/policy",   icon: "FileText",      moduleId: "gdpr", group: "Rutiner" },
    ],
  },
  {
    id: "nis2",
    label: "NIS2",
    description: "Cybersäkerhetsdirektivet — kontrollista, riskanalys och incidentrapportering till MSB",
    icon: "Network",
    enabled: false,
    color: "orange",
    badge: "Kommande",
    navItems: [
      { id: "nis2-checklist", label: "Kontrollista NIS2", href: "/nis2/checklist", icon: "ClipboardCheck", moduleId: "nis2" },
      { id: "nis2-risk", label: "Riskanalys", href: "/nis2/risk", icon: "BarChart3", moduleId: "nis2" },
      { id: "nis2-incidents", label: "Incidentrapportering", href: "/nis2/incidents", icon: "AlertOctagon", moduleId: "nis2" },
    ],
  },
  {
    id: "ai_act",
    label: "AI-förordningen",
    description: "EU AI Act — riskklassificering av AI-system och dokumentationskrav",
    icon: "Bot",
    enabled: false,
    color: "violet",
    badge: "Kommande",
    navItems: [
      { id: "ai-register", label: "AI-systemregister", href: "/ai/register", icon: "Cpu", moduleId: "ai_act" },
      { id: "ai-risk", label: "Riskklassificering", href: "/ai/risk", icon: "Gauge", moduleId: "ai_act" },
    ],
  },
];
