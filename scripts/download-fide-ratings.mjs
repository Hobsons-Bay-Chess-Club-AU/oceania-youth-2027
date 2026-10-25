#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(__dirname, "data");

const FIDE_DOWNLOADS = [
  {
    name: "Standard Ratings",
    url: "https://ratings.fide.com/download/standard_rating_list.zip",
    file: "standard_rating_list.zip",
  },
  {
    name: "Rapid Ratings",
    url: "https://ratings.fide.com/download/rapid_rating_list.zip",
    file: "rapid_rating_list.zip",
  },
  {
    name: "Blitz Ratings",
    url: "https://ratings.fide.com/download/blitz_rating_list.zip",
    file: "blitz_rating_list.zip",
  },
];

async function main() {
  console.log("=== Downloading Official FIDE Rating Lists ===");
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  for (const item of FIDE_DOWNLOADS) {
    const targetPath = path.join(DATA_DIR, item.file);
    console.log(`\nDownloading ${item.name} (${item.file})...`);
    console.log(`URL: ${item.url}`);

    try {
      execSync(`curl -L -f --progress-bar -o "${targetPath}" "${item.url}"`, {
        stdio: "inherit",
      });
      console.log(`✓ Saved: ${targetPath}`);
    } catch (err) {
      console.error(`❌ Failed to download ${item.name}: ${err.message}`);
      process.exit(1);
    }
  }

  console.log("\n✓ All FIDE rating lists successfully downloaded to:", DATA_DIR);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
