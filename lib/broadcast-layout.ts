// Compact cards have 6px padding, a 1px border, a 20px heading, and two
// 22px player rows. Their height is therefore their width plus 64px.
const CARD_EXTRA_HEIGHT = 64;
const MIN_CARD_WIDTH = 142;
const GAP = 8;

export function fullscreenBoardLayout(width: number, height: number, boardCount: number) {
  if (width <= 0 || height <= 0 || boardCount <= 0) {
    return { columns: 1, cardWidth: MIN_CARD_WIDTH, fits: false };
  }
  let columns = 1;
  let cardWidth = 0;
  for (let candidate = 1; candidate <= boardCount; candidate++) {
    const rows = Math.ceil(boardCount / candidate);
    const available = Math.floor(Math.min(
      (width - (candidate - 1) * GAP) / candidate,
      (height - (rows - 1) * GAP) / rows - CARD_EXTRA_HEIGHT,
    ));
    if (available > cardWidth) {
      columns = candidate;
      cardWidth = available;
    }
  }
  if (cardWidth >= MIN_CARD_WIDTH) return { columns, cardWidth, fits: true };

  // Preserve readable pieces and names; overflow remains accessible by scrolling.
  columns = Math.max(1, Math.min(boardCount, Math.floor((width + GAP) / (MIN_CARD_WIDTH + GAP))));
  return { columns, cardWidth: Math.max(1, Math.floor((width - (columns - 1) * GAP) / columns)), fits: false };
}
