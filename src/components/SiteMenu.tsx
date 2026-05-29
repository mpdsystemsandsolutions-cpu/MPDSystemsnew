import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Home, Building2, Target, Users, LogIn } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import mpdLogo from "@/assets/mpd-logo.png";
import mpdDevice from "@/assets/mpd-one-device.png";

type Item = {
  to: string;
  label: string;
  icon?: typeof Home;
  image?: string;
};

const sections: { label: string; items: Item[] }[] = [
  {
    label: "Start",
    items: [
      { to: "/", label: "Dashboard", icon: Home },
      { to: "/auth", label: "Anmelden", icon: LogIn },
    ],
  },
  {
    label: "Produkt",
    items: [
      { to: "/produkt", label: "MPD ONE", image: mpdDevice },
      { to: "/produkt-two", label: "MPD TWO", image: mpdDevice },
    ],
  },
  {
    label: "Unternehmen",
    items: [
      { to: "/unternehmen", label: "Über MPD", icon: Building2 },
      { to: "/unternehmen/team", label: "Team & Kontakt", icon: Users },
    ],
  },
  {
    label: "Markt",
    items: [{ to: "/markt", label: "MVP, USP & Personas", icon: Target }],
  },
];

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium hover:bg-accent transition-colors">
        <Menu className="h-4 w-4" />
        Menü
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <img src={mpdLogo} alt="MPD" className="h-10 w-auto" />
            <span className="text-base">MPD Systems<br />and Solutions</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 space-y-6">
          {sections.map((s) => (
            <div key={s.label}>
              <div className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <ul className="mt-2 space-y-0.5">
                {s.items.map((it) => (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      onClick={() => setOpen(false)}
                      activeOptions={{ exact: true }}
                      activeProps={{ className: "bg-accent text-foreground" }}
                      className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      {it.image ? (
                        <img
                          src={it.image}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded-md object-cover"
                        />
                      ) : it.icon ? (
                        <it.icon className="h-4 w-4 text-primary" />
                      ) : null}
                      <span>{it.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
