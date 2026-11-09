
import { Translated } from "@/components/i18n-provider";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import styles from "./federation-support.module.css";

const sections = [
    ["official-delegation", "12.1", "Official Federation Delegation"],
    ["accommodation", "12.2", "Accommodation Support"],
    ["travel-assistance", "12.3", "Pacific Island Federation Participation Assistance Scheme"],
    ["visa-travel", "12.4", "Visa, Travel and Logistics Support for Official Players"],
    ["special-prizes", "12.5", "Special Prize for Pacific Island Federation Players"],
    ["conditions", "12.6", "General Conditions"],
];

export function FederationSupportPage() {
    return <Translated>{<div className={styles.page}>
        <section className="page-title">
            <span className="eyebrow">Player entry &amp; federation participation</span>
            <h1>Registration and federation support</h1>
            <p>Early registration helps the organisers secure accommodation, visa support and venue capacity.</p>
            <div className="flexline"><Link href="/registration" className="action">Registration &amp; fees →</Link><a href={siteConfig.links.registrations} target="_blank" rel="noreferrer" className="action">Register Now ↗</a></div>
        </section>
        <section className={styles.overview} aria-labelledby="support-overview-title">
            <span className="eyebrow">At a glance</span><h2 id="support-overview-title">Entry fees &amp; support</h2>
            <div className={styles.summary}>
                <div><h3>Standard player entry</h3><p><strong>AUD 260 Early Bird</strong> by 1 August 2027.<br/><strong>AUD 300 general entry</strong> after 1 August.</p><p>Includes all three Classical, Rapid and Blitz tournaments.</p></div>
                <div><h3>Official delegation package</h3><p><strong>AUD 130 Early Bird</strong> or <strong>AUD 170 general entry</strong> per official player. The registration component is waived for both entries.</p><p>Accommodation and visa invitation support, subject to programme conditions.</p></div>
                <div><h3>Pacific Island assistance</h3><p><strong>AUD 1,000</strong> for each of the first three eligible federations registering at least five players by <strong>1 March 2027</strong>.</p><Link href="#travel-assistance">Eligibility &amp; payment conditions ↓</Link></div>
                <div><h3>Pacific Island special prizes</h3><p>Special medals for top eligible Pacific Island players, separate from main championship prizes.</p><p>Minimum three registered players per category. Final eligibility and allocation are determined by the organisers.</p></div>
            </div>
        </section>
        <div className={styles.layout}>
            <aside className={styles.contents}><nav aria-label="Federation support sections"><span className="eyebrow">On this page</span>{sections.map(([id, number, title]) => <a key={id} href={`#${id}`}><span>{number}</span>{title}</a>)}<Link href="/contact-us">Contact the organising committee ↗</Link></nav></aside>
            <article className={styles.content}>
                <div className={styles.intro}>
                    <span className="eyebrow">Federation Support Programme</span>
                    <h2>Supporting participation across Oceania</h2>
                    <p>To encourage broad participation from across the Oceania region, Hobsons Bay Chess Club (HBCC) is committed to supporting participating national federations, particularly developing Pacific Island federations.</p>
                    <p>The programme is designed to reduce participation barriers, encourage international representation, and strengthen chess development throughout Oceania.</p>
                    <p className={styles.condition}>Support initiatives are subject to available funding, sponsorship and organiser capacity.</p>
                </div>
                <section id="official-delegation" className={styles.section}>
                    <span className="eyebrow">12.1</span><h2>Official Federation Delegation</h2>
                    <p>Participating federations may nominate an official delegation comprising:</p>
                    <ul><li>Up to <strong>one (1) Official Player in each age category</strong></li><li><strong>One (1) Head of Delegation</strong></li></ul>
                    <p>Official players will participate as recognised representatives of their respective national federations.</p>
                    <p>The Organising Committee reserves the right to determine the final number of supported officials based on available resources.</p>
                </section>
                <section id="accommodation" className={styles.section}>
                    <span className="eyebrow">12.2</span><h2>Accommodation Support</h2>
                    <p>HBCC intends to provide complimentary accommodation for official federation delegations comprising:</p>
                    <ul><li>One (1) Official Player per age category</li><li>One (1) Head of Delegation per federation</li></ul>
                    <p>Accommodation will generally be provided on a twin-share basis for the official duration of the championship.</p>
                    <p>This initiative aims to significantly reduce travel costs for participating federations and encourage wider regional participation.</p>
                </section>
                <section id="travel-assistance" className={styles.section}>
                    <span className="eyebrow">12.3</span><h2>Pacific Island Federation Participation Assistance Scheme</h2>
                    <p>To encourage participation from developing Oceania federations and assist with regional travel costs, HBCC will establish a <strong>Pacific Island Federation Participation Assistance Scheme</strong>.</p>
                    <p>Under this scheme:</p><ul><li>The <strong>first three (3) eligible federations</strong> will each receive a <strong>$1,000 travel assistance grant</strong>.</li><li>A maximum of <strong>three grants</strong> will be awarded.</li></ul>
                    <h3>Eligibility</h3><p>To qualify, a federation must:</p>
                    <ul><li>Be a member federation of the Oceania Chess Confederation (OCC).</li><li>Be located outside Australia and New Zealand.</li><li>Register a delegation of at least <strong>five (5) players</strong>.</li><li>Submit the names of all participating players to the Organising Committee by <strong>1 March 2027</strong>.</li><li>Be among the first three federations meeting all eligibility requirements.</li></ul>
                    <h3>Payment Conditions</h3><p>The travel assistance grant will:</p>
                    <ul><li>Be paid only after the federation has completed in-person registration at the championship venue.</li><li>Be paid to an authorised federation representative or by another method approved by the Organising Committee.</li><li>Be forfeited if the federation withdraws, fails to attend, or no longer satisfies the eligibility requirements.</li></ul>
                    <h3>Purpose</h3><p>The scheme aims to:</p>
                    <ul><li>Reduce travel costs for developing Oceania federations.</li><li>Encourage broader international participation.</li><li>Provide greater competitive opportunities for young players from Pacific Island nations.</li><li>Strengthen chess development and regional cooperation throughout Oceania.</li></ul>
                </section>
                <section id="visa-travel" className={styles.section}>
                    <span className="eyebrow">12.4</span><h2>Visa, Travel and Logistics Support for Official Players</h2>
                    <p>HBCC will provide practical assistance to participating federations where possible, including:</p>
                    <ul><li>Official invitation letters for visa applications.</li><li>General visa guidance and supporting documentation.</li><li>Early issue of invitation letters to assist with visa processing.</li><li>General travel and logistics advice.</li><li>Accommodation coordination assistance.</li><li>Information on local transport options.</li><li>Airport transfer and hotel-to-venue shuttle services for official delegations (subject to availability and funding).</li><li>General guidance on applying for available FIDE and Oceania development grants.</li></ul>
                    <p className={styles.condition}>Visa invitation letters will only be provided to both official and unofficial players and accompanying persons (e.g. parents) once the entry and registration fee has been paid. If you are unable to obtain a visa, your entry/registration fee will be refunded.</p>
                </section>
                <section id="special-prizes" className={styles.section}>
                    <span className="eyebrow">12.5</span><h2>Special Prize for Pacific Island Federation Players</h2>
                    <p>To encourage greater participation and recognise talented young players from across the Pacific, the Oceania Youth Chess Championship 2027 will offer Special Prizes for Pacific Island Federation Players.</p>
                    <p>These prizes are open to eligible players representing Oceania chess federations other than Australia and New Zealand.</p>
                    <p>The prizes will recognise the best-performing eligible Pacific Island Federation players participating in the Championship and are separate from the main Championship titles and other age-group prizes.</p>
                    <p>A minimum of three registered players per category is required.</p>
                    <p>Eligibility and final prize allocation will be determined by the tournament organisers.</p>
                </section>
                <section id="conditions" className={styles.section}>
                    <span className="eyebrow">12.6</span><h2>General Conditions</h2>
                    <p>All federation support initiatives:</p>
                    <ul><li>Are subject to available funding, sponsorship and organiser capacity.</li><li>May be amended or withdrawn if circumstances require.</li><li>Do not constitute an automatic entitlement unless confirmed in writing by the Organising Committee.</li><li>May be prioritised for developing Oceania federations where funding is limited.</li></ul>
                    <Link href="/contact-us" className="action">Discuss federation support →</Link>
                </section>
            </article>
        </div>
    </div>}</Translated>;
}
