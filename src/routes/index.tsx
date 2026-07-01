import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Save, PencilRuler, LayoutGrid, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  WidgetRenderer,
  defaultLayout,
  widgetCatalog,
  type WidgetConfig,
  type WidgetKind,
  type WidgetSize,
} from "@/components/widgets";
import { platforms, type PlatformKey } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  const [layout, setLayout] = useState<WidgetConfig[]>(defaultLayout);
  const [editMode, setEditMode] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  function addWidget(kind: WidgetKind, size: WidgetSize) {
    const id = "w" + (Date.now() % 100000);
    const platform: PlatformKey | undefined =
      kind === "platform-feed" || kind === "inbox" ? "instagram" : undefined;
    setLayout((l) => [...l, { id, kind, size, platform }]);
    setAddOpen(false);
    toast.success("Widget přidán na nástěnku");
  }

  function removeWidget(id: string) {
    setLayout((l) => l.filter((w) => w.id !== id));
  }

  return (
    <AppShell
      title="Centrální nástěnka"
      subtitle="Konsolidovaný přehled a živé feedy z tvých propojených účtů."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode((e) => !e)}
            className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${
              editMode
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-foreground hover:border-primary/50"
            }`}
          >
            {editMode ? <Save className="size-3.5" /> : <PencilRuler className="size-3.5" />}
            {editMode ? "Uložit rozložení" : "Upravit rozložení"}
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="size-3.5" /> Přidat widget
          </button>
        </div>
      }
    >
      <div className="p-8">
        <div className="grid auto-rows-[128px] grid-cols-12 gap-4">
          {layout.map((w) => (
            <WidgetRenderer
              key={w.id}
              config={w}
              editMode={editMode}
              onRemove={() => removeWidget(w.id)}
              onConfigure={() => toast.info("Konfigurace zdroje widgetu (demo).")}
            />
          ))}
          {editMode ? (
            <button
              onClick={() => setAddOpen(true)}
              className="col-span-3 row-span-1 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <Plus className="size-6" />
              <span className="text-xs font-semibold uppercase tracking-widest">Přidat dlaždici</span>
            </button>
          ) : null}
        </div>

        <p className="mt-8 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Sparkles className="size-3 text-neon-violet" />
          Tip: klikni na <b className="text-foreground">Upravit rozložení</b>, potom můžeš dlaždice
          přesouvat, měnit velikost (1×1 až 4×2) a konfigurovat zdroj – např. „feed konkrétního
          přítele“ nebo „RSS z tvého blogu“.
        </p>
      </div>

      {addOpen ? <AddWidgetDialog onAdd={addWidget} onClose={() => setAddOpen(false)} /> : null}
    </AppShell>
  );
}

function AddWidgetDialog({
  onAdd,
  onClose,
}: {
  onAdd: (kind: WidgetKind, size: WidgetSize) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<WidgetKind | null>(null);
  const item = widgetCatalog.find((c) => c.kind === selected);
  const sizes: WidgetSize[] = ["1x1", "2x1", "2x2", "3x2", "4x1", "4x2", "2x3"];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold">Přidat widget na nástěnku</h2>
            <p className="text-xs text-muted-foreground">
              Vyber typ dlaždice a velikost – nástěnka je jako opravdová korková, pos­kládej si ji.
            </p>
          </div>
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">
            Zavřít
          </button>
        </div>

        <div className="grid grid-cols-[1fr_320px]">
          <div className="max-h-[60vh] overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-2">
              {widgetCatalog.map((c) => {
                const Icon = c.icon;
                const active = selected === c.kind;
                return (
                  <button
                    key={c.kind}
                    onClick={() => setSelected(c.kind)}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-surface hover:border-primary/50"
                    }`}
                  >
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-background">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{c.label}</p>
                      <p className="text-[11px] text-muted-foreground">{c.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-l border-border bg-surface p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Konfigurace
            </p>
            {item ? (
              <>
                <p className="mt-2 font-display text-lg">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>

                <label className="mt-5 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Velikost
                </label>
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => onAdd(item.kind, s)}
                      className="rounded-md border border-border bg-background px-2 py-1.5 font-mono text-[10px] hover:border-primary hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {(item.kind === "platform-feed" || item.kind === "inbox") ? (
                  <>
                    <label className="mt-5 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Zdroj
                    </label>
                    <select className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-xs">
                      {Object.entries(platforms).map(([k, v]) => (
                        <option key={k} value={k}>{v.name}</option>
                      ))}
                    </select>
                  </>
                ) : null}
              </>
            ) : (
              <div className="grid h-full place-items-center text-center text-xs text-muted-foreground">
                <div>
                  <LayoutGrid className="mx-auto mb-2 size-6" />
                  Vyber widget vlevo.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
