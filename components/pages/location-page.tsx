import { Hero } from "@/components/ui";
import { venueData } from "@/app/venue/data";
import { siteConfig } from "@/lib/site-config";
export function LocationPage() {
    return <div className="page-location">
    <Hero eyebrow="Host City & Venue Guide" title="Location & Venue Information" description="Comprehensive travel, accommodation, public transport, and venue details for families and federations attending Oceania Youth 2027 in Melbourne, Australia."><div className="flexline"><a href={siteConfig.links.mapEmbed} target="_blank" rel="noreferrer" className="action">Open Google Maps ↗</a></div></Hero>
    <section className="venue-composition"><div className="venue-description"><div><span className="eyebrow">Playing Hall</span><h2>{venueData.venue.name}</h2><p>{venueData.venue.address}</p></div><p>{venueData.venue.note}</p><div className="subgrid"><div><span className="eyebrow">Playing Hall Venue</span><p>{venueData.venue.name}</p></div><div><span className="eyebrow">Best For</span><p>Junior players, families, and team delegations planning daily movement.</p></div><div><span className="eyebrow">Key Amenities</span><p>Analysis rooms, parent lounge, cafeteria, public transit, and hotel hubs.</p></div></div></div>
      <div className="venue-map"><div className="flexline"><span>Live Map View</span><span>Melbourne, VIC Australia</span></div><div><iframe src={siteConfig.links.mapEmbed} title="Oceania Youth venue map" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div></div>
    </section>
    <section className="travel-notes"><div><span className="eyebrow">Getting to Melbourne</span><h2>Airport Connections &amp; Local Transit</h2></div><div className="subgrid"><div><span className="eyebrow">✈️ International Air Travel</span><p>{venueData.byAir}</p></div><div><span className="eyebrow">🚆 Trains, Trams &amp; SkyBus</span><p>{venueData.byTransport}</p></div></div><div><p className="eyebrow">Recommended Transit Routes</p><div className="subgrid">{venueData.transportRoutes.map(route => <a href={route.href} key={route.label} target="_blank" rel="noreferrer"><p className="metric">{route.label}</p><p>{route.note}</p></a>)}</div></div></section>
    <section className="nearby-guide"><div><span className="eyebrow">Hotel Recommendations</span><h2>Nearby Accommodation</h2><div>{venueData.accommodation.map(item => <div key={item.name}><div className="flexline"><h3>{item.name}</h3><span>{item.distance}</span></div><p>{item.address}</p>{item.offer && <span>{item.offer}</span>}</div>)}</div></div>
      <div><span className="eyebrow">Dining &amp; Cafes</span><h2>Eateries Near Playing Hall</h2><div><div><span>On-Site Catering</span>{venueData.onSiteFoodIntro}</div>{venueData.nearbyEateries.map(item => <div key={item.name}><div className="flexline"><h3>{item.name}</h3><span>{item.distance}</span></div><p>{item.address}</p></div>)}</div></div>
    </section>
  </div>;
}
