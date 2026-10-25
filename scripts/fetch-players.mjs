#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const ENV_FILE = path.join(ROOT_DIR, ".env");
dotenv.config({ path: ENV_FILE });
const FETCH_TXT = path.join(__dirname, "fetch.txt");
const SAMPLE_TXT = path.join(__dirname, "sample.txt");
const OUTPUT_FILE = path.join(ROOT_DIR, "public", "players.json");

const FEDERATION_MAP = {
  australia: { federation: "AUS", flag: "AU" },
  aus: { federation: "AUS", flag: "AU" },
  "new zealand": { federation: "NZL", flag: "NZ" },
  nzl: { federation: "NZL", flag: "NZ" },
  fiji: { federation: "FIJ", flag: "FJ" },
  fij: { federation: "FIJ", flag: "FJ" },
  "papua new guinea": { federation: "PNG", flag: "PG" },
  png: { federation: "PNG", flag: "PG" },
  "solomon islands": { federation: "SOL", flag: "SB" },
  sol: { federation: "SOL", flag: "SB" },
  palau: { federation: "PLW", flag: "PW" },
  plw: { federation: "PLW", flag: "PW" },
  samoa: { federation: "SAM", flag: "WS" },
  sam: { federation: "SAM", flag: "WS" },
  tonga: { federation: "TGA", flag: "TO" },
  tga: { federation: "TGA", flag: "TO" },
  guam: { federation: "GUM", flag: "GU" },
  gum: { federation: "GUM", flag: "GU" },
  "cook islands": { federation: "COK", flag: "CK" },
  cok: { federation: "COK", flag: "CK" },
  nauru: { federation: "NRU", flag: "NR" },
  nru: { federation: "NRU", flag: "NR" },
  vanuatu: { federation: "VAN", flag: "VU" },
  van: { federation: "VAN", flag: "VU" },
  singapore: { federation: "SGP", flag: "SG" },
  sgp: { federation: "SGP", flag: "SG" },
  malaysia: { federation: "MAS", flag: "MY" },
  mas: { federation: "MAS", flag: "MY" },
};

function normalizeFederation(raw) {
  if (!raw) return { federation: "AUS", flag: "AU" };
  const key = raw.trim().toLowerCase();
  return FEDERATION_MAP[key] || {
    federation: raw.slice(0, 3).toUpperCase(),
    flag: raw.slice(0, 2).toUpperCase(),
  };
}

function parseAgeGroupCategory(raw) {
  let division = "Open";
  let category = "Open";

  if (raw) {
    const divMatch = raw.match(/\b(U\d{1,2})\b/i);
    if (divMatch) {
      division = divMatch[1].toUpperCase();
    }

    if (/girls/i.test(raw)) {
      category = "Girls";
    } else if (/open/i.test(raw)) {
      category = "Open";
    }
  }

  return { division, category };
}

async function fetchFideRatings(fideId) {
  const result = { standard: 0, rapid: 0, blitz: 0 };
  if (!fideId || fideId === "0" || fideId.toLowerCase() === "n/a") return result;
  try {
    const res = await fetch(`https://ratings.fide.com/profile/${fideId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });
    if (!res.ok) return result;
    const html = await res.text();
    const parse = (className) => {
      const reg = new RegExp(
        `<div class="${className}[^"]*">[\\s\\S]*?<p>([^<]+)<\\/p>`,
        "i"
      );
      const m = html.match(reg);
      if (!m) return 0;
      const v = parseInt(m[1].trim(), 10);
      return isNaN(v) ? 0 : v;
    };
    result.standard = parse("profile-standart");
    result.rapid = parse("profile-rapid");
    result.blitz = parse("profile-blitz");
  } catch (err) {
    console.warn(`[FIDE] Could not fetch ratings for FIDE ID ${fideId}: ${err.message}`);
  }
  return result;
}

function parseAttendeesHtml(html) {
  const baseCountMatch = html.match(/data-base-count="(\d+)"/);
  const baseCount = baseCountMatch ? parseInt(baseCountMatch[1], 10) : null;

  const rows = html.split(/data-scanning-attendees-target="row"/);
  const players = [];

  for (let i = 1; i < rows.length; i++) {
    const chunk = rows[i];

    const getField = (label) => {
      const regex = new RegExp(
        `<span class="font-medium text-gray-700">${label}</span>:\\s*([^<]+)`,
        "i"
      );
      const m = chunk.match(regex);
      return m ? m[1].trim().replace(/\s+/g, " ") : "";
    };

    const firstName = getField("First Name");
    const lastName = getField("Last Name");
    let name = `${firstName} ${lastName}`.trim().replace(/\s+/g, " ");

    if (!name) {
      const assignedMatch = chunk.match(
        /Assigned to[\s\S]*?<a[^>]*>([^<]+)<\/a>/i
      );
      if (assignedMatch) {
        name = assignedMatch[1].trim().replace(/\s+/g, " ");
      }
    }

    if (!name) continue;

    const fideId = getField("FIDE ID");
    const federationRaw = getField("Oceania Federation");
    const ageCategory = getField("Age Group Category");
    const dob = getField("Date of Birth \\(DOB\\)");
    let yob = undefined;
    if (dob) {
      const yobMatch = dob.match(/\b(\d{4})\b/);
      if (yobMatch) {
        yob = parseInt(yobMatch[1], 10);
      }
    }
    const gender = getField("Gender");

    const { federation, flag } = normalizeFederation(federationRaw);
    const { division, category } = parseAgeGroupCategory(ageCategory);

    players.push({
      name,
      division,
      category,
      federation,
      flag,
      fideId,
      fideRating: 0,
      rapidRating: 0,
      blitzRating: 0,
      ...(yob ? { yob } : {}),
    });
  }

  return { players, baseCount };
}

function getCookieFromEnv() {
  dotenv.config({ path: ENV_FILE });
  return process.env.TINYHQ_COOKIE?.trim() || null;
}

function getBaseUrl() {
  if (fs.existsSync(FETCH_TXT)) {
    const url = fs.readFileSync(FETCH_TXT, "utf8").trim();
    if (url.startsWith("http")) return url;
  }
  return "https://hbcc.tidyhq.com/schedule/events/87244-oceania-youth-championship-2027?scan_type_id=&filter=all&cancellation=active";
}

async function fetchPageHtml(baseUrl, page, cookie) {
  const urlObj = new URL(baseUrl);
  urlObj.searchParams.set("page", String(page));

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  };
  if (cookie) {
    headers["Cookie"] = cookie;
  }

  const res = await fetch(urlObj.toString(), { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${urlObj.toString()}`);
  }
  const html = await res.text();
  if (html.includes("accounts.tidyhq.com/auth/v2") || html.includes("Login to TidyHQ")) {
    throw new Error("TidyHQ session expired or not authenticated (redirected to login).");
  }
  return html;
}

async function main() {
  console.log("=== Oceania Youth 2027: Fetching Registered Players ===");
  const args = process.argv.slice(2);
  const forceSample = args.includes("--sample") || args.includes("--file");

  let allPlayers = [];
  const cookie = getCookieFromEnv();
  const baseUrl = getBaseUrl();

  let fetchedLive = false;

  if (!forceSample && cookie) {
    console.log(`Fetching from TidyHQ: ${baseUrl}`);
    try {
      let page = 1;
      let totalExpected = null;

      while (true) {
        console.log(`Fetching page ${page}...`);
        const html = await fetchPageHtml(baseUrl, page, cookie);
        const { players, baseCount } = parseAttendeesHtml(html);

        if (totalExpected === null && baseCount !== null) {
          totalExpected = baseCount;
          console.log(`Total active registered attendees expected: ${totalExpected}`);
        }

        if (players.length === 0) {
          break;
        }

        allPlayers.push(...players);
        console.log(`Page ${page}: parsed ${players.length} players (Total so far: ${allPlayers.length})`);

        if (totalExpected !== null && allPlayers.length >= totalExpected) {
          break;
        }

        page++;
        // Safety guard
        if (page > 50) break;
      }
      fetchedLive = true;
    } catch (err) {
      console.warn(`[Live Fetch Failed]: ${err.message}`);
      console.log("Falling back to local scripts/sample.txt...");
    }
  }

  if (!fetchedLive) {
    if (!fs.existsSync(SAMPLE_TXT)) {
      console.error(`Sample file not found at ${SAMPLE_TXT}`);
      process.exit(1);
    }
    console.log(`Parsing local sample file: ${SAMPLE_TXT}`);
    const html = fs.readFileSync(SAMPLE_TXT, "utf8");
    const { players } = parseAttendeesHtml(html);
    allPlayers = players;
  }

  console.log(`\nSuccessfully parsed ${allPlayers.length} registered player(s).`);

  // Enrich with FIDE Ratings (Standard, Rapid, Blitz)
  console.log("\nEnriching FIDE ratings (Standard, Rapid, Blitz) from ratings.fide.com...");
  for (let i = 0; i < allPlayers.length; i++) {
    const p = allPlayers[i];
    if (p.fideId) {
      process.stdout.write(`[${i + 1}/${allPlayers.length}] Looking up FIDE ID ${p.fideId} (${p.name})... `);
      const ratings = await fetchFideRatings(p.fideId);
      p.fideRating = ratings.standard;
      p.rapidRating = ratings.rapid;
      p.blitzRating = ratings.blitz;
      console.log(`Std: ${ratings.standard || "—"} | Rpd: ${ratings.rapid || "—"} | Blz: ${ratings.blitz || "—"}`);
    } else {
      console.log(`[${i + 1}/${allPlayers.length}] ${p.name}: No FIDE ID (Unrated)`);
    }
  }

  // Deduplicate divisions
  const standardDivisions = ["U8", "U10", "U12", "U14", "U16", "U18", "U20"];
  const dynamicDivisions = Array.from(new Set(allPlayers.map((p) => p.division)));
  const divisions = Array.from(new Set([...standardDivisions, ...dynamicDivisions]));

  // Check if existing players have changed to avoid unnecessary commits
  let existingData = null;
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
    } catch {
      existingData = null;
    }
  }

  const playersChanged =
    !existingData ||
    JSON.stringify(existingData.players) !== JSON.stringify(allPlayers);

  const lastUpdated = playersChanged
    ? new Date().toISOString()
    : existingData?.lastUpdated || new Date().toISOString();

  const payload = {
    lastUpdated,
    description:
      "Official registered Oceania junior entrants for the 2027 Oceania Youth Chess Championship.",
    divisions,
    categories: ["Open", "Girls"],
    players: allPlayers,
  };

  if (playersChanged) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2) + "\n", "utf8");
    console.log(`\n✓ Changes detected! Updated ${allPlayers.length} player(s) in ${OUTPUT_FILE}`);
  } else {
    console.log(`\n✓ No player changes detected. ${OUTPUT_FILE} preserved.`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
