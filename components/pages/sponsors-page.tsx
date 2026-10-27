import Link from "next/link";
export function SponsorsPage() {
    return (<div className="page-sponsors">
    <section className="page-title">
    <div className="eyebrow">
    <span></span>Partnership &amp; Sponsorship</div>
    <h1>Event Sponsors &amp; Partners</h1><p>Supporting junior chess excellence across Oceania. We extend our deepest gratitude to the federations, clubs, and partners supporting Oceania Youth 2027.</p></section>
    <section className="partners-sheet">
    <div>
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
    </div>);
}
