import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Building2, CheckCircle2, Mail, ShieldCheck, Wrench } from "lucide-react";
import { PageShell, Section } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/markt")({
  head: () => ({
    meta: [
      { title: "MPD für Unternehmen | Schimmelprävention" },
      {
        name: "description",
        content:
          "Raumklima überwachen, Feuchterisiken früh erkennen und Schäden in Immobilien vermeiden.",
      },
    ],
  }),
  component: MarktPage,
});

const benefits = [
  {
    icon: ShieldCheck,
    title: "Risiken früh erkennen",
    desc: "Kritische Luftfeuchtigkeit wird sichtbar, bevor daraus ein kostspieliger Schaden entsteht.",
  },
  {
    icon: BarChart3,
    title: "Verläufe dokumentieren",
    desc: "Messwerte und Warnungen helfen dabei, Raumklima nachvollziehbar zu beurteilen.",
  },
  {
    icon: Wrench,
    title: "Gezielt handeln",
    desc: "Klare Empfehlungen unterstützen Mitarbeitende, Bewohner und Gebäudeverantwortliche.",
  },
];

const applications = [
  "Vermietete Wohnungen und Ferienimmobilien",
  "Büros, Schulen und Pflegeeinrichtungen",
  "Keller, Lager- und Technikräume",
  "Neubauten und Sanierungsprojekte",
];

function MarktPage() {
  return (
    <PageShell
      title="MPD für Unternehmen"
      subtitle="Raumklima verstehen, Feuchteschäden vermeiden und Verantwortung sichtbar machen."
    >
      <section className="rounded-2xl border border-primary/30 bg-primary/10 p-6 md:p-8">
        <Building2 className="h-6 w-6 text-primary" />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          Prävention statt teurer Sanierung
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
          MPD verbindet verständliche Warnsignale vor Ort mit einer digitalen Auswertung.
          Gebäudeverantwortliche erkennen auffällige Räume schneller und können gezielt reagieren.
        </p>
      </section>

      <Section title="Vorteile im Betrieb">
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="border-border/60 p-5">
              <benefit.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-semibold text-foreground">{benefit.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{benefit.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Geeignete Einsatzbereiche">
        <div className="grid gap-3 sm:grid-cols-2">
          {applications.map((application) => (
            <div
              key={application}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm text-muted-foreground">{application}</span>
            </div>
          ))}
        </div>
      </Section>

      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Pilotprojekt gemeinsam starten</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Wir entwickeln MPD derzeit mit realen Anwendungsszenarien weiter und freuen uns über
          Unternehmen, die einen passenden Einsatzbereich erproben möchten.
        </p>
        <Button asChild className="mt-6">
          <a href="mailto:mpd.systemsandsolutions@gmail.com?subject=MPD%20Pilotprojekt">
            <Mail className="h-4 w-4" />
            Pilotprojekt anfragen
          </a>
        </Button>
      </section>
    </PageShell>
  );
}
