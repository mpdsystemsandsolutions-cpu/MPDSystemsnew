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
  title?: string;
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

        {title && (
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
            {subtitle && (
              <p className="mt-3 text-base text-muted-foreground md:text-lg">{subtitle}</p>
            )}
          </div>
        )}

        <div className="space-y-10">{children}</div>

        <footer className="mt-16 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} MPD Systems and Solutions</span>
          <a
            href="mailto:mpd.systemsandsolutions@gmail.com"
            className="transition-colors hover:text-foreground"
          >
            mpd.systemsandsolutions@gmail.com
          </a>
        </footer>
      </div>
    </main>
  );
}

export function Section({
  title,
  eyebrow,
  subtitle,
  children,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section>
      {eyebrow && <div className="mb-2 text-sm font-medium text-primary">{eyebrow}</div>}
      <h2 className="text-xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      {subtitle && (
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">{subtitle}</p>
      )}
      <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
        {children}
      </div>
    </section>
  );
}
