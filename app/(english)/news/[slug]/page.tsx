import { notFound } from "next/navigation";
import { NewsPostPage } from "@/components/pages/news-post-page";
import { getAllNewsPostSummaries, getNewsPostBySlug } from "@/lib/news";

export function generateStaticParams() {
  return getAllNewsPostSummaries().map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <NewsPostPage slug={slug} />;
}
