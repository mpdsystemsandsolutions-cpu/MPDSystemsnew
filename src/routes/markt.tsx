import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";

export const Route = createFileRoute("/markt")({
  head: () => ({
    meta: [
      { title: "Markt: MVP, USP & Zielgruppen | MPD" },
      { name: "description", content: "Personas und Zielgruppen für das MPD ONE – B2C und B2B." },
    ],
  }),
  component: MarktPage,
});

const personas = [
  { title: "Haus- & Wohnungseigentümer", desc: "Privatkunden, die ihr Eigentum vor Feuchteschäden schützen wollen." },
  { title: "Immobilienbetreiber & Facility Manager", desc: "Bürogebäude, Hotels, Pflegeheime, Schulen – Betriebssicherheit & Prävention." },
  { title: "Versicherungsunternehmen", desc: "Gebäude- und Hausratversicherer zur Reduktion von Schadenkosten." },
  { title: "Bauunternehmen & Sanierungsfirmen", desc: "Qualitätssicherung in Neubauten und Bestandsobjekten." },
  { title: "Gesundheits- & Sozialinstitutionen", desc: "Pflegeeinrichtungen, Kliniken, Kindergärten – Wohngesundheit im Fokus." },
];

function MarktPage() {
  return (
    <PageShell title="Markt & Zielgruppen" subtitle="Wer profitiert vom MPD ONE?">
      <Section title="MVP">
        <p>Schimmelwarnsystem mit Luftfeuchtigkeitssensor und LED-Ausgabe. Verkaufspreis: 54,49 €.</p>
      </Section>

      <Section title="Unique Selling Points">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Lebenslange kostenlose App-Updates</li>
          <li>Casing aus recycelten Materialien aus der Region</li>
          <li>Klare Anweisungen, keine verwirrenden Messwerte</li>
        </ol>
      </Section>

      <Section title="Personas">
        <ul className="grid gap-3 sm:grid-cols-2">
          {personas.map((p) => (
            <li key={p.title} className="rounded-lg border border-border bg-card p-4">
              <div className="font-semibold text-foreground">{p.title}</div>
              <div className="mt-1 text-xs">{p.desc}</div>
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  );
}
