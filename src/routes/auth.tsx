import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { CheckCircle2, LogIn, LogOut, Mail, UserPlus } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Anmelden & Registrieren | MPD Systems and Solutions" },
      {
        name: "description",
        content: "Anmeldung und Registrierung fuer MPD Systems and Solutions ueber Supabase Auth.",
      },
    ],
  }),
  component: AuthPage,
});

type AuthMode = "login" | "register";

function AuthPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <PageShell
      title="Kundenbereich"
      subtitle="Melde dich mit deinem Konto an oder registriere dich neu."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="border-border/60 p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          {loadingSession ? (
            <div className="text-sm text-muted-foreground">Session wird geprueft...</div>
          ) : session ? (
            <SignedInPanel email={session.user.email ?? "Unbekannte E-Mail"} onSignOut={handleSignOut} />
          ) : (
            <AuthForms />
          )}
        </Card>

        <aside className="rounded-lg border border-border bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold tracking-tight">Supabase Auth ist aktiv</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Registrierung und Anmeldung laufen direkt ueber dein Supabase-Projekt. Wenn
            E-Mail-Bestaetigung in Supabase eingeschaltet ist, muss der Link aus der Mail
            einmal bestaetigt werden, bevor der Login funktioniert.
          </p>
        </aside>
      </div>
    </PageShell>
  );
}

function AuthForms() {
  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">
          <LogIn className="h-4 w-4" />
          Anmelden
        </TabsTrigger>
        <TabsTrigger value="register">
          <UserPlus className="h-4 w-4" />
          Registrieren
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login" className="mt-6">
        <AuthForm mode="login" />
      </TabsContent>
      <TabsContent value="register" className="mt-6">
        <AuthForm mode="register" />
      </TabsContent>
    </Tabs>
  );
}

function AuthForm({ mode }: { mode: AuthMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === "register";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    const credentials = {
      email: email.trim(),
      password,
    };

    const { data, error: authError } = isRegister
      ? await supabase.auth.signUp(credentials)
      : await supabase.auth.signInWithPassword(credentials);

    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (isRegister && !data.session) {
      setMessage("Registrierung erfolgreich. Bitte pruefe dein E-Mail-Postfach zur Bestaetigung.");
      setPassword("");
      return;
    }

    setMessage(isRegister ? "Konto erstellt und angemeldet." : "Du bist angemeldet.");
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor={`${mode}-email`}>E-Mail</Label>
        <Input
          id={`${mode}-email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="name@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${mode}-password`}>Passwort</Label>
        <Input
          id={`${mode}-password`}
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
          placeholder="Mindestens 6 Zeichen"
        />
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-foreground">
          {message}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {isRegister ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
        {submitting ? "Bitte warten..." : isRegister ? "Konto erstellen" : "Anmelden"}
      </Button>
    </form>
  );
}

function SignedInPanel({ email, onSignOut }: { email: string; onSignOut: () => Promise<void> }) {
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async () => {
    setSubmitting(true);
    await onSignOut();
    setSubmitting(false);
  };

  return (
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-accent-foreground">
        <Mail className="h-5 w-5" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">Du bist angemeldet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Aktuelles Konto: <span className="font-medium text-foreground">{email}</span>
      </p>
      <Button variant="outline" className="mt-6" onClick={handleClick} disabled={submitting}>
        <LogOut className="h-4 w-4" />
        {submitting ? "Abmelden..." : "Abmelden"}
      </Button>
    </div>
  );
}
