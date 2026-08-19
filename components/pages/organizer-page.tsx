"use client";

import { Hero } from "@/components/ui";
import { organizerData } from "@/app/organizer/data";

export function OrganizerPage() {
  return (
    <div className="space-y-8">
      <Hero
        eyebrow="Event Leadership & Governance"
        title="Organising Committee"
        description="Introducing the tournament direction, arbiter panel, and organising committee structure behind Oceania Youth Zonal 2027."
      />

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            FIDE Zone 3.6 Leadership
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
            {organizerData.title}
          </h2>
          <p className="mt-2 text-xs text-slate-400 max-w-2xl">{organizerData.intro}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {organizerData.groups.map((group) => (
            <div
              key={group.title}
              className="glass-card-hover rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-4 backdrop-blur-md"
            >
              <h3 className="font-display text-xl font-bold text-amber-300 border-b border-slate-800 pb-2">
                {group.title}
              </h3>
              <div className="space-y-2.5">
                {group.staff.map((member) => (
                  <div
                    key={member.role}
                    className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 space-y-1"
                  >
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400 block">
                      {member.role}
                    </span>
                    <p className="text-xs font-bold text-white">{member.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

