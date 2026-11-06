/** Last-move coordinates in an 8×8 SVG viewBox, matching board orientation. */
export function boardMoveArrow(from?: string, to?: string, flipped = false) {
  if (!from || !to || from === to || !/^[a-h][1-8]$/.test(from) || !/^[a-h][1-8]$/.test(to)) return null;
  const center = (square: string) => {
    const x = square.charCodeAt(0) - 97 + 0.5;
    const y = 8.5 - Number(square[1]);
    return flipped ? { x: 8 - x, y: 8 - y } : { x, y };
  };
  const start = center(from);
  const end = center(to);
  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
}
