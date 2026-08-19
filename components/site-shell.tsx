"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems, type NavItem } from "@/app/navigation";
import { siteConfig } from "@/lib/site-config";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailSubcribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const normalizePath = (value: string) => {
    if (!value || value === "/") return "/";
    return value.endsWith("/") ? value.slice(0, -1) : value;
  };

  const currentPath = normalizePath(pathname);
  const isActiveLink = (href: string) => currentPath === normalizePath(href);
  const isGroupActive = (item: NavItem) =>
    "children" in item
      ? item.children.some((child) => isActiveLink(child.href))
      : isActiveLink(item.href);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [currentPath]);

  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, searchOpen]);

  // Keyboard shortcut Cmd+K / Ctrl+K for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchResults = [
    { title: "Tournament Schedule", category: "Schedule", href: "/schedule" },
    { title: "Official Regulations & FIDE Rules", category: "Regulations", href: "/regulations" },
    { title: "Player Directory & Age Divisions", category: "Players", href: "/players" },
    { title: "Live DGT Board Broadcasts", category: "Broadcast", href: "/dgt-boards" },
    { title: "Venue & Melbourne Location Guide", category: "Visit", href: "/location" },
    { title: "Latest News & Federation Updates", category: "News", href: "/news" },
    { title: "Registration Process & Fees", category: "Register", href: "/registration" },
    { title: "Contact Organising Committee", category: "Contact", href: "/contact-us" },
  ].filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      setEmailInput("");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      {/* Background glow accents */}
      <div className="pointer-events-none fixed -left-32 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px]" />
      <div className="pointer-events-none fixed -right-32 top-48 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="pointer-events-none fixed left-1/3 top-1/2 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-full border border-amber-500/30 bg-slate-900/80 px-3.5 py-1.5 backdrop-blur-md transition hover:border-amber-400 hover:bg-slate-900"
              onClick={() => setOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 font-display font-black text-slate-950 shadow-md shadow-amber-500/20 transition-transform group-hover:scale-105">
                OY
              </span>
              <div className="grid">
                <span className="font-display text-sm font-extrabold tracking-tight text-white group-hover:text-amber-300">
                  Oceania Youth 2027
                </span>
                <span className="text-[0.7rem] font-semibold text-slate-400">
                  Melbourne, Australia | Zone 3.6
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden items-center gap-1 min-[920px]:flex">
            {navItems.map((item) =>
              "children" in item ? (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isGroupActive(item)
                        ? "bg-slate-800 text-amber-300 border border-amber-500/30"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <svg
                      className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="pointer-events-none absolute right-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="w-56 rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                            isActiveLink(child.href)
                              ? "bg-amber-500/15 text-amber-300 border-l-2 border-amber-400"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActiveLink(item.href)
                      ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-300 backdrop-blur transition hover:border-amber-500/40 hover:text-white"
              title="Search website (Cmd+K)"
            >
              <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded bg-slate-800 px-1.5 py-0.5 text-[0.65rem] text-slate-400 sm:inline">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/registration"
              className="hidden items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md shadow-amber-500/20 transition hover:scale-105 sm:flex"
            >
              Register Interest
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/90 text-white min-[920px]:hidden"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle Navigation"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-2xl min-[920px]:hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-display font-extrabold text-slate-950 text-xs">
                OY
              </span>
              <span className="font-display font-bold text-white text-sm">Oceania Youth 2027</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) =>
              "children" in item ? (
                <div key={item.label} className="space-y-1">
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActiveLink(child.href)
                          ? "bg-amber-500/20 text-amber-300"
                          : "text-slate-300 hover:bg-slate-900"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActiveLink(item.href)
                      ? "bg-amber-500/20 text-amber-300"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-4 border-t border-slate-800">
              <Link
                href="/registration"
                className="flex w-full items-center justify-center rounded-full bg-amber-400 py-3 text-sm font-bold text-slate-950"
                onClick={() => setOpen(false)}
              >
                Register Interest
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Live Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-900 p-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 flex-1">
                <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  autoFocus
                  placeholder="Search pages, schedule, rules, players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-full p-1 text-xs text-slate-400 hover:text-white"
              >
                ESC
              </button>
            </div>
            <div className="mt-3 max-h-72 overflow-y-auto space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map((res) => (
                  <Link
                    key={res.href}
                    href={res.href}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-slate-800"
                  >
                    <span className="text-sm font-medium text-white">{res.title}</span>
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[0.7rem] font-bold text-amber-400">
                      {res.category}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">No matching sections found</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Championship Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/90 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Column 1: Organiser Branding & Subscription */}
            <div className="space-y-4 lg:col-span-1">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 font-display font-black text-slate-950 shadow-md">
                  OY
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-white">Oceania Youth 2027</h3>
                  <p className="text-xs text-slate-400">Zone 3.6 Championship</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Official tournament portal for the 2027 Oceania Youth Zonal Chess Championship hosted by Hobsons Bay Chess Club in Australia.
              </p>
              
              {/* Notification Subscription Widget */}
              <div className="pt-2">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Get Event Updates</p>
                {emailSubcribed ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-300">
                    ✓ Thank you! You will receive key announcements.
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-amber-400 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300"
                    >
                      Join
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Tournament Links</h4>
              <ul className="space-y-2 text-xs">
                {siteConfig.footer.coverageLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-400 hover:text-amber-300 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Regional Federations */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">FIDE Zone 3.6 Members</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">🇦🇺 Australia</span>
                <span className="flex items-center gap-1.5">🇳🇿 New Zealand</span>
                <span className="flex items-center gap-1.5">🇫🇯 Fiji</span>
                <span className="flex items-center gap-1.5">🇵🇬 Papua New Guinea</span>
                <span className="flex items-center gap-1.5">🇸🇧 Solomon Islands</span>
                <span className="flex items-center gap-1.5">🇵🇼 Palau</span>
              </div>
            </div>

            {/* Column 4: Contact & Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Organising Committee</h4>
              <p className="text-xs text-slate-400">{siteConfig.contact.coordinatorName}</p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-block text-xs font-semibold text-amber-300 hover:underline"
              >
                {siteConfig.contact.email}
              </a>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-[0.7rem] text-slate-400">
                {siteConfig.footer.statusText}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2027 Oceania Youth Chess Zonal. Organised by Hobsons Bay Chess Club AU.</p>
            <div className="flex gap-4">
              <Link href="/regulations" className="hover:text-slate-400">Regulations</Link>
              <Link href="/contact-us" className="hover:text-slate-400">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
