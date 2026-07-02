import Link from "next/link";
import { getAllNewsPostSummaries } from "@/lib/news";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function NewsPage() {
  const posts = getAllNewsPostSummaries();
  const featuredPost = posts[0];

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[1rem] border border-white/70 bg-[linear-gradient(140deg,rgba(12,34,70,0.98),rgba(30,77,147,0.94)_48%,rgba(255,197,107,0.86))] px-6 py-8 text-white shadow-[0_30px_80px_rgba(12,34,70,0.18)] md:rounded-[2rem] md:px-10 md:py-12">
        <div className="motion-float absolute -left-10 top-14 h-36 w-36 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="motion-float-delayed absolute right-0 top-0 h-52 w-52 rounded-full bg-yellow-200/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100/80">
              Official announcements
            </p>
            <h1 className="max-w-3xl font-display text-5xl leading-[0.92] text-white md:text-7xl">
              News & Updates
            </h1>
            <p className="max-w-2xl text-base leading-8 text-blue-50/88 md:text-lg">
              Follow the latest tournament announcements, planning milestones, and official notices
              for players, families, and federations.
            </p>
          </div>
          {featuredPost ? (
            <article className="rounded-[1rem] border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:rounded-[1.8rem]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100/75">
                Latest update
              </p>
              <h2 className="mt-3 font-display text-3xl text-white">{featuredPost.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/85">{featuredPost.summary}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-cyan-100/80">
                <span>{formatDate(featuredPost.date)}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-100/60" />
                <span>{featuredPost.author}</span>
              </div>
              <Link
                href={`/news/${featuredPost.slug}`}
                className="mt-5 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
              >
                Read this update
              </Link>
            </article>
          ) : null}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.38fr_0.62fr]">
        <aside className="rounded-[1rem] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:rounded-[2rem] md:p-8 xl:sticky xl:top-24 xl:self-start">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">All updates</p>
          <h2 className="mt-3 font-display text-3xl text-slate-900 md:text-4xl">
            Browse every announcement
          </h2>
          <div className="mt-6 grid gap-3">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="rounded-[0.9rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] px-4 py-4 transition-transform hover:-translate-y-0.5 md:rounded-[1.35rem]"
              >
                <div className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-slate-500">
                  Update {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-2 font-display text-2xl text-slate-900">{post.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{post.summary}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-sky-700">
                  {formatDate(post.date)}
                </p>
              </Link>
            ))}
          </div>
        </aside>

        <div className="grid gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/news/${post.slug}`}
              className="rounded-[1rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition-transform hover:-translate-y-0.5 md:rounded-[1.75rem] md:p-8"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                <span>{formatDate(post.date)}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span>{post.author}</span>
              </div>
              <h2 className="mt-4 font-display text-3xl text-slate-900 md:text-4xl">{post.title}</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{post.summary}</p>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-sky-700">
                Read full update
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
