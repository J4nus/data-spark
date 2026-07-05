import { createFileRoute } from "@tanstack/react-router";
import { Upload, Filter, Grid3x3 } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated/media")({
  head: () => ({ meta: [{ title: "Media Pool – ContentHub" }] }),
  component: MediaPage,
});

function MediaPage() {
  const items = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    tag: ["Foto", "Video", "Reel", "Story"][i % 4],
    hue: (i * 37) % 360,
  }));
  return (
    <AppShell
      title="Media Pool"
      subtitle="Centrální knihovna – přetahuj do plánovače nebo publikuj rovnou"
      actions={
        <button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground">
          <Upload className="size-3.5" /> Nahrát
        </button>
      }
    >
      <div className="p-8">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
            {["Vše", "Fotky", "Videa", "Reels", "Story"].map((t, i) => (
              <button
                key={t}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                  i === 0 ? "bg-background" : "text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="ml-auto flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-xs">
            <Filter className="size-3.5" /> Filtr
          </button>
          <button className="grid size-9 place-items-center rounded-lg border border-border bg-surface">
            <Grid3x3 className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border"
              style={{
                background: `linear-gradient(135deg, oklch(0.5 0.2 ${it.hue}), oklch(0.3 0.15 ${(it.hue + 60) % 360}))`,
              }}
            >
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-2 text-[10px] text-white">
                <span className="font-semibold">{it.tag}</span>
                <span className="font-mono">IMG_{2000 + it.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
