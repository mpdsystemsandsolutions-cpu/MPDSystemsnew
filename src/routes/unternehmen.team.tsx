import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";
import tomImg from "@/assets/team-tom.jpg";
import romanImg from "@/assets/team-roman.jpg";
import robinImg from "@/assets/team-robin.jpg";
import matthiasImg from "@/assets/team-matthias.jpg";

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
    employer: "hansgrohe",
    image: tomImg,
  },
  {
    name: "Roman Armbruster",
    role: "Head of Product Developing",
    employer: "hansgrohe",
    image: romanImg,
  },
  {
    name: "Robin Grießbaum",
    role: "Head of Marketing & Sales",
    employer: "supfina",
    image: robinImg,
  },
  {
    name: "Matthias Kugel",
    role: "Hardware Lead",
    employer: "KOCH Uhlmann Group",
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
                <div className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">
                  Arbeitgeber: <span className="font-medium text-foreground">{m.employer}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  );
}
