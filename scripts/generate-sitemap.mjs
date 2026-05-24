#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { listPosts, readPost, rootDir, slugify } from "./lib.mjs";

const siteUrl = await readSiteUrl();
const urls = [siteUrl, new URL("writing/", siteUrl).toString()];

for (const file of await listPosts()) {
  const post = await readPost(file);
  if (post.data.draft === true) continue;
  const slug = slugify(post.data.title ?? path.basename(file, ".md"));
  urls.push(new URL(`writing/${slug}/`, siteUrl).toString());
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
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

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
