import fs from "node:fs";
import path from "node:path";

const newsDirectory = path.join(process.cwd(), "content", "news");

type FrontMatter = {
  title: string;
  date: string;
  author: string;
  summary: string;
};

export type NewsPost = FrontMatter & {
  slug: string;
  body: string;
  html: string;
};

export type NewsPostSummary = FrontMatter & {
  slug: string;
};

function ensureNewsDirectory() {
  if (!fs.existsSync(newsDirectory)) {
    fs.mkdirSync(newsDirectory, { recursive: true });
  }
}

function parseFrontMatter(fileContent: string): { frontMatter: FrontMatter; body: string } {
  const normalized = fileContent.replace(/\r\n/g, "\n");

  if (!normalized.startsWith("---\n")) {
    throw new Error("News markdown files must begin with front matter delimited by ---");
  }

  const endIndex = normalized.indexOf("\n---\n", 4);

  if (endIndex === -1) {
    throw new Error("News markdown files must close front matter with ---");
  }

  const frontMatterBlock = normalized.slice(4, endIndex);
  const body = normalized.slice(endIndex + 5).trim();
  const values: Partial<FrontMatter> = {};

  for (const line of frontMatterBlock.split("\n")) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim() as keyof FrontMatter;
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    values[key] = value;
  }

  const requiredFields: Array<keyof FrontMatter> = ["title", "date", "author", "summary"];

  for (const field of requiredFields) {
    if (!values[field]) {
      throw new Error(`Missing required front matter field: ${field}`);
    }
  }

  return {
    frontMatter: values as FrontMatter,
    body,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInlineMarkdown(text: string) {
  const escaped = escapeHtml(text);

  return escaped
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderMarkdown(markdown: string) {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) {
      return;
    }

    html.push(`<p>${renderInlineMarkdown(paragraphLines.join(" "))}</p>`);
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) {
      return;
    }

    html.push(`<ul>${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</ul>`);
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      html.push(`<h2>${renderInlineMarkdown(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      html.push(`<h3>${renderInlineMarkdown(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      listItems.push(trimmed.slice(2));
      continue;
    }

    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();

  return html.join("");
}

export function getAllNewsPosts(): NewsPost[] {
  ensureNewsDirectory();

  return fs
    .readdirSync(newsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const filePath = path.join(newsDirectory, fileName);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { frontMatter, body } = parseFrontMatter(fileContent);

      return {
        slug,
        ...frontMatter,
        body,
        html: renderMarkdown(body),
      };
    })
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
}

export function getAllNewsPostSummaries(): NewsPostSummary[] {
  return getAllNewsPosts().map(({ slug, title, date, author, summary }) => ({
    slug,
    title,
    date,
    author,
    summary,
  }));
}

export function getNewsPostBySlug(slug: string): NewsPost | null {
  const posts = getAllNewsPosts();

  return posts.find((post) => post.slug === slug) ?? null;
}
