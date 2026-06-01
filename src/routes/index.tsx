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
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  Droplets,
  Gauge,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Thermometer,
  Users,
  Wifi,
  Wind,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type RiskLevel = "low" | "medium" | "high";

const demoReadings: Reading[] = Array.from({ length: 24 }, (_, index) => {
  const age = 23 - index;
  const humidity = 52 + Math.sin(index / 3) * 9 + (index > 15 ? 8 : 0);
  const temperature = 20.5 + Math.cos(index / 4) * 1.8;

  return {
    id: -index - 1,
    device_id: null,
    temperature: Number(temperature.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
    recorded_at: new Date(Date.now() - age * 60 * 60 * 1000).toISOString(),
  };
});

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

function getRiskScore(temperature: number, humidity: number) {
  const humidityScore =
    humidity < 55
      ? humidity * 0.45
      : humidity < 70
        ? 25 + (humidity - 55) * 2.4
        : 61 + (humidity - 70) * 1.8;
  const temperatureScore = temperature >= 16 && temperature <= 24 ? 12 : 5;
  return Math.max(0, Math.min(100, Math.round(humidityScore + temperatureScore)));
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

function getRiskCopy(level: RiskLevel) {
  if (level === "high") {
    return {
      label: "Kritisch",
      description: "Schimmelgefahr erhöht. Feuchtigkeit schnell senken.",
      tone: "text-red-300",
      border: "border-red-400/40",
      bg: "bg-red-500/10",
    };
  }

  if (level === "medium") {
    return {
      label: "Achtung",
      description: "Raumklima beobachten und bei Bedarf lüften.",
      tone: "text-amber-300",
      border: "border-amber-400/40",
      bg: "bg-amber-500/10",
    };
  }

  return {
    label: "Niedriges Risiko",
    description: "Die aktuellen Werte sind im grünen Bereich.",
    tone: "text-primary",
    border: "border-primary/40",
    bg: "bg-primary/10",
  };
}

function getVentilationAdvice(temperature: number, humidity: number) {
  if (temperature < 16 && humidity > 55 && humidity < 60) {
    return "Ampel Grün: alles in Ordnung. Raum bei Gelegenheit leicht erwärmen.";
  }

  return getTrafficLightRecommendation(humidity).recommendation;
}

function getTrafficLightRecommendation(humidity: number) {
  if (humidity >= 70) {
    return {
      light: "Ampel Rot",
      severity: "Kritisch",
      recommendation: "Dringend lüften.",
      tone: "text-red-300",
      border: "border-red-400/40",
      bg: "bg-red-500/10",
    };
  }

  if (humidity >= 60) {
    return {
      light: "Ampel Orange",
      severity: "Achtung",
      recommendation: "Bitte lüften.",
      tone: "text-amber-300",
      border: "border-amber-400/40",
      bg: "bg-amber-500/10",
    };
  }

  return {
    light: "Ampel Grün",
    severity: "In Ordnung",
    recommendation: "Alles in Ordnung.",
    tone: "text-primary",
    border: "border-primary/40",
    bg: "bg-primary/10",
  };
}

function getDailyStats(source: Reading[]) {
  if (source.length === 0) {
    return [
      { label: "Durchschnitt", value: "-" },
      { label: "Höchstwert", value: "-" },
      { label: "Über 60 %", value: "-" },
      { label: "Über 70 %", value: "-" },
    ];
  }

  const averageHumidity = source.reduce((sum, reading) => sum + reading.humidity, 0) / source.length;
  const maxHumidity = Math.max(...source.map((reading) => reading.humidity));
  const over60 = source.filter((reading) => reading.humidity >= 60).length;
  const over70 = source.filter((reading) => reading.humidity >= 70).length;
  const minutesPerReading = source.length > 1 ? Math.max(5, Math.round((24 * 60) / source.length)) : 30;

  return [
    { label: "Durchschnitt", value: `${averageHumidity.toFixed(1)} %` },
    { label: "Höchstwert", value: `${maxHumidity.toFixed(1)} %` },
    { label: "Über 60 %", value: `${Math.round((over60 * minutesPerReading) / 60)} Std.` },
    { label: "Über 70 %", value: `${Math.round((over70 * minutesPerReading) / 60)} Std.` },
  ];
}

function getWarningHistory(source: Reading[]) {
  return source
    .slice(0, 5)
    .map((reading) => {
      const action = getTrafficLightRecommendation(reading.humidity);

      return {
        time: formatTime(reading.recorded_at),
        severity: action.severity,
        light: action.light,
        recommendation: action.recommendation,
        tone: action.tone,
        border: action.border,
        bg: action.bg,
        text: `Luftfeuchtigkeit: ${reading.humidity.toFixed(1)} %`,
      };
    });
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

  const hasReadings = readings.length > 0;
  const isDemo = !loading && !hasReadings;
  const visibleReadings = hasReadings ? readings : isDemo ? demoReadings : [];
  const latest = visibleReadings[0];
  const displayedTemperature = latest ? latest.temperature.toFixed(1) : "-";
  const displayedHumidity = latest ? latest.humidity.toFixed(1) : "-";
  const selectedDevice = devices.find((device) => device.id === selectedDeviceId);
  const riskScore = latest ? getRiskScore(latest.temperature, latest.humidity) : 0;
  const riskCopy = getRiskCopy(getRiskLevel(riskScore));
  const ventilationAdvice = latest ? getVentilationAdvice(latest.temperature, latest.humidity) : "-";
  const dailyStats = getDailyStats(visibleReadings);
  const warningHistory = getWarningHistory(visibleReadings);
  const chartData = [...visibleReadings].reverse().map((r) => ({
    time: formatTime(r.recorded_at),
    temperature: r.temperature,
    humidity: r.humidity,
  }));

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
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
            <p className="text-sm text-muted-foreground">Konto wird geprüft...</p>
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
                  Deine Sensordaten sind gerätebezogen und nur für dein Konto sichtbar.
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
                  Aktives Gerät
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

        {isDemo && <DemoNotice />}

        <section className="mb-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <RiskPanel
            score={riskScore}
            riskCopy={riskCopy}
            advice={ventilationAdvice}
            isDemo={isDemo}
          />
          <DailyStats stats={dailyStats} />
        </section>

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

        <Card
          className="overflow-hidden border-border/60 p-6 md:p-8"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Verlauf</h2>
              <p className="text-sm text-muted-foreground">
                {hasReadings
                  ? `Letzte ${readings.length} Messungen`
                  : isDemo
                    ? "Demo mit Beispieldaten"
                    : "Keine echten Messwerte"}
              </p>
            </div>
            <div className="flex gap-4 text-xs">
              <LegendDot color="var(--primary)" label="Temperatur (°C)" />
              <LegendDot color="oklch(0.6 0.13 230)" label="Luftfeuchte (%)" />
            </div>
          </div>

          {visibleReadings.length > 0 ? (
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

        <WarningHistory items={warningHistory} isDemo={isDemo} />

        {latest && hasReadings && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Letzte Messung: {formatRelative(latest.recorded_at)}
          </p>
        )}

        <footer className="mt-20 border-t border-border/60 pt-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <img src={mpdLogo} alt="MPD Logo" className="h-12 w-auto" />
                <div className="text-sm font-semibold leading-tight text-foreground">
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
                Geschäftskunden - mit smarter Sensorik, die Risiken erkennt, bevor Schimmel
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
                    className="break-all transition-colors hover:text-foreground"
                  >
                    mpd.systemsandsolutions@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <a href="tel:+4974515210" className="transition-colors hover:text-foreground">
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
        Gerät
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
          <h2 className="text-xl font-semibold tracking-tight">Gerät anlegen</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Erstelle einen Zugangstoken für deinen Arduino Nano ESP32 mit DHT22.
          </p>
        </div>
        {compact && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Schließen
          </Button>
        )}
      </div>

      <form className="space-y-4" onSubmit={createDevice}>
        <div className="space-y-2">
          <Label htmlFor={compact ? "compact-device-name" : "device-name"}>Gerätename</Label>
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
            <div className="font-medium text-foreground">Token für Arduino speichern:</div>
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
          {submitting ? "Wird erstellt..." : "Gerät erstellen"}
        </Button>
      </form>
    </Card>
  );
}

function DemoNotice() {
  return (
    <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">Demo-Modus:</span> Noch keine echten Messwerte
      vorhanden. Das Dashboard zeigt Beispieldaten, damit Besucher den Produktnutzen sofort sehen.
    </div>
  );
}

function RiskPanel({
  score,
  riskCopy,
  advice,
  isDemo,
}: {
  score: number;
  riskCopy: ReturnType<typeof getRiskCopy>;
  advice: string;
  isDemo: boolean;
}) {
  return (
    <Card className="border-border/60 p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <ShieldCheck className="h-4 w-4" />
            Schimmel-Risiko
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-6xl font-semibold tracking-tight tabular-nums">{score}</span>
            <span className="text-lg text-muted-foreground">/ 100</span>
          </div>
          <div className={`mt-4 inline-flex rounded-md border px-3 py-1 text-sm ${riskCopy.border} ${riskCopy.bg}`}>
            <span className={`font-medium ${riskCopy.tone}`}>{riskCopy.label}</span>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {riskCopy.description}
          </p>
        </div>

        <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-4 sm:w-72">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Wind className="h-4 w-4 text-primary" />
            Empfehlung
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{advice}</p>
          {isDemo && <p className="mt-3 text-xs text-muted-foreground">Berechnet aus Demodaten</p>}
        </div>
      </div>
    </Card>
  );
}

function DailyStats({ stats }: { stats: Array<{ label: string; value: string }> }) {
  return (
    <Card className="border-border/60 p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Activity className="h-4 w-4" />
        Tagesauswertung
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-muted/20 p-3">
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="mt-1 text-xl font-semibold tabular-nums text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function WarningHistory({
  items,
  isDemo,
}: {
  items: Array<{
    time: string;
    severity: string;
    light: string;
    recommendation: string;
    tone: string;
    border: string;
    bg: string;
    text: string;
  }>;
  isDemo: boolean;
}) {
  return (
    <Card className="mt-10 border-border/60 p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Warnhistorie
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isDemo
              ? "Beispielhafte Ampel-Empfehlungen aus dem Demo-Verlauf"
              : "Ampelstatus und Handlungsempfehlungen der letzten 24 Stunden"}
          </p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.time}-${item.text}`}
              className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3"
            >
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">
                  {item.time} · {item.severity}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`rounded-md border px-2 py-1 text-xs font-medium ${item.border} ${item.bg} ${item.tone}`}>
                    {item.light}
                  </span>
                  <span className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
                    Handlungsempfehlung: {item.recommendation}
                  </span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Keine Warnungen im aktuellen Zeitraum.
        </div>
      )}
    </Card>
  );
}

function EmptyState({ loading }: { loading: boolean }) {
  return (
    <div className="flex h-[340px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center">
      <p className="text-sm text-muted-foreground">
        {loading
          ? "Messwerte werden geladen..."
          : "Noch keine echten Messwerte empfangen. Prüfe API_URL, Device Token und Vercel-Umgebungsvariablen."}
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
      <Gauge className="pointer-events-none absolute -right-4 -bottom-4 h-24 w-24 text-primary/10" />
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
