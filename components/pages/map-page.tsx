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
        <div className="min-h-[26rem] overflow-hidden rounded-[1.35rem] border border-[rgba(24,34,53,0.12)] bg-[#fffaf1] sm:min-h-[40rem]">
          <iframe
            src={siteConfig.links.mapEmbed}
            title="Oceania Youth event map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="min-h-[26rem] w-full border-0 sm:min-h-[40rem]"
          />
        </div>
      </Section>
    </>
  );
}
