import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Cpu, Home, Package, Ruler, ShieldCheck, Signal, Wind } from "lucide-react";
import { PageShell, Section } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import mpdDevice from "@/assets/mpd-one-device.png";

export const Route = createFileRoute("/produkt")({
  head: () => ({
    meta: [
      { title: "MPD ONE - Schimmelpräventionsgerät | MPD Systems and Solutions" },
      {
        name: "description",
        content:
          "Das MPD ONE erkennt schimmelfördernde Luftbedingungen frühzeitig - mit DHT22-Sensor, Risiko-Score und visueller Ampel-Anzeige.",
      },
    ],
  }),
  component: ProduktPage,
});

const steps = [
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Messen",
    text: "Der DHT22-Sensor erfasst Temperatur und Luftfeuchtigkeit im Raum.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Bewerten",
    text: "MPD ONE leitet daraus einen verständlichen Schimmel-Risiko-Score ab.",
  },
  {
    icon: <Wind className="h-5 w-5" />,
    title: "Handeln",
    text: "LED und Dashboard zeigen, wann Lüften oder Prüfen sinnvoll ist.",
  },
];

const useCases = ["Bad", "Keller", "Schlafzimmer", "Ferienwohnung", "Büro", "Abstellraum"];

const technicalData = [
  { label: "Sensor", value: "DHT22" },
  { label: "Messwerte", value: "Temperatur, Luftfeuchtigkeit" },
  { label: "Anzeige", value: "RGB-LED-Ampel und Web-Dashboard" },
  { label: "Controller", value: "Arduino Nano ESP32" },
  { label: "Aktualisierung", value: "ca. alle 30 Sekunden" },
  { label: "Preis MVP", value: "54,49 €" },
];

function ProduktPage() {
  return (
    <PageShell
      title="MPD ONE"
      subtitle="Unser Schimmelpräventionsgerät - Schimmel erkennen, bevor er entsteht."
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <img src={mpdDevice} alt="MPD ONE Gerät" className="mx-auto h-72 w-auto object-contain" />
        </div>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Signal className="h-3.5 w-3.5" />
            MVP mit Live-Dashboard
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
            Klare Warnung statt Zahlenraten
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Das MPD ONE misst kontinuierlich die Raumluft und übersetzt die Werte in eine
            einfache Handlungsempfehlung. Nutzer sehen nicht nur Prozentwerte, sondern direkt,
            ob das Raumklima stabil ist oder ob Lüften empfohlen wird.
          </p>
        </div>
      </div>

      <Section title="So funktioniert's">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title} className="border-border/60 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                {step.icon}
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Ampelsystem">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-medium text-foreground">Grün</span> - Luftfeuchte unter 60 %:
            alles im grünen Bereich
          </li>
          <li>
            <span className="font-medium text-foreground">Orange</span> - 60-70 %: erhöhte
            Aufmerksamkeit, Lüften empfohlen
          </li>
          <li>
            <span className="font-medium text-foreground">Rot</span> - über 70 %: Schimmelgefahr,
            sofort handeln
          </li>
        </ul>
      </Section>

      <Section title="MPD ONE im Vergleich">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/60 p-5">
            <h3 className="font-semibold text-foreground">Normales Hygrometer</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Zeigt Messwerte, aber keine Bewertung</li>
              <li>Nutzer müssen Grenzwerte selbst kennen</li>
              <li>Keine Historie und kein Dashboard</li>
            </ul>
          </Card>
          <Card className="border-primary/40 bg-primary/10 p-5">
            <h3 className="font-semibold text-foreground">MPD ONE</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Bewertet das Risiko automatisch</li>
              <li>Gibt klare Lüftungsempfehlungen</li>
              <li>Speichert Verlauf und Warnhistorie im Dashboard</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section title="Einsatzorte">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((place) => (
            <div key={place} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
              <Home className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{place}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Lieferumfang">
        <div className="grid gap-3 sm:grid-cols-2">
          {["MPD ONE Gerät", "Kurzanleitung", "Zugang zum Web-Dashboard", "Lebenslange kostenlose App-Updates"].map(
            (item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg border border-border bg-card p-3">
                <Package className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ),
          )}
        </div>
      </Section>

      <Section title="Technische Daten">
        <div className="overflow-hidden rounded-lg border border-border">
          {technicalData.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[0.9fr_1.1fr] border-b border-border bg-card px-4 py-3 last:border-b-0"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Ruler className="h-4 w-4 text-primary" />
                {row.label}
              </div>
              <div className="text-sm text-muted-foreground">{row.value}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Unique Selling Points">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Lebenslange kostenlose App-Updates</li>
          <li>Casing aus recycelten Materialien aus der Region</li>
          <li>Klare Anweisungen statt verwirrender Messwerte</li>
        </ol>
      </Section>

      <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-muted-foreground">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
        <span>
          Ziel des MVP: Ein bezahlbares Schimmelwarnsystem mit Luftfeuchtigkeitssensor,
          LED-Ausgabe und verständlichem Dashboard.
        </span>
      </div>
    </PageShell>
  );
}
