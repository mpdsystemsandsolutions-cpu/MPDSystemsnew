import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";

export const Route = createFileRoute("/unternehmen/")({
  head: () => ({
    meta: [
      { title: "Über MPD Systems and Solutions" },
      { name: "description", content: "MPD = Mold Prevention Devices. Ein Start-up für smarte Schimmelprävention." },
    ],
  }),
  component: UnternehmenPage,
});

function UnternehmenPage() {
  return (
    <PageShell title="Über uns" subtitle="MPD = Mold Prevention Devices.">
      <Section title="Unsere Mission">
        <p>
          Wir entwickeln Messgeräte, die die wesentlichen Faktoren der Schimmelbildung
          frühzeitig erkennen und einordnen. Über visuelle Signale werden Risiken klar
          und verständlich kommuniziert – für gesundes Wohnen und Arbeiten.
        </p>
      </Section>

      <Section title="Gründung & Standort">
        <p>Gegründet 2025 in Horb am Neckar. Entstanden aus der eigenen Wohnsituation in Studenten-WGs.</p>
      </Section>

      <Section title="Inspiration">
        <p>
          Die Idee zum Schimmelpräventionsmesser entstand aus der Realität in Altbau-Wohnungen
          und WGs. Vor dem aktuellen Produkt stand ein Konzept für einen Geräusch- und
          Feinstaubmesser für den Straßenverkehr – verworfen zugunsten der größeren
          Alltagsrelevanz von Schimmelprävention.
        </p>
      </Section>
    </PageShell>
  );
}
