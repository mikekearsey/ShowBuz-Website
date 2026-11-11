#!/usr/bin/env node
/**
 * Fails when an exported async function in src/app/admin/actions.ts
 * has no requireAdminEmail( in its body.
 * Excludes loginAction and logoutAction.
 * Not wired into CI — run manually: node scripts/check-admin-actions.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const EXCLUDE = new Set(["loginAction", "logoutAction"]);
const file = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "app",
  "admin",
  "actions.ts",
);
const source = readFileSync(file, "utf8");

const exportRe = /export\s+async\s+function\s+(\w+)\s*\(/g;
const names = [];
let match;
while ((match = exportRe.exec(source)) !== null) {
  names.push({ name: match[1], index: match.index });
}

const missing = [];
for (let i = 0; i < names.length; i += 1) {
  const { name, index } = names[i];
  if (EXCLUDE.has(name)) continue;
  const end = i + 1 < names.length ? names[i + 1].index : source.length;
  const body = source.slice(index, end);
  if (!body.includes("requireAdminEmail(")) {
    missing.push(name);
  }
}

if (missing.length > 0) {
  console.error(
    "check-admin-actions: missing requireAdminEmail() in:\n  " +
      missing.join("\n  "),
  );
  process.exit(1);
}

console.log(
  `check-admin-actions: ok (${names.length - EXCLUDE.size} gated, ${EXCLUDE.size} excluded)`,
);
