"use client";

import { useState } from "react";
import { Hero, SearchInput } from "@/components/ui";
import { scheduleRows } from "@/app/schedule/data";

const scheduleCategories = [
  { label: "All Events", filter: "all" },
  { label: "Rounds 1 - 9", filter: "round" },
  { label: "Ceremonies & Meetings", filter: "ceremony" },
];

export function SchedulePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const filteredSchedule = scheduleRows.filter((row) => {
    const matchesSearch =
      row.activity.toLowerCase().includes(search.toLowerCase()) ||
      row.venue.toLowerCase().includes(search.toLowerCase()) ||
      (row.date && row.date.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === "round") {
      return row.activity.toLowerCase().includes("round");
    }
    if (activeFilter === "ceremony") {
      return (
        row.activity.toLowerCase().includes("opening") ||
        row.activity.toLowerCase().includes("awards") ||
        row.activity.toLowerCase().includes("meeting") ||
        row.activity.toLowerCase().includes("registration")
      );
    }
    if (selectedDay) {
      return row.date === selectedDay;
    }

    return true;
  });

  const handleAddToCalendar = (activity: string, date: string) => {
    const title = encodeURIComponent(`Oceania Youth 2027: ${activity}`);
    const details = encodeURIComponent("Official Oceania Youth Chess Zonal 2027 Schedule Event.");
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
    window.open(googleUrl, "_blank");
  };

  return (
    <div className="space-y-8">
      <Hero
        eyebrow="Official Timetable"
        title="Tournament Schedule"
        description="Comprehensive 9-round classical championship schedule, technical meetings, opening ceremonies, blitz side events, and prize distribution."
      />

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {scheduleCategories.map((cat) => (
              <button
                key={cat.filter}
                onClick={() => {
                  setActiveFilter(cat.filter);
                  setSelectedDay(null);
                }}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  activeFilter === cat.filter && !selectedDay
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                    : "border border-slate-800 bg-slate-950 text-slate-300 hover:border-amber-500/40 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search schedule events..."
            />
          </div>
        </div>

        {/* Day Shortcut Quick Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400 mr-2">Filter by Day:</span>
          <button
            onClick={() => setSelectedDay(null)}
            className={`rounded-lg px-3 py-1.5 font-bold transition ${
              selectedDay === null ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-slate-950 text-slate-400 hover:text-white"
            }`}
          >
            All Days
          </button>
          {["Day 0", "Day 1", "Day 2", "Day 3", "Day 4", "Day 5"].map((d) => (
            <button
              key={d}
              onClick={() => {
                setSelectedDay(d);
                setActiveFilter("all");
              }}
              className={`rounded-lg px-3 py-1.5 font-bold transition ${
                selectedDay === d ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Schedule Items Grid & Table */}
        <div className="space-y-3">
          {filteredSchedule.length > 0 ? (
            filteredSchedule.map((row, index) => {
              const isRound = row.activity.toLowerCase().includes("round");
              const isCeremony =
                row.activity.toLowerCase().includes("opening") ||
                row.activity.toLowerCase().includes("awards");

              return (
                <div
                  key={`${row.date}-${row.time}-${index}`}
                  className="glass-card-hover flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 backdrop-blur-md"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-11 min-w-[3.75rem] px-2 shrink-0 items-center justify-center rounded-xl font-display font-bold text-[0.7rem] shadow-md text-center leading-tight ${
                        isRound
                          ? "bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950"
                          : isCeremony
                          ? "bg-gradient-to-tr from-cyan-500 to-blue-400 text-slate-950"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {row.date ? row.date.replace(/\s*\d{4}$/, "") : "Event"}
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base font-bold text-white">
                          {row.activity}
                        </span>
                        {row.day && (
                          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[0.65rem] font-semibold text-slate-400">
                            {row.day}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        Venue: <span className="text-slate-300">{row.venue}</span> • Scheduled Time:{" "}
                        <span className="text-amber-300 font-semibold">{row.time}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCalendar(row.activity, row.date)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:border-amber-400 hover:text-white transition"
                  >
                    <span>+ Calendar</span>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No schedule events matched your search or filter parameters.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

