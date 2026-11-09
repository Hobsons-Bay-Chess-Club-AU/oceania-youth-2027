"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import type { GalleryAlbum, GalleryPhoto } from '@/lib/gallery';
import styles from './gallery.module.css';

const SLIDE_INTERVAL = 5000;

function PhotoPlaceholder() {
  return <span className={styles.placeholder}><svg viewBox="0 0 40 32" width="40" height="32" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><rect x="1" y="1" width="38" height="30" rx="2"/><circle cx="12" cy="10" r="3"/><path d="m2 27 10-10 7 7 8-13 12 16"/></svg><span>Preview unavailable</span></span>;
}

export function GalleryPage({ albums }: { albums: GalleryAlbum[] }) {
  const photos = useMemo(() => albums.flatMap(album => album.photos), [albums]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const album = albums.find(entry => entry.id === selectedAlbum);
  const overview = selectedAlbum === null && !showAll;
  const visiblePhotos = showAll ? photos : album?.photos || photos;
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [viewerNotice, setViewerNotice] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
  const photo = viewerIndex === null ? undefined : visiblePhotos[viewerIndex];
  const viewerOpen = viewerIndex !== null;

  function markFailed(src: string) { setFailed(previous => new Set(previous).add(src)); }
  function move(direction: number) {
    if (!visiblePhotos.length) return;
    setViewerNotice('');
    setViewerIndex(index => index === null ? null : (index + direction + visiblePhotos.length) % visiblePhotos.length);
  }
  function openPhoto(index: number, trigger: HTMLButtonElement) {
    lastTrigger.current = trigger;
    setViewerNotice('');
    setPlaying(false);
    setViewerIndex(index);
    dialog.current?.showModal();
  }
  async function closeViewer() {
    if (document.fullscreenElement === frame.current) await document.exitFullscreen().catch(() => {});
    dialog.current?.close();
  }
  function onViewerClosed() {
    setPlaying(false);
    setViewerIndex(null);
    setFullscreen(false);
    if (document.fullscreenElement === frame.current) void document.exitFullscreen().catch(() => {});
    lastTrigger.current?.focus({ preventScroll: true });
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === frame.current) await document.exitFullscreen();
      else await frame.current?.requestFullscreen();
    } catch { setViewerNotice('Fullscreen is unavailable in this browser. You can keep viewing here.'); }
  }
  function chooseAlbum(id: string | null, all = false) {
    setSelectedAlbum(id);
    setShowAll(all);
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  }
  function beginSwipe(event: PointerEvent) {
    if (event.pointerType !== 'touch') return;
    if (!event.isPrimary) { swipe.current = null; return; }
    swipe.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }
  function endSwipe(event: PointerEvent) {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== event.pointerId) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y) * 1.5) move(x < 0 ? 1 : -1);
  }

  useEffect(() => {
    setCanFullscreen(!!document.fullscreenEnabled);
    function syncFullscreen() { setFullscreen(document.fullscreenElement === frame.current); }
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);
  useEffect(() => {
    if (!viewerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [viewerOpen]);
  useEffect(() => {
    function pauseWhenHidden() { if (document.hidden) setPlaying(false); }
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden);
  }, []);
  useEffect(() => {
    if (!playing || !viewerOpen || visiblePhotos.length < 2) return;
    const timer = window.setInterval(() => setViewerIndex(index => index === null ? null : (index + 1) % visiblePhotos.length), SLIDE_INTERVAL);
    return () => window.clearInterval(timer);
  }, [playing, viewerOpen, viewerIndex, visiblePhotos.length]);
  useEffect(() => {
    if (viewerIndex === null || visiblePhotos.length < 2) return;
    for (const offset of [-1, 1]) {
      const adjacent = new Image();
      adjacent.src = visiblePhotos[(viewerIndex + offset + visiblePhotos.length) % visiblePhotos.length].src;
    }
  }, [viewerIndex, visiblePhotos]);

  function thumbnail(image: GalleryPhoto, className?: string) {
    return failed.has(image.src) ? <PhotoPlaceholder /> : <img className={className} src={image.src} alt={image.alt} loading="lazy" decoding="async" onError={() => markFailed(image.src)} />;
  }

  return <div className={styles.page}>
    <section className={`page-title ${styles.masthead}`}>
      <div className="eyebrow">Oceania Youth 2027 / Photo journal</div>
      <h1>Beyond the board.</h1>
      <p>The people, the places, and the moments that bring our championship together.</p>
      <div className={styles.summary}><span><strong>{String(albums.length).padStart(2, '0')}</strong> {albums.length === 1 ? 'album' : 'albums'}</span><span><strong>{String(photos.length).padStart(2, '0')}</strong> {photos.length === 1 ? 'photograph' : 'photographs'}</span><span className={styles.journalLabel}>The championship, in pictures</span></div>
    </section>

    {!photos.length ? <section className={styles.empty} aria-labelledby="gallery-empty-title">
      <img src="/oceania-logo.png" alt="" width="88" height="88" />
      <span className="eyebrow">The story is still unfolding</span><h2 id="gallery-empty-title">Our photo journal starts here.</h2>
      <p>Championship albums will appear here as photographs are added.</p>
    </section> : <section className={styles.collection} aria-labelledby="gallery-collection-title">
      <div className={styles.collectionHeader}>
        <div>{!overview && <button type="button" className={styles.back} onClick={() => chooseAlbum(null)}>← All albums</button>}<span className="eyebrow">{overview ? 'Explore the collection' : showAll ? 'Every frame' : 'Inside the album'}</span><h2 ref={heading} tabIndex={-1} id="gallery-collection-title">{overview ? 'Albums' : showAll ? 'All photographs' : album?.title}</h2><p>{overview ? 'Choose a collection. Take a closer look.' : `${visiblePhotos.length} ${visiblePhotos.length === 1 ? 'photograph' : 'photographs'} · Select a photo to open the viewer.`}</p></div>
        {overview ? <button type="button" className={styles.outlineButton} onClick={() => chooseAlbum(null, true)}>View all photographs <span aria-hidden="true">↗</span></button> : <button type="button" className={styles.outlineButton} onClick={event => openPhoto(0, event.currentTarget)}>Open viewer <span aria-hidden="true">↗</span></button>}
      </div>
      {overview ? <div className={styles.albums}>{albums.map((entry, index) => <button className={styles.albumCard} type="button" key={entry.id} onClick={() => chooseAlbum(entry.id)} aria-label={`Open ${entry.title}, ${entry.photos.length} photographs`}>
        <span className={styles.albumCover}>{thumbnail(entry.photos[0])}<span className={styles.albumNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span className={styles.albumOpen} aria-hidden="true">↗</span></span>
        <span className={styles.albumCaption}><strong>{entry.title}</strong><span>{entry.photos.length} {entry.photos.length === 1 ? 'photo' : 'photos'}</span></span>
      </button>)}</div> : <>
        <div className={styles.albumPicker}><label htmlFor="gallery-album-picker">Collection</label><select id="gallery-album-picker" value={showAll ? '__all__' : `album:${selectedAlbum}`} onChange={event => event.target.value === '__all__' ? chooseAlbum(null, true) : chooseAlbum(event.target.value.slice(6))}><option value="__all__">All photographs</option>{albums.map(entry => <option value={`album:${entry.id}`} key={entry.id}>{entry.title} ({entry.photos.length})</option>)}</select></div>
        <div className={styles.photoGrid}>{visiblePhotos.map((image, index) => <button type="button" className={styles.photoCard} key={image.id} onClick={event => openPhoto(index, event.currentTarget)} aria-label={`View ${image.alt}`}>
          <span className={styles.photoCrop}>{thumbnail(image)}<span className={styles.photoExpand} aria-hidden="true">↗</span></span><span className={styles.photoCaption}><span>{image.title}</span><span>{showAll ? image.albumTitle : String(index + 1).padStart(2, '0')}</span></span>
        </button>)}</div>
      </>}
    </section>}

    <dialog ref={dialog} className={styles.viewer} aria-label="Photo viewer" onClose={onViewerClosed} onKeyDown={event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || ['INPUT', 'SELECT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      if (event.key.toLowerCase() === 'p' && visiblePhotos.length > 1) { event.preventDefault(); setPlaying(value => !value); }
    }}>
      <div ref={frame} className={styles.viewerFrame}>
        <header className={styles.viewerHeader}><div className={styles.viewerBrand}><img src="/oceania-logo.png" width="32" height="32" alt="" /><span>Oceania Youth 2027 <small>Photo journal</small></span></div><div className={styles.viewerActions}>
          <button type="button" onClick={() => setPlaying(value => !value)} disabled={visiblePhotos.length < 2} aria-pressed={playing} aria-keyshortcuts="P">{playing ? 'Ⅱ Pause' : '▷ Slideshow'}</button>
          {canFullscreen && <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>⛶</button>}
          <button type="button" onClick={closeViewer} aria-label="Close photo viewer" className={styles.close}>✕</button>
        </div></header>
        <div className={styles.imageStage} onPointerDown={beginSwipe} onPointerUp={endSwipe} onPointerCancel={() => { swipe.current = null; }}>
          <button className={`${styles.previous} ${styles.arrow}`} type="button" aria-label="Previous photograph" aria-keyshortcuts="ArrowLeft" onClick={() => move(-1)} disabled={visiblePhotos.length < 2}>←</button>
          {photo && <figure key={photo.id} className={styles.slide}>
            {failed.has(photo.src) ? <div className={styles.viewerError} role="status"><PhotoPlaceholder /><p>This photograph could not be displayed.</p><button type="button" onClick={() => setFailed(previous => { const next = new Set(previous); next.delete(photo.src); return next; })}>Try again</button></div> : <img className={styles.fullImage} src={photo.src} alt={photo.alt} draggable={false} onError={() => { markFailed(photo.src); setPlaying(false); }} />}
          </figure>}
          <button className={`${styles.next} ${styles.arrow}`} type="button" aria-label="Next photograph" aria-keyshortcuts="ArrowRight" onClick={() => move(1)} disabled={visiblePhotos.length < 2}>→</button>
          {playing && <span key={photo?.id} className={styles.progress} aria-hidden="true" />}
        </div>
        <footer className={styles.viewerFooter}>
          <div aria-live={playing ? 'off' : 'polite'}><span className={styles.viewerAlbum}>{photo?.albumTitle}</span><h2>{photo?.title}</h2></div>
          <span className={styles.position}>{viewerIndex === null ? '00' : String(viewerIndex + 1).padStart(2, '0')} <span>/ {String(visiblePhotos.length).padStart(2, '0')}</span></span>
          {photo && <a href={photo.src} target="_blank" rel="noopener noreferrer" className={styles.originalLink}>Open original ↗</a>}
          <span className={styles.keyboardHint}>← → navigate · P play / pause · Esc close</span>
          {viewerNotice && <p className={styles.viewerNotice} role="status">{viewerNotice}</p>}
        </footer>
      </div>
    </dialog>
  </div>;
}
