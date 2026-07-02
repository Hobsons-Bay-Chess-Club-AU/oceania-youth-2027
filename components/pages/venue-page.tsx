import { Section } from "@/components/ui";
import { venueData } from "@/app/venue/data";

export function VenuePage() {
  return (
    <>
      <Section
        title="Venue, Accommodation & Food"
        description="TBU"
      >
        <div className="grid gap-4">
          <h3 className="mt-2 text-2xl text-[var(--ink)] [font-family:var(--font-display)]">Venue</h3>
          <p className="leading-[1.7] text-[var(--muted)]">
            The 2027 Oceania Youth Chess Zonal will be held at:
          </p>
          <div className="rounded-[1.35rem] border border-[rgba(24,34,53,0.12)] bg-[#fffaf1] px-4 py-4">
            <strong>{venueData.venue.name}</strong>
            <p className="mt-2 leading-[1.7] text-[var(--muted)]">{venueData.venue.address}</p>
          </div>
          <p className="leading-[1.7] text-[var(--muted)]">{venueData.venue.note}</p>

          <h3 className="mt-2 text-2xl text-[var(--ink)] [font-family:var(--font-display)]">
            Travel to the Venue
          </h3>
          <p className="leading-[1.7] text-[var(--muted)]">{venueData.travelIntro}</p>
          <h4 className="mt-2 text-lg font-semibold text-[var(--ink)]">By Air</h4>
          <p className="leading-[1.7] text-[var(--muted)]">{venueData.byAir}</p>
          <h4 className="mt-2 text-lg font-semibold text-[var(--ink)]">By Public Transport</h4>
          <p className="leading-[1.7] text-[var(--muted)]">{venueData.byTransport}</p>
          <ul className="ml-5 list-disc space-y-2 leading-[1.8] text-[var(--muted)]">
            {venueData.transportRoutes.map((route) => (
              <li key={route.label}>
                <a href={route.href} target="_blank" rel="noreferrer">
                  {route.label}
                </a>{" "}
                {route.note}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Accommodation">
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {venueData.accommodation.map((item) => (
            <article className="rounded-[1.35rem] border border-[rgba(24,34,53,0.12)] bg-[#fffaf1] p-5" key={item.name}>
              <h3 className="text-xl text-[var(--ink)] [font-family:var(--font-display)]">{item.name}</h3>
              <p className="mt-2 leading-[1.7] text-[var(--muted)]">{item.address}</p>
              <p className="leading-[1.7] text-[var(--muted)]">{item.distance}</p>
              {item.offer ? <p className="font-bold text-[var(--gold)]">{item.offer}</p> : null}
            </article>
          ))}
        </div>
      </Section>

      <Section title="Food Options">
        <div className="grid gap-4">
          <p className="leading-[1.7] text-[var(--muted)]">
            There are many food options available. Please see our <a href="/map">map</a> for locations.
          </p>
          <h4 className="mt-2 text-lg font-semibold text-[var(--ink)]">On-Site</h4>
          <p className="leading-[1.7] text-[var(--muted)]">{venueData.onSiteFoodIntro}</p>
          <ul className="ml-5 list-disc space-y-2 leading-[1.8] text-[var(--muted)]">
            {venueData.onSiteFoodItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {venueData.nearbyEateries.map((item) => (
            <article className="rounded-[1.35rem] border border-[rgba(24,34,53,0.12)] bg-[#fffaf1] p-5" key={item.name}>
              <h3 className="text-xl text-[var(--ink)] [font-family:var(--font-display)]">{item.name}</h3>
              <p className="mt-2 leading-[1.7] text-[var(--muted)]">{item.address}</p>
              <p className="leading-[1.7] text-[var(--muted)]">{item.distance}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
