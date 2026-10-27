"use client";
import Link from "next/link";
import { useState } from "react";
import { getAllNewsPostSummaries } from "@/lib/news";
import { Hero, SearchInput } from "@/components/ui";
function formatDate(value: string) { return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)); }
export function NewsPage() {
    const [search, setSearch] = useState("");
    const posts = getAllNewsPostSummaries();
    const featured = posts[0];
    const filtered = posts.filter(post => `${post.title} ${post.summary} ${post.author}`.toLowerCase().includes(search.toLowerCase()));
    return <div className="page-news">
    <Hero eyebrow="Official Bulletin Feed" title="News & Event Announcements" description="Stay updated with key planning milestones, venue updates, registration announcements, and federation notices for Oceania Youth 2027."/>
    {featured && <section className="feature-story"><span className="eyebrow">⭐ Featured Announcement</span><h2>{featured.title}</h2><p>{featured.summary}</p><div className="flexline"><span>📅 {formatDate(featured.date)}</span><span>✍️ {featured.author}</span></div><Link className="action" href={`/news/${featured.slug}`}>Read Full Article →</Link></section>}
    <section className="news-archive"><div className="flexline"><div><span className="eyebrow">Bulletin Archive</span><h2>All Published Updates</h2></div><SearchInput value={search} onChange={setSearch} placeholder="Search news..."/></div>
      {filtered.map(post => <Link className="news-row" key={post.slug} href={`/news/${post.slug}`}><div><span>{formatDate(post.date)}</span><span>By {post.author}</span></div><div><h3>{post.title}</h3><p>{post.summary}</p></div><span>Read update →</span></Link>)}{!filtered.length && <p className="directory-empty">No updates match your search.</p>}
    </section>
  </div>;
}
