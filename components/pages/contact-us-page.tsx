import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/site-config";

const enquiryTopics = [
  "Player eligibility and federation matters",
  "Travel, accommodation, and local planning",
  "Registration timing and payment questions",
  "Volunteer, sponsor, and partner enquiries",
];

export function ContactUsPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[1rem] border border-white/70 bg-[linear-gradient(140deg,rgba(11,26,62,0.98),rgba(16,82,118,0.94)_50%,rgba(255,191,92,0.88))] px-6 py-8 text-white shadow-[0_30px_80px_rgba(12,34,70,0.18)] md:rounded-[2rem] md:px-10 md:py-12">
        <div className="motion-float absolute -left-10 top-14 h-36 w-36 rounded-full bg-cyan-200/20 blur-3xl" />
        <div className="motion-float-delayed absolute right-0 top-0 h-52 w-52 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100/80">
              Contact us
            </p>
            <h1 className="max-w-3xl font-display text-5xl leading-[0.92] text-white md:text-7xl">
              Reach the organising team directly.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/88 md:text-lg">
              Use this page for tournament enquiries from players, families, federations, sponsors,
              and volunteers. We keep all official event contact details here in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
              >
                Email the organisers
              </a>
              <Link
                href="/news"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Read latest updates
              </Link>
            </div>
          </div>

          <article className="rounded-[1rem] border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:rounded-[1.8rem]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100/75">
              Contact summary
            </p>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-white/90">
              <p className="rounded-[0.9rem] bg-slate-950/18 px-4 py-3 md:rounded-[1.2rem]">
                {siteConfig.contact.coordinatorName}
              </p>
              <p className="rounded-[0.9rem] bg-slate-950/18 px-4 py-3 md:rounded-[1.2rem]">
                {siteConfig.contact.locationLabel}
              </p>
              <p className="rounded-[0.9rem] bg-slate-950/18 px-4 py-3 md:rounded-[1.2rem]">
                {siteConfig.contact.phoneLabel}
              </p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="rounded-[0.9rem] bg-slate-950/18 px-4 py-3 font-semibold text-white underline decoration-white/30 underline-offset-4 md:rounded-[1.2rem]"
              >
                {siteConfig.contact.email}
              </a>
              <p className="rounded-[0.9rem] bg-slate-950/18 px-4 py-3 text-white/80 md:rounded-[1.2rem]">
                {siteConfig.contact.responseWindow}
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.38fr_0.62fr]">
        <aside className="rounded-[1rem] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:rounded-[2rem] md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">Best for</p>
          <h2 className="mt-3 font-display text-3xl text-slate-900 md:text-4xl">
            Common enquiry topics
          </h2>
          <div className="mt-6 grid gap-3">
            {enquiryTopics.map((topic) => (
              <div
                key={topic}
                className="rounded-[0.9rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] px-4 py-4 text-sm leading-6 text-slate-700 md:rounded-[1.3rem]"
              >
                {topic}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1rem] border border-amber-200 bg-amber-50/80 p-5 md:rounded-[1.5rem]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
              Planning notes
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{siteConfig.contact.officeHours}</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              For urgent public updates, key announcements will also appear on the News & Updates page.
            </p>
          </div>
        </aside>

        <article className="rounded-[1rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:rounded-[2rem] md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
            Send an enquiry
          </p>
          <h2 className="mt-3 font-display text-3xl text-slate-900 md:text-4xl">
            Message the tournament office
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Share your question with as much detail as possible so the team can respond efficiently and
            direct it to the right organiser.
          </p>

          <div className="mt-6">
            <ContactForm />
          </div>
        </article>
      </section>
    </div>
  );
}
