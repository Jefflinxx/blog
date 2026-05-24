#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { postsDir, renderFrontmatter, slugify, today } from "./lib.mjs";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: npm run post:new -- "Post Title"');
  process.exit(1);
}

const date = today();
const slug = slugify(title);
const file = path.join(postsDir, `${date}-${slug}.md`);
const frontmatter = renderFrontmatter({
  title,
  date,
  description: "",
  categories: ["Notes"],
  tags: [],
  authors: ["you"],
  draft: true
});

const body = `# ${title}\n\nWrite the opening paragraph here. It should clearly state the main idea of the post.\n`;

await mkdir(postsDir, { recursive: true });
await writeFile(file, `${frontmatter}${body}`, { flag: "wx" });

console.log(file);
