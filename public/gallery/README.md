# Photo gallery

Add event images in album folders, then rebuild the site:

```
public/gallery/
  01-opening-ceremony/
    photo-01.jpg
    photo-02.jpg
  02-at-the-boards/
    photo-01.webp
```

Each folder containing images becomes an album. Nested folders are supported; images directly in this folder appear in a Highlights album. Albums and images use natural filename ordering (photo2 before photo10). Numeric album prefixes such as 01- control ordering and are omitted from displayed titles.

Supported browser image types: JPG/JPEG, PNG, WebP, AVIF, GIF, SVG and BMP (case-insensitive). Convert HEIC/RAW/TIFF images to JPEG or WebP first. Use web-sized images to keep downloads fast; the gallery lazy-loads thumbnails but serves the original files. Folder and file names can contain spaces or Unicode characters.

Hidden files/folders, symbolic links, non-image files and empty albums are ignored. Captions come from filenames; camera-style filenames use a simple photo number. All image files in public are publicly accessible.

The page is available directly at /gallery/ and intentionally absent from navigation, footer links and site search. It is marked noindex while in development. Add or change images and rebuild/redeploy to update the static gallery.

## Included sample albums

Two clearly labelled sample albums are included to demonstrate the viewer:

- `01-sample-event-artwork`: copies of the site's existing championship banner and event poster.
- `02-sample-chess-collection`: original Oceania and federation chess-piece preview artwork.

These four sample images are artwork, not event photographs. Replace or remove the sample folders when adding real event albums. Their existing source assets are unchanged.
