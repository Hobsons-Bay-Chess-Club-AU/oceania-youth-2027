"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Hero, SearchInput } from "@/components/ui";
import { DEFAULT_DIVISIONS } from "@/app/players/data";
import type { Player, PlayersData, PlayerCategory } from "@/app/players/types";
export function PlayersPage() {
    const [data, setData] = useState<PlayersData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<"All" | PlayerCategory>("All");
    const [division, setDivision] = useState<string>("All");
    const [federation, setFederation] = useState<string>("All");
    const fetchPlayers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/players.json", { cache: "no-store" });
            if (!res.ok) {
                throw new Error(`Failed to load players list (HTTP ${res.status})`);
            }
            const json: PlayersData = await res.json();
            setData(json);
        }
        catch (err) {
            console.error("Error loading players.json:", err);
            setError(err instanceof Error ? err.message : "Unable to load player directory data.");
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchPlayers();
    }, [fetchPlayers]);
    const divisions = data?.divisions || DEFAULT_DIVISIONS;
    const allPlayers = useMemo(() => data?.players || [], [data]);
    const federations = useMemo(() => Array.from(new Set(allPlayers.map((player) => player.federation))).sort(), [allPlayers]);
    const filteredPlayers = useMemo(() => {
        const search = query.trim().toLowerCase();
        return allPlayers.filter((player) => {
            const matchesQuery = !search ||
                player.name.toLowerCase().includes(search) ||
                player.fideId.includes(search) ||
                player.federation.toLowerCase().includes(search);
            const matchesCategory = category === "All" || player.category === category;
            const matchesDivision = division === "All" || player.division === division;
            const matchesFederation = federation === "All" || player.federation === federation;
            return matchesQuery && matchesCategory && matchesDivision && matchesFederation;
        });
    }, [allPlayers, category, division, federation, query]);
    const groupedPlayers = useMemo(() => {
        return divisions.map((divisionName) => ({
            division: divisionName,
            open: filteredPlayers.filter((player) => player.division === divisionName && player.category === "Open"),
            girls: filteredPlayers.filter((player) => player.division === divisionName && player.category === "Girls"),
        }));
    }, [divisions, filteredPlayers]);
    const formattedLastUpdated = useMemo(() => {
        if (!data?.lastUpdated)
            return null;
        try {
            const d = new Date(data.lastUpdated);
            return isNaN(d.getTime())
                ? data.lastUpdated
                : d.toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });
        }
        catch {
            return data.lastUpdated;
        }
    }, [data?.lastUpdated]);
    return <div className="page-players">
    <Hero eyebrow="Zone 3.6 Competitors" title="Registered Player Directory" description="Filter Oceania junior entrants by age group division, gender category, national federation, or search by FIDE rating & ID."/>
    <section className="players-workspace">
      <div className="directory-filters">
        <div><span className="eyebrow">Search Directory</span><SearchInput value={query} onChange={setQuery} placeholder="Search player, ID, country..."/></div>
        <div><label className="eyebrow" htmlFor="player-category">Category</label><select id="player-category" value={category} onChange={e => setCategory(e.target.value as "All" | PlayerCategory)}><option value="All">All Categories</option><option value="Open">Open Championship</option><option value="Girls">Girls Championship</option></select></div>
        <div><label className="eyebrow" htmlFor="player-division">Age Division</label><select id="player-division" value={division} onChange={e => setDivision(e.target.value)}><option value="All">All Divisions (U8 - U20)</option>{divisions.map(value => <option key={value} value={value}>{value} Division</option>)}</select></div>
        <div><label className="eyebrow" htmlFor="player-federation">Federation</label><select id="player-federation" value={federation} onChange={e => setFederation(e.target.value)}><option value="All">All Federations</option>{federations.map(value => <option key={value} value={value}>{value}</option>)}</select></div>
      </div>
      <div className="directory-divisions">{divisions.map(value => <button type="button" key={value} aria-label={`${value} division, ${allPlayers.filter(p => p.division === value).length} players`} aria-pressed={division === value} onClick={() => setDivision(division === value ? "All" : value)}><span>{value}</span><span>{allPlayers.filter(p => p.division === value).length}</span></button>)}</div>
      <div className="directory-summary"><div className="flexline"><p>Displaying {filteredPlayers.length}{filteredPlayers.length !== allPlayers.length ? ` of ${allPlayers.length}` : ""} registered player profiles{formattedLastUpdated && ` · Updated: ${formattedLastUpdated}`}</p>{(query || category !== "All" || division !== "All" || federation !== "All") && <button type="button" onClick={() => { setQuery(""); setCategory("All"); setDivision("All"); setFederation("All"); }}>Reset Filters</button>}</div></div>
      <div className="directory-results" aria-live="polite">
        {isLoading && <p role="status">Loading player directory...</p>}
        {!isLoading && error && <div role="alert"><p>{error}</p><button type="button" onClick={fetchPlayers}>Retry Loading</button></div>}
        {!isLoading && !error && groupedPlayers.map(group => group.open.length + group.girls.length > 0 && <section className="directory-group" key={group.division}>
          <div className="flexline"><h3>{group.division} Championship</h3><span className="counts">Open: {group.open.length} · Girls: {group.girls.length}</span></div>
          {[...group.open, ...group.girls].map(p => <PlayerRow key={`${p.category}-${p.division}-${p.fideId}`} player={p}/>)}
        </section>)}
        {!isLoading && !error && !filteredPlayers.length && <p className="directory-empty">No player records match your active search filters.</p>}
      </div>
    </section>
  </div>;
}
function PlayerRow({ player: p }: {
    player: Player;
}) {
    return <div className="directory-row">
    <span className="name">{p.name}<small>{p.category}{(p.yob || p.dob) && ` · YOB: ${p.yob || p.dob?.match(/\d{4}/)?.[0]}`}</small></span>
    <span className="federation"><span aria-hidden="true">{countryCodeToFlag(p.flag)}</span>{p.federation}</span>
    <a href={`https://ratings.fide.com/profile/${p.fideId}`} target="_blank" rel="noreferrer">ID #{p.fideId}</a>
    <span className="rating"><span title="Classical / Standard Rating">Std: {p.fideRating > 0 ? p.fideRating : "—"}</span><small>Rpd: {p.rapidRating && p.rapidRating > 0 ? p.rapidRating : "—"} · Blz: {p.blitzRating && p.blitzRating > 0 ? p.blitzRating : "—"}</small></span>
  </div>;
}
function countryCodeToFlag(code: string) {
    return code.toUpperCase().replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
}
