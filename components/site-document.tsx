import type { Metadata } from "next";
import "@/app/globals.css";
import "@/tokens.css";
import { SiteShell } from "@/components/site-shell";
import { siteConfig } from "@/lib/site-config";
import { I18nProvider } from "@/components/i18n-provider";
import { getMessages, getCatalogueCoverage } from "@/lib/i18n-catalogs";
import type { Locale } from "@/lib/i18n";
export const englishMetadata: Metadata = {
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

export function SiteDocument({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return <html lang={locale} suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: `try { const saved = localStorage.getItem("oy27-v2-theme"); document.documentElement.dataset.theme = saved === "light" || saved === "dark" ? saved : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch { document.documentElement.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }` }} /></head>
    <body><I18nProvider locale={locale} messages={getMessages(locale)} coverage={getCatalogueCoverage()}><SiteShell>{children}</SiteShell></I18nProvider></body>
  </html>;
}
