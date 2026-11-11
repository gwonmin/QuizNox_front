#!/usr/bin/env node
/**
 * Build handbookDocRegistry.tsx from HandbookView.tsx slug → component map,
 * then rewrite HandbookView to use the registry (eager components).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const viewPath = path.join(root, "src/pages/Handbook/HandbookView.tsx");
const registryPath = path.join(root, "src/pages/Handbook/handbookDocRegistry.tsx");

let view = fs.readFileSync(viewPath, "utf8");

// Normalize any remaining .mdx import paths to .tsx for parsing
const importMap = new Map(); // componentName → rel path without ext
for (const match of view.matchAll(
  /import\s+(\w+)\s+from\s+"\.\/mdx\/([^"]+)\.(mdx|tsx)"/g,
)) {
  importMap.set(match[1], match[2]);
}

const docs = [];
const seen = new Set();
for (const match of view.matchAll(
  /layerId === "([^"]+)" && slug === "([^"]+)"[\s\S]{0,280}?return <(\w+)/g,
)) {
  const layerId = match[1];
  const slug = match[2];
  const component = match[3];
  const key = `${layerId}/${slug}`;
  if (seen.has(key)) continue;
  seen.add(key);
  const rel = importMap.get(component);
  if (!rel) {
    console.warn(`import missing: ${component} (${key})`);
    continue;
  }
  const exportName = path.basename(rel);
  docs.push({ key, layerId, slug, rel, exportName, component });
}

// Unique imports by rel
const byRel = new Map();
for (const doc of docs) {
  if (!byRel.has(doc.rel)) byRel.set(doc.rel, doc.exportName);
}

const importLines = [...byRel.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([rel, name]) => `import ${name} from "./mdx/${rel}";`)
  .join("\n");

const mapLines = docs
  .map((d) => `  "${d.key}": ${d.exportName},`)
  .join("\n");

const registrySource = `import type { ComponentType } from "react";
${importLines}

/** layerId/slug → handbook document component */
export const HANDBOOK_DOC_REGISTRY: Record<string, ComponentType> = {
${mapLines}
};

export function getHandbookDocComponent(layerId: string, slug: string): ComponentType | null {
  return HANDBOOK_DOC_REGISTRY[\`\${layerId}/\${slug}\`] ?? null;
}

export function hasHandbookDoc(layerId: string, slug: string): boolean {
  return \`\${layerId}/\${slug}\` in HANDBOOK_DOC_REGISTRY;
}
`;

fs.writeFileSync(registryPath, registrySource, "utf8");
console.log(`wrote ${registryPath} (${docs.length} docs)`);

// Strip old mdx/tsx doc imports from HandbookView
view = view.replace(
  /^import\s+\w+\s+from\s+"\.\/mdx\/[^"]+\.(mdx|tsx)";\n/gm,
  "",
);

// Ensure registry import exists once after other local imports
if (!view.includes("handbookDocRegistry")) {
  view = view.replace(
    /(import \{ HandbookLayout \} from[^;]+;\n)/,
    `$1import { getHandbookDocComponent, hasHandbookDoc } from "./handbookDocRegistry";\n`,
  );
}

// Replace isMdxDoc ladder with hasHandbookDoc
view = view.replace(
  /const isMdxDoc = \(\(\) => \{[\s\S]*?return false;\n  \}\)\(\);/,
  `const isMdxDoc = Boolean(layerId && slug && hasHandbookDoc(layerId, slug));`,
);

// Replace mdxComponent ladder
view = view.replace(
  /const mdxComponent = \(\(\) => \{[\s\S]*?return null;\n  \}\)\(\);/,
  `const Doc = layerId && slug ? getHandbookDocComponent(layerId, slug) : null;
  const mdxComponent = Doc ? <Doc /> : null;`,
);

fs.writeFileSync(viewPath, view, "utf8");
console.log("updated HandbookView.tsx");
