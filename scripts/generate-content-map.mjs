#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import path from "node:path";
import {
  contentHash,
  excerpt,
  firstParagraph,
  listPosts,
  markdownToPlainText,
  postSlug,
  readPost,
  rootDir,
  topTerms
} from "./lib.mjs";

const entries = {};

for (const file of await listPosts()) {
  const post = await readPost(file);
  const rel = path.relative(rootDir, file);
  const plain = markdownToPlainText(post.body);
  const summary = post.data.description || excerpt(firstParagraph(post.body) || plain, 220);

  entries[rel] = {
    title: post.data.title ?? path.basename(file, ".md"),
    slug: postSlug(file, post.data),
    url: `/writing/${postSlug(file, post.data)}/`,
    date: post.data.date ?? null,
    draft: post.data.draft === true,
    categories: post.data.categories ?? [],
    tags: post.data.tags ?? [],
    summary,
    terms: topTerms(`${post.data.title ?? ""} ${summary} ${plain}`),
    hash: contentHash(post.source)
  };
}

const output = path.join(rootDir, "content-map.json");
await writeFile(output, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(rootDir, output)} with ${Object.keys(entries).length} post(s).`);
