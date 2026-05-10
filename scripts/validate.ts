import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",
  "components/Bag.tsx",
  "components/Carousel.tsx",
  "components/DragGhost.tsx",
  "components/StorageArea.tsx",
  "components/UnloadedList.tsx",
  "lib/belt.ts",
  "lib/storage.ts",
  "next.config.mjs",
  "tests/belt.test.ts",
  "tests/storage.test.ts"
];

for (const relative of required) {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) {
    throw new Error(`Missing required file: ${relative}`);
  }
}

const appSource = [
  "app/page.tsx",
  "components/StorageArea.tsx",
  "lib/storage.ts"
]
  .map((relative) => fs.readFileSync(path.join(root, relative), "utf8"))
  .join("\n");
const config = fs.readFileSync(path.join(root, "next.config.mjs"), "utf8");

for (const needle of [
  "Luggage Carousel",
  "StorageRules.unloadStorage",
  "unload",
  "Three by three luggage storage area"
]) {
  if (!appSource.includes(needle)) {
    throw new Error(`App source does not include ${needle}`);
  }
}

if (!config.includes('output: "export"')) {
  throw new Error("next.config.mjs must keep static export enabled");
}

console.log("Next.js static export setup validated");
