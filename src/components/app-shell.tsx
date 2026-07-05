import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquare,
  Images,
  CalendarClock,
  Plug,
  KeyRound,
  Palette,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const nav = [
  { to: "/", label: "Nástěnka", icon: LayoutDashboard },
  { to: "/zpravy", label: "Zprávy", icon: MessageSquare, badge: 12 },
  { to: "/media", label: "Media Pool", icon: Images },
  { to: "/planovac", label: "Plánovač", icon: CalendarClock },
  { to: "/platformy", label: "Platformy", icon: Plug },
  { to: "/api-klice", label: "API klíče", icon: KeyRound },
  { to: "/design-system", label: "Design System", icon: Palette },
] as const;

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Odhlášeno");
    await navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-neon-violet font-display text-lg font-bold text-primary-foreground shadow-glow-pink">
            C
          </div>
          <div className="min-w-0">
            <p className="font-display text-base font-semibold leading-tight">ContentHub</p>
            <p className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">
              Studio Suite
            </p>
          </div>
          <button className="ml-auto grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
            <Bell className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_var(--neon-pink)]"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {"badge" in item && item.badge ? (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <div className="rounded-xl border border-sidebar-border bg-surface-2/60 p-3">
            <div className="flex items-center gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-neon-violet font-display text-xs font-bold text-primary-foreground">
                EM
              </div>
              <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Content Studio</p>
                <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-neon-green" />
                  Backend připraven
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-8 backdrop-blur">
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            {subtitle ? (
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Hledat obsah, zprávy, fotky…"
              className="h-9 w-72 rounded-lg border border-input bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <button className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground">
            <Bell className="size-4" />
          </button>
          {actions}
        </header>

        <main className="flex-1 bg-grid-faint">{children}</main>
      </div>
    </div>
  );
}
