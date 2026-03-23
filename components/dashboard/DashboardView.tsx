"use client";

import { useAppStore } from "@/lib/store/appStore";
import { getRoleConfig } from "@/lib/config/roles";
import { Card } from "@/components/ui/card";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { AlertTriangle, Database, CalendarClock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function DashboardView() {
  const { activeRole, settings, enabledModules } = useAppStore();
  const roleConfig = getRoleConfig(activeRole);

  const isGdprEnabled = enabledModules.includes("gdpr");

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Välkomstbanner (visas tills dokumentation är komplett) */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Kom igång med din compliance</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Börja med att fylla i din <strong>registerförteckning</strong> — den matar resten av appen
            med data för integritetspolicy, incidenthantering och rutiner.
          </p>
        </div>
      </div>

      {/* Compliance-mätare */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <ComplianceCard
          value={0}
          label="Kompletteringsgrad"
          sublabel="Dokumentation"
          type="percent"
          color="gray"
        />
        <ComplianceCard
          value={0}
          label="Behandlingar"
          sublabel="I registerförteckningen"
          type="count"
          color="blue"
        />
        <ComplianceCard
          value={0}
          label="Aktiva incidenter"
          sublabel="Kräver åtgärd"
          type="count"
          color="red"
        />
        <ComplianceCard
          value={0}
          label="Rutiner"
          sublabel="Planerade i årshjulet"
          type="count"
          color="green"
        />
      </div>

      {/* Snabbåtgärder */}
      {isGdprEnabled && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Snabbåtkomst</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <QuickCard
              href="/gdpr/incidents/new"
              icon={AlertTriangle}
              label="Rapportera incident"
              description="Starta 72-timmarsflödet"
              urgent
            />
            <QuickCard
              href="/gdpr/register"
              icon={Database}
              label="Registerförteckning"
              description="Lägg till en behandling"
            />
            <QuickCard
              href="/gdpr/routines"
              icon={CalendarClock}
              label="Rutiner & Årshjul"
              description="Se dagens uppgifter"
            />
          </div>
        </div>
      )}

      {/* Nyhetsflöde */}
      <NewsFeed />
    </div>
  );
}

function ComplianceCard({
  value, label, sublabel, type, color,
}: {
  value: number;
  label: string;
  sublabel: string;
  type: "percent" | "count";
  color: "gray" | "blue" | "red" | "green";
}) {
  const colorMap = {
    gray: "text-gray-700",
    blue: "text-blue-600",
    red: "text-red-600",
    green: "text-green-600",
  };

  return (
    <Card className="p-4">
      <p className={cn("text-2xl font-bold", colorMap[color])}>
        {value}{type === "percent" ? "%" : ""}
      </p>
      <p className="text-sm font-medium text-gray-900 mt-1">{label}</p>
      <p className="text-xs text-gray-500">{sublabel}</p>
    </Card>
  );
}

function QuickCard({
  href, icon: Icon, label, description, urgent,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
  urgent?: boolean;
}) {
  return (
    <Link href={href}>
      <div className={cn(
        "border rounded-xl p-4 flex items-center justify-between group cursor-pointer transition-all hover:shadow-sm",
        urgent
          ? "border-red-200 bg-red-50 hover:bg-red-100"
          : "border-gray-200 bg-white hover:bg-gray-50"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            urgent ? "bg-red-100" : "bg-gray-100"
          )}>
            <Icon className={cn("w-4 h-4", urgent ? "text-red-600" : "text-gray-600")} />
          </div>
          <div>
            <p className={cn("text-sm font-medium", urgent ? "text-red-900" : "text-gray-900")}>{label}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
