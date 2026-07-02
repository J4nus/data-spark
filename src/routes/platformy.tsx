import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { platforms, type PlatformKey } from "@/lib/mock-data";
import { CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/platformy")({
  head: () => ({ meta: [{ title: "Platformy – ContentHub" }] }),
  component: PlatformsPage,
});

const states: Record<PlatformKey, { connected: boolean; account?: string; followers?: string }> = {
  instagram: { connected: true, account: "@klara_dvorak", followers: "128,4k" },
  facebook: { connected: true, account: "Klára Dvořáková Official", followers: "42,1k" },
  youtube: { connected: false },
  manual: { connected: true, account: "Ruční zápisky", followers: "24" },
};

function PlatformsPage() {
  return (
    <AppShell title="Propojené platformy" subtitle="Instagram, Facebook a YouTube připravené pro OAuth napojení">
      <div className="grid grid-cols-2 gap-4 p-8">
        {(Object.keys(platforms) as PlatformKey[]).map((k) => {
          const p = platforms[k];
          const s = states[k];
          return (
            <div key={k} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-4">
                <div className={`grid size-12 shrink-0 place-items-center rounded-xl ${p.dot} font-display text-sm font-bold text-background`}>
                  {p.short}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg font-semibold">{p.name}</p>
                    {s.connected ? (
                      <span className="flex items-center gap-1 rounded-full bg-neon-green/15 px-2 py-0.5 text-[10px] font-bold text-neon-green">
                        <CheckCircle2 className="size-3" /> Připojeno
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        <XCircle className="size-3" /> Odpojeno
                      </span>
                    )}
                  </div>
                  {s.account ? (
                    <p className="mt-1 truncate text-xs text-muted-foreground">{s.account}</p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">Připoj svůj účet a začni synchronizovat.</p>
                  )}
                  {s.followers ? (
                    <p className="mt-2 text-xs">
                      <b className="font-display text-base">{s.followers}</b>{" "}
                      <span className="text-muted-foreground">{k === "manual" ? "zápisků" : "sledujících"}</span>
                    </p>
                  ) : null}
                </div>
                <button
                  className={`shrink-0 rounded-md px-3 py-1.5 text-[11px] font-semibold ${
                    s.connected
                      ? "border border-border text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {s.connected ? "Nastavení" : "Připojit"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
