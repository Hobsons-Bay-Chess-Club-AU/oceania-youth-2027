"use client";

import { useEffect, useState } from "react";

type TournamentStatsProps = {
  heading: string;
  title: string;
  badge: string;
  description: string;
  stats: Record<string, number>;
};

const statCardThemes = [
  {
    shell: "border-sky-200 bg-[linear-gradient(180deg,#eff9ff,#ffffff)]",
    value: "text-sky-700",
    label: "text-sky-800/80",
  },
  {
    shell: "border-amber-200 bg-[linear-gradient(180deg,#fff8eb,#ffffff)]",
    value: "text-amber-700",
    label: "text-amber-900/75",
  },
  {
    shell: "border-emerald-200 bg-[linear-gradient(180deg,#effcf6,#ffffff)]",
    value: "text-emerald-700",
    label: "text-emerald-900/75",
  },
  {
    shell: "border-rose-200 bg-[linear-gradient(180deg,#fff1f4,#ffffff)]",
    value: "text-rose-700",
    label: "text-rose-900/75",
  },
  {
    shell: "border-violet-200 bg-[linear-gradient(180deg,#f6f2ff,#ffffff)]",
    value: "text-violet-700",
    label: "text-violet-900/75",
  },
  {
    shell: "border-cyan-200 bg-[linear-gradient(180deg,#ecfeff,#ffffff)]",
    value: "text-cyan-700",
    label: "text-cyan-900/75",
  },
];

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
    const durationMs = 1400;
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
    <article className="motion-rise-in-delayed rounded-[1rem] border border-white/70 bg-white/75 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:rounded-[2rem] md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">{heading}</p>
          <h2 className="mt-3 font-display text-3xl text-slate-900 md:text-4xl">{title}</h2>
        </div>
        <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white">{badge}</span>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
        {description}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {entries.map(([name], index) => {
          const theme = statCardThemes[index % statCardThemes.length];

          return (
          <article
            key={name}
            className={`rounded-[1rem] border p-5 md:rounded-[1.5rem] ${theme.shell}`}
          >
            <p className={`text-xs font-black uppercase tracking-[0.16em] ${theme.label}`}>{name}</p>
            <p className={`mt-3 font-display text-4xl tabular-nums ${theme.value}`}>{counts[index]}</p>
          </article>
          );
        })}
      </div>
    </article>
  );
}
