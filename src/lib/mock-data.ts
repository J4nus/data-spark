export type PlatformKey =
  | "instagram"
  | "facebook"
  | "onlyfans"
  | "tiktok"
  | "youtube"
  | "x"
  | "mail"
  | "rss";

export const platforms: Record<
  PlatformKey,
  { name: string; short: string; color: string; dot: string }
> = {
  instagram: { name: "Instagram", short: "IG", color: "text-ig", dot: "bg-ig" },
  facebook: { name: "Facebook", short: "FB", color: "text-fb", dot: "bg-fb" },
  onlyfans: { name: "OnlyFans", short: "OF", color: "text-of", dot: "bg-of" },
  tiktok: { name: "TikTok", short: "TT", color: "text-tt", dot: "bg-tt" },
  youtube: { name: "YouTube", short: "YT", color: "text-yt", dot: "bg-yt" },
  x: { name: "X (Twitter)", short: "X", color: "text-x", dot: "bg-x" },
  mail: { name: "E-mail", short: "@", color: "text-mail", dot: "bg-mail" },
  rss: { name: "RSS", short: "RSS", color: "text-rss", dot: "bg-rss" },
};

export const kpis = [
  { label: "OnlyFans tržby", value: "$14 250", delta: "+12,4 %", trend: "up" as const, platform: "onlyfans" },
  { label: "Instagram sledující", value: "128,4k", delta: "+842", trend: "up" as const, platform: "instagram" },
  { label: "AI odpovědi (24h)", value: "1 420", delta: "+18 %", trend: "up" as const, platform: "mail" },
  { label: "Aktivní sítě", value: "6 / 8", delta: "2 čekají", trend: "flat" as const, platform: "x" },
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
    platform: "tiktok" as PlatformKey,
    author: "@klara_dvorak",
    time: "včera",
    text: "Zákulisí focení – rychlá sestřih • 47k zhlédnutí",
    likes: 3200,
    comments: 210,
  },
];

export const inboxMessages = [
  {
    id: "m1",
    platform: "onlyfans" as PlatformKey,
    from: "Tomas_99",
    preview: "Díky za ten poslední set, byl neuvěřitelný...",
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
    aiResolved: true,
  },
  {
    id: "m3",
    platform: "instagram" as PlatformKey,
    from: "@lucie.k",
    preview: "Ahoj! Kdy bude další stream? 💕",
    time: "12:44",
    unread: false,
  },
  {
    id: "m4",
    platform: "mail" as PlatformKey,
    from: "management@studio.cz",
    preview: "Smlouva na březnovou kampaň – k podpisu",
    time: "10:15",
    unread: true,
  },
  {
    id: "m5",
    platform: "x" as PlatformKey,
    from: "@brand_official",
    preview: "Zaslali jsme vám návrh spolupráce, mrkněte na DM.",
    time: "09:48",
    unread: false,
  },
];

export const rssItems = [
  { id: "r1", source: "Social Media Today", title: "Nové algoritmy na TikToku upřednostňují delší formát", time: "před 1h" },
  { id: "r2", source: "TechCrunch", title: "OnlyFans mění platební podmínky pro tvůrce v EU", time: "před 3h" },
  { id: "r3", source: "The Verge", title: "Instagram testuje AI filtry pro Reels", time: "dnes" },
  { id: "r4", source: "Marketing Land", title: "X spouští video balíčky pro Premium účty", time: "včera" },
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
  { id: "s2", title: "Thread: Budoucnost AI ve vizuálu", platform: "x" as PlatformKey, day: 1, hour: 10 },
  { id: "s3", title: "Exclusive drop", platform: "onlyfans" as PlatformKey, day: 3, hour: 21 },
  { id: "s4", title: "TikTok BTS", platform: "tiktok" as PlatformKey, day: 5, hour: 18 },
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
