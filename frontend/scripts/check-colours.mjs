import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sourceDirectories = [
  "app",
  "components",
  "views",
  "hooks",
  "utils",
  "redux",
  "config",
  "styles",
];
const extensions = /\.(?:[cm]?[jt]sx?|scss|css)$/;
const rawColour =
  /#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})(?![\da-f])|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\s*\(/gi;
const ignored = new Set(["node_modules", ".next", "__tests__", "theme"]);
let failures = 0;

async function check(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignored.has(entry.name)) await check(path);
      continue;
    }

    if (
      !entry.isFile() ||
      !extensions.test(entry.name) ||
      /\.test\.[jt]sx?$/.test(entry.name)
    ) {
      continue;
    }

    const lines = (await readFile(path, "utf-8")).split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      if (rawColour.test(lines[i])) {
        console.error(
          `${relative(root, path)}:${i + 1}: Use a semantic theme colour instead of a raw colour.`
        );
        failures++;
      }
      rawColour.lastIndex = 0;
    }
  }
}

for (const directory of sourceDirectories) {
  await check(join(root, directory));
}

if (failures) {
  console.error(
    `Found ${failures} lines containing raw colours outside the theme.`
  );
  process.exitCode = 1;
} else {
  console.log("Colour check passed: no raw colours found in frontend source files.");
}
