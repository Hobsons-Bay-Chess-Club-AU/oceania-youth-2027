import { readdirSync } from 'node:fs';
import path from 'node:path';

export type GalleryPhoto = { id: string; src: string; filename: string; title: string; albumId: string; albumTitle: string; alt: string };
export type GalleryAlbum = { id: string; title: string; photos: GalleryPhoto[] };
const supportedImage = /\.(jpe?g|png|webp|avif|gif|svg|bmp)$/i;
const compareNames = (a: string, b: string) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }) || a.localeCompare(b, 'en');

function readableName(value: string) {
  const cleaned = value.replace(/^\d+[-_ ]+(?=[a-z])/i, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned ? cleaned[0].toUpperCase() + cleaned.slice(1) : 'Untitled album';
}

// Server/build-only: files remain in public/gallery and need no runtime API.
export function discoverGallery(root = path.join(process.cwd(), 'public', 'gallery')): GalleryAlbum[] {
  const albums: GalleryAlbum[] = [];
  function visit(relative: string) {
    let entries;
    try { entries = readdirSync(path.join(root, relative), { withFileTypes: true }); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return; throw error; }
    const visible = entries.filter(entry => !entry.name.startsWith('.')).sort((a, b) => compareNames(a.name, b.name));
    const files = visible.filter(entry => entry.isFile() && supportedImage.test(entry.name));
    const id = relative.split(path.sep).join('/');
    const title = relative ? readableName(path.basename(relative)) : 'Highlights';
    if (files.length) {
      const photos = files.map((file, index) => {
        const segments = [...id.split('/').filter(Boolean), file.name];
        const photoId = segments.join('/');
        const stem = file.name.replace(/\.[^.]+$/, '');
        const caption = /^(?:img|dscf?|pxl|photo)[ _-]?\d/i.test(stem) ? `Photo ${String(index + 1).padStart(2, '0')}` : readableName(stem);
        return { id: photoId, src: '/gallery/' + segments.map(encodeURIComponent).join('/'), filename: file.name, title: caption, albumId: id, albumTitle: title, alt: `${title} — ${caption}` };
      });
      albums.push({ id, title, photos });
    }
    for (const entry of visible) if (entry.isDirectory()) visit(path.join(relative, entry.name));
  }
  visit('');
  return albums;
}
