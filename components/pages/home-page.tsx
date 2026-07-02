import Link from "next/link";
import { homePageData } from "@/app/data";
import { siteConfig } from "@/lib/site-config";
import { HomeHeroCountdown } from "@/components/home-hero-countdown";

export function HomePage() {
  const quickFacts = [
    {
      label: "Player capacity",
      value: "TBC",
      note: "Use this for expected player count or registration target.",
      tone: "from-sky-400 via-cyan-300 to-teal-200",
    },
    {
      label: "Event duration",
      value: "TBC",
      note: "Use this for the total tournament days once dates are locked.",
      tone: "from-amber-300 via-orange-300 to-pink-200",
    },
    {
      label: "Competition streams",
      value: "TBC",
      note: "Use this for divisions, sections, or championship groups.",
      tone: "from-violet-400 via-fuchsia-300 to-rose-200",
    },
  ];

  const highlightCards = [
    {
      title: "Clear structure",
      body: "The landing page should quickly route visitors to schedules, venue details, registrations, and player information.",
    },
    {
      title: "Stronger branding",
      body: "This design direction gives the event a more polished visual identity without locking in the final copy yet.",
    },
    {
      title: "Better momentum",
      body: "Layered cards, richer color, and subtle motion help the homepage feel alive from the first screen.",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[1rem] border border-white/70 bg-[linear-gradient(135deg,rgba(12,34,70,0.98),rgba(28,74,143,0.92)_45%,rgba(107,217,255,0.78))] px-6 py-8 shadow-[0_30px_80px_rgba(12,34,70,0.18)] md:rounded-[2rem] md:px-10 md:py-12">
        <div className="motion-float absolute -left-10 top-16 h-36 w-36 rounded-full bg-yellow-300/30 blur-3xl" />
        <div className="motion-float-delayed absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6 motion-rise-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              <span className="text-lg">♟</span>
              Every chess master was once a beginner (Irving Chernev)
            </div>
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100/80">
                Present by Hobsons Bay Chess Club
              </p>
              <h1 className="max-w-xl font-display text-5xl leading-[0.92] text-white md:text-7xl">
                Oceania Youth Chess Zonal Tournament 2027
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white md:text-lg">
                The official Oceania Youth Zonal 2027 website brings together the key information
                players, families, and federations need in one place, including event updates,
                schedule planning, regulations, venue guidance, registration details, and player
                information as they are confirmed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full bg-yellow-300 px-5 py-3 text-sm font-extrabold text-slate-900 shadow-lg shadow-yellow-300/20">
                {homePageData.dateLabel}
              </span>
              <Link
                href="/schedule"
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
              >
                Explore the schedule
              </Link>
              <Link
                href="/players"
                className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition-transform hover:-translate-y-0.5"
              >
                See player divisions
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {quickFacts.map((fact) => (
                <article
                  key={fact.label}
                  className={`motion-scale-in rounded-[1rem] bg-gradient-to-br ${fact.tone} p-[1px] shadow-xl shadow-slate-950/10 md:rounded-[1.5rem]`}
                >
                  <div className="h-full rounded-[calc(1rem-1px)] bg-white/88 p-4 backdrop-blur md:rounded-[calc(1.5rem-1px)]">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      {fact.label}
                    </p>
                    <p className="mt-2 font-display text-4xl text-slate-900">{fact.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{fact.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="motion-rise-in-delayed">
            <HomeHeroCountdown
              dateLabel={homePageData.dateLabel}
              eventStartDate={homePageData.eventStartDate}
              registrationHref={siteConfig.links.registrations}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="motion-rise-in rounded-[1rem] border border-sky-200/70 bg-[linear-gradient(180deg,#e8fbff,#f7fdff)] p-6 shadow-[0_24px_60px_rgba(59,130,246,0.08)] md:rounded-[2rem] md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">Live notice</p>
          <h2 className="mt-3 font-display text-3xl text-slate-900 md:text-4xl">
            {homePageData.alert.title}
          </h2>
          <ul className="mt-5 space-y-3">
            {homePageData.alert.items.map((item, index) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm"
              >
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-black text-sky-700">
                  0{index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="motion-rise-in-delayed rounded-[1rem] border border-white/70 bg-white/75 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:rounded-[2rem] md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">
                Why this redesign direction works
              </p>
              <h2 className="mt-3 font-display text-3xl text-slate-900 md:text-4xl">
                Serious event, friendlier first impression
              </h2>
            </div>
            <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white">
              2027-ready direction
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {highlightCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[1rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-5 md:rounded-[1.5rem]"
              >
                <h3 className="font-display text-2xl text-slate-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.body}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="motion-rise-in rounded-[1rem] border border-white/70 bg-white/75 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:rounded-[2rem] md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-500">
              Quick look
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900 md:text-4xl">
              Everything families need at a glance
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            These cards keep the practical details simple, visual, and fast to scan on both phone and desktop.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {homePageData.eventDetails.map((item, index) => (
            <article
              key={item.title}
              className="rounded-[1rem] border border-slate-200 bg-slate-50/90 p-5 transition-transform hover:-translate-y-1 md:rounded-[1.75rem]"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-slate-700 shadow-sm">
                {index + 1}
              </div>
              <h3 className="mt-4 font-display text-2xl text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="motion-rise-in rounded-[1rem] border border-slate-200 bg-[linear-gradient(180deg,#fffaf0,#ffffff)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] md:rounded-[2rem] md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">Big rewards</p>
          <h2 className="mt-3 font-display text-3xl text-slate-900 md:text-4xl">
            More than just a tournament
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {homePageData.stakes.map((item) => (
              <article
                key={item.title}
                className="rounded-[1rem] bg-white p-5 shadow-sm ring-1 ring-slate-100 md:rounded-[1.5rem]"
              >
                <h3 className="font-display text-2xl text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="motion-rise-in-delayed rounded-[1rem] border border-indigo-200/80 bg-[linear-gradient(160deg,#eef2ff,#f7f9ff_45%,#fff6eb)] p-6 shadow-[0_24px_60px_rgba(99,102,241,0.08)] md:rounded-[2rem] md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Why attend</p>
          <h2 className="mt-3 font-display text-3xl text-slate-900 md:text-4xl">
            Reasons players and families will care
          </h2>
          <div className="mt-6 space-y-4">
            {homePageData.whyParticipate.map((item, index) => (
              <article
                key={item.title}
                className="flex gap-4 rounded-[1rem] bg-white/90 p-4 shadow-sm backdrop-blur md:rounded-[1.5rem]"
              >
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-sm font-black text-indigo-700">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-display text-2xl text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="motion-rise-in overflow-hidden rounded-[1rem] border border-yellow-200/70 bg-[linear-gradient(135deg,#ffe082,#ffb55a_45%,#ff7f66)] p-6 shadow-[0_26px_60px_rgba(251,146,60,0.18)] md:rounded-[2rem] md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900/60">
              Registration status
            </p>
            <h2 className="mt-3 font-display text-4xl text-slate-900 md:text-5xl">
              Don&apos;t just play. Make history.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-900/75">
              {homePageData.registration.description}
            </p>
          </div>
          <div className="rounded-[1rem] bg-white/75 p-5 text-slate-900 shadow-xl backdrop-blur md:rounded-[1.75rem]">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Snapshot
            </p>
            <p className="mt-3 font-display text-4xl">{homePageData.registration.playersRegistered}</p>
            <p className="mt-3 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white">
              {homePageData.registration.status}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-700">
              {homePageData.registration.note}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="motion-rise-in rounded-[1rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:rounded-[2rem]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Contact</p>
          <h2 className="mt-3 font-display text-3xl text-slate-900">Need help planning?</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Families, team managers, and players should be able to reach a real person quickly.
          </p>
          <div className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
            <p className="rounded-2xl bg-slate-50 px-4 py-3">{siteConfig.contact.coordinatorName}</p>
            <p className="rounded-2xl bg-slate-50 px-4 py-3">{siteConfig.contact.phoneLabel}</p>
            <p className="rounded-2xl bg-slate-50 px-4 py-3">{siteConfig.contact.email}</p>
          </div>
        </article>

        <article className="motion-rise-in-delayed rounded-[1rem] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] md:rounded-[2rem]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Planning & updates</p>
          <h2 className="mt-3 font-display text-3xl">Current site status</h2>
          <p className="mt-3 text-sm leading-6 text-white/75">
            This website is being prepared as the 2027 event home for schedules, venue details, regulations, player information, and official updates.
          </p>
          <div className="mt-5">
            <Link
              href="/regulations"
              className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900"
            >
              View regulations
            </Link>
          </div>
          <p className="mt-5 text-sm text-white/65">
            {siteConfig.organization.legalLine}
          </p>
        </article>
      </section>
    </div>
  );
}
