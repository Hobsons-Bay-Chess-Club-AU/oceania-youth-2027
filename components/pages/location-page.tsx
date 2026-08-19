"use client";

import { siteConfig } from "@/lib/site-config";
import { venueData } from "@/app/venue/data";
import { Hero } from "@/components/ui";

const arrivalCards = [
  {
    title: "Playing Hall Venue",
    body: venueData.venue.name,
    accent: "text-amber-400 border-amber-500/30",
  },
  {
    title: "Best For",
    body: "Junior players, families, and team delegations planning daily movement.",
    accent: "text-cyan-400 border-cyan-500/30",
  },
  {
    title: "Key Amenities",
    body: "Analysis rooms, parent lounge, cafeteria, public transit, and hotel hubs.",
    accent: "text-emerald-400 border-emerald-500/30",
  },
];

export function LocationPage() {
  return (
    <div className="space-y-8">
      <Hero
        eyebrow="Host City & Venue Guide"
        title="Location & Venue Information"
        description="Comprehensive travel, accommodation, public transport, and venue details for families and federations attending Oceania Youth 2027 in Melbourne, Australia."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={siteConfig.links.mapEmbed}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-2.5 text-xs font-black uppercase text-slate-950 shadow-md transition hover:scale-105"
          >
            <span>Open Google Maps</span>
            <span>↗</span>
          </a>
        </div>
      </Hero>

      {/* Main Venue Snapshot Grid */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Playing Hall
            </span>
            <h2 className="mt-1 font-display text-3xl font-bold text-white">
              {venueData.venue.name}
            </h2>
            <p className="mt-2 text-xs text-slate-300">{venueData.venue.address}</p>
          </div>

          <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
            {venueData.venue.note}
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {arrivalCards.map((card) => (
              <div
                key={card.title}
                className={`rounded-2xl border bg-slate-950/80 p-4 space-y-1 ${card.accent}`}
              >
                <span className="text-[0.65rem] font-bold uppercase tracking-wider block">
                  {card.title}
                </span>
                <p className="text-xs leading-snug text-slate-300">{card.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Embedded Interactive Map */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-950 p-2 shadow-2xl overflow-hidden flex flex-col justify-between">
          <div className="p-3 text-xs text-slate-400 flex items-center justify-between border-b border-slate-800 mb-2">
            <span className="font-bold text-amber-300">Live Map View</span>
            <span>Melbourne, VIC Australia</span>
          </div>
          <div className="h-80 w-full rounded-2xl overflow-hidden">
            <iframe
              src={siteConfig.links.mapEmbed}
              title="Oceania Youth venue map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      </section>

      {/* Travel & Public Transport */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md md:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Getting to Melbourne
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
            Airport Connections & Local Transit
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              ✈️ International Air Travel
            </span>
            <p className="text-xs leading-relaxed text-slate-300">{venueData.byAir}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              🚆 Trains, Trams & SkyBus
            </span>
            <p className="text-xs leading-relaxed text-slate-300">{venueData.byTransport}</p>
          </div>
        </div>

        {/* Transport Routes */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Recommended Transit Routes</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {venueData.transportRoutes.map((route) => (
              <a
                key={route.label}
                href={route.href}
                target="_blank"
                rel="noreferrer"
                className="glass-card-hover block rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-amber-400"
              >
                <p className="font-display text-sm font-bold text-white">{route.label}</p>
                <p className="mt-1 text-xs text-slate-400">{route.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodation & Dining */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Hotel Recommendations
          </span>
          <h2 className="font-display text-2xl font-bold text-white">Nearby Accommodation</h2>
          <div className="space-y-3 pt-2">
            {venueData.accommodation.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1"
              >
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

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Dining & Cafes
          </span>
          <h2 className="font-display text-2xl font-bold text-white">Eateries Near Playing Hall</h2>
          <div className="space-y-3 pt-2">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-slate-300">
              <span className="font-bold text-amber-300 block mb-1">On-Site Catering</span>
              {venueData.onSiteFoodIntro}
            </div>
            {venueData.nearbyEateries.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1"
              >
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

