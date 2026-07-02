import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Přihlášení – ContentHub" },
      { name: "description", content: "Přihlášení do ContentHubu přes e-mail nebo Google." },
    ],
  }),
  component: AuthPage,
});

type AuthMode = "signin" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;
    void import("@/integrations/supabase/client").then(async ({ supabase }) => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setCheckingSession(false);
      if (data.session) void navigate({ to: "/" });
    });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function submitEmailAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const { supabase } = await import("@/integrations/supabase/client");
    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin },
          });

    setLoading(false);
    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      toast.success("Účet je vytvořený. Zkontroluj e-mail pro potvrzení.");
      return;
    }

    toast.success("Přihlášení proběhlo úspěšně");
    await navigate({ to: "/" });
  }

  async function signInWithGoogle() {
    setLoading(true);
    const { lovable } = await import("@/integrations/lovable/index");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    if (!result.redirected) {
      toast.success("Přihlášení přes Google proběhlo úspěšně");
      await navigate({ to: "/" });
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-6">
          <p className="font-display text-2xl font-semibold">ContentHub</p>
          <h1 className="mt-2 font-display text-xl font-semibold">
            {mode === "signin" ? "Přihlášení" : "Vytvořit účet"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Backend, profily a data jsou chráněné přes Lovable Cloud.
          </p>
        </div>

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading || checkingSession}
          className="flex h-11 w-full items-center justify-center rounded-lg border border-border bg-surface text-sm font-semibold transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          Pokračovat přes Google
        </button>

        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> E-mail <span className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-3" onSubmit={submitEmailAuth}>
          <label className="block text-xs font-semibold text-muted-foreground">
            E-mail
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              required
              className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>
          <label className="block text-xs font-semibold text-muted-foreground">
            Heslo
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={8}
              className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>
          <button
            type="submit"
            disabled={loading || checkingSession}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {mode === "signin" ? "Přihlásit se" : "Registrovat"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "Nemáš účet? Vytvořit účet" : "Už máš účet? Přihlásit se"}
        </button>
      </section>
    </main>
  );
}