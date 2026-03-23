"use client";

import { useAppStore } from "@/lib/store/appStore";
import { ModuleSelector } from "@/components/modules/ModuleSelector";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Trash2 } from "lucide-react";
import { useRef } from "react";

export default function SettingsPage() {
  const { settings, updateSettings, exportData, importData } = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gamgi-compliance-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      importData(text);
    };
    reader.readAsText(file);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Inställningar</h1>
        <p className="text-sm text-gray-500">Hantera organisation, moduler och data</p>
      </div>

      {/* Organisation */}
      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Organisation</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Organisationsnamn</label>
            <input
              type="text"
              value={settings.organizationName}
              onChange={(e) => updateSettings({ organizationName: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Organisationsnummer</label>
            <input
              type="text"
              value={settings.organizationNumber ?? ""}
              onChange={(e) => updateSettings({ organizationNumber: e.target.value })}
              placeholder="556000-0000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">DPO-namn</label>
              <input
                type="text"
                value={settings.dpoName ?? ""}
                onChange={(e) => updateSettings({ dpoName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">DPO e-post</label>
              <input
                type="email"
                value={settings.dpoEmail ?? ""}
                onChange={(e) => updateSettings({ dpoEmail: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Moduler */}
      <Card className="p-5">
        <ModuleSelector />
      </Card>

      {/* Export / Import */}
      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Data — Export & Import</h2>
        <p className="text-xs text-gray-500">
          All data sparas lokalt i din webbläsare. Exportera regelbundet som backup.
        </p>
        <div className="flex gap-3">
          <Button onClick={handleExport} variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportera JSON
          </Button>
          <Button
            onClick={() => fileRef.current?.click()}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importera JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </Card>
    </div>
  );
}
