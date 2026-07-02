import { Hero, Section } from "@/components/ui";
import { scheduleRows } from "@/app/schedule/data";

export function SchedulePage() {
  return (
    <>
      <Hero
        eyebrow="Tournament flow"
        title="Tournament Schedule"
        description="The source schedule has been converted into local structured data so we can restyle or edit it later without touching markup."
      />
      <Section title="Event timetable">
        <div className="grid gap-4 md:hidden">
          {scheduleRows.map((row, index) => (
            <article
              key={`${row.date}-${row.time}-${index}`}
              className="rounded-[1rem] border border-[rgba(24,34,53,0.12)] bg-[#fffaf1] p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--gold)]">
                    {row.date || "Schedule item"}
                  </p>
                  <h3 className="mt-2 text-xl text-[var(--ink)] [font-family:var(--font-display)]">
                    {row.activity}
                  </h3>
                </div>
                <span className="rounded-full bg-[var(--navy)] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">
                  {row.time}
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-[0.9rem] bg-white/75 px-4 py-3">
                  <p className="text-[0.7rem] font-black uppercase tracking-[0.16em] text-slate-500">Day</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{row.day || "To be confirmed"}</p>
                </div>
                <div className="rounded-[0.9rem] bg-white/75 px-4 py-3">
                  <p className="text-[0.7rem] font-black uppercase tracking-[0.16em] text-slate-500">Venue</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{row.venue}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-[1rem] border border-[rgba(24,34,53,0.12)] bg-[#fffaf1] md:block md:rounded-[1.35rem]">
          <table className="w-full min-w-[760px] border-collapse">
            <thead className="bg-[var(--navy)] text-white">
              <tr>
                <th className="px-3 py-3 text-left text-sm font-bold sm:px-4 sm:text-base">December</th>
                <th className="px-3 py-3 text-left text-sm font-bold sm:px-4 sm:text-base">Day</th>
                <th className="px-3 py-3 text-left text-sm font-bold sm:px-4 sm:text-base">Times</th>
                <th className="px-3 py-3 text-left text-sm font-bold sm:px-4 sm:text-base">Venue</th>
                <th className="px-3 py-3 text-left text-sm font-bold sm:px-4 sm:text-base">Activity</th>
              </tr>
            </thead>
            <tbody>
              {scheduleRows.map((row, index) => (
                <tr key={`${row.date}-${row.time}-${index}`}>
                  <td className="border-b border-[rgba(24,34,53,0.12)] px-3 py-3 text-left text-[0.95rem] sm:px-4 sm:text-base">{row.date}</td>
                  <td className="border-b border-[rgba(24,34,53,0.12)] px-3 py-3 text-left text-[0.95rem] sm:px-4 sm:text-base">{row.day}</td>
                  <td className="border-b border-[rgba(24,34,53,0.12)] px-3 py-3 text-left text-[0.95rem] sm:px-4 sm:text-base">{row.time}</td>
                  <td className="border-b border-[rgba(24,34,53,0.12)] px-3 py-3 text-left text-[0.95rem] sm:px-4 sm:text-base">{row.venue}</td>
                  <td className="border-b border-[rgba(24,34,53,0.12)] px-3 py-3 text-left text-[0.95rem] sm:px-4 sm:text-base">{row.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
