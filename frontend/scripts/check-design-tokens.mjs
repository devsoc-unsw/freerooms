import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const baselinePath = join(import.meta.dirname, "design-token-baseline.json");
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
const ignored = new Set(["node_modules", ".next", "__tests__", "theme"]);
const extensions = new Set([".ts", ".tsx", ".css", ".scss"]);

const styleProperties = [
  "padding",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingInline",
  "paddingBlock",
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginInline",
  "marginBlock",
  "gap",
  "rowGap",
  "columnGap",
  "borderRadius",
  // Common MUI System aliases.
  "p",
  "pt",
  "pb",
  "pl",
  "pr",
  "px",
  "py",
  "m",
  "mt",
  "mb",
  "ml",
  "mr",
  "mx",
  "my",
];

const cssProperties = [
  "padding",
  "padding-top",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "padding-inline",
  "padding-block",
  "margin",
  "margin-top",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "margin-inline",
  "margin-block",
  "gap",
  "row-gap",
  "column-gap",
  "border-radius",
];

const jsPropertyPattern = new RegExp(
  `\\b(${styleProperties.join("|")})\\s*:\\s*(?:(["'])([^"']+)\\2|(-?\\d+(?:\\.\\d+)?))`,
  "g"
);
const cssPropertyPattern = new RegExp(
  `\\b(${cssProperties.join("|")})\\s*:\\s*([^;}{]+)`,
  "gi"
);
const pxPattern = /-?\d+(?:\.\d+)?px\b/g;
const numberPattern = /^-?\d+(?:\.\d+)?$/;

function extension(path) {
  const match = path.match(/\.[^.]+$/);
  return match?.[0] ?? "";
}

function normaliseValue(value) {
  return value.replace(/\s+/g, " ").trim();
}

function isZero(value) {
  if (numberPattern.test(value)) return Number(value) === 0;

  const pixels = value.match(pxPattern);
  return pixels !== null && pixels.every((pixel) => Number.parseFloat(pixel) === 0);
}

function addViolation(violations, file, line, property, value) {
  const normalised = normaliseValue(value);
  if (!normalised || isZero(normalised)) return;

  const key = `${file}|${property}|${normalised}`;
  const current = violations.get(key) ?? {
    key,
    file,
    property,
    value: normalised,
    count: 0,
    lines: [],
  };

  current.count++;
  current.lines.push(line);
  violations.set(key, current);
}

function scanJavascript(text, file, violations) {
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;

    jsPropertyPattern.lastIndex = 0;
    let match;

    while ((match = jsPropertyPattern.exec(line))) {
      const property = match[1];
      const quotedValue = match[3];
      const numericValue = match[4];

      if (numericValue !== undefined) {
        addViolation(violations, file, index + 1, property, numericValue);
        continue;
      }

      if (quotedValue && pxPattern.test(quotedValue)) {
        pxPattern.lastIndex = 0;
        addViolation(violations, file, index + 1, property, quotedValue);
      }
      pxPattern.lastIndex = 0;
    }
  });
}

function scanCss(text, file, violations) {
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      return;
    }

    cssPropertyPattern.lastIndex = 0;
    let match;

    while ((match = cssPropertyPattern.exec(line))) {
      const property = match[1];
      const value = match[2];

      if (pxPattern.test(value)) {
        pxPattern.lastIndex = 0;
        addViolation(violations, file, index + 1, property, value);
      }
      pxPattern.lastIndex = 0;
    }
  });
}

async function scanDirectory(directory, violations) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignored.has(entry.name)) await scanDirectory(path, violations);
      continue;
    }

    if (!entry.isFile() || !extensions.has(extension(entry.name))) continue;

    const text = await readFile(path, "utf-8");
    const file = relative(root, path);

    if (entry.name.endsWith(".css") || entry.name.endsWith(".scss")) {
      scanCss(text, file, violations);
    } else {
      scanJavascript(text, file, violations);
    }
  }
}

async function getViolations() {
  const violations = new Map();

  for (const directory of sourceDirectories) {
    await scanDirectory(join(root, directory), violations);
  }

  return violations;
}

function serialiseBaseline(violations) {
  return {
    version: 1,
    note: "Existing layout-token debt. New or additional raw spacing/radius values fail lint:tokens.",
    violations: Object.fromEntries(
      [...violations.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => [key, value.count])
    ),
  };
}

const violations = await getViolations();

if (process.argv.includes("--write-baseline")) {
  await writeFile(
    baselinePath,
    `${JSON.stringify(serialiseBaseline(violations), null, 2)}\n`,
    "utf-8"
  );
  console.log(
    `Wrote ${violations.size} existing design-token fingerprints to scripts/design-token-baseline.json.`
  );
  process.exit(0);
}

const baseline = JSON.parse(await readFile(baselinePath, "utf-8"));
const failures = [];

for (const [key, violation] of violations) {
  const allowedCount = baseline.violations[key] ?? 0;
  if (violation.count > allowedCount) {
    failures.push({
      ...violation,
      newCount: violation.count - allowedCount,
    });
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    const lineList = failure.lines.join(", ");
    console.error(
      `${failure.file}:${lineList}: Use theme.space.*, theme.radius.*, or a semantic layout token instead of raw ${failure.property}: ${failure.value}.`
    );
  }

  console.error(
    `Found ${failures.reduce((sum, failure) => sum + failure.newCount, 0)} new raw spacing/radius value(s).`
  );
  process.exitCode = 1;
} else {
  console.log("Design token check passed: no new raw spacing/radius values found.");
}
