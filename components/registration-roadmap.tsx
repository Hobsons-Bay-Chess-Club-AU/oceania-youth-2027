
import { Translated } from "@/components/i18n-provider";
import styles from "./registration-roadmap.module.css";

export function RegistrationRoadmap() {
    return <Translated>{<section className={styles.section} aria-label="Championship schedule diagram">
        <figure className={styles.figure}>
            <p className={styles.hint} id="roadmap-scroll-hint">Scroll across to view the full schedule →</p>
            <div className={styles.scroll} tabIndex={0} role="region" aria-label="Schedule diagram, scroll horizontally to explore" aria-describedby="roadmap-scroll-hint">
                <img src="/registration-roadmap.svg" width="1600" height="660" alt="Oceania Youth Chess Championship 2027 schedule: registration opens 1 September 2026, followed by federation deadlines, the lucky draw, entry closing dates, arrival on 28 September, tournament day on 29 September and departure on 4 October. Full dates are listed in the timeline below."/>
            </div>
            <figcaption className={styles.caption}>
                <p><strong>Pacific Islander federation assistance:</strong> The first 3 eligible federations to register by 1 March 2027, excluding Australia and New Zealand, receive AUD 1,000 towards flight tickets. A minimum of 5 players per federation is required.</p>
                <p><strong>Overseas federations:</strong> Latest entry is 1 April 2027, allowing time for visa applications to the Australian Government.</p>
                <a href="/registration-roadmap.svg" download="Oceania-Youth-2027-Registration-Schedule.svg">Download schedule diagram ↗</a>
            </figcaption>
        </figure>
    </section>}</Translated>;
}
