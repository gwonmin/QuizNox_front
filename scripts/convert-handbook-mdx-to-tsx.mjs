#!/usr/bin/env node
/**
 * Convert handbook .mdx files to .tsx components.
 * Usage: node scripts/convert-handbook-mdx-to-tsx.mjs [layer...]
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/pages/Handbook/mdx");
const layers = process.argv.slice(2);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

function inlineMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")
    .replace(/</g, "&lt;")
    .replace(/&lt;(\/?(?:a|code|strong|em|DocLink)\b)/g, "<$1");
}

function isJsxish(line) {
  const t = line.trim();
  if (!t) return false;
  if (t.startsWith("import ") || t.startsWith("export ")) return true;
  if (t.startsWith("<") || t.startsWith("</") || t.startsWith("{") || t.startsWith("}")) return true;
  if (t.startsWith("[") || t.startsWith("]") || t.startsWith("(") || t.startsWith(")")) return true;
  if (t.startsWith(");") || t.startsWith("/>") || t === "/>") return true;
  if (t.startsWith("//") || t.startsWith("/*") || t.startsWith("*")) return true;
  if (/^[A-Za-z_][\w]*\s*=/.test(t)) return true;
  if (t.startsWith(",") || t.endsWith(",") || t.endsWith("{") || t.endsWith("([")) return true;
  if (/^(\[|"|'|<)/.test(t)) return true;
  return false;
}

/** Scan a line; returns whether we were inside a template at line start, and updated depths */
function scanLineState(line, state) {
  const start = { ...state, inTemplateAtStart: state.inTemplate };
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const prev = line[i - 1];
    if (ch === "`" && prev !== "\\") {
      state.inTemplate = !state.inTemplate;
      continue;
    }
    if (state.inTemplate) continue;
    if (ch === "{") state.braceDepth += 1;
    if (ch === "}") state.braceDepth -= 1;
    if (ch === "(") state.parenDepth += 1;
    if (ch === ")") state.parenDepth -= 1;
  }
  if (state.braceDepth < 0) state.braceDepth = 0;
  if (state.parenDepth < 0) state.parenDepth = 0;
  return start.inTemplateAtStart || start.braceDepth > 0 || start.parenDepth > 0;
}

function convertFence(lang, body) {
  const escaped = body.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  const label = lang ? ` className="language-${lang}"` : "";
  return `<pre><code${label}>{\`${escaped}\`}</code></pre>`;
}

function convertBody(source) {
  const lines = source.split("\n");
  const out = [];
  let i = 0;
  const state = { inTemplate: false, braceDepth: 0, parenDepth: 0 };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Fenced code block (markdown) — convert as a whole before state scan of inner lines
    const fenceOpen = trimmed.match(/^```(\w*)\s*$/);
    if (fenceOpen && !state.inTemplate && state.braceDepth === 0) {
      const lang = fenceOpen[1] || "";
      i += 1;
      const buf = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1; // closing ```
      out.push(convertFence(lang, buf.join("\n")));
      continue;
    }

    const insideExpr = scanLineState(line, state);

    if (trimmed === "") {
      out.push("");
      i += 1;
      continue;
    }

    if (insideExpr || isJsxish(line) || trimmed.includes("`")) {
      out.push(line);
      i += 1;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      out.push("<hr />");
      i += 1;
      continue;
    }

    const h3 = trimmed.match(/^###\s+(.+)$/);
    if (h3) {
      out.push(`<h3>${inlineMarkdown(h3[1])}</h3>`);
      i += 1;
      continue;
    }
    const h2 = trimmed.match(/^##\s+(.+)$/);
    if (h2) {
      out.push(`<h2>${inlineMarkdown(h2[1])}</h2>`);
      i += 1;
      continue;
    }
    const h1 = trimmed.match(/^#\s+(.+)$/);
    if (h1) {
      out.push(`<h2>${inlineMarkdown(h1[1])}</h2>`);
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const m = t.match(/^[-*]\s+(.+)$/) || t.match(/^\d+\.\s+(.+)$/);
        if (!m) break;
        items.push(`  <li>${inlineMarkdown(m[1])}</li>`);
        i += 1;
      }
      out.push("<ul>");
      out.push(...items);
      out.push("</ul>");
      continue;
    }

    if (trimmed.startsWith(">")) {
      const parts = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        parts.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      out.push(`<blockquote><p>${inlineMarkdown(parts.join(" "))}</p></blockquote>`);
      continue;
    }

    if (/[\u3131-\uD79D]/.test(trimmed) || trimmed.includes("**") || /\[[^\]]+\]\([^)]+\)/.test(trimmed)) {
      const parts = [trimmed];
      i += 1;
      while (i < lines.length) {
        const t = lines[i].trim();
        if (
          t === "" ||
          t.startsWith("#") ||
          isJsxish(lines[i]) ||
          t.startsWith(">") ||
          /^[-*]\s+/.test(t) ||
          t.startsWith("```")
        ) {
          break;
        }
        parts.push(t);
        i += 1;
      }
      out.push(`<p>${inlineMarkdown(parts.join(" "))}</p>`);
      continue;
    }

    out.push(line);
    i += 1;
  }

  return out.join("\n");
}

function splitImportsAndBody(source) {
  const lines = source.split("\n");
  const imports = [];
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (t === "" && imports.length === 0) {
      i += 1;
      continue;
    }
    if (t.startsWith("import ")) {
      let block = lines[i];
      i += 1;
      while (!block.includes(";") && i < lines.length) {
        block += "\n" + lines[i];
        i += 1;
      }
      imports.push(block);
      continue;
    }
    break;
  }
  const body = lines.slice(i).join("\n").replace(/^\n+/, "").replace(/\n+$/, "");
  return { imports, body };
}

function convertFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const name = path.basename(filePath, ".mdx");
  const { imports, body } = splitImportsAndBody(raw);
  const jsxBody = convertBody(body);
  const indented = jsxBody
    .split("\n")
    .map((l) => (l.length ? `      ${l}` : ""))
    .join("\n");

  const content = `${imports.join("\n")}${imports.length ? "\n\n" : ""}export default function ${name}() {
  return (
    <>
${indented}
    </>
  );
}
`;

  const dest = filePath.replace(/\.mdx$/, ".tsx");
  fs.writeFileSync(dest, content, "utf8");
  fs.unlinkSync(filePath);
}

function main() {
  const targets = [];
  if (layers.length === 0) {
    targets.push(...walk(ROOT));
  } else {
    for (const layer of layers) {
      const dir = path.join(ROOT, layer);
      targets.push(...walk(dir));
    }
  }
  for (const file of targets) convertFile(file);
  console.log(`converted ${targets.length} mdx → tsx`);
}

main();
