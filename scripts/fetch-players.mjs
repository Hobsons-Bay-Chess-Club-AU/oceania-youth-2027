import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const ENV_FILE = path.join(ROOT_DIR, ".env");
dotenv.config({ path: ENV_FILE });
const FETCH_TXT = path.join(__dirname, "fetch.txt");
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

function getDataDir() {
  const candidates = [
    path.join(__dirname, "data"),
    path.join(ROOT_DIR, "data"),
    path.join(ROOT_DIR, "scripts", "data"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return path.join(__dirname, "data");
}

function lookupLocalRatings(fideIds) {
  const dataDir = getDataDir();
  const stdZip = path.join(dataDir, "standard_rating_list.zip");
  const rpdZip = path.join(dataDir, "rapid_rating_list.zip");
  const blzZip = path.join(dataDir, "blitz_rating_list.zip");

  const results = {};
  for (const id of fideIds) {
    results[id] = { standard: 0, rapid: 0, blitz: 0, yob: null };
  }

  const queryZip = (zipPath, field) => {
    if (!fs.existsSync(zipPath)) {
      console.warn(`[Local Ratings] Warning: Rating zip file not found at ${zipPath}`);
      return;
    }
    const validIds = fideIds.filter(
      (id) => id && id !== "0" && id.toLowerCase() !== "n/a"
    );
    if (!validIds.length) return;

    const pattern = validIds.join("|");
    try {
      const stdout = execSync(
        `unzip -p "${zipPath}" | grep -E "^(${pattern})[[:space:]]"`,
        { maxBuffer: 20 * 1024 * 1024 }
      ).toString();

      for (const line of stdout.split("\n")) {
        if (!line.trim()) continue;
        const id = line.slice(0, 15).trim();
        const rating = parseInt(line.slice(113, 118).trim(), 10) || 0;
        const bday = parseInt(line.slice(125, 131).trim(), 10) || 0;

        if (results[id]) {
          results[id][field] = rating;
          if (bday > 1900 && bday < 2100) {
            results[id].yob = bday;
          }
        }
      }
    } catch {
      // grep exits with 1 if no matches found
    }
  };

  queryZip(stdZip, "standard");
  queryZip(rpdZip, "rapid");
  queryZip(blzZip, "blitz");

  return results;
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
    accept: "text/html",
    "accept-language": "en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    pragma: "no-cache",
    priority: "u=1, i",
    referer: "https://hbcc.tidyhq.com/schedule/events/87244-oceania-youth-championship-2027",
    "sec-ch-ua": '"Google Chrome";v="155", "Chromium";v="155", "Not(A:Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
  };

  if (cookie) {
    headers["cookie"] = cookie;
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

  const cookie = getCookieFromEnv();
  const baseUrl = getBaseUrl();

  if (!cookie) {
    console.error("❌ Error: No TINYHQ_COOKIE found in environment or .env file.");
    console.error("Please set the TINYHQ_COOKIE secret in GitHub Repository Settings -> Secrets and variables -> Actions.");
    process.exit(1);
  }

  console.log(`Fetching from TidyHQ: ${baseUrl}`);
  let allPlayers = [];

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
      console.log(
        `Page ${page}: parsed ${players.length} players (Total so far: ${allPlayers.length})`
      );

      if (totalExpected !== null && allPlayers.length >= totalExpected) {
        break;
      }

      page++;
      // Safety guard
      if (page > 50) break;
    }
  } catch (err) {
    console.error(`❌ Fetch failed: ${err.message}`);
    process.exit(1);
  }

  console.log(`\nSuccessfully parsed ${allPlayers.length} registered player(s).`);

  // Enrich with FIDE Ratings (Standard, Rapid, Blitz) from local rating lists
  console.log("\nEnriching FIDE ratings (Standard, Rapid, Blitz) from local rating lists...");
  const registeredFideIds = allPlayers
    .map((p) => p.fideId)
    .filter((id) => id && id !== "0" && id.toLowerCase() !== "n/a");

  const ratingsMap = lookupLocalRatings(registeredFideIds);

  for (let i = 0; i < allPlayers.length; i++) {
    const p = allPlayers[i];
    if (p.fideId && ratingsMap[p.fideId]) {
      const r = ratingsMap[p.fideId];
      p.fideRating = r.standard;
      p.rapidRating = r.rapid;
      p.blitzRating = r.blitz;
      if (!p.yob && r.yob) {
        p.yob = r.yob;
      }
      console.log(
        `[${i + 1}/${allPlayers.length}] ${p.name} (FIDE #${p.fideId}) -> Std: ${r.standard || "—"} | Rpd: ${r.rapid || "—"} | Blz: ${r.blitz || "—"}`
      );
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
