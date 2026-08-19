"use client";

import Link from "next/link";
import { useState } from "react";
import { getAllNewsPostSummaries } from "@/lib/news";
import { Hero, SearchInput } from "@/components/ui";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function NewsPage() {
  const posts = getAllNewsPostSummaries();
  const [search, setSearch] = useState("");

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.summary.toLowerCase().includes(search.toLowerCase())
  );

  const featuredPost = filteredPosts[0];

  return (
    <div className="space-y-8">
      <Hero
        eyebrow="Official Bulletin Feed"
        title="News & Event Announcements"
        description="Stay updated with key planning milestones, venue updates, registration announcements, and federation notices for Oceania Youth 2027."
      />

      {/* Featured News Hero */}
      {featuredPost && (
        <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-12 items-center">
            <div className="space-y-3 lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-300">
                ⭐ Featured Announcement
              </span>
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                {featuredPost.title}
              </h2>
              <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
                {featuredPost.summary}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
                <span>📅 {formatDate(featuredPost.date)}</span>
                <span>•</span>
                <span>✍️ {featuredPost.author}</span>
              </div>
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <Link
                href={`/news/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:scale-105"
              >
                <span>Read Full Article</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid & Filter */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Bulletin Archive
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">All Published Updates</h2>
          </div>
          <div className="w-full sm:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search news..."
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/news/${post.slug}`}
              className="glass-card-hover block rounded-2xl border border-slate-800 bg-slate-950/70 p-5 backdrop-blur-md space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>📅 {formatDate(post.date)}</span>
                <span className="font-bold text-amber-300">By {post.author}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white hover:text-amber-300 transition">
                {post.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-300 line-clamp-3">
                {post.summary}
              </p>
              <span className="inline-block text-xs font-bold text-amber-400">
                Read update →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

