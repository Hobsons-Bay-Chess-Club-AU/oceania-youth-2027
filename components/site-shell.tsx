"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/app/navigation";
import { siteConfig } from "@/lib/site-config";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="site-frame">
      <div className="backdrop-orb backdrop-orb-left" />
      <div className="backdrop-orb backdrop-orb-right" />
      <header className="site-header">
        <div className="shell shell-header">
          <Link href="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark">OY</span>
            <span>
              <strong>Oceania Youth Chess</strong>
              <small>2027 host site</small>
            </span>
          </Link>
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            Menu
          </button>
          <nav className={`site-nav ${open ? "is-open" : ""}`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="shell page-shell">{children}</main>
      <footer className="site-footer">
        <div className="shell footer-shell">
          <div className="footer-hero">
            <p className="eyebrow">Oceania Youth Chess 2027</p>
            <h3>{siteConfig.organization.name}</h3>
            <p>{siteConfig.organization.legalLine}</p>
            <div className="footer-status">
              <span>{siteConfig.footer.statusLabel}</span>
              <p>{siteConfig.footer.statusText}</p>
            </div>
          </div>

          <div className="footer-grid">
            <div className="footer-card">
              <p className="eyebrow">{siteConfig.footer.sourceLabel}</p>
              <p>{siteConfig.footer.sourceText}</p>
              <a href={siteConfig.links.sourceReference} target="_blank" rel="noreferrer">
                Open reference source
              </a>
            </div>

            <div className="footer-card">
              <p className="eyebrow">{siteConfig.footer.coverageTitle}</p>
              <div className="footer-link-list">
                {siteConfig.footer.coverageLinks.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="footer-card">
              <p className="eyebrow">Contact</p>
              <div className="footer-contact-list">
                <p>{siteConfig.contact.coordinatorName}</p>
                <p>{siteConfig.contact.phoneLabel}</p>
                <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              </div>
            </div>
          </div>

          <div className="footer-note">
            <p>{siteConfig.footer.note}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
