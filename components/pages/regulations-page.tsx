import Link from "next/link";
import { Hero, Section } from "@/components/ui";
import { regulations } from "@/app/regulations/data";
import { RegulationsPdfDownload } from "@/components/regulations-pdf-download";

export function RegulationsPage() {
  return (
    <>
      <Hero
        eyebrow="Rules and format"
        title="Tournament Regulations"
        description="The full regulations source has been carried across and reformatted to match the new site design while keeping the official content intact."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <RegulationsPdfDownload
            label="Download PDF"
            className="inline-flex items-center rounded-full bg-[var(--navy)] px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          />
          <a
            href="#regulations-content"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
          >
            Browse sections
          </a>
        </div>
      </Hero>
      <Section
        title={regulations.title}
        description="Read the official regulations online or download the PDF version for offline reference."
      >
        <div id="regulations-content" className="grid gap-6 xl:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)]">
          <aside className="xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-[1rem] border border-slate-200 bg-[linear-gradient(180deg,#f9fbff,#eef4ff)] p-4 shadow-sm sm:p-5 md:rounded-[1.75rem]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">On this page</p>
                <RegulationsPdfDownload label="PDF" className="text-sm font-bold text-sky-700" />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {regulations.sections.map((section) => {
                  const sectionId = getSectionId(section.heading);

                  return (
                    <a
                      key={section.heading}
                      href={`#${sectionId}`}
                      className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:bg-white"
                    >
                      {section.heading}
                    </a>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            {regulations.sections.map((section) => (
              <article
                id={getSectionId(section.heading)}
                key={section.heading}
                className="scroll-mt-24 rounded-[1rem] border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-6 md:rounded-[1.75rem]"
              >
                <h3 className="font-display text-xl text-slate-900 sm:text-2xl md:text-3xl">{section.heading}</h3>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => {
                    const isStandaloneLabel =
                      paragraph === "AGE GROUP REQUIREMENTS" || paragraph === "Important Notice:";

                    if (isStandaloneLabel) {
                      return (
                        <p
                          key={paragraph}
                          className="text-sm font-black uppercase tracking-[0.16em] text-slate-500"
                        >
                          {paragraph}
                        </p>
                      );
                    }

                    return (
                      <p key={paragraph} className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
                {section.list ? (
                  <ul className="mt-5 space-y-3">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-700 sm:leading-7"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.orderedList ? (
                  <ol className="mt-5 space-y-3">
                    {section.orderedList.map((item, index) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-700 sm:leading-7"
                      >
                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

function getSectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
