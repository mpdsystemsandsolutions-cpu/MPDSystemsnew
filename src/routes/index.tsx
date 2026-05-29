import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Thermometer, Droplets, Mail, Phone, MapPin, Users, Plus, Copy, Wifi } from "lucide-react";
import mpdLogo from "@/assets/mpd-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteMenu } from "@/components/SiteMenu";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

type Reading = {
  id: number;
  device_id: string | null;
  temperature: number;
  humidity: number;
  recorded_at: string;
};

type Device = {
  id: string;
  name: string;
  device_token: string;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelative(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "gerade eben";
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
  if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std.`;
  return `vor ${Math.floor(diff / 86400)} Tagen`;
}

function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);

  const applyReadings = (data: Reading[]) => {
    setReadings(
      data.map((d) => ({
        ...d,
        temperature: Number(d.temperature),
        humidity: Number(d.humidity),
      })),
    );
  };

  const loadPublicReadings = async (deviceId?: string) => {
    const params = deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : "";
    const response = await fetch(`/api/public/latest${params}`);

    if (!response.ok) {
      setReadings([]);
      return 0;
    }

    const data = (await response.json()) as { readings?: Reading[] };
    const nextReadings = data.readings ?? [];
    applyReadings(nextReadings);
    return nextReadings.length;
  };

  const loadDevices = async (activeSession: Session | null) => {
    if (!activeSession) {
      setDevices([]);
      setSelectedDeviceId("");
      await loadPublicReadings();
      setAuthReady(true);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("devices")
      .select("id, name, device_token")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setDevices(data);
      setSelectedDeviceId((current) => current || data[0]?.id || "");
    }

    setAuthReady(true);
  };

  const load = async (deviceId = selectedDeviceId) => {
    if (!deviceId) {
      await loadPublicReadings();
      setLoading(false);
      return;
    }

    setLoading(true);
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("sensor_readings")
      .select("id, device_id, temperature, humidity, recorded_at")
      .eq("device_id", deviceId)
      .gte("recorded_at", since)
      .order("recorded_at", { ascending: false })
      .limit(288);
    if (!error && data && data.length > 0) {
      applyReadings(data);
    } else {
      const publicReadingCount = await loadPublicReadings(deviceId);
      if (publicReadingCount === 0) {
        await loadPublicReadings();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadDevices(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      loadDevices(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    load(selectedDeviceId);
    const interval = setInterval(() => load(selectedDeviceId), 30_000);
    return () => clearInterval(interval);
  }, [selectedDeviceId]);

  const latest = readings[0];
  const hasReadings = readings.length > 0;
  const displayedTemperature = latest ? latest.temperature.toFixed(1) : "-";
  const displayedHumidity = latest ? latest.humidity.toFixed(1) : "-";
  const selectedDevice = devices.find((device) => device.id === selectedDeviceId);
  const chartData = [...readings].reverse().map((r) => ({
    time: formatTime(r.recorded_at),
    temperature: r.temperature,
    humidity: r.humidity,
  }));

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {/* Header */}
        <header className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <SiteMenu />
            <ThemeToggle />
          </div>
          <div className="flex flex-col items-center text-center">
            <img
              src={mpdLogo}
              alt="MPD Systems and Solutions Logo"
              className="h-32 w-auto md:h-40"
            />
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              MPD Systems and Solutions
            </h1>
            <p className="mt-3 text-base italic text-primary md:text-lg">
              Schimmel erkennen, bevor er entsteht
            </p>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Klima-Dashboard · ESP32 + DHT22
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Aktualisiert alle 30 s
            </div>
          </div>
        </header>

        {!authReady ? (
          <Card className="mb-10 border-border/60 p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <p className="text-sm text-muted-foreground">Konto wird geprueft...</p>
          </Card>
        ) : !session ? (
          <Card
            className="mb-10 border-border/60 p-6 md:p-8"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Bitte anmelden</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Deine Sensordaten sind geraetebezogen und nur fuer dein Konto sichtbar.
                </p>
              </div>
              <Button asChild>
                <Link to="/auth">Anmelden</Link>
              </Button>
            </div>
          </Card>
        ) : devices.length === 0 ? (
          <AddDevicePanel userId={session.user.id} onCreated={() => loadDevices(session)} />
        ) : (
          <Card className="mb-10 border-border/60 p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Wifi className="h-4 w-4" />
                  Aktives Geraet
                </div>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  {selectedDevice?.name ?? "Schimmeldetektor"}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tagesdiagramm der letzten 24 Stunden
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-[minmax(180px,1fr)_auto]">
                <select
                  value={selectedDeviceId}
                  onChange={(event) => setSelectedDeviceId(event.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                >
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </select>
                <AddDevicePanel
                  userId={session.user.id}
                  onCreated={() => loadDevices(session)}
                  compact
                />
              </div>
            </div>
          </Card>
        )}

        {/* Current values */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <MetricCard
            icon={<Thermometer className="h-5 w-5" />}
            label="Temperatur"
            value={displayedTemperature}
            unit="°C"
          />
          <MetricCard
            icon={<Droplets className="h-5 w-5" />}
            label="Luftfeuchtigkeit"
            value={displayedHumidity}
            unit="%"
          />
        </section>

        {/* Chart */}
        <Card
          className="overflow-hidden border-border/60 p-6 md:p-8"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Verlauf</h2>
              <p className="text-sm text-muted-foreground">
                {hasReadings ? `Letzte ${readings.length} Messungen` : "Keine echten Messwerte"}
              </p>
            </div>
            <div className="flex gap-4 text-xs">
              <LegendDot color="var(--primary)" label="Temperatur (°C)" />
              <LegendDot color="oklch(0.6 0.13 230)" label="Luftfeuchte (%)" />
            </div>
          </div>

          {hasReadings ? (
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.13 165)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="oklch(0.78 0.13 165)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="humFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.6 0.13 230)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="oklch(0.6 0.13 230)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={32}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="oklch(0.78 0.13 165)"
                    strokeWidth={2.5}
                    fill="url(#tempFill)"
                    name="Temperatur"
                  />
                  <Area
                    type="monotone"
                    dataKey="humidity"
                    stroke="oklch(0.6 0.13 230)"
                    strokeWidth={2.5}
                    fill="url(#humFill)"
                    name="Luftfeuchte"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState loading={loading} />
          )}
        </Card>

        {latest && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Letzte Messung: {formatRelative(latest.recorded_at)}
          </p>
        )}

        {/* Team / Kontakt Footer */}
        <footer className="mt-20 border-t border-border/60 pt-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <img src={mpdLogo} alt="MPD Logo" className="h-12 w-auto" />
                <div className="text-sm font-semibold text-foreground leading-tight">
                  MPD Systems
                  <br />
                  and Solutions
                </div>
              </div>
              <p className="mt-3 text-xs italic text-primary">
                Schimmel erkennen, bevor er entsteht
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Gegründet 2025. Wir produzieren Schimmelpräventionsgeräte für private Haushalte und
                Geschäftskunden – mit smarter Sensorik, die Risiken erkennt, bevor Schimmel
                entsteht.
              </p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Users className="h-4 w-4 text-primary" />
                Team
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <li>Robin Grießbaum</li>
                <li>Matthias Kugel</li>
                <li>Roman Armbruster</li>
                <li>Tom Furtwängler</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Kontakt</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <a
                    href="mailto:mpd.systemsandsolutions@gmail.com"
                    className="hover:text-foreground transition-colors break-all"
                  >
                    mpd.systemsandsolutions@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <a href="tel:+4974515210" className="hover:text-foreground transition-colors">
                    07451 5210
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Florianstraße 15, 72160 Horb am Neckar</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
            <span>© {new Date().getFullYear()} MPD Systems and Solutions</span>
            <span>Alle Rechte vorbehalten</span>
          </div>
        </footer>
      </div>
    </main>
  );
}

function createDeviceToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function AddDevicePanel({
  userId,
  onCreated,
  compact = false,
}: {
  userId: string;
  onCreated: () => Promise<void> | void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(!compact);
  const [name, setName] = useState("Schimmeldetektor");
  const [token, setToken] = useState(createDeviceToken);
  const [lastToken, setLastToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDevice = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from("devices").insert({
      owner_id: userId,
      name: name.trim() || "Schimmeldetektor",
      device_token: token,
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setLastToken(token);
    setName("Schimmeldetektor");
    setToken(createDeviceToken());
    await onCreated();
  };

  const copyToken = async () => {
    if (lastToken) await navigator.clipboard.writeText(lastToken);
  };

  if (compact && !open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Geraet
      </Button>
    );
  }

  return (
    <Card
      className={compact ? "border-border/60 p-4" : "mb-10 border-border/60 p-6 md:p-8"}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Geraet anlegen</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Erstelle einen Zugangstoken fuer deinen Arduino Nano ESP32 mit DHT22.
          </p>
        </div>
        {compact && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Schliessen
          </Button>
        )}
      </div>

      <form className="space-y-4" onSubmit={createDevice}>
        <div className="space-y-2">
          <Label htmlFor={compact ? "compact-device-name" : "device-name"}>Geraetename</Label>
          <Input
            id={compact ? "compact-device-name" : "device-name"}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={compact ? "compact-device-token" : "device-token"}>Device Token</Label>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <Input
              id={compact ? "compact-device-token" : "device-token"}
              value={token}
              onChange={(event) => setToken(event.target.value)}
              required
              minLength={16}
            />
            <Button type="button" variant="outline" onClick={() => setToken(createDeviceToken())}>
              Neu
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
            {error}
          </div>
        )}

        {lastToken && (
          <div className="rounded-md border border-primary/40 bg-primary/10 p-3 text-sm">
            <div className="font-medium text-foreground">Token fuer Arduino speichern:</div>
            <code className="mt-2 block break-all rounded bg-background p-2 text-xs text-foreground">
              {lastToken}
            </code>
            <Button type="button" variant="outline" size="sm" className="mt-3" onClick={copyToken}>
              <Copy className="h-4 w-4" />
              Kopieren
            </Button>
          </div>
        )}

        <Button type="submit" disabled={submitting}>
          <Plus className="h-4 w-4" />
          {submitting ? "Wird erstellt..." : "Geraet erstellen"}
        </Button>
      </form>
    </Card>
  );
}

function EmptyState({ loading }: { loading: boolean }) {
  return (
    <div className="flex h-[340px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center">
      <p className="text-sm text-muted-foreground">
        {loading
          ? "Messwerte werden geladen..."
          : "Noch keine echten Messwerte empfangen. Pruefe API_URL, Device Token und Vercel-Umgebungsvariablen."}
      </p>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <Card
      className="relative overflow-hidden border-border/60 p-6 md:p-8"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          {icon}
        </div>
      </div>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-5xl font-semibold tracking-tight tabular-nums">{value}</span>
        <span className="text-lg font-medium text-muted-foreground">{unit}</span>
      </div>
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--gradient-mint)" }}
      />
    </Card>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
