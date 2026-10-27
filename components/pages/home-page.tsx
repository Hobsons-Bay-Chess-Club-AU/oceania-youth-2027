"use client";
import Link from "next/link";
import { useState } from "react";
import { homePageData } from "@/app/data";
import { siteConfig } from "@/lib/site-config";
import { HomeHeroCountdown } from "@/components/home-hero-countdown";
export function HomePage() {
    const [selectedAge, setSelectedAge] = useState(14);
    return (<div className="page-home">
    <section className="home-lead">
    <div className="home-copy">
    <div className="home-eyebrow">
    <span>♟️</span>{homePageData.heroKicker}</div>
    <div>
    <p className="eyebrow">Presented by Hobsons Bay Chess Club AU</p><h1>Oceania Youth <span className="title-second">Chess Zonal </span><span className="title-year">2027</span></h1><p>Welcome to the official digital portal for the 2027 Oceania Youth Zonal Championship. Access full tournament schedules, regulations, player lists, live board broadcasts, and venue travel guides for federations across Zone 3.6.</p></div>
    <div className="hero-actions">
    <span className="eyebrow">{homePageData.dateLabel}</span><a href="/OceaniaYouth%202027%20Tournament%20Pack.pdf" download="OceaniaYouth 2027 Tournament Pack.pdf" target="_blank" rel="noreferrer" className="action"><span>📥 Download Tournament Pack (PDF)</span></a><Link href="/schedule" className="action"><span>Explore Schedule</span><span>→</span></Link></div>
    </div>
    <div aria-hidden="true" className="home-art">
    </div>
    </section>
    <div className="home-stats">{homePageData.quickFacts.map(fact => <div key={fact.label}><p className="eyebrow">{fact.label}</p><p className="metric">{fact.value}</p><p>{fact.note}</p></div>)}</div>
    <section className="entry-banner">
    <div className="subgrid">
    <div>
    <span className="eyebrow">Registration Status</span><h2>Don't just play. Make Oceania history.</h2><p>{homePageData.registration.description}</p></div>
    <div className="flexline">
    <div>
    <p className="eyebrow">Entry Status</p><p className="metric">{homePageData.registration.playersRegistered}</p><Link href="/registration" className="action">Pre-Register Interest</Link></div>
    </div>
    </div>
    </section>
    <HomeHeroCountdown dateLabel={homePageData.dateLabel} eventStartDate={homePageData.eventStartDate} registrationHref={siteConfig.links.registrations}/><div className="bulletin">
    <div className="flexline">
    <span className="eyebrow">Official Bulletin</span><span></span></div>
    <h2>{homePageData.alert.title}</h2><ul>{homePageData.alert.items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><span>{item}</span></li>)}</ul></div>
    <section className="age-explorer" data-age-explorer="true">
    <div className="flexline">
    <div>
    <span className="eyebrow">14 Championship Categories</span><h2>Age Divisions &amp; FIDE Pathways</h2></div>
    <p>Click on an age category to inspect Open and Girls divisional structures and qualification paths.</p></div>
    <div className="flexline">
    {[8, 10, 12, 14, 16, 18, 20].map(age => <button key={age} type="button" aria-pressed={selectedAge === age} onClick={() => setSelectedAge(age)}>U{age}</button>)}</div>
    <div className="subgrid">
    <div>
    <span className="eyebrow">Category Focus</span><h3>U{selectedAge} Division</h3><p>{selectedAge === 20 ? "Junior Premier Championship" : `Born ${2027 - selectedAge} or later`}</p></div>
    <div>
    <span className="eyebrow">Open Tournament</span><h3>Under {selectedAge} Open</h3><p>9 Rounds Swiss Classical (90m + 30s increment). FIDE Rated with title norm pathways.</p></div>
    <div>
    <span className="eyebrow">Girls Tournament</span><h3>Under {selectedAge} Girls</h3><p>Dedicated 9-round championship for female players across Zone 3.6 federations.</p></div>
    </div>
    </section>
    <section className="quick-reference">
    <div>
    <span className="eyebrow">Quick Reference</span><h2>Everything Families &amp; Players Need</h2></div>
    <div className="subgrid">
    <div>
    <span>01</span><h3>{homePageData.eventDetails[0].title}</h3><p>{homePageData.eventDetails[0].body}</p></div>
    <div>
    <span>02</span><h3>{homePageData.eventDetails[1].title}</h3><p>{homePageData.eventDetails[1].body}</p></div>
    <div>
    <span>03</span><h3>{homePageData.eventDetails[2].title}</h3><p>{homePageData.eventDetails[2].body}</p></div>
    <div>
    <span>04</span><h3>{homePageData.eventDetails[3].title}</h3><p className="region-names">{homePageData.eventDetails[3].body}</p><div aria-hidden="true" className="region-portrait">
    <img src="/pacific/countries/au.svg" alt=""/><img src="/pacific/countries/nz.svg" alt=""/><img src="/pacific/countries/fj.svg" alt=""/><img src="/pacific/countries/pg.svg" alt=""/><img src="/pacific/countries/sb.svg" alt=""/><img src="/pacific/countries/pw.svg" alt=""/><img src="/pacific/countries/gu.svg" alt=""/><img src="/pacific/countries/nr.svg" alt=""/><img src="/pacific/countries/nc.svg" alt=""/><img src="/pacific/countries/to.svg" alt=""/><img src="/pacific/countries/vu.svg" alt=""/><img src="/pacific/countries/ki.svg" alt=""/><img src="/pacific/countries/mh.svg" alt=""/></div>
    </div>
    </div>
    </section>
    <div className="editorial-pair">
    <div className="honours">
    <span className="eyebrow">Championship Honors</span><h2>Titles, Medals &amp; Norm Opportunities</h2><div className="subgrid">
    <div>
    <h3>{homePageData.stakes[0].title}</h3><p>{homePageData.stakes[0].body}</p></div>
    <div>
    <h3>{homePageData.stakes[1].title}</h3><p>{homePageData.stakes[1].body}</p></div>
    <div>
    <h3>{homePageData.stakes[2].title}</h3><p>{homePageData.stakes[2].body}</p></div>
    <div>
    <h3>{homePageData.stakes[3].title}</h3><p>{homePageData.stakes[3].body}</p></div>
    </div>
    </div>
    <div className="experience">
    <span className="eyebrow">The Oceania Experience</span><h2>Why Players &amp; Families Attend</h2><div>
    <div className="flexline">
    <span>1</span><div>
    <h3>{homePageData.whyParticipate[0].title}</h3><p>{homePageData.whyParticipate[0].body}</p></div>
    </div>
    <div className="flexline">
    <span>2</span><div>
    <h3>{homePageData.whyParticipate[1].title}</h3><p>{homePageData.whyParticipate[1].body}</p></div>
    </div>
    <div className="flexline">
    <span>3</span><div>
    <h3>{homePageData.whyParticipate[2].title}</h3><p>{homePageData.whyParticipate[2].body}</p></div>
    </div>
    <div className="flexline">
    <span>4</span><div>
    <h3>{homePageData.whyParticipate[3].title}</h3><p>{homePageData.whyParticipate[3].body}</p></div>
    </div>
    </div>
    </div>
    </div>
    <div className="snapshot">
    <article>
    <div className="flexline">
    <div>
    <span className="eyebrow">{homePageData.tournamentStats.heading}</span><h2>{homePageData.tournamentStats.title}</h2></div>
    <span>{homePageData.tournamentStats.badge}</span></div>
    <p>{homePageData.tournamentStats.description}</p><div className="subgrid">
    <div>
    <div className="flexline">
    <span>🌐</span><span className="eyebrow">Target</span></div>
    <p className="metric">13</p><p>Federations</p></div>
    <div>
    <div className="flexline">
    <span>🏆</span><span className="eyebrow">Target</span></div>
    <p className="metric">14</p><p>{homePageData.quickFacts[0].label}</p></div>
    <div>
    <div className="flexline">
    <span>♟️</span><span className="eyebrow">Target</span></div>
    <p className="metric">25</p><p>Rounds</p></div>
    <div>
    <div className="flexline">
    <span>🎯</span><span className="eyebrow">Target</span></div>
    <p className="metric">7</p><p>Age Divisions</p></div>
    </div>
    </article>
    </div>
    <div className="original-banner" id="championship-banner">
    <div>
    <img alt="Oceania Youth Chess Zonal Championship 2027" width="1600" height="900" decoding="async" src="/hero.png" loading="lazy"/></div>
    <div className="banner-controls">
    <a className="action" href="#main">Overview</a><a className="action" href="#championship-banner">Banner</a></div>
    </div>
    <section className="support-split">
    <div>
    <span className="eyebrow">Need Support?</span><h2>Contact Organising Committee</h2><p>Have questions about travel, entry conditions, or age group eligibility? Reach out to our organising team.</p><div>
    <div>
IA Casey Goh (Event Director) &amp; HBCC Committee</div>
    <div>
Email: major_tournaments@hobsonsbaychess.com</div>
    </div>
    <Link href="/contact-us" className="action">Send Inquiry Message →</Link></div>
    <div>
    <span className="eyebrow">FIDE Regulations</span><h2>Tournament Manual</h2><p>Review published guidelines regarding time controls, tie-breaks, norm eligibility, and player conduct.</p><div className="flexline">
    <Link href="/regulations" className="action">Read Regulations →</Link><a href="/OceaniaYouth%202027%20Tournament%20Pack.pdf" download="OceaniaYouth 2027 Tournament Pack.pdf" target="_blank" rel="noreferrer" className="action"><span>📥 Download Pack (PDF)</span></a></div>
    <p>Official championship platform for player registration, schedules, regulations, and live broadcasts.</p></div>
    </section>
    </div>);
}
