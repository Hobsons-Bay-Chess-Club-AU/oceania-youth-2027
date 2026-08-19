"use client";

import { siteConfig } from "@/lib/site-config";
import { Hero } from "@/components/ui";

export function MapPage() {
  return (
    <div className="space-y-8">
      <Hero
        eyebrow="Interactive Location"
        title="Event Map & Directions"
        description="Full-screen interactive Google Map embed showing playing hall location, transit connections, and nearby amenities in Melbourne, Australia."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={siteConfig.links.mapEmbed}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-2.5 text-xs font-black uppercase text-slate-950 shadow-md transition hover:scale-105"
          >
            <span>Open Full Google Maps</span>
            <span>↗</span>
          </a>
        </div>
      </Hero>

      <section className="rounded-3xl border border-slate-800 bg-slate-950 p-3 shadow-2xl overflow-hidden space-y-3">
        <div className="flex items-center justify-between p-3 text-xs border-b border-slate-800">
          <span className="font-bold text-amber-300">Official Playing Hall Map</span>
          <span className="text-slate-400">Melbourne, VIC 3000</span>
        </div>
        <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-slate-800">
          <iframe
            src={siteConfig.links.mapEmbed}
            title="Oceania Youth event map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>
      </section>
    </div>
  );
}

