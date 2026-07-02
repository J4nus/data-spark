import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { platforms, type PlatformKey } from "@/lib/mock-data";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

export const Route = createFileRoute("/design-system")({
  head: () => ({ meta: [{ title: "Design System – ContentHub" }] }),
  component: DesignSystemPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-10 first:border-t-0">
      <h2 className="mb-1 font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Swatch({ name, cssVar, label }: { name: string; cssVar: string; label?: string }) {
  return (
    <div>
      <div
        className="h-20 rounded-lg border border-border"
        style={{ background: `var(${cssVar})` }}
      />
      <p className="mt-2 text-xs font-semibold">{name}</p>
      <p className="font-mono text-[10px] text-muted-foreground">{label ?? cssVar}</p>
    </div>
  );
}

function DesignSystemPage() {
  return (
    <AppShell title="Design System" subtitle="Živá knihovna komponent – všechny tokeny na jednom místě">
      <div className="mx-auto max-w-5xl px-8 py-8">
        {/* Toc */}
        <nav className="mb-8 flex flex-wrap gap-2 text-[11px]">
          {["Barvy", "Typografie", "Platform tokens", "Tlačítka", "Vstupy", "Odznaky", "Karty", "Alerts", "Tabulka", "Ikony"].map(
            (n) => (
              <a
                key={n}
                href={`#${n}`}
                className="rounded-full border border-border bg-surface px-3 py-1 hover:border-primary hover:text-primary"
              >
                {n}
              </a>
            ),
          )}
        </nav>

        <Section title="Barvy">
          <p className="mb-4 text-xs text-muted-foreground">Sémantické tokeny (oklch, dark theme).</p>
          <div className="grid grid-cols-6 gap-4">
            <Swatch name="Primary" cssVar="--primary" />
            <Swatch name="Background" cssVar="--background" />
            <Swatch name="Surface" cssVar="--surface" />
            <Swatch name="Surface 2" cssVar="--surface-2" />
            <Swatch name="Muted" cssVar="--muted" />
            <Swatch name="Border" cssVar="--border" />
            <Swatch name="Neon Pink" cssVar="--neon-pink" />
            <Swatch name="Neon Blue" cssVar="--neon-blue" />
            <Swatch name="Neon Green" cssVar="--neon-green" />
            <Swatch name="Neon Amber" cssVar="--neon-amber" />
            <Swatch name="Neon Violet" cssVar="--neon-violet" />
            <Swatch name="Destructive" cssVar="--destructive" />
          </div>
        </Section>

        <Section title="Typografie">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Display · Space Grotesk 600</p>
              <p className="font-display text-5xl font-semibold tracking-tight">Nástěnka tvůrce</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">H2</p>
              <p className="font-display text-3xl font-semibold">Plánovač publikací</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Body · Inter</p>
              <p className="max-w-prose text-sm leading-relaxed">
                Sjednocená schránka spojuje zprávy z Instagramu, Facebooku a YouTube.
                Ruční poznámky ukládají kontext bez externí integrace.
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Mono · JetBrains Mono</p>
              <p className="font-mono text-sm">2026-03-24 21:00 · IG_REEL_0421</p>
            </div>
          </div>
        </Section>

        <Section title="Platform tokens">
          <div className="grid grid-cols-4 gap-3">
            {(Object.keys(platforms) as PlatformKey[]).map((k) => {
              const p = platforms[k];
              return (
                <div key={k} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                  <div className={`grid size-10 place-items-center rounded-lg ${p.dot} font-bold text-background`}>
                    {p.short}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">--platform-{p.short.toLowerCase()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Tlačítka">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-6">
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Primární akce</button>
            <button className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold">Sekundární</button>
            <button className="rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">Outline primary</button>
            <button className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Ghost</button>
            <button className="rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">Smazat</button>
            <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Small</button>
          </div>
        </Section>

        <Section title="Vstupy">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6">
            <input
              type="text"
              placeholder="E-mail"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            />
            <input
              type="text"
              placeholder="Heslo"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            />
            <textarea
              placeholder="Text příspěvku…"
              className="col-span-2 h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option>Instagram</option>
              <option>Facebook</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="size-4 accent-primary" defaultChecked /> Publikovat rovnou
            </label>
          </div>
        </Section>

        <Section title="Odznaky (badges)">
          <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-6">
            <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase text-primary">Draft</span>
            <span className="rounded-full bg-neon-green/15 px-2.5 py-1 text-[10px] font-bold uppercase text-neon-green">Publikováno</span>
            <span className="rounded-full bg-neon-blue/15 px-2.5 py-1 text-[10px] font-bold uppercase text-neon-blue">Naplánováno</span>
            <span className="rounded-full bg-neon-amber/15 px-2.5 py-1 text-[10px] font-bold uppercase text-neon-amber">Čeká</span>
            <span className="rounded-full bg-destructive/15 px-2.5 py-1 text-[10px] font-bold uppercase text-destructive">Chyba</span>
          </div>
        </Section>

        <Section title="Karty">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">KPI</p>
              <p className="mt-2 font-display text-3xl font-semibold">128,4k</p>
              <p className="mt-1 text-[11px] text-neon-green">+842</p>
            </div>
            <div className="rounded-2xl border border-primary/50 bg-gradient-to-br from-primary/10 to-neon-violet/10 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Featured</p>
              <p className="mt-2 font-display text-lg">Meta + YouTube model</p>
              <p className="mt-2 text-xs text-muted-foreground">Základ pro účty, média, příspěvky a ruční poznámky.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
              <div className="mx-auto grid size-10 place-items-center rounded-full border border-border">+</div>
              <p className="mt-2">Přidat dlaždici</p>
            </div>
          </div>
        </Section>

        <Section title="Alerts">
          <div className="space-y-3">
            {[
              { i: CheckCircle2, c: "text-neon-green", bg: "bg-neon-green/10 border-neon-green/30", t: "Účet Instagram byl úspěšně propojen." },
              { i: Info, c: "text-neon-blue", bg: "bg-neon-blue/10 border-neon-blue/30", t: "YouTube účet čeká na OAuth propojení." },
              { i: AlertTriangle, c: "text-neon-amber", bg: "bg-neon-amber/10 border-neon-amber/30", t: "Meta token vyprší za 3 dny – obnov jej v Platformách." },
              { i: XCircle, c: "text-destructive", bg: "bg-destructive/10 border-destructive/30", t: "Publikace na Facebook se nezdařila (rate limit)." },
            ].map((a, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 ${a.bg}`}>
                <a.i className={`mt-0.5 size-4 shrink-0 ${a.c}`} />
                <p className="text-sm">{a.t}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Tabulka">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-surface text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-4 py-3 text-left">Post</th><th className="px-4 py-3 text-left">Platforma</th><th className="px-4 py-3 text-left">Stav</th><th className="px-4 py-3 text-right">Dosah</th></tr>
              </thead>
              <tbody>
                {[
                  { t: "Tokyo Night Walk pt. 2", p: "instagram", s: "Publikováno", r: "42k" },
                  { t: "Studio Tour", p: "youtube", s: "Naplánováno", r: "—" },
                  { t: "Poznámky ke kampani", p: "manual", s: "Draft", r: "—" },
                ].map((r, i) => {
                  const p = platforms[r.p as PlatformKey];
                  return (
                    <tr key={i} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-3 font-medium">{r.t}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5`}>
                          <span className={`size-2 rounded-full ${p.dot}`} /> {p.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{r.s}</td>
                      <td className="px-4 py-3 text-right font-mono">{r.r}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
