"use client";

import Link from "next/link";
import { Hero } from "@/components/ui";
import { siteConfig } from "@/lib/site-config";

const sponsorTiers = [
  {
    tier: "Host Organiser & Governing Bodies",
    badge: "Principal Host",
    partners: [
      { name: "Hobsons Bay Chess Club AU", desc: "Premier Melbourne Chess Club & Event Host" },
      { name: "FIDE Zone 3.6 Federation", desc: "Oceania Chess Governing Body" },
      { name: "Australian Chess Federation (ACF)", desc: "National Governing Body for Chess in Australia" },
    ],
  },
  {
    tier: "Supporting Partners & Equipment",
    badge: "Official Equipment",
    partners: [
      { name: "DGT Live Broadcast Transmissions", desc: "Official Electronic Board Provider" },
      { name: "Chess Victoria Inc.", desc: "State Junior Chess Development" },
    ],
  },
];

export function SponsorsPage() {
  return (
    <div className="space-y-8">
      <Hero
        eyebrow="Partnership & Sponsorship"
        title="Event Sponsors & Partners"
        description="Supporting junior chess excellence across Oceania. We extend our deepest gratitude to the federations, clubs, and partners supporting Oceania Youth 2027."
      />

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-6">
        {sponsorTiers.map((tier) => (
          <div key={tier.tier} className="space-y-4 border-b border-slate-800/80 pb-6 last:border-0 last:pb-0">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">{tier.tier}</h2>
              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-300">
                {tier.badge}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tier.partners.map((p) => (
                <div
                  key={p.name}
                  className="glass-card-hover rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-2"
                >
                  <span className="text-2xl">♟️</span>
                  <h3 className="font-display text-lg font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Become a Sponsor Callout */}
      <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 p-6 md:p-8 space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Sponsorship Opportunities
        </span>
        <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
          Partner With Oceania Youth 2027
        </h2>
        <p className="text-xs leading-relaxed text-slate-300 max-w-2xl">
          Empower the next generation of international chess champions. Explore custom sponsorship packages including live broadcast logo placements, trophy naming rights, and youth development grants.
        </p>
        <Link
          href="/contact-us"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:scale-105"
        >
          <span>Inquire About Partnership</span>
          <span>→</span>
        </Link>
      </section>
    </div>
  );
}

