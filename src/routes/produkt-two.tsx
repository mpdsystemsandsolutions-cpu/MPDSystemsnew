import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/produkt-two")({
  head: () => ({
    meta: [
      { title: "MPD TWO | MPD Systems and Solutions" },
      {
        name: "description",
        content: "Produktseite fuer MPD TWO von MPD Systems and Solutions.",
      },
    ],
  }),
  component: ProduktTwoPage,
});

function ProduktTwoPage() {
  return <PageShell title="MPD TWO">{null}</PageShell>;
}
