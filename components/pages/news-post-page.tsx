import Link from "next/link";
import { getAllNewsPostSummaries, getNewsPostBySlug } from "@/lib/news";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function NewsPostPage({ slug }: { slug: string }) {
  const post = getNewsPostBySlug(slug);

  if (!post) {
    return null;
  }

  const otherPosts = getAllNewsPostSummaries().filter((item) => item.slug !== slug);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[1rem] border border-white/70 bg-[linear-gradient(140deg,rgba(12,34,70,0.98),rgba(30,77,147,0.94)_48%,rgba(255,197,107,0.86))] px-6 py-8 text-white shadow-[0_30px_80px_rgba(12,34,70,0.18)] md:rounded-[2rem] md:px-10 md:py-12">
        <div className="motion-float absolute -left-10 top-14 h-36 w-36 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="motion-float-delayed absolute right-0 top-0 h-52 w-52 rounded-full bg-yellow-200/20 blur-3xl" />
        <div className="relative grid gap-6">
          <Link
            href="/news"
            className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/95 backdrop-blur"
          >
            Back to News & Updates
          </Link>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100/80">
              Official announcement
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-5xl leading-[0.92] text-white md:text-7xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-cyan-100/80">
              <span>{formatDate(post.date)}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-100/60" />
              <span>{post.author}</span>
            </div>
            <p className="mt-5 max-w-3xl text-base leading-8 text-blue-50/88 md:text-lg">{post.summary}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.68fr_0.32fr]">
        <article className="rounded-[1rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:rounded-[2rem] md:p-8">
          <div
            className="news-content text-[0.98rem] leading-7 text-slate-700"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>

        <aside className="rounded-[1rem] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:rounded-[2rem] md:p-8 xl:sticky xl:top-24 xl:self-start">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">More updates</p>
          <h2 className="mt-3 font-display text-3xl text-slate-900">Keep reading</h2>
          <div className="mt-6 grid gap-3">
            {otherPosts.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="rounded-[0.9rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] px-4 py-4 transition-transform hover:-translate-y-0.5 md:rounded-[1.35rem]"
              >
                <h3 className="font-display text-2xl text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-sky-700">
                  {formatDate(item.date)}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
