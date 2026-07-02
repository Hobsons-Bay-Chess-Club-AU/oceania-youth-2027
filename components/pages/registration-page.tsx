import Link from "next/link";

export function RegistrationPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(140deg,rgba(12,34,70,0.98),rgba(23,84,129,0.94)_52%,rgba(255,201,120,0.86))] px-6 py-8 text-white shadow-[0_30px_80px_rgba(12,34,70,0.18)] md:px-10 md:py-12">
        <div className="motion-float absolute -left-10 top-16 h-36 w-36 rounded-full bg-cyan-200/20 blur-3xl" />
        <div className="motion-float-delayed absolute right-0 top-0 h-52 w-52 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100/80">
              Registration
            </p>
            <h1 className="max-w-3xl font-display text-5xl leading-[0.92] text-white md:text-7xl">
              Entry details will be published here.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-blue-50/88 md:text-lg">
              This page is reserved for player entry information, registration timing, eligibility checks,
              fee details, and the official application process for Oceania Youth Chess 2027.
            </p>
          </div>

          <article className="rounded-[1.8rem] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100/75">
              Current status
            </p>
            <h2 className="mt-3 font-display text-3xl text-white">Registration not yet open</h2>
            <p className="mt-3 text-sm leading-7 text-white/85">
              The entry process is still being prepared. Once registration opens, this page will include
              full instructions and direct access to the official form.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/news"
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
              >
                Read latest updates
              </Link>
              <Link
                href="/schedule"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                View schedule
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">What will be added</p>
          <h2 className="mt-3 font-display text-3xl text-slate-900">Player entry steps</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            This section will explain how players register, what details are required, and how organisers
            will confirm successful entries.
          </p>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Before you enter</p>
          <h2 className="mt-3 font-display text-3xl text-slate-900">Eligibility and fees</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Eligibility rules, division requirements, fee information, and federation-related notes will
            appear here once they are finalised.
          </p>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">Stay informed</p>
          <h2 className="mt-3 font-display text-3xl text-slate-900">Opening announcement</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The official opening date for registrations will also be announced through the News & Updates
            page so players and families can plan ahead with confidence.
          </p>
        </article>
      </section>
    </div>
  );
}
