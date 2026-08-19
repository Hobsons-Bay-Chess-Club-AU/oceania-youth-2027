"use client";

import { Hero } from "@/components/ui";
import { regulations } from "@/app/regulations/data";
import { RegulationsPdfDownload } from "@/components/regulations-pdf-download";

export function RegulationsPage() {
  return (
    <div className="space-y-8">
      <Hero
        eyebrow="FIDE Handbook & Handbook Rules"
        title="Official Tournament Regulations"
        description="Comprehensive technical regulations governing playing formats, time controls, tie-breaks, norm pathways, and appeal procedures for Oceania Youth 2027."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <RegulationsPdfDownload
            label="Download PDF Manual"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-2.5 text-xs font-black uppercase text-slate-950 shadow-md transition hover:scale-105"
          />
          <a
            href="#regulations-content"
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            Browse Regulations ↓
          </a>
        </div>
      </Hero>

      <div id="regulations-content" className="grid gap-8 lg:grid-cols-12">
        {/* Sticky Table of Contents */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Regulations Navigator
              </span>
              <RegulationsPdfDownload label="PDF" className="text-xs font-bold text-amber-300 hover:underline" />
            </div>

            <nav className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
              {regulations.sections.map((sec) => {
                const id = getSectionId(sec.heading);
                return (
                  <a
                    key={sec.heading}
                    href={`#${id}`}
                    className="block rounded-xl border border-slate-800/80 bg-slate-950/60 px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-amber-500/40 hover:text-white hover:bg-slate-900"
                  >
                    {sec.heading}
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Regulations Document Sections */}
        <main className="lg:col-span-8 space-y-6">
          {regulations.sections.map((section) => (
            <article
              id={getSectionId(section.heading)}
              key={section.heading}
              className="scroll-mt-24 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md md:p-8 space-y-4"
            >
              <h3 className="font-display text-2xl font-bold text-white border-b border-slate-800 pb-3">
                {section.heading}
              </h3>

              <div className="space-y-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                {section.paragraphs.map((p) => {
                  const isLabel = p === "AGE GROUP REQUIREMENTS" || p === "Important Notice:";
                  if (isLabel) {
                    return (
                      <p key={p} className="font-bold text-amber-400 uppercase tracking-wider pt-2">
                        {p}
                      </p>
                    );
                  }
                  return <p key={p}>{p}</p>;
                })}
              </div>

              {section.list && (
                <ul className="space-y-2 pt-2">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300"
                    >
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.orderedList && (
                <ol className="space-y-2 pt-2">
                  {section.orderedList.map((item, index) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/20 font-bold text-amber-300 text-[0.65rem]">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              )}
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}

function getSectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

