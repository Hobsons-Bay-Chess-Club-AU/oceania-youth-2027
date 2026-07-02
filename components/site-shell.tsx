"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/app/navigation";
import { siteConfig } from "@/lib/site-config";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navLinkBase =
    "rounded-full px-3.5 py-2 text-[0.95rem] text-white/85 transition hover:bg-white/12 hover:text-white";
  const mobileNavLinkBase =
    "flex min-h-12 items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-base text-white/85 transition hover:bg-white/12 hover:text-white";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed left-[-6rem] top-24 h-64 w-64 rounded-full bg-[rgba(199,137,27,0.2)] opacity-45 blur-[70px]" />
      <div className="pointer-events-none fixed right-[-5rem] top-56 h-80 w-80 rounded-full bg-[rgba(23,52,99,0.12)] opacity-45 blur-[70px]" />
      <header className="sticky inset-x-0 top-0 z-40 bg-[linear-gradient(180deg,rgba(12,34,70,0.94),rgba(12,34,70,0))] backdrop-blur-[10px] max-[920px]:bg-[rgba(12,34,70,0.98)] max-[920px]:shadow-[0_10px_30px_rgba(12,34,70,0.18)]">
        <div className="mx-auto flex w-[min(1180px,calc(100%-1rem))] items-center justify-between gap-4 rounded-b-[1.1rem] bg-[rgba(12,34,70,0.94)] px-4 py-3 shadow-[0_20px_60px_rgba(23,52,99,0.12)] backdrop-blur-[22px] sm:w-[min(1180px,calc(100%-2rem))] sm:rounded-b-[1.5rem] sm:px-5 sm:py-[0.95rem] max-[920px]:shadow-none">
          <Link href="/" className="flex min-w-0 items-center gap-3 text-white" onClick={() => setOpen(false)}>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(135deg,var(--gold),#ffe2a3)] font-extrabold text-[var(--navy-deep)]">
              OY
            </span>
            <span className="grid min-w-0 gap-[0.15rem]">
              <strong className="block text-base leading-[1.1] [font-family:var(--font-display)] sm:text-[1.05rem]">
                Oceania Youth Chess Zonal
              </strong>
              <small className="block text-[0.76rem] leading-[1.2] text-white/70 sm:text-sm">
                Melbourne, Australia | 2027
              </small>
            </span>
          </Link>
          <nav className="hidden flex-wrap items-center gap-2 min-[921px]:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${navLinkBase} ${pathname === item.href ? "bg-white/12 text-white" : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="inline-flex h-[2.9rem] w-[2.9rem] shrink-0 flex-col justify-center gap-[0.22rem] rounded-full border border-white/15 bg-white/5 p-0 text-white min-[921px]:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            <span
              className={`mx-auto block h-[2px] w-4 rounded-full bg-current transition ${open ? "translate-y-[4px] rotate-45" : ""}`}
            />
            <span
              className={`mx-auto block h-[2px] w-4 rounded-full bg-current transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`mx-auto block h-[2px] w-4 rounded-full bg-current transition ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
            />
          </button>
        </div>
        <div
          className={`fixed inset-0 bg-[rgba(5,12,28,0.45)] transition min-[921px]:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          onClick={() => setOpen(false)}
          aria-hidden={!open}
        />
        <div
          className={`fixed left-2 right-2 top-[4.35rem] grid max-h-[calc(100dvh-5rem)] gap-4 overflow-y-auto rounded-[0.9rem] border border-white/10 bg-[rgba(12,34,70,0.98)] p-4 shadow-[0_20px_60px_rgba(23,52,99,0.12)] transition min-[921px]:hidden md:rounded-[1.25rem] ${open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2.5 opacity-0"}`}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="m-0 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--gold)]">
              Menu
            </p>
            <button
              type="button"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              Close
            </button>
          </div>
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${mobileNavLinkBase} ${pathname === item.href ? "bg-white/12 text-white" : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto grid w-[min(1180px,calc(100%-1rem))] gap-4 px-0 py-[0.8rem] pb-12 sm:w-[min(1180px,calc(100%-2rem))] sm:gap-6 sm:py-4 sm:pb-16">
        {children}
      </main>
      <footer className="pb-8">
        <div className="mx-auto grid w-[min(1180px,calc(100%-1rem))] gap-4 rounded-[1rem] bg-[linear-gradient(180deg,rgba(12,34,70,0.96),rgba(8,24,49,0.98))] p-5 text-white shadow-[0_20px_60px_rgba(23,52,99,0.12)] sm:w-[min(1180px,calc(100%-2rem))] sm:p-8 md:rounded-[1.5rem]">
          <div className="grid gap-3 border-b border-white/10 pb-4">
            <p className="m-0 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--gold)]">
              Oceania Youth Zonal 2027
            </p>
            <h3 className="text-2xl [font-family:var(--font-display)]">
              {siteConfig.organization.name}
            </h3>
            <p className="leading-[1.7] text-white">{siteConfig.organization.legalLine}</p>
            <div className="mt-2 grid gap-2 rounded-[0.9rem] border border-white/10 bg-white/5 p-4 md:rounded-[1.25rem]">
              <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.08em]">
                {siteConfig.footer.statusLabel}
              </span>
              <p className="leading-[1.7] text-white">{siteConfig.footer.statusText}</p>
            </div>
          </div>

          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            <div className="grid gap-4 rounded-[0.9rem] border border-white/10 bg-white/5 p-4 md:rounded-[1.4rem]">
              <p className="m-0 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--gold)]">
                {siteConfig.footer.coverageTitle}
              </p>
              <div className="grid gap-3">
                {siteConfig.footer.coverageLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl bg-white/5 px-4 py-3 text-white transition hover:-translate-y-px hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-4 rounded-[0.9rem] border border-white/10 bg-white/5 p-4 md:rounded-[1.4rem]">
              <p className="m-0 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--gold)]">
                Contact
              </p>
              <div className="grid gap-3 text-white">
                <p>{siteConfig.contact.coordinatorName}</p>
                <p>{siteConfig.contact.phoneLabel}</p>
                <a className="text-white" href={`mailto:${siteConfig.contact.email}`}>
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-1">
            <p className="leading-[1.7] text-white">{siteConfig.footer.note}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
