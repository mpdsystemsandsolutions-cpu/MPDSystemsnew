import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";

export const Route = createFileRoute("/produkt")({
  head: () => ({
    meta: [
      { title: "MPD ONE – Schimmelpräventionsgerät | MPD Systems and Solutions" },
      { name: "description", content: "Das MPD ONE erkennt schimmelfördernde Luftbedingungen frühzeitig – mit DHT22-Sensor und visueller Ampel-Anzeige." },
    ],
  }),
  component: ProduktPage,
});

import mpdDevice from "@/assets/mpd-one-device.png";

function ProduktPage() {
  return (
    <PageShell
      title="MPD ONE"
      subtitle="Unser Schimmelpräventionsgerät – Schimmel erkennen, bevor er entsteht."
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <img src={mpdDevice} alt="MPD ONE Gerät" className="mx-auto h-72 w-auto object-contain" />
      </div>
      <Section title="Was ist das MPD ONE?">
        <p>
          Das <strong className="text-foreground">MPD ONE</strong> ist ein kompaktes
          Messgerät, das die wesentlichen Faktoren der Schimmelbildung – Luftfeuchtigkeit
          und Temperatur – kontinuierlich erfasst und in Echtzeit auswertet. Über eine
          RGB-LED wird der aktuelle Status klar verständlich angezeigt.
        </p>
      </Section>

      <Section title="Ampelsystem">
        <ul className="list-disc space-y-1 pl-5">
          <li><span className="text-foreground font-medium">Grün</span> – Luftfeuchte unter 60 %: alles im grünen Bereich</li>
          <li><span className="text-foreground font-medium">Orange</span> – 60–70 %: erhöhte Aufmerksamkeit, Lüften empfohlen</li>
          <li><span className="text-foreground font-medium">Rot</span> – über 70 %: Schimmelgefahr, sofort handeln</li>
        </ul>
      </Section>

      <Section title="Minimum Viable Product">
        <p>
          Schimmelwarnsystem mit Luftfeuchtigkeitssensor und LED-Ausgabe.
          Verkaufspreis: <strong className="text-foreground">54,49 €</strong>.
        </p>
      </Section>

      <Section title="Unique Selling Points">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Lebenslange kostenlose App-Updates</li>
          <li>Casing aus recycelten Materialien aus der Region</li>
          <li>Klare Anweisungen statt verwirrender Messwerte</li>
        </ol>
      </Section>
    </PageShell>
  );
}
