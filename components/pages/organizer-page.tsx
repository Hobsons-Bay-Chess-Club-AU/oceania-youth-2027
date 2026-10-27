import { Hero } from "@/components/ui";
import { organizerData } from "@/app/organizer/data";
export function OrganizerPage() {
    return <div className="page-organizer">
    <Hero eyebrow="Event Leadership & Governance" title="Organising Committee" description="Introducing the tournament direction, arbiter panel, and organising committee structure behind Oceania Youth Zonal 2027."/>
    <section className="organizer-sheet"><div><span className="eyebrow">FIDE Zone 3.6 Leadership</span><h2>{organizerData.title}</h2><p>{organizerData.intro}</p></div>
      <div className="subgrid">{organizerData.groups.map(group => <div key={group.title}><h3>{group.title}</h3><div>{group.staff.map(member => <div key={member.role}><span className="eyebrow">{member.role}</span><p>{member.name}</p></div>)}</div></div>)}</div>
    </section>
  </div>;
}
