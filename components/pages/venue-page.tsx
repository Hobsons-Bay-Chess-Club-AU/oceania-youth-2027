import { Section } from "@/components/ui";
import { venueData } from "@/lib/site-data";

export function VenuePage() {
  return (
    <>
      <Section title="Venue, Accommodation & Food" description="Content migrated from the 2025 site for reuse and editing.">
        <div className="prose-block">
          <h3>Venue</h3>
          <p>The 2025 Oceania Youth Chess Zonal will be held at:</p>
          <div className="callout">
            <strong>{venueData.venue.name}</strong>
            <p>{venueData.venue.address}</p>
          </div>
          <p>{venueData.venue.note}</p>

          <h3>Travel to the Venue</h3>
          <p>{venueData.travelIntro}</p>
          <h4>By Air</h4>
          <p>{venueData.byAir}</p>
          <h4>By Public Transport</h4>
          <p>{venueData.byTransport}</p>
          <ul className="bullet-list">
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
        <div className="info-grid">
          {venueData.accommodation.map((item) => (
            <article className="info-card" key={item.name}>
              <h3>{item.name}</h3>
              <p>{item.address}</p>
              <p>{item.distance}</p>
              {item.offer ? <p className="accent-text">{item.offer}</p> : null}
            </article>
          ))}
        </div>
      </Section>

      <Section title="Food Options">
        <div className="prose-block">
          <p>
            There are many food options available. Please see our <a href="/map">map</a> for locations.
          </p>
          <h4>On-Site</h4>
          <p>{venueData.onSiteFoodIntro}</p>
          <ul className="bullet-list">
            {venueData.onSiteFoodItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="info-grid">
          {venueData.nearbyEateries.map((item) => (
            <article className="info-card" key={item.name}>
              <h3>{item.name}</h3>
              <p>{item.address}</p>
              <p>{item.distance}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
