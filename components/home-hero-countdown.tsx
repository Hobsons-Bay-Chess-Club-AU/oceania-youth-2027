"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export function HomeHeroCountdown({ dateLabel, eventStartDate, registrationHref }: {
    dateLabel: string;
    eventStartDate: string;
    registrationHref: string;
}) {
    const [remaining, setRemaining] = useState<number | null>(null);
    const [localTimezone, setLocalTimezone] = useState(false);
    useEffect(() => {
        const update = () => setRemaining(Math.max(0, new Date(eventStartDate).getTime() - Date.now()));
        update();
        const timer = window.setInterval(update, 1000);
        return () => window.clearInterval(timer);
    }, [eventStartDate]);
    const units = remaining === null ? [null, null, null, null] : [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
    return <article className="clock-strip"><div>
    <div className="flexline"><div><span className="eyebrow">Official Tournament Clock</span><h2>Countdown to Opening Day</h2></div><div className="flexline"><button type="button" aria-pressed={!localTimezone} onClick={() => setLocalTimezone(false)}>AEST (UTC+10)</button><button type="button" aria-pressed={localTimezone} onClick={() => setLocalTimezone(true)}>My Timezone</button></div></div>
    <div className="subgrid" role="timer" aria-label="Time until opening day">{units.map((value, index) => <div key={index}><p className="metric">{value === null ? "—" : index ? String(value).padStart(2, "0") : value}</p><p className="eyebrow">{["Days", "Hours", "Minutes", "Seconds"][index]}</p></div>)}</div>
    <div><div className="flexline"><span>Schedule Status: Locked</span><span>Confirmed Dates</span></div><p>Counting down to <strong>{dateLabel}</strong>. Official 9-round classical, 7-round rapid, and 9-round blitz schedules are locked.</p>{localTimezone && <p>Opening day in your timezone: {new Date(eventStartDate).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p>}<div className="flexline"><a href={registrationHref} className="action">Register Interest →</a><Link href="/schedule" className="action">View Official Schedule</Link></div></div>
  </div></article>;
}
