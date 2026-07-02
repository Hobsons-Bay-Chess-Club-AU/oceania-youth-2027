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
        <div className="-mx-1 overflow-auto rounded-[1.35rem] border border-[rgba(24,34,53,0.12)] bg-[#fffaf1] sm:mx-0">
          <table className="w-full border-collapse">
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
