import { Hero, Section } from "@/components/ui";
import { siteConfig } from "@/lib/site-config";

export function SponsorsPage() {
  return (
    <>
      <Hero
        eyebrow="Partner recognition"
        title="Our Sponsors"
        description="Sponsor artwork is carried over from the source page for now and can be replaced with a 2027 partner system later."
      />
      <Section title="Sponsors">
        <div className="sponsor-stage">
          <img
            src={siteConfig.heroImage}
            alt="Placeholder sponsor board"
          />
          <p>Replace this area with sponsor logos, partner tiers, and acknowledgement copy later.</p>
        </div>
      </Section>
    </>
  );
}
