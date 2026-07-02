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
        <div className="grid justify-items-center gap-4 text-center">
          <img src={siteConfig.heroImage} alt="Placeholder sponsor board" />
          <p className="max-w-2xl leading-[1.7] text-[var(--muted)]">
            Replace this area with sponsor logos, partner tiers, and acknowledgement copy later.
          </p>
        </div>
      </Section>
    </>
  );
}
