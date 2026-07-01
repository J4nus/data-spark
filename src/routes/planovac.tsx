import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  czechDays,
  czechMonths,
  engagementHeatmap,
  platforms,
  scheduledPosts,
  type PlatformKey,
} from "@/lib/mock-data";

export const Route = createFileRoute("/planovac")({
  head: () => ({
    meta: [
      { title: "Plánovač publikací – ContentHub" },
      { name: "description", content: "Bohatý kalendář publikací s heatmapou nejlepšího času." },
    ],
  }),
  component: PlannerPage,
});

type ViewMode = "week" | "month" | "day";

function PlannerPage() {
  const [view, setView] = useState<ViewMode>("week");
  const [monthIndex, setMonthIndex] = useState(2); // Březen
  const [activePlatforms, setActivePlatforms] = useState<Set<PlatformKey>>(
    new Set(Object.keys(platforms) as PlatformKey[]),
  );

  function togglePlatform(p: PlatformKey) {
    const next = new Set(activePlatforms);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    setActivePlatforms(next);
  }

  return (
    <AppShell
      title="Plánovač publikací"
      subtitle="Bohatý kalendář s heatmapou nejlepšího času k postnutí"
      actions={
        <button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground">
          <Plus className="size-3.5" /> Nový příspěvek
        </button>
      }
    >
      <div className="grid grid-cols-[280px_minmax(0,1fr)] gap-6 p-8">
        {/* Left rail */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-sm font-semibold">
                {czechMonths[monthIndex]} 2026
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setMonthIndex((m) => (m + 11) % 12)}
                  className="grid size-7 place-items-center rounded-md border border-border hover:bg-surface"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <button
                  onClick={() => setMonthIndex((m) => (m + 1) % 12)}
                  className="grid size-7 place-items-center rounded-md border border-border hover:bg-surface"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
            <MiniMonth monthIndex={monthIndex} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Filtr platforem
              </p>
              <Filter className="size-3.5 text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              {(Object.keys(platforms) as PlatformKey[]).map((k) => {
                const p = platforms[k];
                const active = activePlatforms.has(k);
                return (
                  <button
                    key={k}
                    onClick={() => togglePlatform(k)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition ${
                      active ? "bg-surface" : "opacity-40 hover:opacity-70"
                    }`}
                  >
                    <span className={`grid size-6 place-items-center rounded ${p.dot} text-[9px] font-bold text-background`}>
                      {p.short}
                    </span>
                    <span className="flex-1 text-left font-medium">{p.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {scheduledPosts.filter((s) => s.platform === k).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Doporučení AI
            </p>
            <p className="mt-2 text-xs leading-relaxed text-pretty">
              Nejlepší čas pro post na <b className="text-primary">Instagram</b> je dnes{" "}
              <b>20:00–21:30</b>. Publikum je nejaktivnější a algoritmus preferuje Reels s tématem
              „backstage".
            </p>
            <button className="mt-3 w-full rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary">
              Naplánovat na 20:15
            </button>
          </div>
        </aside>

        {/* Main calendar */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-lg border border-border bg-surface p-1">
              {(["day", "week", "month"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    view === v ? "bg-background text-foreground shadow" : "text-muted-foreground"
                  }`}
                >
                  {v === "day" ? "Den" : v === "week" ? "Týden" : "Měsíc"}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              10.–16. března 2026 · <b className="text-foreground">6 naplánováno</b>
            </p>
          </div>

          {view === "week" ? <WeekGrid activePlatforms={activePlatforms} /> : null}
          {view === "month" ? <MonthGrid /> : null}
          {view === "day" ? <DayView /> : null}

          <HeatmapPanel />
        </div>
      </div>
    </AppShell>
  );
}

function MiniMonth({ monthIndex }: { monthIndex: number }) {
  const today = 24;
  const days = Array.from({ length: 35 }, (_, i) => i - 2); // start offset
  const withEvents = new Set([12, 16, 18, 22, 24, 27]);
  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted-foreground">
        {czechDays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (d < 1 || d > 31) return <div key={i} />;
          const active = d === today;
          const has = withEvents.has(d);
          return (
            <div
              key={i}
              className={`grid aspect-square place-items-center rounded text-[11px] ${
                active
                  ? "bg-primary font-semibold text-primary-foreground"
                  : has
                    ? "border border-primary/40"
                    : "text-muted-foreground hover:bg-surface"
              }`}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekGrid({ activePlatforms }: { activePlatforms: Set<PlatformKey> }) {
  const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 - 22:00
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] border-b border-border">
        <div />
        {czechDays.map((d, i) => (
          <div key={d} className="border-l border-border px-3 py-3 text-center">
            <p className="font-mono text-[10px] uppercase text-muted-foreground">{d}</p>
            <p className="font-display text-lg font-semibold">{10 + i}</p>
          </div>
        ))}
      </div>
      <div className="relative grid grid-cols-[60px_repeat(7,minmax(0,1fr))]">
        <div className="border-r border-border">
          {hours.map((h) => (
            <div key={h} className="h-16 border-b border-border/60 px-2 pt-1 text-right font-mono text-[10px] text-muted-foreground">
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>
        {czechDays.map((_, dayIdx) => (
          <div key={dayIdx} className="relative border-r border-border">
            {hours.map((h) => (
              <div
                key={h}
                className="h-16 border-b border-border/60 transition hover:bg-primary/5"
              />
            ))}
            {scheduledPosts
              .filter((s) => s.day === dayIdx && activePlatforms.has(s.platform))
              .map((s) => {
                const p = platforms[s.platform];
                const top = (s.hour - 8) * 64;
                return (
                  <div
                    key={s.id}
                    className="absolute left-1 right-1 cursor-grab rounded-md border border-border/60 p-2 text-[11px] shadow-lg backdrop-blur"
                    style={{ top, height: 60, background: `color-mix(in oklch, var(--platform-${p.short.toLowerCase()}), transparent 70%)` }}
                  >
                    <p className={`font-semibold ${p.color}`}>{p.short} · {s.hour}:00</p>
                    <p className="truncate text-foreground">{s.title}</p>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthGrid() {
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid grid-cols-7 border-b border-border">
        {czechDays.map((d) => (
          <div key={d} className="border-l border-border py-3 text-center text-[11px] font-semibold uppercase text-muted-foreground first:border-l-0">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5">
        {days.map((d, i) => (
          <div
            key={i}
            className="min-h-24 border-b border-l border-border p-2 first:border-l-0 hover:bg-surface"
          >
            {d >= 1 && d <= 31 ? (
              <>
                <p className={`text-xs font-semibold ${d === 24 ? "text-primary" : ""}`}>{d}</p>
                {[16, 18, 24, 22].includes(d) ? (
                  <div className="mt-1 space-y-1">
                    {scheduledPosts.slice(0, 1).map((s) => {
                      const p = platforms[s.platform];
                      return (
                        <div
                          key={s.id}
                          className={`truncate rounded px-1.5 py-0.5 text-[10px] ${p.dot} text-background`}
                        >
                          {s.hour}:00 {s.title}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayView() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="font-display text-xl">Úterý 24. března 2026</p>
      <div className="mt-4 space-y-2">
        {scheduledPosts.slice(0, 4).map((s) => {
          const p = platforms[s.platform];
          return (
            <div key={s.id} className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3">
              <div className="w-14 font-mono text-sm text-muted-foreground">{s.hour}:00</div>
              <div className={`grid size-8 shrink-0 place-items-center rounded ${p.dot} text-[10px] font-bold text-background`}>
                {p.short}
              </div>
              <p className="flex-1 truncate text-sm font-medium">{s.title}</p>
              <button className="text-xs text-primary">Upravit</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeatmapPanel() {
  const max = 1;
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <p className="font-display text-lg font-semibold">Heatmapa aktivity publika</p>
          <p className="text-xs text-muted-foreground">
            Kdy jsou tvoji sledující nejvíce online (7 dní × 24 hodin)
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          Nízká
          <div className="flex">
            {[0.15, 0.35, 0.55, 0.75, 0.95].map((v) => (
              <div key={v} className="size-4" style={{ background: `oklch(0.7 0.24 355 / ${v})` }} />
            ))}
          </div>
          Vysoká
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[40px_repeat(24,minmax(0,1fr))] gap-0.5 text-[9px] text-muted-foreground">
            <div />
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="text-center font-mono">{h % 3 === 0 ? h : ""}</div>
            ))}
          </div>
          {engagementHeatmap.map((row, d) => (
            <div key={d} className="mt-0.5 grid grid-cols-[40px_repeat(24,minmax(0,1fr))] gap-0.5">
              <div className="pr-2 text-right font-mono text-[10px] text-muted-foreground">
                {czechDays[d]}
              </div>
              {row.map((v, h) => (
                <div
                  key={h}
                  className="aspect-square rounded-sm"
                  style={{ background: `oklch(0.7 0.24 355 / ${(v / max) * 0.9 + 0.05})` }}
                  title={`${czechDays[d]} ${h}:00 · ${Math.round(v * 100)}%`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
