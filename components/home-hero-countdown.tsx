"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CountdownItem = {
  label: string;
  value: string;
};

const fallbackCountdownCards: CountdownItem[] = [
  { label: "Days", value: "TBC" },
  { label: "Hours", value: "--" },
  { label: "Minutes", value: "--" },
  { label: "Seconds", value: "--" },
];

export function HomeHeroCountdown({
  dateLabel,
  eventStartDate,
  registrationHref,
}: {
  dateLabel: string;
  eventStartDate: string | null;
  registrationHref: string;
}) {
  const [countdown, setCountdown] = useState<CountdownItem[] | null>(() =>
    getCountdownParts(eventStartDate),
  );

  useEffect(() => {
    setCountdown(getCountdownParts(eventStartDate));

    if (!eventStartDate) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts(eventStartDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [eventStartDate]);

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-5 text-white shadow-[0_20px_60px_rgba(8,24,49,0.22)] backdrop-blur-xl md:p-6">
      <div className="absolute right-[-2rem] top-[-2rem] h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl" />
      <div className="absolute bottom-[-2rem] left-[-1rem] h-24 w-24 rounded-full bg-cyan-200/20 blur-2xl" />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100/80">
              Event countdown
            </p>
            <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
              {countdown ? "Counting down to first move" : "Countdown ready when dates lock in"}
            </h2>
          </div>
          <span className="rounded-full border border-white/15 bg-slate-950/20 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-50">
            {countdown ? "Live now" : "Dates pending"}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(countdown ?? fallbackCountdownCards).map((item) => (
            <article key={item.label} className="rounded-[1.4rem] border border-white/10 bg-slate-950/20 p-4">
              <p className="text-3xl font-black text-white tabular-nums md:text-4xl">{item.value}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100/75">
                {item.label}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 rounded-[1.4rem] border border-white/10 bg-slate-950/20 p-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100/75">
              Event status
            </p>
            <p className="mt-3 text-sm leading-7 text-white/85">
              {countdown
                ? `The tournament countdown is now live for ${dateLabel}. Register early and check back here for official updates as the event approaches.`
                : "Official tournament dates will be announced soon. Registration and key event updates will appear here as soon as they are confirmed."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={registrationHref}
              className="inline-flex items-center rounded-full bg-yellow-300 px-5 py-3 text-sm font-extrabold text-slate-900 shadow-lg shadow-yellow-300/20 transition-transform hover:-translate-y-0.5"
            >
              Register now
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Read latest updates
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function getCountdownParts(eventStartDate: string | null) {
  if (!eventStartDate) {
    return null;
  }

  const target = new Date(`${eventStartDate}T00:00:00+10:00`);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (Number.isNaN(target.getTime()) || diff <= 0) {
    return [
      { label: "Days", value: "0" },
      { label: "Hours", value: "00" },
      { label: "Minutes", value: "00" },
      { label: "Seconds", value: "00" },
    ];
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { label: "Days", value: String(days) },
    { label: "Hours", value: String(hours).padStart(2, "0") },
    { label: "Minutes", value: String(minutes).padStart(2, "0") },
    { label: "Seconds", value: String(seconds).padStart(2, "0") },
  ];
}
