import type { Metadata } from 'next';
import { GalleryPage } from '@/components/pages/gallery-page';
import { discoverGallery } from '@/lib/gallery';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'Photo Gallery',
  description: 'Albums and photographs from Oceania Youth 2027.',
  alternates: { canonical: '/gallery/' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <GalleryPage albums={discoverGallery()} />;
}
