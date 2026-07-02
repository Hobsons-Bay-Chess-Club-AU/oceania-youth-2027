import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { venueData } from "@/app/venue/data";

const arrivalCards = [
  {
    title: "Play here",
    body: venueData.venue.name,
    accent: "from-sky-500 via-cyan-400 to-teal-300",
  },
  {
    title: "Best for",
    body: "Families planning travel, meals, and match-day movement in one stop.",
    accent: "from-amber-400 via-orange-300 to-rose-300",
  },
  {
    title: "What you'll find",
    body: "Venue notes, transport links, nearby stays, food options, and the live map embed.",
    accent: "from-indigo-500 via-violet-400 to-fuchsia-300",
  },
];

export function LocationPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(140deg,rgba(12,34,70,0.98),rgba(21,70,122,0.94)_48%,rgba(111,226,214,0.82))] px-6 py-8 text-white shadow-[0_30px_80px_rgba(12,34,70,0.18)] md:px-10 md:py-12">
        <div className="motion-float absolute -left-12 top-16 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="motion-float-delayed absolute right-0 top-0 h-56 w-56 rounded-full bg-cyan-200/20 blur-3xl" />
        <div className="relative grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div className="space-y-6 motion-rise-in">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/95 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              Plan your visit
            </div>
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100/80">
                Venue, map, stay and food
              </p>
              <h1 className="max-w-3xl font-display text-5xl leading-[0.92] text-white md:text-7xl">
                Find the venue fast, then plan the whole day around it.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-blue-50/88 md:text-lg">
                Everything families and team managers usually need is now on one page: where to go,
                how to get there, where to stay nearby, what to eat, and the live map embed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={siteConfig.links.mapEmbed}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-yellow-300 px-5 py-3 text-sm font-extrabold text-slate-900 shadow-lg shadow-yellow-300/20 transition-transform hover:-translate-y-0.5"
              >
                Open map in Google Maps
              </a>
              <Link
                href="/schedule"
                className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition-transform hover:-translate-y-0.5"
              >
                Check the tournament schedule
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-[1.8rem] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100/75">
                Tournament location
              </p>
              <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
                {venueData.venue.name}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-blue-50/88">
                {venueData.venue.address}
              </p>
              <p className="mt-4 rounded-[1.2rem] bg-slate-950/20 px-4 py-4 text-sm leading-7 text-white/85">
                {venueData.venue.note}
              </p>
            </article>
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              {arrivalCards.map((card) => (
                <article
                  key={card.title}
                  className={`rounded-[1.5rem] bg-gradient-to-br ${card.accent} p-[1px] shadow-xl shadow-slate-950/10`}
                >
                  <div className="h-full rounded-[calc(1.5rem-1px)] bg-white/88 p-5 text-slate-900 backdrop-blur">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      {card.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{card.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="motion-rise-in overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-4">
          <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,#ecfeff,#f8fdff)] p-4">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-2">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                  Live map
                </p>
                <h2 className="mt-2 font-display text-3xl text-slate-900 md:text-4xl">
                  Zoom in before you arrive
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-500">
                Use the embedded map to scope out roads, station access, food spots, and nearby accommodation.
              </p>
            </div>
            <div className="min-h-[28rem] overflow-hidden rounded-[1.5rem] border border-sky-100 bg-white sm:min-h-[42rem]">
              <iframe
                src={siteConfig.links.mapEmbed}
                title="Oceania Youth event map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="min-h-[28rem] w-full border-0 sm:min-h-[42rem]"
              />
            </div>
          </div>
        </article>

        <article className="motion-rise-in-delayed rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#fffaf0,#ffffff)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
            Getting there
          </p>
          <h2 className="mt-3 font-display text-3xl text-slate-900 md:text-4xl">
            Arrival guidance in plain language
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{venueData.travelIntro}</p>

          <div className="mt-6 space-y-4">
            <article className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">By air</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{venueData.byAir}</p>
            </article>
            <article className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                By public transport
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{venueData.byTransport}</p>
            </article>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-slate-200 bg-slate-50/90 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Useful route links
            </p>
            <div className="mt-4 grid gap-3">
              {venueData.transportRoutes.map((route) => (
                <a
                  key={route.label}
                  href={route.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[1.2rem] bg-white px-4 py-4 text-sm text-slate-700 shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  <strong className="block text-slate-900">{route.label}</strong>
                  <span className="mt-1 block leading-6 text-slate-500">{route.note}</span>
                </a>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="motion-rise-in rounded-[2rem] border border-emerald-200/70 bg-[linear-gradient(180deg,#f1fff7,#ffffff)] p-6 shadow-[0_24px_60px_rgba(16,185,129,0.08)] md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
                Stay nearby
              </p>
              <h2 className="mt-3 font-display text-3xl text-slate-900 md:text-4xl">
                Accommodation options close to the action
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Keep this list practical and bookable so visitors can compare distance, convenience, and event deals quickly.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {venueData.accommodation.map((item) => (
              <article
                className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-sm"
                key={item.name}
              >
                <h3 className="font-display text-2xl text-slate-900">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.address}</p>
                <p className="mt-2 text-sm font-semibold text-emerald-700">{item.distance}</p>
                {item.offer ? (
                  <p className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-700">
                    {item.offer}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </article>

        <article className="motion-rise-in-delayed rounded-[2rem] border border-amber-200/70 bg-[linear-gradient(180deg,#fff8eb,#ffffff)] p-6 shadow-[0_24px_60px_rgba(245,158,11,0.08)] md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">
                Eat nearby
              </p>
              <h2 className="mt-3 font-display text-3xl text-slate-900 md:text-4xl">
                Easy food choices for long tournament days
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Mix on-site options with nearby cafes and family-friendly spots so people can plan short breaks between rounds.
            </p>
          </div>

          <div className="mt-6 rounded-[1.6rem] bg-white p-5 shadow-sm ring-1 ring-amber-100">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">On-site options</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{venueData.onSiteFoodIntro}</p>
            <ul className="mt-4 space-y-3">
              {venueData.onSiteFoodItems.map((item) => (
                <li
                  key={item}
                  className="rounded-[1rem] bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 grid gap-4">
            {venueData.nearbyEateries.map((item) => (
              <article
                className="rounded-[1.5rem] border border-amber-100 bg-white p-5 shadow-sm"
                key={item.name}
              >
                <h3 className="font-display text-2xl text-slate-900">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.address}</p>
                <p className="mt-2 text-sm font-semibold text-amber-700">{item.distance}</p>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
