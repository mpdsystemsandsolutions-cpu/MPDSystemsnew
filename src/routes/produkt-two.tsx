import { createFileRoute } from "@tanstack/react-router";
import { Gauge, Lightbulb, Wifi } from "lucide-react";
import { PageShell, Section } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import mpdTwoShowroom from "@/assets/mpd-two-showroom.png";

export const Route = createFileRoute("/produkt-two")({
  head: () => ({
    meta: [
      { title: "MPD TWO | MPD Systems and Solutions" },
      {
        name: "description",
        content: "MPD TWO ist die innovative Weiterentwicklung des MPD ONE mit Live-Dashboard.",
      },
    ],
  }),
  component: ProduktTwoPage,
});

function ProduktTwoPage() {
  return (
    <PageShell
      title="MPD TWO"
      subtitle="Die innovative Weiterentwicklung mit intelligentem Live-Dashboard."
    >
      <Section title="Showroom">
        <Card className="overflow-hidden border-primary/30 bg-card">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <img
              src={mpdTwoShowroom}
              alt="MPD TWO im Showroom"
              className="aspect-square h-full w-full object-cover"
            />
            <div className="p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Lightbulb className="h-3.5 w-3.5" />
                Innovative Weiterentwicklung
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Raumklima live verstehen
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                MPD TWO entwickelt das bewährte Konzept des MPD ONE konsequent weiter. Das
                integrierte Live-Dashboard macht aktuelle Messwerte, Entwicklungen und
                Handlungsempfehlungen jederzeit übersichtlich sichtbar.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Wifi className="h-4 w-4 text-primary" />
                  Live-Dashboard mit aktuellen Raumklimadaten
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Gauge className="h-4 w-4 text-primary" />
                  Messwerte und Entwicklungen auf einen Blick
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>
    </PageShell>
  );
}
