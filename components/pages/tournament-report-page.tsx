"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { defaultRound, formatPoints, latestSnapshot, resultLabel, type TournamentPlayer, type TournamentResults } from '@/lib/tournament-results';
import styles from './tournament-report.module.css';

type Selection = { formatId: string; divisionId: string; round: number };
type Mode = 'pairings' | 'standings';

function PlayerIdentity({ player, format, points, color }: { player?: TournamentPlayer; format: string; points?: number | null; color?: 'white' | 'black' }) {
  if (!player) return <span className={styles.byeOpponent}>No opponent <small>Allocated bye</small></span>;
  const rating = player.ratings[format];
  return <span className={styles.identity}>
    <img src={`/pacific/flags/${player.federation.flag}.svg`} width="22" height="16" alt={player.federation.name} title={player.federation.name} />
    <span className={styles.personCopy}><span className={styles.personName} title={player.name}>{color && <span className={styles.colorMarker} data-color={color} aria-label={color} />}{player.title && <span className={styles.titleBadge} data-women={player.title.startsWith('W')}>{player.title}</span>}<span translate="no">{player.name}</span></span>
      <small>{rating > 0 ? `(${rating})` : 'Unrated'}{typeof points === 'number' && <> <span aria-hidden="true">·</span> <span title="Points before this round">{formatPoints(points)} pts</span></>}</small>
    </span>
  </span>;
}

export function TournamentReportPage({ data, mode }: { data: TournamentResults; mode: Mode }) {
  const initialDivision = data.divisions.find(division => division.id === 'u14-open') || data.divisions[0];
  const [selection, setSelection] = useState<Selection>({ formatId: data.formats[0]?.id || '', divisionId: initialDivision?.id || '', round: 0 });
  const [query, setQuery] = useState('');
  const [federation, setFederation] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelection({ formatId: data.formats.some(format => format.id === params.get('format')) ? params.get('format')! : data.formats[0]?.id || '', divisionId: data.divisions.some(division => division.id === params.get('division')) ? params.get('division')! : initialDivision?.id || '', round: Math.max(0, Number(params.get('round')) || 0) });
  }, [data, mode, initialDivision?.id]);
  const division = data.divisions.find(entry => entry.id === selection.divisionId) || initialDivision;
  const format = data.formats.find(entry => entry.id === selection.formatId) || data.formats[0];
  const competition = division?.competitions.find(entry => entry.formatId === format?.id);
  const players = useMemo(() => new Map(division?.players.map(player => [player.id, player]) || []), [division]);
  const round = competition?.rounds.find(entry => entry.number === selection.round) || competition?.rounds.find(entry => entry.number === defaultRound(competition));
  const snapshot = competition?.standings.find(entry => entry.afterRound === selection.round) || (competition ? latestSnapshot(competition) : undefined);
  const activeRound = mode === 'pairings' ? round?.number || 0 : snapshot?.afterRound || 0;
  const federations = [...new Map(division?.players.map(player => [player.federation.code, player.federation]) || []).values()].sort((a,b) => a.name.localeCompare(b.name));
  const needle = query.trim().toLowerCase();
  function matches(player?: TournamentPlayer) {
    return !!player && `${player.name} ${player.federation.code} ${player.federation.name} ${player.title || ''}`.toLowerCase().includes(needle);
  }
  const pairings = round?.pairings.filter(game => {
    const white = players.get(game.whiteId); const black = players.get(game.blackId || '');
    const searchMatch = !needle || matches(white) || matches(black) || String(game.board || '').includes(needle);
    const countryMatch = federation === 'all' || white?.federation.code === federation || black?.federation.code === federation;
    const statusMatch = resultFilter === 'all' || (resultFilter === 'bye' ? game.result === 'bye' : game.status === resultFilter && game.result !== 'bye');
    return searchMatch && countryMatch && statusMatch;
  }) || [];
  const standings = snapshot?.rows.filter(row => {
    const player = players.get(row.playerId);
    return (!needle || matches(player)) && (federation === 'all' || player?.federation.code === federation);
  }) || [];
  function select(next: Partial<Selection>) {
    const updated = { ...selection, ...next };
    setSelection(updated);
    if (next.divisionId || next.formatId) { setQuery(''); setFederation('all'); setResultFilter('all'); }
    const url = new URL(window.location.href);
    url.searchParams.set('format', updated.formatId); url.searchParams.set('division', updated.divisionId);
    if (updated.round) url.searchParams.set('round', String(updated.round)); else url.searchParams.delete('round');
    window.history.replaceState(window.history.state, '', url);
  }
  function viewLink(view: Mode) {
    const targetRound = view === 'standings' ? competition?.standings.some(entry => entry.afterRound === activeRound) ? activeRound : snapshot?.afterRound : activeRound;
    return `/${view}/?${new URLSearchParams({ format: selection.formatId, division: selection.divisionId, ...(targetRound ? { round: String(targetRound) } : {}) }).toString()}`;
  }
  function clearFilters() { setQuery(''); setFederation('all'); setResultFilter('all'); }
  function dateTime(value: string) { return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: data.timeZone }).format(new Date(value)); }
  const boardGames = round?.pairings.filter(game => game.blackId !== null) || [];
  const completed = boardGames.filter(game => game.status === 'completed').length;
  const live = boardGames.filter(game => game.status === 'playing').length;
  const leading = snapshot?.rows[0];

  return <div className={styles.page}>
    {data.isSample && <aside className={styles.sampleNotice}><strong>Design preview</strong><span>Fictional players, ratings, pairings and results. This is sample data, not an official tournament report.</span></aside>}
    <section className={`page-title ${styles.masthead}`}>
      <div className="eyebrow">{data.eventName} / Tournament desk</div><h1>{mode === 'pairings' ? 'Pairings & results.' : 'Every point counts.'}</h1>
      <p>{mode === 'pairings' ? 'Find your board. Follow every result. Pairings and scores, organised by division and round.' : 'Follow your division through the rounds. Points, tie-breaks and the latest published standings in one place.'}</p>
    </section>
    <section className={styles.workspace} aria-label={mode === 'pairings' ? 'Pairings and results' : 'Division standings'}>
      <nav className={styles.viewTabs} aria-label="Tournament report views"><Link href={viewLink('pairings')} aria-current={mode === 'pairings' ? 'page' : undefined}>Pairings & results</Link><Link href={viewLink('standings')} aria-current={mode === 'standings' ? 'page' : undefined}>Standings</Link><a className={styles.dataLink} href="/tournament/sample-results.json" target="_blank" rel="noopener noreferrer">Sample JSON ↗</a></nav>
      <div className={styles.selectors}>
        <fieldset className={styles.formatPicker}><legend>01 / Championship</legend><div>{data.formats.map(entry => <button key={entry.id} type="button" aria-pressed={entry.id === format?.id} onClick={() => select({ formatId: entry.id, round: 0 })}>{entry.name}</button>)}</div></fieldset>
        <div className={styles.divisionPicker}><label htmlFor={`division-${mode}`}>02 / Division</label><select id={`division-${mode}`} value={division?.id || ''} onChange={event => select({ divisionId: event.target.value, round: 0 })}>{['Open','Girls'].map(category => <optgroup key={category} label={category}>{data.divisions.filter(entry => entry.category === category).map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</optgroup>)}</select></div>
      </div>
      {!competition ? <div className={styles.empty}><h2>Report not published yet.</h2><p>This division has no {format?.name.toLowerCase()} report available.</p></div> : <>
        <div className={styles.divisionHeading}><div><span className="eyebrow">{format.name} championship · {format.timeControl}</span><h2>{division.name}</h2></div><span className={styles.roundStatus} data-status={mode === 'standings' ? snapshot?.provisional ? 'live' : 'completed' : round?.status}>{mode === 'standings' ? snapshot?.provisional ? 'Provisional standings' : 'Round complete' : round?.status === 'live' ? 'Round in progress' : round?.status === 'completed' ? 'Results complete' : 'Pairings published'}</span></div>
        <div className={styles.roundBar}><span className={styles.roundLabel}>{mode === 'pairings' ? '03 / Round' : '03 / Standings after'}</span><div className={styles.roundButtons}>{(mode === 'pairings' ? competition.rounds.map(entry => entry.number) : competition.standings.map(entry => entry.afterRound)).map(number => <button type="button" key={number} aria-pressed={number === activeRound} onClick={() => select({ round: number })}>Round {number}</button>)}</div></div>
        <div className={styles.reportOverview}>
          <div><span className="eyebrow">{mode === 'pairings' ? 'Round' : 'After round'}</span><strong className={styles.roundNumber}>{String(activeRound).padStart(2,'0')}<small> / {format.totalRounds}</small></strong></div>
          <div><span>{mode === 'pairings' ? 'Results recorded' : 'Players ranked'}</span><strong>{mode === 'pairings' ? `${completed} / ${boardGames.length}` : snapshot?.rows.length || 0}</strong></div>
          <div><span>{mode === 'pairings' ? 'Games in progress' : 'Leading score'}</span><strong>{mode === 'pairings' ? live : leading ? formatPoints(leading.points) : '—'}{mode === 'standings' && <small> pts</small>}</strong></div>
          <p>{mode === 'pairings' && round ? <>{round.status === 'scheduled' ? 'Scheduled start' : 'Round started'}<br/><strong>{dateTime(round.startsAt)}</strong><br/>Melbourne time</> : <>Data updated: {dateTime(competition.updatedAt || data.updatedAt)}<br/>{snapshot?.provisional ? 'Round in progress. Games played may differ.' : 'All results for this snapshot are recorded.'}</>}</p>
        </div>
        <div className={styles.filters}><div className={styles.search}><label htmlFor={`search-${mode}`}>{mode === 'pairings' ? 'Find a player or board' : 'Find a player'}</label><input type="search" id={`search-${mode}`} value={query} onChange={event => setQuery(event.target.value)} placeholder={mode === 'pairings' ? 'Name, federation or board number' : 'Name or federation'} /></div><div><label htmlFor={`federation-${mode}`}>Federation</label><select id={`federation-${mode}`} value={federation} onChange={event => setFederation(event.target.value)}><option value="all">All federations</option>{federations.map(entry => <option key={entry.code} value={entry.code}>{entry.name}</option>)}</select></div>{mode === 'pairings' && <div><label htmlFor="pairing-status">Game status</label><select id="pairing-status" value={resultFilter} onChange={event => setResultFilter(event.target.value)}><option value="all">All games</option><option value="completed">Results recorded</option><option value="playing">In progress</option><option value="scheduled">Not started</option><option value="bye">Byes</option></select></div>}</div>
        <div className={styles.reportCaption} aria-live="polite"><span>{mode === 'pairings' ? `${pairings.length} of ${round?.pairings.length || 0} pairings` : `${standings.length} of ${snapshot?.rows.length || 0} players`}</span><span>{mode === 'pairings' ? 'Player points shown before the round' : 'Ranking order follows the published snapshot'}</span></div>
        {mode === 'pairings' ? <div className={styles.pairingsWrap}><table className={styles.pairings}><caption className={styles.srOnly}>{division.name}, {format.name}, round {activeRound} pairings and results</caption><thead><tr><th scope="col">Board</th><th scope="col">White</th><th scope="col">Result</th><th scope="col">Black</th></tr></thead><tbody>{pairings.map(game => <tr key={game.id} data-live={game.status === 'playing'}><td className={styles.boardCell}><span className={styles.mobileLabel}>Board </span>{game.board === null ? '—' : String(game.board).padStart(2,'0')}</td><td className={styles.whiteCell}><PlayerIdentity player={players.get(game.whiteId)} format={format.id} points={game.whitePointsBefore} color={game.blackId ? 'white' : undefined} /></td><td className={styles.resultCell}><strong data-status={game.status} data-bye={game.result === 'bye'}>{resultLabel(game)}</strong>{game.status === 'scheduled' && <small>Not started</small>}{game.result?.endsWith('F') && <small>Forfeit</small>}</td><td className={styles.blackCell}><PlayerIdentity player={players.get(game.blackId || '')} format={format.id} points={game.blackPointsBefore} color="black" /></td></tr>)}</tbody></table></div> : <div className={styles.standingsScroll} tabIndex={0} role="region" aria-label="Standings table; scroll horizontally for all tie-break columns"><table className={styles.standings}><caption className={styles.srOnly}>{division.name}, {format.name}, standings after round {activeRound}</caption><thead><tr><th scope="col">Rank</th><th scope="col">Player</th><th scope="col">FED</th><th scope="col" title="Completed rounds, including byes">P</th><th scope="col">Points</th><th scope="col" title="Buchholz">BH</th><th scope="col" title="Sonneborn–Berger">SB</th><th scope="col">Form</th></tr></thead><tbody>{standings.map(row => { const player = players.get(row.playerId); return <tr key={row.playerId} data-leading={row.rank === 1}><td className={styles.rankCell}>{String(row.rank).padStart(2,'0')}</td><td><PlayerIdentity player={player} format={format.id} /></td><td className={styles.federationCell} title={player?.federation.name}>{player?.federation.code}</td><td>{row.played}</td><td className={styles.pointsCell}>{formatPoints(row.points)}</td><td>{formatPoints(row.tieBreaks.buchholz)}</td><td>{formatPoints(row.tieBreaks.sonnebornBerger)}</td><td><span className={styles.form}>{row.form.map(result => <span key={result.round} data-result={result.result} title={`Round ${result.round}: ${result.result === 'W' ? 'Win' : result.result === 'D' ? 'Draw' : result.result === 'L' ? 'Loss' : 'Bye'}`}>{result.result}</span>)}</span></td></tr>; })}</tbody></table></div>}
        {(mode === 'pairings' ? pairings.length === 0 : standings.length === 0) && <div className={styles.empty}><h3>No matches for these filters.</h3><p>Try another player name, federation or game status.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>}
        {mode === 'standings' && <div className={styles.legend}><p><strong>BH</strong> Buchholz · <strong>SB</strong> Sonneborn–Berger · <strong>P</strong> Completed rounds, including byes</p><p><strong>Form</strong> W win · D draw · L loss · B bye</p><p>{data.tieBreakDescription}</p></div>}
        <p className={styles.footerNote}>{data.isSample ? 'Illustrative data for interface development. Pairings, times, ratings and rankings are not official.' : 'Reports reflect the latest published tournament data.'}</p>
      </>}
    </section>
  </div>;
}
