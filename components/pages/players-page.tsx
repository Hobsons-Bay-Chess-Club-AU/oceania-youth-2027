"use client";

import { useMemo, useState } from "react";
import { Hero, Section } from "@/components/ui";
import { playersData } from "@/app/players/data";

export function PlayersPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | "Open" | "Girls">("All");
  const [division, setDivision] = useState<string>("All");
  const [federation, setFederation] = useState<string>("All");

  const federations = useMemo(
    () => Array.from(new Set(playersData.players.map((player) => player.federation))).sort(),
    [],
  );

  const filteredPlayers = useMemo(() => {
    const search = query.trim().toLowerCase();

    return playersData.players.filter((player) => {
      const matchesQuery =
        !search ||
        player.name.toLowerCase().includes(search) ||
        player.fideId.includes(search) ||
        player.federation.toLowerCase().includes(search);

      const matchesCategory = category === "All" || player.category === category;
      const matchesDivision = division === "All" || player.division === division;
      const matchesFederation = federation === "All" || player.federation === federation;

      return matchesQuery && matchesCategory && matchesDivision && matchesFederation;
    });
  }, [category, division, federation, query]);

  const groupedPlayers = useMemo(() => {
    return playersData.divisions.map((divisionName) => ({
      division: divisionName,
      open: filteredPlayers.filter(
        (player) => player.division === divisionName && player.category === "Open",
      ),
      girls: filteredPlayers.filter(
        (player) => player.division === divisionName && player.category === "Girls",
      ),
    }));
  }, [filteredPlayers]);

  return (
    <>
      <Hero
        eyebrow="Player directory"
        title="Registered Players"
        description="Browse players by division, search by name or FIDE ID, and quickly filter by category or federation."
      />
      <Section title="Player List" description={playersData.description}>
        <div className="space-y-6">
          <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff,#ffffff)] p-5 shadow-sm md:grid-cols-[1.7fr_repeat(3,minmax(0,1fr))]">
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Search
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search player name, FIDE ID, or federation"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Category
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as "All" | "Open" | "Girls")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="All">All categories</option>
                <option value="Open">Open</option>
                <option value="Girls">Girls</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Division
              </span>
              <select
                value={division}
                onChange={(event) => setDivision(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="All">All divisions</option>
                {playersData.divisions.map((divisionName) => (
                  <option key={divisionName} value={divisionName}>
                    {divisionName}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Federation
              </span>
              <select
                value={federation}
                onChange={(event) => setFederation(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="All">All federations</option>
                {federations.map((federationName) => (
                  <option key={federationName} value={federationName}>
                    {federationName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            {playersData.divisions.map((divisionName) => {
              const count = filteredPlayers.filter((player) => player.division === divisionName).length;
              const active = division === divisionName;

              return (
                <button
                  key={divisionName}
                  type="button"
                  onClick={() => setDivision(active ? "All" : divisionName)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span>{divisionName}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 px-5 py-4 shadow-sm">
            <p className="text-sm text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredPlayers.length}</span> players
              across <span className="font-bold text-slate-900">{groupedPlayers.filter((group) => group.open.length || group.girls.length).length}</span> divisions.
            </p>
          </div>

          <div className="space-y-6">
            {groupedPlayers.map((group) => {
              if (group.open.length === 0 && group.girls.length === 0) {
                return null;
              }

              return (
                <section
                  key={group.division}
                  className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur md:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                        Division
                      </p>
                      <h3 className="font-display text-3xl text-slate-900">{group.division}</h3>
                    </div>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        Open {group.open.length}
                      </span>
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                        Girls {group.girls.length}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 xl:grid-cols-2">
                    <PlayerCategoryTable title="Open" players={group.open} accent="slate" />
                    <PlayerCategoryTable title="Girls" players={group.girls} accent="rose" />
                  </div>
                </section>
              );
            })}
          </div>

          {filteredPlayers.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center">
              <h3 className="font-display text-2xl text-slate-900">No players match those filters</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Try clearing the search, switching division, or broadening the federation filter.
              </p>
            </div>
          ) : null}
        </div>
      </Section>
    </>
  );
}

function PlayerCategoryTable({
  title,
  players,
  accent,
}: {
  title: "Open" | "Girls";
  players: Array<{
    name: string;
    division: string;
    category: string;
    federation: string;
    flag: string;
    fideId: string;
    fideRating: number;
  }>;
  accent: "slate" | "rose";
}) {
  const accentClasses =
    accent === "rose"
      ? {
          badge: "bg-rose-100 text-rose-700",
          panel: "bg-[linear-gradient(180deg,#fff7f9,#ffffff)]",
        }
      : {
          badge: "bg-slate-100 text-slate-700",
          panel: "bg-[linear-gradient(180deg,#f8fbff,#ffffff)]",
        };

  return (
    <article className={`rounded-[1.5rem] border border-slate-200 ${accentClasses.panel} p-4`}>
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-display text-2xl text-slate-900">{title}</h4>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${accentClasses.badge}`}>
          {players.length} players
        </span>
      </div>

      {players.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-6 text-sm text-slate-500">
          No players in this section for the current filters.
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white">
          <div className="grid grid-cols-[minmax(0,1.6fr)_110px_96px_96px] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            <span>Player</span>
            <span>Federation</span>
            <span>FIDE ID</span>
            <span>Rating</span>
          </div>
          <div className="divide-y divide-slate-100">
            {players.map((player) => (
              <div
                key={`${player.category}-${player.division}-${player.fideId}`}
                className="grid grid-cols-[minmax(0,1.6fr)_110px_96px_96px] gap-3 px-4 py-4 text-sm text-slate-700"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{player.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">
                    {countryCodeToFlag(player.flag)}
                  </span>
                  <span className="font-medium">{player.federation}</span>
                </div>
                <a
                  href={`https://ratings.fide.com/profile/${player.fideId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-sky-700 hover:underline"
                >
                  {player.fideId}
                </a>
                <span className="font-medium text-slate-900">{player.fideRating}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function countryCodeToFlag(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}
