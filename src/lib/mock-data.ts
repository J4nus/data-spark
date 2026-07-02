export type PlatformKey =
  | "instagram"
  | "facebook"
  | "youtube"
  | "manual";

export const platforms: Record<
  PlatformKey,
  { name: string; short: string; color: string; dot: string }
> = {
  instagram: { name: "Instagram", short: "IG", color: "text-ig", dot: "bg-ig" },
  facebook: { name: "Facebook", short: "FB", color: "text-fb", dot: "bg-fb" },
  youtube: { name: "YouTube", short: "YT", color: "text-yt", dot: "bg-yt" },
  manual: { name: "Ruční zápisky", short: "NO", color: "text-neon-amber", dot: "bg-neon-amber" },
};

export const kpis = [
  { label: "Instagram sledující", value: "128,4k", delta: "+842", trend: "up" as const, platform: "instagram" },
  { label: "Facebook dosah", value: "42,1k", delta: "+8,2 %", trend: "up" as const, platform: "facebook" },
  { label: "YouTube zhlédnutí", value: "18,6k", delta: "+1 240", trend: "up" as const, platform: "youtube" },
  { label: "Ruční zápisky", value: "24", delta: "+5 tento týden", trend: "flat" as const, platform: "manual" },
];

export const feedPosts = [
  {
    id: "p1",
    platform: "instagram" as PlatformKey,
    author: "Můj profil",
    time: "před 2h",
    text: "🔥 Nová exkluzivní kolekce je online! Odkaz najdete nahoře.",
    likes: 1240,
    comments: 48,
    image: "aesthetic dark fashion portrait, neon accents",
  },
  {
    id: "p2",
    platform: "facebook" as PlatformKey,
    author: "Petra Nováková",
    time: "před 5h",
    text: "Konečně víkend! Kdo je s námi na Instameet v Praze?",
    likes: 84,
    comments: 12,
  },
  {
    id: "p3",
    platform: "youtube" as PlatformKey,
    author: "ContentHub Studio",
    time: "včera",
    text: "Nový vlog: jak připravujeme týdenní obsahový plán pro Meta a YouTube.",
    likes: 920,
    comments: 64,
  },
];

export const inboxMessages = [
  {
    id: "m1",
    platform: "instagram" as PlatformKey,
    from: "@tomas_creative",
    preview: "Můžeme domluvit collab na příští týden?",
    time: "14:20",
    unread: true,
  },
  {
    id: "m2",
    platform: "facebook" as PlatformKey,
    from: "Aleš M.",
    preview: "Dobrý den, poslal jsem vám zprávu na stránku...",
    time: "13:02",
    unread: true,
  },
  {
    id: "m3",
    platform: "instagram" as PlatformKey,
    from: "@lucie.k",
    preview: "Ahoj! Kdy vyjde další reels série?",
    time: "12:44",
    unread: false,
  },
  {
    id: "m4",
    platform: "youtube" as PlatformKey,
    from: "Komentář u videa",
    preview: "Můžeš udělat video o plánování obsahu?",
    time: "10:15",
    unread: true,
  },
  {
    id: "m5",
    platform: "manual" as PlatformKey,
    from: "Ruční zápis",
    preview: "Zapsat nápad na sérii: měsíční reporting kampaní.",
    time: "09:48",
    unread: false,
  },
];

export const rssItems = [
  { id: "r1", source: "Meta", title: "Připravit OAuth flow pro Instagram a Facebook přes Meta Graph API", time: "backend" },
  { id: "r2", source: "YouTube", title: "Připravit napojení YouTube účtu a základní synchronizaci kanálu", time: "backend" },
  { id: "r3", source: "Poznámky", title: "Ruční zápisky zůstávají bez externí integrace", time: "model" },
];

export const friends = [
  { id: "f1", name: "Sofia R.", handle: "@sofiar", online: true },
  { id: "f2", name: "Denis K.", handle: "@deniskay", online: true },
  { id: "f3", name: "Marta P.", handle: "@martap", online: false },
  { id: "f4", name: "Jakub V.", handle: "@jakubv", online: false },
  { id: "f5", name: "Elena T.", handle: "@elenat", online: true },
];

export const scheduledPosts = [
  { id: "s1", title: "Reels – Tokyo Night Walk pt. 2", platform: "instagram" as PlatformKey, day: 4, hour: 19 },
  { id: "s2", title: "Facebook Live Q&A", platform: "facebook" as PlatformKey, day: 2, hour: 20 },
  { id: "s3", title: "Ruční zápis: nápady na kampaň", platform: "manual" as PlatformKey, day: 3, hour: 11 },
  { id: "s4", title: "YouTube Shorts: BTS", platform: "youtube" as PlatformKey, day: 5, hour: 18 },
  { id: "s5", title: "YT Vlog: Studio tour", platform: "youtube" as PlatformKey, day: 6, hour: 15 },
  { id: "s6", title: "Facebook Live Q&A", platform: "facebook" as PlatformKey, day: 2, hour: 20 },
];

// Heatmap: 7 dní × 24 hodin (0-1 intenzita)
export const engagementHeatmap: number[][] = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => {
    const primetime = (h >= 18 && h <= 22) ? 0.7 : (h >= 11 && h <= 14) ? 0.4 : 0.1;
    const weekendBoost = d >= 5 ? 0.2 : 0;
    const jitter = Math.sin(d * 17 + h * 3) * 0.15 + 0.15;
    return Math.min(1, primetime + weekendBoost + jitter);
  }),
);

export const czechDays = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];
export const czechMonths = [
  "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
  "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec",
];
