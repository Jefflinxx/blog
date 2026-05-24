#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  listPosts,
  markdownToPlainText,
  postSlug,
  readPost,
  rootDir,
  topTerms
} from "./lib.mjs";

const targetArg = process.argv[2];
const posts = await Promise.all((await listPosts()).map(readPost));
const contentMap = await loadContentMap();

for (const post of posts) {
  if (targetArg && !post.file.endsWith(targetArg)) continue;
  const currentRel = path.relative(rootDir, post.file);
  const currentText = `${post.data.title ?? ""} ${post.data.description ?? ""} ${markdownToPlainText(post.body)}`;
  const currentTerms = new Set(topTerms(currentText, 24));
  const existingLinks = new Set([...post.body.matchAll(/\]\((\.\/[^)]+\.md)\)/g)].map((match) => match[1]));

  const suggestions = Object.entries(contentMap)
    .filter(([rel, item]) => rel !== currentRel && item.draft !== true)
    .map(([rel, item]) => {
      const overlap = item.terms.filter((term) => currentTerms.has(term));
      const targetFile = path.basename(rel);
      return {
        rel,
        title: item.title,
        link: `./${targetFile}`,
        overlap,
        score: overlap.length + sharedListScore(post.data.categories, item.categories) + sharedListScore(post.data.tags, item.tags)
      };
    })
    .filter((item) => item.score > 0 && !existingLinks.has(item.link))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 5);

  console.log(`\n${currentRel}`);
  if (suggestions.length === 0) {
    console.log("  No obvious cross-link candidates yet.");
    continue;
  }

  for (const suggestion of suggestions) {
    const terms = suggestion.overlap.slice(0, 5).join(", ") || "shared category/tag";
    console.log(`  - ${suggestion.title}`);
    console.log(`    link: ${suggestion.link}`);
    console.log(`    why: ${terms}`);
  }
}

async function loadContentMap() {
  const file = path.join(rootDir, "content-map.json");
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    console.error("content-map.json not found. Run `npm run content-map:generate` first.");
    process.exit(1);
  }
}

function sharedListScore(left = [], right = []) {
  const rightSet = new Set(right);
  return left.filter((item) => rightSet.has(item)).length * 2;
}
