#!/usr/bin/env node
import path from "node:path";
import { listPosts, readPost, rootDir, slugify } from "./lib.mjs";

const required = ["title", "date", "description", "categories", "tags", "authors"];
const failures = [];

for (const file of await listPosts()) {
  const post = await readPost(file);
  const rel = path.relative(rootDir, file);

  for (const key of required) {
    const value = post.data[key];
    if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
      failures.push(`${rel}: missing ${key}`);
    }
  }

  const description = post.data.description ?? "";
  const minDescriptionLength = /[\u3400-\u9fff]/.test(description) ? 25 : 50;
  if (description && (description.length < minDescriptionLength || description.length > 160)) {
    failures.push(`${rel}: description should be ${minDescriptionLength}-160 characters`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(post.data.date ?? ""))) {
    failures.push(`${rel}: date should use YYYY-MM-DD`);
  }

  const expectedSlugPart = post.data.slug ?? slugify(post.data.title ?? "");
  if (expectedSlugPart && !path.basename(file, ".md").includes(expectedSlugPart)) {
    failures.push(`${rel}: filename slug does not match title`);
  }
}

if (failures.length > 0) {
  console.error("SEO check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("SEO check passed.");
