import { siteConfig } from "@/lib/site-config";
import { Hero, Section } from "@/components/ui";

export function MapPage() {
  return (
    <>
      <Hero
        eyebrow="Venue navigation"
        title="Interactive event map"
        description="Embedded from the original site so we keep location context while the rest of the experience moves into Next.js."
      />
      <Section title="Map">
        <div className="map-frame">
          <iframe
            src={siteConfig.links.mapEmbed}
            title="Oceania Youth event map"
            loading="lazy"
          />
        </div>
      </Section>
    </>
  );
}
