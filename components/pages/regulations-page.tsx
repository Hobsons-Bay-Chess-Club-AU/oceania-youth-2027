"use client";

import { Hero } from "@/components/ui";
import { regulations } from "@/app/regulations/data";

export function RegulationsPage() {
  const { metadata } = regulations;

  return (
    <div className="space-y-8">
      <Hero
        eyebrow="FIDE Zone 3.6 & OCC Rules"
        title="Official Tournament Regulations"
        description="Comprehensive technical regulations governing playing formats, time controls, age cutoffs, tie-break systems, direct titles, and appeal procedures for Oceania Youth 2027."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/OceaniaYouth%202027%20TournamentRegulations.pdf"
            download="OceaniaYouth 2027 TournamentRegulations.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-2.5 text-xs font-black uppercase text-slate-950 shadow-md transition hover:scale-105"
          >
            <span>📥 Download Regulations (PDF)</span>
          </a>
          <a
            href="/OceaniaYouth%202027%20Tournament%20Pack.pdf"
            download="OceaniaYouth 2027 Tournament Pack.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            <span>📥 Download Tournament Pack (PDF)</span>
          </a>
          <a
            href="#regulations-content"
            className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/60 px-5 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Browse Regulations ↓
          </a>
        </div>
      </Hero>

      {/* Official Tournament Metadata Card */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col gap-2 border-b border-slate-800 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Tournament Snapshot
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white">
              {regulations.title}
            </h2>
            <p className="text-xs text-slate-400">{regulations.subtitle}</p>
          </div>
          <a
            href="/OceaniaYouth%202027%20TournamentRegulations.pdf"
            download="OceaniaYouth 2027 TournamentRegulations.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-amber-300 hover:text-amber-200 hover:underline"
          >
            <span>📄 Official PDF Document</span>
            <span>↗</span>
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
              Dates
            </span>
            <p className="mt-1 text-sm font-semibold text-white">{metadata.dates}</p>
          </div>
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
              Venue
            </span>
            <p className="mt-1 text-sm font-semibold text-white">{metadata.venue}</p>
          </div>
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
              Organisers
            </span>
            <p className="mt-1 text-sm font-semibold text-white">{metadata.organiser}</p>
          </div>
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
              Contact Email
            </span>
            <a
              href={`mailto:${metadata.contact}`}
              className="mt-1 block text-sm font-semibold text-amber-300 hover:underline break-all"
            >
              {metadata.contact}
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-xs text-slate-400 leading-relaxed">
          <strong className="text-amber-400 font-semibold uppercase tracking-wider mr-2">
            Status of Regulations:
          </strong>
          {metadata.status}
        </div>
      </section>

      <div id="regulations-content" className="grid gap-8 lg:grid-cols-12">
        {/* Sticky Table of Contents */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Regulations Navigator
              </span>
              <a
                href="/OceaniaYouth%202027%20TournamentRegulations.pdf"
                download="OceaniaYouth 2027 TournamentRegulations.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-amber-300 hover:underline inline-flex items-center gap-1"
                title="Download Official Regulations PDF"
              >
                <span>PDF</span>
                <span>↓</span>
              </a>
            </div>

            <nav className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
              {regulations.sections.map((sec) => {
                const id = getSectionId(sec.heading);
                const isChapter = !sec.heading.includes(".");
                return (
                  <a
                    key={sec.heading}
                    href={`#${id}`}
                    className={`block rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition ${
                      isChapter
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                        : "border-slate-800/80 bg-slate-950/60 text-slate-300 hover:border-amber-500/40 hover:text-white hover:bg-slate-900"
                    }`}
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
              className="scroll-mt-24 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md md:p-8 space-y-5"
            >
              <h3 className="font-display text-xl md:text-2xl font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>{section.heading}</span>
              </h3>

              {section.paragraphs.length > 0 && (
                <div className="space-y-3 text-xs leading-relaxed text-slate-300 md:text-sm">
                  {section.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              )}

              {/* Render Table if section has one */}
              {section.table && (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70 p-1">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="border-b border-slate-800 bg-slate-900/90 text-[0.7rem] uppercase tracking-wider text-amber-400">
                      <tr>
                        {section.table.headers.map((h, i) => (
                          <th key={i} className="px-4 py-3 font-bold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {section.table.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={rIdx % 2 === 0 ? "bg-transparent" : "bg-slate-900/30"}
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`px-4 py-3 ${
                                cIdx === 0 ? "font-semibold text-white" : ""
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Additional Paragraphs after Table */}
              {"paragraphsAfterTable" in section &&
                Array.isArray((section as { paragraphsAfterTable?: string[] }).paragraphsAfterTable) && (
                  <div className="space-y-3 text-xs leading-relaxed text-slate-300 md:text-sm pt-1">
                    {(section as { paragraphsAfterTable?: string[] }).paragraphsAfterTable?.map(
                      (p) => (
                        <p key={p}>{p}</p>
                      )
                    )}
                  </div>
                )}

              {/* Render Bullet Lists */}
              {section.list && (
                <ul className="space-y-2 pt-1">
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

              {/* Render Ordered Lists */}
              {section.orderedList && (
                <ol className="space-y-2 pt-1">
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

              {/* Render Callout Banner */}
              {section.callout && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 space-y-1">
                  {section.callout.title && (
                    <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-400">
                      <span>⚠️</span>
                      <span>{section.callout.title}</span>
                    </div>
                  )}
                  <p className="leading-relaxed text-slate-200">
                    {section.callout.text}
                  </p>
                </div>
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
