import styles from "./registration-timeline.module.css";

const milestones = [
    { date: "2026-09-01", label: "1 Sep 2026", title: "Registration opens", note: "Player registration is now open.", kind: "opening" },
    { date: "2027-03-01", label: "1 Mar 2027", title: "Pacific Island assistance deadline", note: "Eligible federations submit their player delegations.", kind: "deadline" },
    { date: "2027-04-01", label: "1 Apr 2027", title: "Overseas federation deadline", note: "Allow time for Australian visa applications.", kind: "deadline" },
    { date: "2027-05-01", label: "1 May 2027", title: "First 300 players lucky draw", note: "The first 300 registered players qualify for the draw.", kind: "event" },
    { date: "2027-08-01", label: "1 Aug 2027", title: "Early Bird entry closes", note: "Complete payment by the Early Bird deadline.", kind: "deadline" },
    { date: "2027-09-27", label: "27 Sep 2027", title: "Final entry closes", note: "Last date to enter the championship.", kind: "deadline" },
    { date: "2027-09-28", label: "28 Sep 2027", title: "Delegations arrive in Melbourne", note: "Arrival, airport transfers and hotel check-in.", kind: "event" },
    { date: "2027-09-29", label: "29 Sep 2027", title: "Championship begins", note: "Classical, Rapid and Blitz run 29 September–3 October.", kind: "event" },
    { date: "2027-10-04", label: "4 Oct 2027", title: "Delegations depart", note: "Hotel check-out and airport transfers.", kind: "event" },
];

export function RegistrationTimeline() {
    return <section className={styles.timeline} aria-labelledby="registration-schedule-title">
        <div className={styles.heading}>
            <div><span className="eyebrow">Key dates</span><h2 id="registration-schedule-title">Registration schedule</h2></div>
            <p>Plan your entry, federation deadlines and journey to Melbourne.</p>
        </div>
        <ol className={styles.milestones}>
            {milestones.map((milestone, index) => <li key={milestone.date} className={styles.milestone} data-kind={milestone.kind}>
                <div className={styles.date}><span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><time dateTime={milestone.date}>{milestone.label}</time></div>
                <h3>{milestone.title}</h3>
                <p>{milestone.note}</p>
            </li>)}
        </ol>
        <p className={styles.note}>Championship play: <strong>29 September–3 October 2027.</strong> Arrival and departure days are shown separately.</p>
    </section>;
}
