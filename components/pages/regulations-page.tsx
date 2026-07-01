import { Hero, Section } from "@/components/ui";
import { regulations } from "@/lib/site-data";

export function RegulationsPage() {
  return (
    <>
      <Hero
        eyebrow="Rules and format"
        title="Tournament Regulations"
        description="The full regulations source has been carried across and reformatted to match the new site design while keeping the official content intact."
      />
      <Section title={regulations.title} description="Imported from the source regulations page and presented in a cleaner article layout.">
        <div className="grid gap-6 xl:grid-cols-[0.34fr_0.66fr]">
          <aside className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f9fbff,#eef4ff)] p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">On this page</p>
            <div className="mt-4 space-y-3">
              {regulations.sections.map((section) => (
                <div key={section.heading} className="rounded-2xl bg-white/80 px-4 py-3">
                  <p className="text-sm font-bold text-slate-900">{section.heading}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-5">
            {regulations.sections.map((section) => (
              <article
                key={section.heading}
                className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur"
              >
                <h3 className="font-display text-2xl text-slate-900 md:text-3xl">{section.heading}</h3>
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
                      <p key={paragraph} className="text-base leading-8 text-slate-600">
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
                        className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-7 text-slate-700"
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
                        className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-7 text-slate-700"
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
