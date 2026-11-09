
import { Translated } from "@/components/i18n-provider";
import Link from "next/link";
import styles from "./sponsors.module.css";
export function SponsorsPage() {
    return <Translated>{(<div className="page-sponsors">
    <section className="page-title">
    <div className="eyebrow">
    <span></span>Partnership &amp; Sponsorship</div>
    <h1>Event Sponsors &amp; Partners</h1><p>Supporting junior chess excellence across Oceania. We extend our deepest gratitude to the federations, clubs, and partners supporting Oceania Youth 2027.</p></section>
    <section className={styles.prospectus} aria-labelledby="sponsorship-prospectus-title">
      <div className={styles.prospectusCopy}>
        <span className={styles.kicker}>2027 Sponsorship Prospectus</span>
        <h2 id="sponsorship-prospectus-title">Back the next generation of champions.</h2>
        <p>Explore three sponsorship packages and find the right partnership for your organisation.</p>
      </div>
      <div className={styles.prospectusAction}>
        <a className={styles.prospectusLink} href="/Oceania_Youth_Zonal_2027_Sponsorship_Prospectus_3_Packages.pdf" target="_blank" rel="noopener noreferrer">
          <svg width="23" height="25" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 1h9l6 6v18H5zM14 1v7h6M9 13h7M9 17h7M9 21h4" /></svg>
          <span>View sponsorship prospectus</span><span aria-hidden="true">↗</span>
        </a>
        <span className={styles.fileDetails}>PDF · 583 KB · Opens in a new tab</span>
      </div>
    </section>
    <section className="partners-sheet">
    <div>
    <h2>Our Sponsors</h2>
    <a className="sponsor-link" href="https://www.bmg.vic.edu.au/" target="_blank" rel="noreferrer">
    <img className="sponsor-logo" src="/bgm.svg" alt="" width="322" height="427" loading="lazy"/>
    <h3>Bacchus Marsh Grammar</h3>
    </a>
    </div>
    <div className="host-partners">
    <div className="flexline">
    <h2>Host Organiser &amp; Governing Bodies</h2><span>Principal Host</span></div>
    <div className="subgrid">
    <div>
    <span>♟️</span><h3>Hobsons Bay Chess Club AU</h3><p>Premier Melbourne Chess Club &amp; Event Host</p></div>
    <div>
    <span>♟️</span><h3>FIDE Zone 3.6 Federation</h3><p>Oceania Chess Governing Body</p></div>
    <div>
    <span>♟️</span><h3>Australian Chess Federation (ACF)</h3><p>National Governing Body for Chess in Australia</p></div>
    </div>
    </div>
    <div>
    <div className="flexline">
    <h2>Supporting Partners &amp; Equipment</h2><span>Official Equipment</span></div>
    <div className="subgrid">
    <div>
    <span>♟️</span><h3>DGT Live Broadcast Transmissions</h3><p>Official Electronic Board Provider</p></div>
    <div>
    <span>♟️</span><h3>Chess Victoria Inc.</h3><p>State Junior Chess Development</p></div>
    </div>
    </div>
    </section>
    <section className="partnership-call">
    <span className="eyebrow">Sponsorship Opportunities</span><h2>Partner With Oceania Youth 2027</h2><p>Empower the next generation of international chess champions. Explore custom sponsorship packages including live broadcast logo placements, trophy naming rights, and youth development grants.</p><Link href="/contact-us" className="action"><span>Inquire About Partnership</span><span>→</span></Link></section>
    </div>)}</Translated>;
}
