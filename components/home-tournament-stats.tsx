"use client";

import { useEffect, useState } from "react";

type TournamentStatsProps = {
  heading: string;
  title: string;
  badge: string;
  description: string;
  stats: Record<string, number>;
};

const statIcons: Record<string, string> = {
  Federations: "🌐",
  Championships: "🏆",
  Rounds: "♟️",
  AgeGroups: "🎯",
};

export function HomeTournamentStats({
  heading,
  title,
  badge,
  description,
  stats,
}: TournamentStatsProps) {
  const entries = Object.entries(stats);
  const [counts, setCounts] = useState(() => entries.map(() => 0));

  useEffect(() => {
    const durationMs = 1200;
    const frameMs = 24;
    const steps = Math.max(1, Math.floor(durationMs / frameMs));
    let step = 0;

    const timer = window.setInterval(() => {
      step += 1;
      const progress = Math.min(1, step / steps);
      const eased = 1 - (1 - progress) * (1 - progress);

      setCounts(entries.map(([, value]) => Math.round(value * eased)));

      if (progress >= 1) {
        window.clearInterval(timer);
      }
    }, frameMs);

    return () => window.clearInterval(timer);
  }, [entries]);

  return (
    <article className="motion-rise-in-delayed rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            {heading}
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
            {title}
          </h2>
        </div>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300">
          {badge}
        </span>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-300 md:text-sm">
        {description}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {entries.map(([name], index) => {
          const icon = statIcons[name] || "⭐";

          return (
            <div
              key={name}
              className="glass-card-hover group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 p-5 backdrop-blur-md"
            >
              <div className="flex items-center justify-between text-slate-400 text-lg">
                <span className="text-2xl">{icon}</span>
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">
                  Target
                </span>
              </div>
              <p className="mt-3 font-display text-4xl font-extrabold text-white tabular-nums">
                {counts[index]}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-300">
                {name === "AgeGroups" ? "Age Divisions" : name}
              </p>
            </div>
          );
        })}
      </div>
    </article>
  );
}

