import { createFileRoute } from "@tanstack/react-router";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { PageShell, Section } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import mpdLogo from "@/assets/mpd-logo.png";
import tomImg from "@/assets/team-tom.jpg";
import romanImg from "@/assets/team-roman.jpg";
import robinImg from "@/assets/team-robin.jpg";
import matthiasImg from "@/assets/team-matthias.jpg";
import hansgroheLogo from "@/assets/company-hansgrohe.svg";
import supfinaLogo from "@/assets/company-supfina.png";
import kochLogo from "@/assets/company-koch.svg";

export const Route = createFileRoute("/unternehmen/team")({
  head: () => ({
    meta: [
      { title: "Team & Kontakt | MPD Systems and Solutions" },
      { name: "description", content: "Die Köpfe hinter MPD Systems and Solutions." },
    ],
  }),
  component: TeamPage,
});

const team = [
  {
    name: "Tom Furtwängler",
    role: "Head of Product Developing",
    company: "hansgrohe",
    companyLogo: hansgroheLogo,
    image: tomImg,
  },
  {
    name: "Roman Armbruster",
    role: "Head of Product Developing",
    company: "hansgrohe",
    companyLogo: hansgroheLogo,
    image: romanImg,
  },
  {
    name: "Robin Grießbaum",
    role: "Head of Marketing & Sales",
    company: "Supfina",
    companyLogo: supfinaLogo,
    image: robinImg,
  },
  {
    name: "Matthias Kugel",
    role: "Hardware Lead",
    company: "KOCH Uhlmann Group",
    companyLogo: kochLogo,
    image: matthiasImg,
  },
];

function TeamPage() {
  return (
    <PageShell title="Team & Kontakt" subtitle="Die Köpfe hinter MPD.">
      <Section title="Unser Team">
        <ul className="grid gap-6 sm:grid-cols-2">
          {team.map((m) => (
            <li key={m.name} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-[4/5] w-full overflow-hidden bg-muted">
                <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="text-base font-semibold text-foreground">{m.name}</div>
                <div className="mt-1 text-sm text-primary">{m.role}</div>
                <div className="mt-3 flex h-16 items-center border-t border-border pt-3">
                  <img
                    src={m.companyLogo}
                    alt={`${m.company} Logo`}
                    className="max-h-10 max-w-44 object-contain object-left"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Über MPD Systems and Solutions">
        <Card className="border-primary/30 bg-primary/10 p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <img
              src={mpdLogo}
              alt="MPD Systems and Solutions Logo"
              className="h-20 w-auto self-start"
            />
            <div>
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Building2 className="h-5 w-5 text-primary" />
                Schimmel erkennen, bevor er entsteht
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Gegründet 2025. Wir produzieren Schimmelpräventionsgeräte für private Haushalte und
                Geschäftskunden mit smarter Sensorik, die Risiken erkennt, bevor Schimmel entsteht.
              </p>
            </div>
          </div>
        </Card>
      </Section>

      <Section
        title="Kontakt"
        subtitle="Fragen zu unseren Produkten, einem Pilotprojekt oder einer Zusammenarbeit?"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <ContactCard
            icon={Mail}
            label="E-Mail"
            value="mpd.systemsandsolutions@gmail.com"
            href="mailto:mpd.systemsandsolutions@gmail.com"
          />
          <ContactCard icon={Phone} label="Telefon" value="07451 5210" href="tel:+4974515210" />
          <ContactCard
            icon={MapPin}
            label="Adresse"
            value="Florianstraße 15, 72160 Horb am Neckar"
            href="https://www.google.com/maps/search/?api=1&query=Florianstra%C3%9Fe+15%2C+72160+Horb+am+Neckar"
          />
        </div>
      </Section>
    </PageShell>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      <Card className="h-full border-border/60 p-5 transition-colors hover:border-primary/50 hover:bg-accent/30">
        <Icon className="h-5 w-5 text-primary" />
        <div className="mt-4 text-sm font-semibold text-foreground">{label}</div>
        <div className="mt-1 break-words text-sm text-muted-foreground">{value}</div>
      </Card>
    </a>
  );
}
