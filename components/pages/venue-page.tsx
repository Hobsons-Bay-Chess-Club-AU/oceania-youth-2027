"use client";

import Link from "next/link";
import { Hero } from "@/components/ui";
import { venueData } from "@/app/venue/data";

export function VenuePage() {
  return (
    <div className="space-y-8">
      <Hero
        eyebrow="Playing Hall & Logistics"
        title="Venue, Accommodation & Dining"
        description="Comprehensive logistics guide for players, parents, and federations attending Oceania Youth 2027."
      />

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Playing Venue
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
            {venueData.venue.name}
          </h2>
          <p className="mt-1 text-xs text-slate-300">{venueData.venue.address}</p>
        </div>

        <p className="text-xs leading-relaxed text-slate-300">{venueData.venue.note}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">✈️ Airport Travel</span>
            <p className="text-xs leading-relaxed text-slate-300">{venueData.byAir}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">🚆 Transit & Trams</span>
            <p className="text-xs leading-relaxed text-slate-300">{venueData.byTransport}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Recommended Accommodation</h2>
          <div className="space-y-3">
            {venueData.accommodation.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <h3 className="font-display text-base font-bold text-white">{item.name}</h3>
                  <span className="font-bold text-emerald-400">{item.distance}</span>
                </div>
                <p className="text-xs text-slate-400">{item.address}</p>
                {item.offer && (
                  <span className="inline-block mt-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-300">
                    {item.offer}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Food & Catering</h2>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-slate-300">
            <span className="font-bold text-amber-300 block mb-1">On-Site Options</span>
            {venueData.onSiteFoodIntro}
          </div>
          <div className="space-y-3">
            {venueData.nearbyEateries.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <h3 className="font-display text-base font-bold text-white">{item.name}</h3>
                  <span className="font-bold text-amber-300">{item.distance}</span>
                </div>
                <p className="text-xs text-slate-400">{item.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

