# Hidden photo gallery

Visit `/gallery/` directly. The page is deliberately absent from navigation, footer links and site search, with `noindex` metadata while in development. It uses the normal English site shell.

## Adding albums

Place photos in `public/gallery/<album-folder>/` and rebuild/redeploy. The static build discovers the directory tree; there is no API or hand-maintained album list. A folder with images becomes an album; empty folders and non-image files are omitted. Images directly inside `public/gallery/` become a Highlights album. Nested folders containing images become separate albums.

Folder names become readable album titles. A prefix such as `01-` controls order and is hidden in the displayed title. Image names are sorted naturally (photo2 before photo10). URLs encode each path segment, including spaces, Unicode, `#` and `%`. Symbolic links and hidden entries are not followed.

Supported formats: JPG/JPEG, PNG, WebP, AVIF, GIF, SVG, BMP. Convert HEIC, RAW and TIFF before adding files. Use appropriately sized JPEG/WebP images for the web; lazy loading does not reduce original file size. Existing photos are not modified. Filename captions are placeholders for editorial descriptions, not automatically generated scene descriptions.

## Viewing

- Browse album covers or choose View all photographs.
- Open any photo in a modal viewer; the original aspect ratio is preserved.
- Use Left/Right arrows, on-screen buttons or horizontal touch swipes to navigate.
- Start/pause the five-second slideshow with its button or `P`. Playback pauses when the browser tab becomes hidden and stops when the viewer closes.
- Escape closes the viewer (native fullscreen may exit first). Focus returns to the opening button.
- The fullscreen button uses the native Fullscreen API when available. The modal already fills the viewport on browsers without it.
- Open original links to the image in a new tab. Failed images have a retry control.
- Motion effects respect `prefers-reduced-motion`; playback is never started automatically.

No event photos were supplied. Two labelled sample albums now contain four images copied from existing event and chess-piece artwork, including landscape and portrait formats. Replace these folders with real event photographs when ready. `public/gallery/README.md` lists the sample sources and provides the folder guide. The empty state still appears if no album images remain.

## Validation

`npm test` covers empty/missing galleries, nested albums, natural sorting, supported extensions, special-character URLs and symlink exclusions. Run `npm run typecheck` and `npm run build` for integration checks. Browser preview approval timed out in this session, so native dialog/fullscreen and responsive appearance still require visual browser verification.
