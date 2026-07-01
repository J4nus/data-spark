import { useState } from "react";
import {
  Bell,
  StickyNote,
  Timer,
  Rss,
  Mail,
  Users,
  Image as ImageIcon,
  Grip,
  Settings2,
  X,
  TrendingUp,
  Heart,
  MessageCircle,
  Calendar as CalendarIcon,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import {
  feedPosts,
  friends,
  inboxMessages,
  kpis,
  platforms,
  rssItems,
  scheduledPosts,
  type PlatformKey,
} from "@/lib/mock-data";

/**
 * Widget system pro nástěnku.
 * Každý widget má rozměry v jednotkách gridu (col × row).
 * Uživatel může v edit módu měnit velikost, pozici a konfiguraci zdroje.
 */

export type WidgetSize = "1x1" | "2x1" | "2x2" | "3x2" | "4x2" | "2x3" | "4x1";

export type WidgetKind =
  | "kpi"
  | "platform-feed"
  | "friends-photos"
  | "friend-feed"
  | "inbox"
  | "unified-inbox"
  | "rss"
  | "mail-preview"
  | "sticky-note"
  | "countdown"
  | "calendar-mini"
  | "ai-queue"
  | "media-pool"
  | "engagement";

export type WidgetConfig = {
  id: string;
  kind: WidgetKind;
  size: WidgetSize;
  title?: string;
  platform?: PlatformKey;
  source?: string; // ID přítele / stránky / RSS / mailboxu
  note?: string;
  color?: string;
  countdownTo?: string;
};

const sizeClass: Record<WidgetSize, string> = {
  "1x1": "col-span-3 row-span-1",
  "2x1": "col-span-6 row-span-1",
  "4x1": "col-span-12 row-span-1",
  "2x2": "col-span-6 row-span-2",
  "3x2": "col-span-9 row-span-2",
  "4x2": "col-span-12 row-span-2",
  "2x3": "col-span-6 row-span-3",
};

export function WidgetChrome({
  children,
  size,
  editMode,
  onRemove,
  onConfigure,
  accent,
  className = "",
}: {
  children: React.ReactNode;
  size: WidgetSize;
  editMode: boolean;
  onRemove?: () => void;
  onConfigure?: () => void;
  accent?: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition ${
        editMode ? "cursor-grab ring-1 ring-primary/30 hover:ring-primary/60" : ""
      } ${sizeClass[size]} ${className}`}
      style={accent ? { boxShadow: `inset 0 1px 0 0 ${accent}` } : undefined}
    >
      {editMode ? (
        <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={onConfigure}
            className="grid size-6 place-items-center rounded-md bg-background/80 text-muted-foreground backdrop-blur hover:text-foreground"
          >
            <Settings2 className="size-3" />
          </button>
          <button
            onClick={onRemove}
            className="grid size-6 place-items-center rounded-md bg-background/80 text-muted-foreground backdrop-blur hover:text-destructive"
          >
            <X className="size-3" />
          </button>
          <div className="grid size-6 place-items-center rounded-md bg-background/80 text-muted-foreground backdrop-blur">
            <Grip className="size-3" />
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
}

function WidgetHeader({
  icon,
  title,
  meta,
  accent,
}: {
  icon?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        {icon}
        <span className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      {meta ? <div className="shrink-0 text-[10px] text-muted-foreground">{meta}</div> : null}
      {accent ? <div className="absolute inset-x-0 top-0 h-px" style={{ background: accent }} /> : null}
    </div>
  );
}

/* -------- Widgets -------- */

function KpiWidget({ index }: { index: number }) {
  const k = kpis[index % kpis.length];
  const p = platforms[k.platform as PlatformKey];
  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {k.label}
        </span>
        <span className={`size-2 rounded-full ${p.dot}`} />
      </div>
      <div className="mt-4">
        <p className="font-display text-3xl font-semibold tracking-tight">{k.value}</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-neon-green">
          <TrendingUp className="size-3" /> {k.delta}
        </p>
      </div>
    </div>
  );
}

function PlatformFeedWidget({ platform }: { platform: PlatformKey }) {
  const p = platforms[platform];
  const post = feedPosts.find((f) => f.platform === platform) ?? feedPosts[0];
  return (
    <>
      <WidgetHeader
        icon={<span className={`grid size-5 place-items-center rounded ${p.dot} text-[9px] font-bold text-background`}>{p.short}</span>}
        title={`${p.name} feed`}
        meta={<select className="bg-transparent text-[10px] text-muted-foreground focus:outline-none">
          <option>Můj Facebook Wall (Vlastní příspěvky)</option>
          <option>Feed přátel</option>
          <option>Stránka: STARNET</option>
        </select>}
      />
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        <div className="rounded-lg border border-border/60 bg-surface p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className={`text-xs font-semibold ${p.color}`}>{post.author}</span>
            <span className="text-[10px] text-muted-foreground">({post.time})</span>
          </div>
          <p className="text-sm leading-snug text-pretty">{post.text}</p>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Heart className="size-3" /> {post.likes.toLocaleString("cs-CZ")} Likes</span>
            <span className="flex items-center gap-1"><MessageCircle className="size-3" /> {post.comments} Komentářů</span>
          </div>
        </div>
      </div>
    </>
  );
}

function FriendsPhotosWidget() {
  return (
    <>
      <WidgetHeader
        icon={<ImageIcon className="size-4 text-neon-violet" />}
        title="Nejnovější fotky přátel"
        meta="24 nových"
      />
      <div className="grid flex-1 grid-cols-3 gap-1 p-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-md bg-gradient-to-br from-surface-2 to-surface"
          >
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background: `linear-gradient(135deg, oklch(0.5 0.2 ${(i * 40) % 360}), oklch(0.3 0.15 ${(i * 60) % 360}))`,
              }}
            />
            <span className="absolute bottom-1 left-1 text-[9px] font-medium text-white/90">
              @{["sofiar", "deniskay", "elenat", "martap"][i % 4]}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function FriendFeedWidget({ friendId }: { friendId?: string }) {
  const friend = friends.find((f) => f.id === friendId) ?? friends[0];
  return (
    <>
      <WidgetHeader
        icon={<Users className="size-4 text-neon-blue" />}
        title={`Feed: ${friend.name}`}
        meta={friend.handle}
      />
      <div className="flex-1 space-y-2 p-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-neon-blue to-neon-violet" />
            <div className="min-w-0 flex-1">
              <p className="text-xs">
                <span className="font-semibold">{friend.name}</span>
                <span className="ml-2 text-muted-foreground">{["dnes", "včera", "před 2 dny"][i]}</span>
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {["Právě jsem přidal(a) nové fotky…", "Sledujte dnešní live!", "Díky za super víkend."][i]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function InboxWidget({ platform }: { platform: PlatformKey }) {
  const p = platforms[platform];
  const messages = inboxMessages.filter((m) => m.platform === platform);
  return (
    <>
      <WidgetHeader
        icon={<span className={`grid size-5 place-items-center rounded ${p.dot} text-[9px] font-bold text-background`}>{p.short}</span>}
        title={`Náhled schránky – ${p.name}`}
        meta={<button className="text-[10px] text-primary">Otevřít</button>}
      />
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {(messages.length ? messages : inboxMessages.slice(0, 3)).map((m) => (
          <div key={m.id} className="flex items-start gap-3 rounded-lg p-3 hover:bg-surface">
            <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-surface-2 to-surface" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-semibold">{m.from}</p>
                <span className="shrink-0 text-[10px] text-muted-foreground">{m.time}</span>
              </div>
              <p className="truncate text-[11px] text-muted-foreground">„{m.preview}“</p>
            </div>
            {m.aiResolved ? (
              <span className="shrink-0 rounded-full bg-neon-green/15 px-2 py-0.5 text-[9px] font-bold uppercase text-neon-green">
                Vyřešeno AI
              </span>
            ) : m.unread ? (
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

function UnifiedInboxWidget() {
  return (
    <>
      <WidgetHeader
        icon={<Mail className="size-4 text-neon-amber" />}
        title="Sjednocená schránka"
        meta="všechny platformy"
      />
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {inboxMessages.map((m) => {
          const p = platforms[m.platform];
          return (
            <div key={m.id} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-surface">
              <div className={`grid size-8 shrink-0 place-items-center rounded-lg ${p.dot} text-[10px] font-bold text-background`}>
                {p.short}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-semibold">{m.from}</p>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{m.time}</span>
                </div>
                <p className="truncate text-[11px] text-muted-foreground">{m.preview}</p>
              </div>
              {m.unread ? <span className="size-2 shrink-0 rounded-full bg-primary" /> : null}
            </div>
          );
        })}
      </div>
    </>
  );
}

function RssWidget() {
  return (
    <>
      <WidgetHeader
        icon={<Rss className="size-4 text-neon-amber" />}
        title="Trendy & zprávy"
        meta={`${rssItems.length} nových`}
      />
      <ul className="flex-1 divide-y divide-border/60 overflow-y-auto">
        {rssItems.map((r) => (
          <li key={r.id} className="cursor-pointer px-4 py-3 hover:bg-surface">
            <p className="text-xs font-medium leading-snug text-pretty">{r.title}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {r.source} · {r.time}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

function StickyNoteWidget({ text }: { text?: string }) {
  return (
    <div
      className="flex h-full flex-col justify-between p-5"
      style={{ background: "linear-gradient(135deg, oklch(0.35 0.14 60), oklch(0.25 0.1 40))" }}
    >
      <StickyNote className="size-4 text-neon-amber" />
      <p className="font-display text-lg leading-tight text-pretty">
        {text ?? "Nezapomenout: v pátek 18:00 poslat teaser na X před drop na OnlyFans."}
      </p>
      <p className="text-[10px] uppercase tracking-widest text-neon-amber/70">Poznámka</p>
    </div>
  );
}

function CountdownWidget({ label = "Příští drop", value = "02d : 14h : 05m" }) {
  return (
    <div className="relative flex h-full items-center gap-4 overflow-hidden bg-gradient-to-br from-primary/20 to-neon-violet/20 p-5">
      <div className="absolute inset-0 bg-grid-faint opacity-40" />
      <div className="relative grid size-12 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/10">
        <Timer className="size-5 text-primary" />
      </div>
      <div className="relative min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 font-display text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-[10px] text-muted-foreground">Notifikace ve všech aktivních sítích.</p>
      </div>
    </div>
  );
}

function CalendarMiniWidget() {
  const today = 24;
  const daysWithEvents = new Set([16, 18, 22, 24, 27]);
  return (
    <>
      <WidgetHeader
        icon={<CalendarIcon className="size-4 text-neon-blue" />}
        title="Plánovač"
        meta="Březen 2026"
      />
      <div className="flex-1 p-4">
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-muted-foreground">
          {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => {
            const active = d === today;
            const hasEvent = daysWithEvents.has(d);
            return (
              <div
                key={d}
                className={`grid aspect-square place-items-center rounded-md text-xs ${
                  active
                    ? "bg-primary font-semibold text-primary-foreground"
                    : hasEvent
                      ? "border border-primary/40 text-foreground"
                      : "text-muted-foreground hover:bg-surface"
                }`}
              >
                {d}
              </div>
            );
          })}
        </div>
        <div className="mt-4 space-y-2 border-t border-border/60 pt-3">
          {scheduledPosts.slice(0, 2).map((s) => {
            const p = platforms[s.platform];
            return (
              <div key={s.id} className="flex items-center gap-2 text-[11px]">
                <span className={`size-1.5 rounded-full ${p.dot}`} />
                <span className="font-mono text-muted-foreground">{s.hour}:00</span>
                <span className="truncate">{s.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function AiQueueWidget() {
  return (
    <>
      <WidgetHeader
        icon={<Sparkles className="size-4 text-neon-violet" />}
        title="AI fronta odpovědí"
        meta={<span className="flex items-center gap-1 text-neon-green"><span className="size-1.5 animate-pulse rounded-full bg-neon-green" /> aktivní</span>}
      />
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {[
          { from: "Martin K. (OF)", text: "Ahoj, bude dneska ten slibovaný set?", suggestion: "Ahoj Martine! Ano, dnes ve 21:00 posílám novinku, díky za trpělivost 💕" },
          { from: "Alex (IG DM)", text: "Máš super fotky!", suggestion: "Moc díky za podporu, Alexi! 🖤" },
        ].map((q, i) => (
          <div key={i} className="rounded-lg border border-border/60 bg-surface p-3">
            <p className="text-[11px] font-semibold text-muted-foreground">Zpráva od: {q.from}</p>
            <p className="mt-1 text-xs italic text-muted-foreground">„{q.text}“</p>
            <p className="mt-2 rounded-md bg-neon-violet/10 p-2 text-xs leading-snug text-pretty">
              {q.suggestion}
            </p>
            <div className="mt-2 flex gap-2">
              <button className="rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
                Schválit
              </button>
              <button className="rounded-md border border-border px-2.5 py-1 text-[10px]">Upravit</button>
              <button className="ml-auto text-[10px] text-muted-foreground hover:text-destructive">
                Zamítnout
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function EngagementWidget() {
  return (
    <>
      <WidgetHeader
        icon={<TrendingUp className="size-4 text-neon-green" />}
        title="Engagement (7 dní)"
        meta="Všechny platformy"
      />
      <div className="flex flex-1 items-end gap-1 p-4">
        {Array.from({ length: 28 }).map((_, i) => {
          const h = 20 + Math.sin(i * 0.6) * 20 + Math.random() * 30;
          return (
            <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary" style={{ height: `${h}%` }} />
          );
        })}
      </div>
    </>
  );
}

/* -------- Registry & default layout -------- */

export const widgetCatalog: {
  kind: WidgetKind;
  label: string;
  desc: string;
  defaultSize: WidgetSize;
  icon: typeof Bell;
}[] = [
  { kind: "kpi", label: "KPI karta", desc: "Klíčové číslo z libovolné platformy", defaultSize: "1x1", icon: TrendingUp },
  { kind: "platform-feed", label: "Feed platformy", desc: "Zeď / vlastní příspěvky / stránka", defaultSize: "2x2", icon: ImageIcon },
  { kind: "friends-photos", label: "Fotky přátel", desc: "Mřížka nejnovějších fotek", defaultSize: "2x2", icon: Users },
  { kind: "friend-feed", label: "Feed konkrétního přítele", desc: "Aktivita jednoho profilu", defaultSize: "2x1", icon: Users },
  { kind: "inbox", label: "Schránka platformy", desc: "Náhled DM z jedné sítě", defaultSize: "2x2", icon: Mail },
  { kind: "unified-inbox", label: "Sjednocená schránka", desc: "Všechny platformy dohromady", defaultSize: "2x2", icon: Mail },
  { kind: "rss", label: "RSS feed", desc: "Externí web / blog", defaultSize: "2x1", icon: Rss },
  { kind: "mail-preview", label: "Náhled e-mailu", desc: "IMAP schránka", defaultSize: "2x2", icon: Mail },
  { kind: "sticky-note", label: "Poznámka", desc: "Volný text", defaultSize: "1x1", icon: StickyNote },
  { kind: "countdown", label: "Odpočet", desc: "Countdown s notifikací", defaultSize: "2x1", icon: Timer },
  { kind: "calendar-mini", label: "Mini kalendář", desc: "Přehled plánovaných postů", defaultSize: "2x3", icon: CalendarIcon },
  { kind: "ai-queue", label: "AI fronta", desc: "Návrhy odpovědí k schválení", defaultSize: "2x2", icon: Sparkles },
  { kind: "media-pool", label: "Media Pool", desc: "Náhled knihovny mediálních souborů", defaultSize: "2x1", icon: ImageIcon },
  { kind: "engagement", label: "Engagement graf", desc: "Dosah / lajky v čase", defaultSize: "2x1", icon: TrendingUp },
];

export const defaultLayout: WidgetConfig[] = [
  { id: "w1", kind: "kpi", size: "1x1" },
  { id: "w2", kind: "kpi", size: "1x1" },
  { id: "w3", kind: "kpi", size: "1x1" },
  { id: "w4", kind: "kpi", size: "1x1" },
  { id: "w5", kind: "platform-feed", size: "2x2", platform: "facebook" },
  { id: "w6", kind: "inbox", size: "2x2", platform: "facebook" },
  { id: "w7", kind: "ai-queue", size: "2x2" },
  { id: "w8", kind: "friends-photos", size: "2x2" },
  { id: "w9", kind: "sticky-note", size: "1x1" },
  { id: "w10", kind: "countdown", size: "2x1" },
  { id: "w11", kind: "rss", size: "2x1" },
  { id: "w12", kind: "calendar-mini", size: "2x3" },
  { id: "w13", kind: "unified-inbox", size: "2x2" },
  { id: "w14", kind: "engagement", size: "4x1" },
];

/* -------- Renderer -------- */

export function WidgetRenderer({
  config,
  editMode,
  onRemove,
  onConfigure,
}: {
  config: WidgetConfig;
  editMode: boolean;
  onRemove: () => void;
  onConfigure: () => void;
}) {
  const chrome = (children: React.ReactNode, accent?: string) => (
    <WidgetChrome size={config.size} editMode={editMode} onRemove={onRemove} onConfigure={onConfigure} accent={accent}>
      {children}
    </WidgetChrome>
  );

  switch (config.kind) {
    case "kpi": {
      const idx = parseInt(config.id.replace(/\D/g, "")) || 0;
      return chrome(<KpiWidget index={idx} />);
    }
    case "platform-feed":
      return chrome(<PlatformFeedWidget platform={config.platform ?? "instagram"} />);
    case "friends-photos":
      return chrome(<FriendsPhotosWidget />);
    case "friend-feed":
      return chrome(<FriendFeedWidget friendId={config.source} />);
    case "inbox":
      return chrome(<InboxWidget platform={config.platform ?? "onlyfans"} />);
    case "unified-inbox":
      return chrome(<UnifiedInboxWidget />);
    case "rss":
      return chrome(<RssWidget />);
    case "mail-preview":
      return chrome(<InboxWidget platform="mail" />);
    case "sticky-note":
      return chrome(<StickyNoteWidget text={config.note} />);
    case "countdown":
      return chrome(<CountdownWidget />);
    case "calendar-mini":
      return chrome(<CalendarMiniWidget />);
    case "ai-queue":
      return chrome(<AiQueueWidget />);
    case "media-pool":
      return chrome(<FriendsPhotosWidget />);
    case "engagement":
      return chrome(<EngagementWidget />);
    default:
      return chrome(<div className="p-4 text-xs text-muted-foreground">Neznámý widget</div>);
  }
}
