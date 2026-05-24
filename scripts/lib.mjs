import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

export const rootDir = new URL("..", import.meta.url).pathname;
export const postsDir = path.join(rootDir, "docs", "writing", "posts");

export function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function parseFrontmatter(source) {
  if (!source.startsWith("---\n")) {
    return { data: {}, body: source, raw: "" };
  }

  const end = source.indexOf("\n---", 4);
  if (end === -1) {
    return { data: {}, body: source, raw: "" };
  }

  const raw = source.slice(4, end).trim();
  const body = source.slice(end + 4).replace(/^\n/, "");
  return { data: parseYamlSubset(raw), body, raw };
}

export function renderFrontmatter(data) {
  const lines = ["---"];

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${item}`);
    } else if (typeof value === "boolean") {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: "${String(value).replaceAll('"', '\\"')}"`);
    }
  }

  lines.push("---", "");
  return lines.join("\n");
}

export async function listPosts() {
  const files = await readdir(postsDir);
  return files
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => path.join(postsDir, file));
}

export async function readPost(file) {
  const source = await readFile(file, "utf8");
  return { file, source, ...parseFrontmatter(source) };
}

export async function writePost(file, data, body) {
  await writeFile(file, `${renderFrontmatter(data)}${body.trimStart()}`, "utf8");
}

export function firstParagraph(body) {
  return body
    .replace(/^# .+$/gm, "")
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .find((part) => part && !part.startsWith("- ")) ?? "";
}

export function excerpt(text, max = 155) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}...`;
}

export function contentHash(source) {
  return createHash("sha256").update(source).digest("hex");
}

export function markdownToPlainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[#>*_\-~]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function postSlug(file, data = {}) {
  if (data.slug) return String(data.slug);
  return path.basename(file, ".md").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

export function topTerms(text, limit = 12) {
  const stopWords = new Set([
    "about",
    "after",
    "again",
    "also",
    "because",
    "before",
    "between",
    "could",
    "every",
    "first",
    "from",
    "have",
    "into",
    "more",
    "only",
    "other",
    "should",
    "that",
    "their",
    "there",
    "these",
    "this",
    "through",
    "when",
    "where",
    "which",
    "with",
    "would",
    "一個",
    "不是",
    "什麼",
    "以及",
    "但是",
    "你可以",
    "如果",
    "就是",
    "我們",
    "所以",
    "這個",
    "這些",
    "那個"
  ]);

  const counts = new Map();
  const words = text.toLowerCase().match(/[\p{Letter}\p{Number}][\p{Letter}\p{Number}-]{2,}/gu) ?? [];

  for (const word of words) {
    if (stopWords.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([term]) => term);
}

function parseYamlSubset(raw) {
  const data = {};
  const lines = raw.split("\n");
  let currentKey = null;

  for (const line of lines) {
    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMatch && currentKey) {
      data[currentKey].push(cleanScalar(listMatch[1]));
      continue;
    }

    const pairMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pairMatch) continue;

    const [, key, value] = pairMatch;
    if (value === "") {
      data[key] = [];
      currentKey = key;
    } else {
      data[key] = cleanScalar(value);
      currentKey = null;
    }
  }

  return data;
}

function cleanScalar(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  return trimmed.replace(/^["']|["']$/g, "");
}
