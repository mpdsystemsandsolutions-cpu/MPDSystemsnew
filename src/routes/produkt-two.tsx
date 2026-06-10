import { createFileRoute } from "@tanstack/react-router";
import { Gauge, Lightbulb, MonitorSmartphone, Palette, Sparkles, Wifi } from "lucide-react";
import { PageShell, Section } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import mpdTwoRgb from "@/assets/mpd-two-rgb.png";
import mpdTwoLed from "@/assets/mpd-two-led.png";
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
      <Section title="Kompakte RGB-Version">
        <Card className="overflow-hidden border-primary/30 bg-card">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="order-2 p-6 md:p-8 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Palette className="h-3.5 w-3.5" />
                RGB-Statusanzeige
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Klare Signale, digitale Einblicke
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Die kompakte Version des MPD TWO verbindet eine direkte RGB-Anzeige am Gerät mit dem
                Live-Dashboard. Die Farbe zeigt den aktuellen Raumklima-Status sofort, während
                detaillierte Messwerte und Entwicklungen digital abrufbar bleiben.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Palette className="h-4 w-4 text-primary" />
                  RGB-LED für einen schnellen Statusüberblick
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MonitorSmartphone className="h-4 w-4 text-primary" />
                  Live-Dashboard für Details und Entwicklungen
                </div>
              </div>
            </div>
            <img
              src={mpdTwoRgb}
              alt="Kompakte MPD TWO Version mit RGB-LED"
              className="order-1 aspect-square h-full w-full object-cover lg:order-2"
            />
          </div>
        </Card>
      </Section>

      <Section title="Kompakte LED-Version für schlichtes Design">
        <Card className="overflow-hidden border-primary/30 bg-card">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <img
              src={mpdTwoLed}
              alt="Kompakte MPD TWO Version mit umlaufendem LED-Ring"
              className="aspect-square h-full w-full object-cover"
            />
            <div className="p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Minimalistische LED-Anzeige
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Dezente Form, klares Signal
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Die kompakte LED-Version fügt sich mit ihrem schlichten, runden Gehäuse unauffällig
                in Wohn- und Arbeitsräume ein. Der umlaufende LED-Ring zeigt den aktuellen
                Raumklima-Status klar und aus verschiedenen Blickwinkeln sichtbar.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Umlaufender LED-Ring für eine eindeutige Statusanzeige
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MonitorSmartphone className="h-4 w-4 text-primary" />
                  Schlichtes Design mit Zugriff auf das Live-Dashboard
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

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
                Showroom-Version mit LED-Band
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Raumklima live verstehen
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Die Showroom-Version macht das Raumklima besonders anschaulich: Ein umlaufendes
                LED-Band visualisiert den aktuellen Status weithin sichtbar. Ergänzend zeigt das
                Live-Dashboard Messwerte, Entwicklungen und Handlungsempfehlungen.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Wifi className="h-4 w-4 text-primary" />
                  Live-Dashboard mit aktuellen Raumklimadaten
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Gauge className="h-4 w-4 text-primary" />
                  LED-Band für eine weithin sichtbare Statusanzeige
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>
    </PageShell>
  );
}
