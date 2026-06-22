#!/usr/bin/env node
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { listPosts, postSlug, readPost, rootDir } from "./lib.mjs";

const siteUrl = await readSiteUrl();
const excludedDocs = await readExcludedDocs();
const urls = new Set([siteUrl, new URL("writing/", siteUrl).toString()]);

for (const page of await listTopLevelPages()) {
  urls.add(new URL(page === "index" ? "" : `${page}/`, siteUrl).toString());
}

for (const file of await listPosts()) {
  const post = await readPost(file);
  if (post.data.draft === true) continue;
  const slug = postSlug(file, post.data);
  urls.add(new URL(`writing/${slug}/`, siteUrl).toString());
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...[...urls].sort().map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
  "</urlset>",
  ""
].join("\n");

const output = path.join(rootDir, "docs", "sitemap.xml");
await writeFile(output, xml, "utf8");
console.log(`Wrote ${path.relative(rootDir, output)}`);

async function readSiteUrl() {
  const mkdocs = await import("node:fs/promises").then((fs) =>
    fs.readFile(path.join(rootDir, "mkdocs.yml"), "utf8")
  );
  const match = mkdocs.match(/^site_url:\s*(.+)$/m);
  return (match?.[1] ?? "https://example.com/").trim().replace(/\/?$/, "/");
}

async function readExcludedDocs() {
  const mkdocs = await import("node:fs/promises").then((fs) =>
    fs.readFile(path.join(rootDir, "mkdocs.yml"), "utf8")
  );
  const match = mkdocs.match(/^exclude_docs:\s*\|\n((?:\s+.+\n?)*)/m);
  if (!match) return new Set();
  return new Set(
    match[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  );
}

async function listTopLevelPages() {
  const docsDir = path.join(rootDir, "docs");
  const entries = await readdir(docsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .filter((entry) => !excludedDocs.has(entry.name))
    .map((entry) => path.basename(entry.name, ".md"));
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
