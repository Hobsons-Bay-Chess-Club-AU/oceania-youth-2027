import Link from "next/link";
import { getAllNewsPostSummaries, getNewsPostBySlug } from "@/lib/news";
function formatDate(value: string) { return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)); }
export function NewsPostPage({ slug }: {
    slug: string;
}) {
    const post = getNewsPostBySlug(slug);
    if (!post)
        return null;
    const otherPosts = getAllNewsPostSummaries().filter(item => item.slug !== slug);
    return <div className="page-article">
    <section className="article-masthead"><Link className="action" href="/news">← Back to All News</Link><div><span className="eyebrow">Official Bulletin</span><h1>{post.title}</h1><div className="flexline"><span>📅 {formatDate(post.date)}</span><span>✍️ {post.author}</span></div></div><p>{post.summary}</p></section>
    <section className="article-body"><article className="news-content" dangerouslySetInnerHTML={{ __html: post.html }}/><aside><span className="eyebrow">Related Bulletins</span><h2>More Updates</h2>{otherPosts.map(item => <Link className="related-story" key={item.slug} href={`/news/${item.slug}`}><h3>{item.title}</h3><p>{item.summary}</p><span>{formatDate(item.date)} →</span></Link>)}</aside></section>
  </div>;
}
