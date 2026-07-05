import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, StickyNote, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { inboxMessages, platforms, type PlatformKey } from "@/lib/mock-data";

export const Route = createFileRoute("/zpravy")({
  head: () => ({ meta: [{ title: "Zprávy – ContentHub" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const [selected, setSelected] = useState(inboxMessages[0].id);
  const active = inboxMessages.find((m) => m.id === selected) ?? inboxMessages[0];
  const p = platforms[active.platform];

  return (
    <AppShell title="Sjednocená schránka" subtitle="Všechny zprávy ze všech platforem na jednom místě">
      <div className="grid h-[calc(100vh-4rem)] grid-cols-[320px_minmax(0,1fr)_360px]">
        {/* List */}
        <div className="flex flex-col border-r border-border">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Hledat konverzaci…"
                className="h-9 w-full rounded-lg border border-input bg-surface pl-9 pr-3 text-sm"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {(Object.keys(platforms) as PlatformKey[]).slice(0, 6).map((k) => (
                <button
                  key={k}
                  className={`grid size-7 place-items-center rounded ${platforms[k].dot} text-[9px] font-bold text-background`}
                >
                  {platforms[k].short}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {inboxMessages.map((m) => {
              const mp = platforms[m.platform];
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={`flex w-full items-center gap-3 border-b border-border/60 p-3 text-left transition ${
                    selected === m.id ? "bg-primary/10" : "hover:bg-surface"
                  }`}
                >
                  <div className={`grid size-9 shrink-0 place-items-center rounded-lg ${mp.dot} text-[10px] font-bold text-background`}>
                    {mp.short}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{m.from}</p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{m.time}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{m.preview}</p>
                  </div>
                  {m.unread ? <span className="size-2 shrink-0 rounded-full bg-primary" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <div className={`grid size-10 place-items-center rounded-full ${p.dot} text-xs font-bold text-background`}>
              {p.short}
            </div>
            <div>
              <p className="font-display text-lg font-semibold">{active.from}</p>
              <p className="text-[11px] text-muted-foreground">{p.name}</p>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            <div className="flex justify-start">
              <div className="max-w-md rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-sm">
                „{active.preview}“
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-md rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                Ahoj! Díky za zprávu, dnes ve 21:00 posílám novinku 💕
              </div>
            </div>
          </div>
          <div className="border-t border-border p-4">
            <div className="flex items-end gap-2 rounded-2xl border border-input bg-surface p-2">
              <textarea
                placeholder="Napsat odpověď…"
                className="min-h-10 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none"
              />
              <button className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Notes panel */}
        <aside className="flex flex-col border-l border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <StickyNote className="size-4 text-neon-amber" />
            <p className="font-display text-sm font-semibold">Ruční poznámky</p>
          </div>
          <p className="text-xs text-muted-foreground">Rychlé poznámky ke konverzaci a budoucím příspěvkům:</p>
          <div className="mt-4 space-y-2">
            {[
              "Ověřit, jestli z toho vznikne Instagram collab.",
              "Přidat téma do YouTube backlogu.",
              "Navázat Facebook postem po publikaci reels.",
            ].map((t, i) => (
              <button key={i} className="w-full rounded-lg border border-border bg-background p-3 text-left text-xs leading-snug hover:border-primary">
                {t}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-border bg-background p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Kontext
            </p>
            <p className="mt-2 text-xs">Meta + YouTube · manuální zápisky</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              AI návrhy odpovědí přijdou až v pozdější fázi.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
