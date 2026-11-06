export function replayPlyForKey(previous: number | null, lastPly: number, key: "ArrowLeft" | "ArrowRight") {
  const current = Math.min(previous ?? lastPly, lastPly);
  if (key === "ArrowLeft") return current > 0 ? current - 1 : previous;
  return current < lastPly ? current + 1 : previous;
}
