export const PIECE_SET_STORAGE_KEY = "oy27-broadcast-piece-set";
export const DEFAULT_PIECE_SET = "oceania-2027";
export const CLASSIC_PIECE_SETS = [
  { id: "chessnut", name: "Chessnut", description: "The original broadcast set. Clear, familiar silhouettes.", directory: "/chess", extension: "svg" },
  { id: "staunton", name: "Staunton 3D", description: "Traditional sculpted pieces in ivory and ebony.", directory: "/chess/staunton", extension: "webp" },
  { id: "spatial", name: "Spatial", description: "Contemporary sculpted shapes, drawn as crisp vectors.", directory: "/chess/spatial", extension: "svg" },
  { id: "celtic", name: "Celtic", description: "Elegant traditional silhouettes with flowing decorative details.", directory: "/chess/celtic", extension: "svg" },
  { id: "oceania-2027", name: "Oceania Youth 2027", description: "Ivory, ocean teal and gold. One shared base for thirteen federations.", directory: "/chess/oceania-2027", extension: "svg" },
] as const;
export const FEDERATION_PIECE_SETS = [
  { code: "au", fide: "AUS", name: "Australia", description: "Commonwealth stars, eucalyptus green and gold." },
  { code: "nz", fide: "NZL", name: "New Zealand", description: "Silver fern details and Southern Cross stars." },
  { code: "fj", fide: "FIJ", name: "Fiji", description: "Coconut palms, ocean blue and shield details." },
  { code: "pg", fide: "PNG", name: "Papua New Guinea", description: "Bird-of-paradise details in red, black and gold." },
  { code: "sb", fide: "SOL", name: "Solomon Islands", description: "Five stars and a golden diagonal across ocean and forest." },
  { code: "pw", fide: "PLW", name: "Palau", description: "A golden moon above a turquoise lagoon." },
  { code: "gu", fide: "GUM", name: "Guam", description: "Coconut palm and canoe details framed in red and blue." },
  { code: "nr", fide: "NRU", name: "Nauru", description: "Twelve-pointed stars and a golden equator band." },
  { code: "nc", fide: "NCL", name: "New Caledonia", description: "Cagou-inspired crests and blue, red and green accents." },
  { code: "to", fide: "TGA", name: "Tonga", description: "Cross motifs, royal red and ivory." },
  { code: "vu", fide: "VAN", name: "Vanuatu", description: "Curved tusk and fern details in gold, red and green." },
  { code: "ki", fide: "KIR", name: "Kiribati", description: "Frigatebird wings, a rising sun and ocean waves." },
  { code: "mh", fide: "MHL", name: "Marshall Islands", description: "Radiant stars and orange-and-ivory diagonal beams." },
] as const;
export type FederationCode = typeof FEDERATION_PIECE_SETS[number]["code"];
export const PIECE_SETS = [...CLASSIC_PIECE_SETS, ...FEDERATION_PIECE_SETS.map(set => ({
  ...set, id: `federation-${set.code}` as `federation-${FederationCode}`,
  directory: `/chess/federations/${set.code}`, extension: "svg" as const,
}))];
export type PieceSetId = typeof PIECE_SETS[number]["id"];
export type PiecePreference = PieceSetId | "adaptive";
export type FederationLookup = Record<string, FederationCode>;

export function federationCode(value?: string): FederationCode | undefined {
  const normalized = value?.trim().toUpperCase().replace(/[\s_-]+/g, "");
  if (!normalized) return undefined;
  const aliases: Record<string, FederationCode> = { FJI: "fj", SLB: "sb", VUT: "vu", TON: "to", NCA: "nc", NAURU: "nr" };
  return aliases[normalized] || FEDERATION_PIECE_SETS.find(set =>
    [set.code.toUpperCase(), set.fide, set.name.toUpperCase().replace(/[\s_-]+/g, "")].includes(normalized)
  )?.code;
}

export function buildFederationLookup(players: { fideId?: string | number; federation?: string }[]): FederationLookup {
  const result: FederationLookup = {};
  const conflicted = new Set<string>();
  for (const player of players) {
    const id = String(player.fideId ?? "").trim();
    const code = federationCode(player.federation);
    if (!/^[1-9]\d*$/.test(id) || conflicted.has(id)) continue;
    if (!code) { delete result[id]; conflicted.add(id); continue; }
    if (result[id] && result[id] !== code) { delete result[id]; conflicted.add(id); }
    else result[id] = code;
  }
  return result;
}

export function playerFederation(headers: Record<string, string>, color: "w" | "b", lookup: FederationLookup): FederationCode | undefined {
  const side = color === "w" ? "White" : "Black";
  const explicit = ["Federation", "Fed", "Country"].map(suffix => headers[side + suffix]?.trim()).filter(value => value && value !== "-" && value !== "?");
  if (explicit.length) {
    const codes = explicit.map(value => federationCode(value));
    return codes[0] && codes.every(code => code === codes[0]) ? codes[0] : undefined;
  }
  const id = (headers[side + "FideId"] || headers[side + "FIDEId"] || headers[side + "FIDEID"] || "").trim();
  return /^[1-9]\d*$/.test(id) ? lookup[id] : undefined;
}

export function resolvePieceSet(preference: PiecePreference, federation?: string): PieceSetId {
  const code = federationCode(federation);
  return preference === "adaptive" ? code ? `federation-${code}` : DEFAULT_PIECE_SET : preference;
}

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

export function validPiecePreference(value: unknown): PiecePreference {
  return value === "adaptive" ? value : validPieceSet(value);
}

export function readPieceSet(storage: Pick<Storage, "getItem">): PiecePreference {
  try { return validPiecePreference(storage.getItem(PIECE_SET_STORAGE_KEY)); }
  catch { return DEFAULT_PIECE_SET; }
}

export function savePieceSet(storage: Pick<Storage, "setItem">, setId: PiecePreference) {
  try { storage.setItem(PIECE_SET_STORAGE_KEY, validPiecePreference(setId)); return true; }
  catch { return false; }
}
