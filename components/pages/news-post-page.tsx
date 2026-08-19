"use client";

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
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-2xl backdrop-blur-xl md:p-8 space-y-4">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition"
        >
          <span>← Back to All News</span>
        </Link>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
            Official Bulletin
          </span>
          <h1 className="font-display text-3xl font-bold text-white md:text-5xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
            <span>📅 {formatDate(post.date)}</span>
            <span>•</span>
            <span>✍️ {post.author}</span>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-slate-300 md:text-sm max-w-3xl pt-1">
          {post.summary}
        </p>
      </section>

      {/* Article Body & Sidebar */}
      <section className="grid gap-8 lg:grid-cols-12">
        <article className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
          <div
            className="news-content text-xs leading-relaxed text-slate-300 space-y-4 md:text-sm"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>

        <aside className="lg:col-span-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl backdrop-blur-xl space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Related Bulletins
            </span>
            <h2 className="mt-1 font-display text-lg font-bold text-white">More Updates</h2>
          </div>

          <div className="space-y-3">
            {otherPosts.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="glass-card-hover block rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1 backdrop-blur-md"
              >
                <h3 className="font-display text-sm font-bold text-white hover:text-amber-300 transition">
                  {item.title}
                </h3>
                <p className="text-[0.7rem] text-slate-400 line-clamp-2">{item.summary}</p>
                <span className="text-[0.65rem] font-bold text-amber-400 block pt-1">
                  {formatDate(item.date)} →
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

