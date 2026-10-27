"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/app/navigation";
import { siteConfig } from "@/lib/site-config";
const searchTitles: Record<string, string> = {
    "/schedule": "Tournament Schedule",
    "/regulations": "Official Regulations & FIDE Rules",
    "/players": "Player Directory & Age Divisions",
    "/dgt-boards": "Live DGT Board Broadcasts",
    "/location": "Venue & Melbourne Location Guide",
    "/news": "Latest News & Federation Updates",
    "/contact-us": "Contact Organising Committee",
};
const searchPages = [
    ...navItems.flatMap(item => "children" in item ? item.children : [item]).map(item => ({ ...item, title: searchTitles[item.href] || item.label })),
    { href: "/registration", label: "Registration", title: "Registration Process & Fees" },
];
export function SiteShell({ children }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [informationOpen, setInformationOpen] = useState(false);
    const [theme, setTheme] = useState("light");
    const [query, setQuery] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const dialog = useRef<HTMLDialogElement>(null);
    const searchInput = useRef<HTMLInputElement>(null);
    function openSearch() {
        dialog.current?.showModal();
        searchInput.current?.focus();
    }
    useEffect(() => {
        const system = window.matchMedia("(prefers-color-scheme: dark)");
        function syncTheme() {
            let saved: string | null = null;
            try {
                saved = localStorage.getItem("oy27-v2-theme");
            }
            catch { }
            const resolved = saved === "light" || saved === "dark" ? saved : system.matches ? "dark" : "light";
            document.documentElement.dataset.theme = resolved;
            setTheme(resolved);
        }
        syncTheme();
        system.addEventListener("change", syncTheme);
        function keyboard(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                if (dialog.current?.open)
                    dialog.current.close();
                else
                    openSearch();
            }
            if (e.key === "Escape") {
                setMenuOpen(false);
                setInformationOpen(false);
            }
        }
        document.addEventListener("keydown", keyboard);
        return () => { system.removeEventListener("change", syncTheme); document.removeEventListener("keydown", keyboard); };
    }, []);
    useEffect(() => {
        setMenuOpen(false);
        setInformationOpen(false);
        dialog.current?.close();
    }, [pathname]);
    function toggleTheme() {
        const next = theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        setTheme(next);
        try {
            localStorage.setItem("oy27-v2-theme", next);
        }
        catch { }
    }
    function isActive(href: string) {
        return pathname.replace(/\/$/, "") === href.replace(/\/$/, "");
    }
    return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <Link href="/" className="brand">
        <img src="/pacific/mark.svg" alt="" className="brand-symbol" width="36" height="44"/>
        <div className="subgrid"><span>Oceania Youth 2027</span><span>Melbourne, Australia | Zone 3.6</span></div>
      </Link>
      <nav aria-label="Main navigation" className={`site-nav${menuOpen ? " open" : ""}`} id="site-navigation">
        {navItems.map(item => "children" in item ?
            <div key={item.label} className={`nav-dropdown${informationOpen ? " open" : ""}`}>
            <button type="button" aria-expanded={informationOpen} aria-controls="information-links" onClick={() => setInformationOpen(!informationOpen)}>{item.label} <span aria-hidden="true">⌄</span></button>
            <div className="dropdown-panel" id="information-links" hidden={!informationOpen}>{item.children.map(child => <Link key={child.href} href={child.href} aria-current={isActive(child.href) ? "page" : undefined}>{child.label}</Link>)}</div>
          </div> :
            <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>{item.label}</Link>)}
        <Link className="mobile-nav-action" href="/registration">Register Interest ↗</Link>
        <button className="mobile-nav-action" type="button" onClick={openSearch}>Search website</button>
      </nav>
      <div className="header-tools">
        <button className="search-trigger" onClick={openSearch} aria-label="Search website (Cmd+K)"><svg className="ui-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
        <Link href="/registration" className="register-link">Register Interest</Link>
        <button type="button" className="theme-toggle" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} onClick={toggleTheme}>◐</button>
        <button type="button" className="mobile-menu" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-controls="site-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>
    </header>
    <main id="main">{children}</main>
    <footer className="site-footer">
    <div>
    <div className="subgrid">
    <div>
    <div className="flexline">
    <span>OY</span><div>
    <h3 className="footer-title">Oceania Youth 2027</h3><p>Zone 3.6 Championship</p></div>
    </div>
    <p>Official tournament portal for the 2027 Oceania Youth Zonal Chess Championship hosted by Hobsons Bay Chess Club in Australia.</p><div>
    <p className="eyebrow">Get Event Updates</p>{subscribed ? <p role="status">✓ Thank you! You will receive key announcements.</p> : <form onSubmit={e => { e.preventDefault(); setSubscribed(true); }}><input type="email" required aria-label="Email address for updates" placeholder="Enter your email"/><button type="submit">Join</button></form>}</div>
    </div>
    <div>
    <h4 className="eyebrow">Tournament Links</h4><ul>
    <li>
    <Link href="/news">News &amp; Updates</Link></li>
    <li>
    <Link href="/schedule">Tournament Schedule</Link></li>
    <li>
    <Link href="/regulations">Regulations</Link></li>
    <li>
    <Link href="/players">Player Directory</Link></li>
    <li>
    <Link href="/location">Venue &amp; Travel</Link></li>
    <li>
    <Link href="/registration">Registration Portal</Link></li>
    <li>
    <Link href="/dgt-boards">Live DGT Boards</Link></li>
    </ul>
    </div>
    <div>
    <h4 className="eyebrow">FIDE Zone 3.6 Members</h4><div className="subgrid">
    <span>🇦🇺 Australia</span><span>🇳🇿 New Zealand</span><span>🇫🇯 Fiji</span><span>🇵🇬 Papua New Guinea</span><span>🇸🇧 Solomon Islands</span><span>🇵🇼 Palau</span></div>
    </div>
    <div>
    <h4 className="eyebrow">Organising Committee</h4><p>{siteConfig.contact.coordinatorName}</p><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a><div>
Oceania Youth Zonal 2027 takes place 27 September – 4 October 2027 at Bacchus Marsh Grammar – Woodlea Campus in Melbourne, Australia.</div>
    </div>
    </div>
    <div className="flexline">
    <p>© 2027 Oceania Youth Chess Zonal. Organised by Hobsons Bay Chess Club AU.</p><div className="flexline">
    <Link href="/regulations">Regulations</Link><Link href="/contact-us">Contact</Link></div>
    </div>
    </div>
    </footer>

    <dialog ref={dialog} className="site-search" aria-labelledby="search-title" onClick={e => {
            if (e.target === e.currentTarget)
                dialog.current?.close();
        }}>
      <button type="button" className="dialog-close" aria-label="Close search" onClick={() => dialog.current?.close()}>×</button>
      <h2 id="search-title">Search the website</h2>
      <input ref={searchInput} aria-label="Search pages" placeholder="Search schedule, regulations, players…" value={query} onChange={e => setQuery(e.target.value)}/>
      <div className="search-results">{searchPages.filter(item => `${item.label} ${item.title}`.toLowerCase().includes(query.toLowerCase())).map(item => <Link key={item.href} href={item.href} onClick={() => dialog.current?.close()}>{item.title}</Link>)}{!searchPages.some(item => `${item.label} ${item.title}`.toLowerCase().includes(query.toLowerCase())) && <p>No pages match your search.</p>}</div>
    </dialog>
  </>;
}
