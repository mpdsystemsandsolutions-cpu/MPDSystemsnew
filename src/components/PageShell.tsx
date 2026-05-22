import { ReactNode } from "react";
import { SiteMenu } from "./SiteMenu";
import { ThemeToggle } from "./ThemeToggle";
import mpdLogo from "@/assets/mpd-logo.png";
import { Link } from "@tanstack/react-router";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <header className="mb-10 flex items-center justify-between gap-4">
          <SiteMenu />
          <Link to="/" className="flex items-center gap-3">
            <img src={mpdLogo} alt="MPD" className="h-10 w-auto" />
            <span className="hidden text-sm font-semibold sm:inline">
              MPD Systems and Solutions
            </span>
          </Link>
          <ThemeToggle />
        </header>

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-base text-muted-foreground md:text-lg">{subtitle}</p>
          )}
        </div>

        <div className="space-y-10">{children}</div>
      </div>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
        {children}
      </div>
    </section>
  );
}
