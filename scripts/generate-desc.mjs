#!/usr/bin/env node
import path from "node:path";
import { excerpt, firstParagraph, listPosts, readPost, rootDir, writePost } from "./lib.mjs";

const shouldWrite = process.argv.includes("--write");
let changed = 0;

for (const file of await listPosts()) {
  const post = await readPost(file);
  if (post.data.description) continue;

  const paragraph = firstParagraph(post.body);
  if (!paragraph) continue;

  const description = excerpt(paragraph);
  const rel = path.relative(rootDir, file);
  console.log(`${rel}: ${description}`);

  if (shouldWrite) {
    await writePost(file, { ...post.data, description }, post.body);
    changed += 1;
  }
}

if (!shouldWrite) {
  console.log("Run with --write to update files.");
} else {
  console.log(`Updated ${changed} post(s).`);
}
