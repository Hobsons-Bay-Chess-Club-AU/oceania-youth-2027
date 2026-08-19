"use client";

import Link from "next/link";
import { useState } from "react";
import { homePageData } from "@/app/data";
import { siteConfig } from "@/lib/site-config";
import { HomeHeroCountdown } from "@/components/home-hero-countdown";
import { HomeTournamentStats } from "@/components/home-tournament-stats";

const ageDivisions = [
  { group: "U8", open: "Under 8 Open", girls: "Under 8 Girls", note: "Born 2019 or later" },
  { group: "U10", open: "Under 10 Open", girls: "Under 10 Girls", note: "Born 2017 or later" },
  { group: "U12", open: "Under 12 Open", girls: "Under 12 Girls", note: "Born 2015 or later" },
  { group: "U14", open: "Under 14 Open", girls: "Under 14 Girls", note: "Born 2013 or later" },
  { group: "U16", open: "Under 16 Open", girls: "Under 16 Girls", note: "Born 2011 or later" },
  { group: "U18", open: "Under 18 Open", girls: "Under 18 Girls", note: "Born 2009 or later" },
  { group: "U20", open: "Under 20 Open", girls: "Under 20 Girls", note: "Junior Premier Championship" },
];

export function HomePage() {
  const [selectedGroup, setSelectedGroup] = useState(ageDivisions[3]); // Default U14

  return (
    <div className="space-y-10 md:space-y-14">
      {/* Hero Championship Section */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl md:p-10 lg:p-12">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="space-y-6 motion-rise-in lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-amber-300 backdrop-blur-md">
              <span className="text-sm">♟️</span>
              {homePageData.heroKicker}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-cyan-400">
                Presented by Hobsons Bay Chess Club AU
              </p>
              <h1 className="font-display text-3xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                Oceania Youth Chess Zonal 2027
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Welcome to the official digital portal for the 2027 Oceania Youth Zonal Championship. Access full tournament schedules, regulations, player lists, live board broadcasts, and venue travel guides for federations across Zone 3.6.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/20">
                {homePageData.dateLabel}
              </span>
              <a
                href="/OceaniaYouth%202027%20Tournament%20Pack.pdf"
                download="OceaniaYouth 2027 Tournament Pack.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-5 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 hover:-translate-y-0.5"
              >
                <span>📥 Download Tournament Pack (PDF)</span>
              </a>
              <Link
                href="/schedule"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/90 px-5 py-2.5 text-xs font-bold text-white transition hover:border-amber-400 hover:bg-slate-800 hover:-translate-y-0.5"
              >
                <span>Explore Schedule</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              {homePageData.quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="glass-card-hover rounded-2xl border border-slate-800 bg-slate-950/60 p-4 backdrop-blur-md"
                >
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                    {fact.label}
                  </p>
                  <p className="mt-1 font-display text-3xl font-extrabold text-amber-400">{fact.value}</p>
                  <p className="mt-1 text-xs text-slate-300 leading-snug">{fact.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="motion-rise-in-delayed lg:col-span-5">
            <HomeHeroCountdown
              dateLabel={homePageData.dateLabel}
              eventStartDate={homePageData.eventStartDate}
              registrationHref={siteConfig.links.registrations}
            />
          </div>
        </div>
      </section>

      {/* Live Notice & Stats Section */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="motion-rise-in rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-xl backdrop-blur-xl lg:col-span-5 md:p-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Official Bulletin
            </span>
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
            {homePageData.alert.title}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {homePageData.alert.items.map((item, index) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-xs leading-relaxed text-slate-300"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 font-bold text-cyan-400 text-[0.7rem]">
                  0{index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <HomeTournamentStats {...homePageData.tournamentStats} />
        </div>
      </section>

      {/* Interactive Age Division Pathways Preview */}
      <section className="motion-rise-in rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              14 Championship Categories
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Age Divisions & FIDE Pathways
            </h2>
          </div>
          <p className="max-w-md text-xs text-slate-400">
            Click on an age category to inspect Open and Girls divisional structures and qualification paths.
          </p>
        </div>

        {/* Division Selector Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          {ageDivisions.map((div) => (
            <button
              key={div.group}
              onClick={() => setSelectedGroup(div)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                selectedGroup.group === div.group
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                  : "border border-slate-800 bg-slate-950 text-slate-300 hover:border-amber-500/40 hover:text-white"
              }`}
            >
              Category {div.group}
            </button>
          ))}
        </div>

        {/* Selected Category Details */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-amber-500/20 bg-slate-950/80 p-5 space-y-2">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-400">
              Category Focus
            </span>
            <h3 className="font-display text-2xl font-bold text-white">{selectedGroup.group} Division</h3>
            <p className="text-xs text-slate-400">{selectedGroup.note}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-2">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-cyan-400">
              Open Tournament
            </span>
            <h3 className="font-display text-xl font-bold text-white">{selectedGroup.open}</h3>
            <p className="text-xs text-slate-400">
              9 Rounds Swiss Classical (90m + 30s increment). FIDE Rated with title norm pathways.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-2">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-pink-400">
              Girls Tournament
            </span>
            <h3 className="font-display text-xl font-bold text-white">{selectedGroup.girls}</h3>
            <p className="text-xs text-slate-400">
              Dedicated 9-round championship for female players across Zone 3.6 federations.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Look & Features Grid */}
      <section className="motion-rise-in rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md md:p-8">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Quick Reference
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
            Everything Families & Players Need
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {homePageData.eventDetails.map((item, index) => (
            <div
              key={item.title}
              className="glass-card-hover rounded-2xl border border-slate-800 bg-slate-950/70 p-5 backdrop-blur-md space-y-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 font-bold text-amber-400 text-xs">
                0{index + 1}
              </span>
              <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
              <p className="text-xs leading-relaxed text-slate-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stakes & Why Participate */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="motion-rise-in rounded-3xl border border-amber-500/20 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Championship Honors
          </span>
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Titles, Medals & Norm Opportunities
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            {homePageData.stakes.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1"
              >
                <h3 className="font-display text-base font-bold text-amber-300">{item.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="motion-rise-in-delayed rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            The Oceania Experience
          </span>
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Why Players & Families Attend
          </h2>
          <div className="space-y-3 pt-2">
            {homePageData.whyParticipate.map((item, index) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 font-bold text-cyan-400 text-xs">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-400">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Callout Banner */}
      <section className="motion-rise-in relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-slate-900 p-6 shadow-2xl backdrop-blur-xl md:p-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="space-y-3 lg:col-span-8">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Registration Status
            </span>
            <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
              Don&apos;t just play. Make Oceania history.
            </h2>
            <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
              {homePageData.registration.description}
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
            <div className="rounded-2xl border border-amber-500/30 bg-slate-950/90 p-5 text-center space-y-2 w-full max-w-xs">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                Entry Status
              </p>
              <p className="font-display text-2xl font-bold text-amber-300">
                {homePageData.registration.playersRegistered}
              </p>
              <Link
                href="/registration"
                className="block w-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 py-2.5 text-xs font-black uppercase text-slate-950 shadow-md transition hover:scale-105"
              >
                Pre-Register Interest
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="motion-rise-in rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Need Support?
          </span>
          <h2 className="font-display text-2xl font-bold text-white">Contact Organising Committee</h2>
          <p className="text-xs text-slate-400">
            Have questions about travel, entry conditions, or age group eligibility? Reach out to our organising team.
          </p>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
              {siteConfig.contact.coordinatorName}
            </div>
            <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
              Email: {siteConfig.contact.email}
            </div>
          </div>
          <Link
            href="/contact-us"
            className="inline-flex rounded-full border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            Send Inquiry Message →
          </Link>
        </div>

        <div className="motion-rise-in-delayed rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            FIDE Regulations
          </span>
          <h2 className="font-display text-2xl font-bold text-white">Tournament Manual</h2>
          <p className="text-xs text-slate-400">
            Review published guidelines regarding time controls, tie-breaks, norm eligibility, and player conduct.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href="/regulations"
              className="inline-flex rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:scale-105"
            >
              Read Regulations →
            </Link>
            <a
              href="/OceaniaYouth%202027%20Tournament%20Pack.pdf"
              download="OceaniaYouth 2027 Tournament Pack.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 hover:border-amber-400 hover:text-white transition"
            >
              <span>📥 Download Pack (PDF)</span>
            </a>
          </div>
          <p className="text-[0.7rem] text-slate-500 leading-relaxed">
            {siteConfig.organization.legalLine}
          </p>
        </div>
      </section>
    </div>
  );
}

