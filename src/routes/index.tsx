import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Gauge,
  HeartPulse,
  Home,
  Leaf,
  Mail,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  Wind,
} from "lucide-react";
import { PageShell, Section } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import mpdDevice from "@/assets/mpd-one-device.png";
import mpdTwoRgb from "@/assets/mpd-two-rgb.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MPD Systems and Solutions | Schimmelprävention einfach verstehen" },
      {
        name: "description",
        content:
          "MPD überwacht das Raumklima, erkennt Schimmelrisiken frühzeitig und gibt klare Handlungsempfehlungen.",
      },
    ],
  }),
  component: LandingPage,
});

const benefits = [
  {
    icon: ShieldCheck,
    title: "Risiken früh erkennen",
    text: "Temperatur und Luftfeuchtigkeit werden kontinuierlich bewertet, bevor Feuchte zum Problem wird.",
  },
  {
    icon: Wind,
    title: "Richtig handeln",
    text: "Klare Lüftungsempfehlungen ersetzen Zahlenraten und komplizierte Grenzwerttabellen.",
  },
  {
    icon: MonitorSmartphone,
    title: "Entwicklung verstehen",
    text: "Das Live-Dashboard macht Messwerte, Warnungen und den Verlauf der letzten 24 Stunden sichtbar.",
  },
];

const audiences = [
  {
    icon: Home,
    title: "Privathaushalte",
    text: "Für Bad, Keller, Schlafzimmer und Ferienwohnung.",
  },
  {
    icon: Building2,
    title: "Immobilien & Gewerbe",
    text: "Für Vermieter, Facility Management, Büros und Bildungseinrichtungen.",
  },
  {
    icon: HeartPulse,
    title: "Gesundes Raumklima",
    text: "Für Räume, in denen Schutz, Wohlbefinden und Prävention zählen.",
  },
];

function LandingPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card px-6 py-10 md:px-10 md:py-14">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Funktionsfähiger Prototyp aus Horb am Neckar
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
              Schimmel verhindern, bevor er sichtbar wird.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              MPD überwacht dein Raumklima und sagt dir verständlich, wann du handeln musst. Direkt
              am Gerät und im intelligenten Live-Dashboard.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/produkt">
                  MPD ONE entdecken
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">Live-Dashboard ansehen</Link>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Klare Ampelanzeige", "Aktualisierung alle 30 Sekunden", "Live-Auswertung"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-12 rounded-full bg-primary/20 blur-3xl" />
            <img
              src={mpdDevice}
              alt="MPD ONE Schimmelpräventionsgerät"
              className="relative mx-auto h-80 w-auto object-contain md:h-96"
            />
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-background/90 px-4 py-2 shadow-xl backdrop-blur">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
              </span>
              <span className="whitespace-nowrap text-sm font-medium">Raumklima in Ordnung</span>
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Einfach statt technisch"
        title="Aus Messwerten werden klare Entscheidungen"
        subtitle="MPD übersetzt Raumklimadaten in verständliche Hinweise, die im Alltag wirklich helfen."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="border-border/60 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <benefit.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Ampelsystem"
        title="Ein Blick genügt"
        subtitle="Die Anzeige zeigt sofort, ob das Raumklima stabil ist oder Lüften empfohlen wird."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <TrafficLight
            color="bg-emerald-400"
            title="Grün"
            range="Unter 60 %"
            text="Alles in Ordnung."
          />
          <TrafficLight
            color="bg-amber-400"
            title="Orange"
            range="60 bis 70 %"
            text="Bitte lüften."
          />
          <TrafficLight color="bg-red-400" title="Rot" range="Über 70 %" text="Dringend handeln." />
        </div>
      </Section>

      <section className="overflow-hidden rounded-2xl border border-primary/30 bg-card">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="p-6 md:p-10">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <Gauge className="h-4 w-4" />
              MPD TWO
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">
              Raumklima live verstehen
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Die Weiterentwicklung verbindet die direkte RGB-Anzeige am Gerät mit einem
              Live-Dashboard für Messwerte, Warnhistorie und konkrete Empfehlungen.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/produkt-two">
                MPD TWO ansehen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <img
            src={mpdTwoRgb}
            alt="MPD TWO mit RGB-Statusanzeige"
            className="aspect-square h-full w-full object-cover"
          />
        </div>
      </section>

      <Section
        eyebrow="Einsatzbereiche"
        title="Prävention für Räume, die zählen"
        subtitle="Vom einzelnen Schlafzimmer bis zur professionell verwalteten Immobilie."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {audiences.map((audience) => (
            <Card key={audience.title} className="border-border/60 p-5">
              <audience.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-semibold text-foreground">{audience.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{audience.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <section className="rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center md:p-10">
        <Leaf className="mx-auto h-7 w-7 text-primary" />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
          Interesse an MPD oder einem Pilotprojekt?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Wir suchen Haushalte und Unternehmen, die intelligente Schimmelprävention gemeinsam mit
          uns im Alltag erproben möchten.
        </p>
        <Button asChild size="lg" className="mt-6">
          <a href="mailto:mpd.systemsandsolutions@gmail.com?subject=Interesse%20an%20MPD">
            <Mail className="h-4 w-4" />
            Pilotprojekt anfragen
          </a>
        </Button>
      </section>
    </PageShell>
  );
}

function TrafficLight({
  color,
  title,
  range,
  text,
}: {
  color: string;
  title: string;
  range: string;
  text: string;
}) {
  return (
    <Card className="flex items-center gap-4 border-border/60 p-5">
      <span className={`h-12 w-12 shrink-0 rounded-full ${color} shadow-lg`} />
      <div>
        <div className="font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{range}</div>
        <div className="mt-1 text-sm text-muted-foreground">{text}</div>
      </div>
    </Card>
  );
}
