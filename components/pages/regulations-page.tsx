import { Hero } from "@/components/ui";
import { regulations, type RegulationSection } from "@/app/regulations/data";
function sectionId(heading: string) { return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
export function RegulationsPage() {
    const { metadata } = regulations;
    return <div className="page-regulations">
    <Hero eyebrow="FIDE Zone 3.6 & OCC Rules" title="Official Tournament Regulations" description="Comprehensive technical regulations governing playing formats, time controls, age cutoffs, tie-break systems, direct titles, and appeal procedures for Oceania Youth 2027.">
      <div className="flexline"><a className="action" href="/OceaniaYouth%202027%20TournamentRegulations.pdf" download="OceaniaYouth 2027 TournamentRegulations.pdf" target="_blank" rel="noreferrer">📥 Download Regulations (PDF)</a><a className="action" href="/OceaniaYouth%202027%20Tournament%20Pack.pdf" download="OceaniaYouth 2027 Tournament Pack.pdf" target="_blank" rel="noreferrer">📥 Download Tournament Pack (PDF)</a><a className="action" href="#regulations-content">Browse Regulations ↓</a></div>
    </Hero>
    <section className="rules-snapshot"><div className="flexline"><div><span className="eyebrow">Tournament Snapshot</span><h2>{regulations.title}</h2><p>{regulations.subtitle}</p></div><a className="action" href="/OceaniaYouth%202027%20TournamentRegulations.pdf" download target="_blank" rel="noreferrer">📄 Official PDF Document ↗</a></div>
      <div className="subgrid">{[["Dates", metadata.dates], ["Venue", metadata.venue], ["Organisers", metadata.organiser], ["Contact Email", metadata.contact]].map(([label, value]) => <div key={label}><span className="eyebrow">{label}</span>{label === "Contact Email" ? <a href={`mailto:${value}`}>{value}</a> : <p>{value}</p>}</div>)}</div><div><strong>Status of Regulations: </strong>{metadata.status}</div>
    </section>
    <div className="rules-workspace" id="regulations-content"><aside className="rules-index"><div><div className="flexline"><span className="eyebrow">Regulations Navigator</span><a className="action" href="/OceaniaYouth%202027%20TournamentRegulations.pdf" download>PDF ↓</a></div><nav aria-label="Regulations chapters">{regulations.sections.map(section => <a key={section.heading} href={`#${sectionId(section.heading)}`}>{section.heading}</a>)}</nav></div></aside>
      <div className="rules-copy">{regulations.sections.map(section => <RuleSection key={section.heading} section={section}/>)}</div>
    </div>
  </div>;
}
function RuleSection({ section }: {
    section: RegulationSection;
}) {
    const afterTable = "paragraphsAfterTable" in section ? section.paragraphsAfterTable : null;
    return <article id={sectionId(section.heading)}><h2>{section.heading}</h2>
    {section.paragraphs.map(p => <p key={p}>{p}</p>)}
    {section.table && <div className="rules-table"><table><thead><tr>{section.table.headers.map((header, i) => <th key={i} scope="col">{header}</th>)}</tr></thead><tbody>{section.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
    {Array.isArray(afterTable) && afterTable.map((p: string) => <p key={p}>{p}</p>)}
    {section.list && <ul>{section.list.map(item => <li key={item}>{item}</li>)}</ul>}
    {section.orderedList && <ol>{section.orderedList.map(item => <li key={item}>{item}</li>)}</ol>}
    {section.callout && <div className="rule-callout">{section.callout.title && <strong>{section.callout.title}</strong>}<p>{section.callout.text}</p></div>}
  </article>;
}
