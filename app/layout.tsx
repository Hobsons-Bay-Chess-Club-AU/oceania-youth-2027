import type { Metadata } from "next";
import "./globals.css";
import "../tokens.css";
import { SiteShell } from "@/components/site-shell";
import { siteConfig } from "@/lib/site-config";
export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
        default: siteConfig.defaultTitle,
        template: siteConfig.titleTemplate,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    applicationName: siteConfig.name,
    icons: {
        icon: [
            { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
            { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        ],
        shortcut: "/favicon-32.png",
        apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    },
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: siteConfig.seo.type,
        locale: siteConfig.seo.locale,
        url: siteConfig.siteUrl,
        siteName: siteConfig.name,
        title: siteConfig.defaultTitle,
        description: siteConfig.description,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: `${siteConfig.name} preview image`,
            },
        ],
    },
    twitter: {
        card: siteConfig.seo.twitterCard,
        title: siteConfig.defaultTitle,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
    },
    category: "sports",
};
export default function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    return (<html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `try { const saved = localStorage.getItem("oy27-v2-theme"); document.documentElement.dataset.theme = saved === "light" || saved === "dark" ? saved : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch { document.documentElement.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }` }}/></head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>);
}
