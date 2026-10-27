"use client";
import { useState } from "react";
import { Hero, SearchInput } from "@/components/ui";
import { scheduleRows } from "@/app/schedule/data";
const categories = [{ label: "All Events", value: "all" }, { label: "Rounds 1 - 9", value: "round" }, { label: "Ceremonies & Meetings", value: "ceremony" }];
export function SchedulePage() {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [day, setDay] = useState("all");
    const days = Array.from(new Set(scheduleRows.map(row => row.day)));
    const rows = scheduleRows.filter(row => {
        const text = `${row.activity} ${row.venue} ${row.date}`.toLowerCase();
        return text.includes(search.toLowerCase()) && (day === "all" || day === row.day) && (filter === "all" || (filter === "round" ? text.includes("round") : /opening|awards|meeting|registration|ceremony/.test(text)));
    });
    function addToCalendar(activity: string, date: string) {
        const title = encodeURIComponent(`Oceania Youth 2027: ${activity}`);
        const details = encodeURIComponent("Official Oceania Youth Chess Zonal 2027 Schedule Event.");
        const match = date.match(/(\d+)\s+(Sept|Oct)/);
        const start = match ? `2027${match[2] === "Sept" ? "09" : "10"}${match[1].padStart(2, "0")}` : "";
        window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}${start ? `&dates=${start}/${start}` : ""}`, "_blank", "noopener,noreferrer");
    }
    return <div className="page-schedule">
    <Hero eyebrow="Official Timetable" title="Tournament Schedule" description="Comprehensive 9-round classical championship schedule, technical meetings, opening ceremonies, blitz side events, and prize distribution."/>
    <section className="schedule-workspace">
      <div className="schedule-toolbar"><div className="flexline">{categories.map(item => <button type="button" key={item.value} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}</button>)}</div><div><SearchInput value={search} onChange={setSearch} placeholder="Search schedule events..."/></div></div>
      <aside className="day-selector" aria-label="Filter by day"><span className="eyebrow">Filter by Day:</span><button type="button" aria-pressed={day === "all"} onClick={() => setDay("all")}>All Days</button>{days.map(value => <button type="button" key={value} aria-pressed={day === value} onClick={() => setDay(value)}>{value}</button>)}</aside>
      <div className="schedule-events" aria-live="polite">{rows.map((row, index) => <div className="event-row" key={`${row.date}-${index}`}><div className="event-date">{row.date.replace(" 2027", "")}</div><div className="event-description"><div className="flexline"><span>{row.activity}</span><span>{row.day}</span></div><p>Venue: {row.venue} · Scheduled Time: <strong>{row.time}</strong></p></div><button className="calendar-action" type="button" onClick={() => addToCalendar(row.activity, row.date)}>+ Calendar</button></div>)}{!rows.length && <p className="directory-empty">No schedule events matched your search or filter parameters.</p>}</div>
    </section>
  </div>;
}
