import { SiteDocument, englishMetadata } from "@/components/site-document";
export const metadata = englishMetadata;
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteDocument locale="en">{children}</SiteDocument>;
}
