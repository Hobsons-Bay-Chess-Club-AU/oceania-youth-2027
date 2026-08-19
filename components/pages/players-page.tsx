"use client";

import { useMemo, useState } from "react";
import { Hero, SearchInput } from "@/components/ui";
import { playersData } from "@/app/players/data";

export function PlayersPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | "Open" | "Girls">("All");
  const [division, setDivision] = useState<string>("All");
  const [federation, setFederation] = useState<string>("All");

  const federations = useMemo(
    () => Array.from(new Set(playersData.players.map((player) => player.federation))).sort(),
    []
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
        (player) => player.division === divisionName && player.category === "Open"
      ),
      girls: filteredPlayers.filter(
        (player) => player.division === divisionName && player.category === "Girls"
      ),
    }));
  }, [filteredPlayers]);

  return (
    <div className="space-y-8">
      <Hero
        eyebrow="Zone 3.6 Competitors"
        title="Registered Player Directory"
        description="Filter Oceania junior entrants by age group division, gender category, national federation, or search by FIDE rating & ID."
      />

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-6">
        {/* Filter Controls Bar */}
        <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 md:grid-cols-4">
          <div className="space-y-1.5 md:col-span-1">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-400">
              Search Directory
            </span>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search player, ID, country..."
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-400">
              Category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "All" | "Open" | "Girls")}
              className="w-full rounded-full border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500"
            >
              <option value="All">All Categories</option>
              <option value="Open">Open Championship</option>
              <option value="Girls">Girls Championship</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-400">
              Age Division
            </span>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full rounded-full border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500"
            >
              <option value="All">All Divisions (U8 - U20)</option>
              {playersData.divisions.map((div) => (
                <option key={div} value={div}>
                  {div} Division
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-400">
              Federation
            </span>
            <select
              value={federation}
              onChange={(e) => setFederation(e.target.value)}
              className="w-full rounded-full border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500"
            >
              <option value="All">All Federations</option>
              {federations.map((fed) => (
                <option key={fed} value={fed}>
                  {fed}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Division Quick Tabs */}
        <div className="flex flex-wrap gap-2">
          {playersData.divisions.map((divName) => {
            const count = filteredPlayers.filter((p) => p.division === divName).length;
            const active = division === divName;

            return (
              <button
                key={divName}
                type="button"
                onClick={() => setDivision(active ? "All" : divName)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  active
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                    : "border border-slate-800 bg-slate-950 text-slate-300 hover:border-amber-500/40 hover:text-white"
                }`}
              >
                <span>{divName}</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[0.65rem] text-slate-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Summary */}
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
          <p>
            Displaying <span className="font-bold text-white">{filteredPlayers.length}</span> registered player profiles
          </p>
          {(query || category !== "All" || division !== "All" || federation !== "All") && (
            <button
              onClick={() => {
                setQuery("");
                setCategory("All");
                setDivision("All");
                setFederation("All");
              }}
              className="text-amber-400 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Division Groups */}
        <div className="space-y-6">
          {groupedPlayers.map((group) => {
            if (group.open.length === 0 && group.girls.length === 0) return null;

            return (
              <div
                key={group.division}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 backdrop-blur-md space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-display text-xl font-bold text-white">{group.division} Championship</h3>
                  <div className="flex gap-2 text-xs">
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 font-bold text-amber-300">
                      Open: {group.open.length}
                    </span>
                    <span className="rounded-full bg-pink-500/10 border border-pink-500/20 px-3 py-1 font-bold text-pink-300">
                      Girls: {group.girls.length}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <PlayerCategoryTable title="Open" players={group.open} />
                  <PlayerCategoryTable title="Girls" players={group.girls} />
                </div>
              </div>
            );
          })}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-8 text-center text-xs text-slate-400">
            No player records match your active search filters.
          </div>
        )}
      </section>
    </div>
  );
}

function PlayerCategoryTable({
  title,
  players,
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
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-white uppercase tracking-wider">{title} Division</span>
        <span className="text-slate-400">{players.length} entrants</span>
      </div>

      {players.length === 0 ? (
        <div className="p-4 text-center text-xs text-slate-500">No entrants registered in this division yet</div>
      ) : (
        <div className="divide-y divide-slate-800/80 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
          {players.map((p) => (
            <div
              key={`${p.category}-${p.division}-${p.fideId}`}
              className="flex items-center justify-between p-3 text-xs transition hover:bg-slate-900"
            >
              <div className="space-y-0.5">
                <p className="font-bold text-white">{p.name}</p>
                <div className="flex items-center gap-2 text-slate-400 text-[0.7rem]">
                  <span>{countryCodeToFlag(p.flag)}</span>
                  <span>{p.federation}</span>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <a
                  href={`https://ratings.fide.com/profile/${p.fideId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-cyan-400 font-medium hover:underline text-[0.75rem]"
                >
                  ID #{p.fideId}
                </a>
                <p className="font-bold text-amber-300 text-xs">Rating: {p.fideRating}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function countryCodeToFlag(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

