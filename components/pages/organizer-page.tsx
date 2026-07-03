import { Hero, Section } from "@/components/ui";
import { organizerData } from "@/app/organizer/data";

export function OrganizerPage() {
  return (
    <>
      <Hero
        eyebrow="Event leadership"
        title="Organizer Information"
        description="This page introduces the organizing structure behind Oceania Youth Zonal 2027 and will be updated as official appointments are confirmed."
      />
      <Section title={organizerData.title} description={organizerData.intro}>
        <div className="grid gap-4 md:grid-cols-3">
          {organizerData.groups.map((group) => (
            <article
              key={group.title}
              className="rounded-[1rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-5 shadow-sm md:rounded-[1.5rem]"
            >
              <h3 className="font-display text-2xl text-slate-900">{group.title}</h3>
              <div className="mt-4 grid gap-3">
                {group.staff.map((member) => (
                  <div key={member.role} className="rounded-[0.9rem] bg-slate-50 px-4 py-3 md:rounded-[1.2rem]">
                    <p className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-slate-500">
                      {member.role}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{member.name}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
