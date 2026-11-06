export const PIECE_SET_STORAGE_KEY = "oy27-broadcast-piece-set";
export const DEFAULT_PIECE_SET = "oceania-2027";
export const PIECE_SETS = [
  { id: "chessnut", name: "Chessnut", description: "The original broadcast set. Clear, familiar silhouettes.", directory: "/chess", extension: "svg" },
  { id: "staunton", name: "Staunton 3D", description: "Traditional sculpted pieces in ivory and ebony.", directory: "/chess/staunton", extension: "webp" },
  { id: "spatial", name: "Spatial", description: "Contemporary sculpted shapes, drawn as crisp vectors.", directory: "/chess/spatial", extension: "svg" },
  { id: "celtic", name: "Celtic", description: "Elegant traditional silhouettes with flowing decorative details.", directory: "/chess/celtic", extension: "svg" },
  { id: "oceania-2027", name: "Oceania Youth 2027", description: "Ivory, ocean teal and gold. One shared base for thirteen federations.", directory: "/chess/oceania-2027", extension: "svg" },
] as const;
export type PieceSetId = typeof PIECE_SETS[number]["id"];

export const OCEANIA_FEDERATIONS = [
  ["au", "Australia"], ["nz", "New Zealand"], ["fj", "Fiji"], ["pg", "Papua New Guinea"],
  ["sb", "Solomon Islands"], ["pw", "Palau"], ["gu", "Guam"], ["nr", "Nauru"],
  ["nc", "New Caledonia"], ["to", "Tonga"], ["vu", "Vanuatu"], ["ki", "Kiribati"], ["mh", "Marshall Islands"],
] as const;

export function validPieceSet(value: unknown): PieceSetId {
  return PIECE_SETS.some(set => set.id === value) ? value as PieceSetId : DEFAULT_PIECE_SET;
}

export function pieceSource(setId: PieceSetId, color: "w" | "b", type: string) {
  const set = PIECE_SETS.find(set => set.id === validPieceSet(setId))!;
  return `${set.directory}/${color}${type.toUpperCase()}.${set.extension}`;
}

export function readPieceSet(storage: Pick<Storage, "getItem">): PieceSetId {
  try { return validPieceSet(storage.getItem(PIECE_SET_STORAGE_KEY)); }
  catch { return DEFAULT_PIECE_SET; }
}

export function savePieceSet(storage: Pick<Storage, "setItem">, setId: PieceSetId) {
  try { storage.setItem(PIECE_SET_STORAGE_KEY, validPieceSet(setId)); return true; }
  catch { return false; }
}
