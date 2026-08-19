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
  const [tzMode, setTzMode] = useState<"AEST" | "LOCAL">("AEST");
  const [countdown, setCountdown] = useState<CountdownItem[] | null>(() =>
    getCountdownParts(eventStartDate)
  );

  useEffect(() => {
    setCountdown(getCountdownParts(eventStartDate));
    if (!eventStartDate) return;

    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts(eventStartDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [eventStartDate]);

  return (
    <article className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-amber-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Official Tournament Clock
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Countdown to Opening Day
            </h2>
          </div>
          
          {/* Timezone Switcher */}
          <div className="flex items-center rounded-full border border-slate-700 bg-slate-950 p-1 text-xs">
            <button
              onClick={() => setTzMode("AEST")}
              className={`rounded-full px-3 py-1 font-bold transition ${
                tzMode === "AEST" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              AEST (UTC+10)
            </button>
            <button
              onClick={() => setTzMode("LOCAL")}
              className={`rounded-full px-3 py-1 font-bold transition ${
                tzMode === "LOCAL" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              My Timezone
            </button>
          </div>
        </div>

        {/* Countdown Ticker Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(countdown ?? fallbackCountdownCards).map((item) => (
            <div
              key={item.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-center transition hover:border-amber-500/40"
            >
              <div className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full bg-amber-500/5 group-hover:bg-amber-500/15 transition" />
              <p className="font-display text-3xl font-extrabold text-white tabular-nums md:text-4xl">
                {item.value}
              </p>
              <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Status Callout Card */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
            <span>Schedule Status: Locked</span>
            <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-emerald-300 font-bold">
              Confirmed Dates
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-300">
            Counting down to <strong className="text-white">{dateLabel}</strong>. Official 9-round classical, 7-round rapid, and 9-round blitz schedules are locked.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href={registrationHref}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition hover:scale-105"
            >
              <span>Register Interest</span>
              <span>→</span>
            </Link>
            <Link
              href="/schedule"
              className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
            >
              View Official Schedule
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function getCountdownParts(eventStartDate: string | null) {
  if (!eventStartDate) return null;

  const target = new Date(eventStartDate);
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


