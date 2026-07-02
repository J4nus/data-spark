import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Eye, EyeOff, Copy, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/api-klice")({
  head: () => ({ meta: [{ title: "API klíče – ContentHub" }] }),
  component: ApiKeysPage,
});

const keys = [
  { name: "Meta Graph API", value: "EAA••••••••••••••••••••pQ4", created: "02. 2. 2026" },
  { name: "YouTube OAuth", value: "yt_••••••••••••••••••••hK1p", created: "14. 1. 2026" },
];

function ApiKeysPage() {
  const [show, setShow] = useState<string | null>(null);
  return (
    <AppShell
      title="API klíče"
      subtitle="Šifrované úložiště přihlašovacích údajů k propojeným službám"
      actions={
        <button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground">
          <Plus className="size-3.5" /> Přidat klíč
        </button>
      }
    >
      <div className="p-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface text-[10px] uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3 text-left">Název</th>
                <th className="px-6 py-3 text-left">Hodnota</th>
                <th className="px-6 py-3 text-left">Vytvořeno</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.name} className="border-b border-border/60 last:border-b-0">
                  <td className="px-6 py-4 font-medium">{k.name}</td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {show === k.name ? k.value.replace(/•/g, "a") : k.value}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{k.created}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setShow(show === k.name ? null : k.name)}
                      className="mr-2 text-muted-foreground hover:text-foreground"
                    >
                      {show === k.name ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Copy className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
