import { Hero, Section } from "@/components/ui";
import { scheduleRows } from "@/lib/site-data";

export function SchedulePage() {
  return (
    <>
      <Hero
        eyebrow="Tournament flow"
        title="Tournament Schedule"
        description="The source schedule has been converted into local structured data so we can restyle or edit it later without touching markup."
      />
      <Section title="Event timetable">
        <div className="table-shell">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>December</th>
                <th>Day</th>
                <th>Times</th>
                <th>Venue</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              {scheduleRows.map((row, index) => (
                <tr key={`${row.date}-${row.time}-${index}`}>
                  <td>{row.date}</td>
                  <td>{row.day}</td>
                  <td>{row.time}</td>
                  <td>{row.venue}</td>
                  <td>{row.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
