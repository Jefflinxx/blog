# Blog Agent Guide

This project is a writing-first personal blog built with MkDocs Material.

我大量參考：https://github.com/jxnl/blog/ 的架構。

## Goals

- Keep the article system simple and durable.
- Prefer Markdown posts with complete frontmatter.
- Preserve SEO metadata and stable published URLs.
- Use JavaScript scripts for local authoring tools.
- Maintain an internal content map so AI can reason about existing posts.
- Add internal links only when they help the reader continue a natural path.

## Important Paths

- `docs/writing/posts/`: published and draft posts.
- `docs/writing/index.md`: writing index page.
- `mkdocs.yml`: site navigation, SEO, RSS, and plugin configuration.
- `scripts/`: Node.js authoring and SEO utilities.
- `docs/stylesheets/extra.css`: visual customization.
- `content-map.json`: generated article map for SEO and cross-link analysis.

## Post Rules

Every post must include:

```yaml
---
title: "Post Title"
date: 2026-05-24
description: "A clear 50-160 character summary for search and sharing."
categories:
  - Notes
tags:
  - blog
authors:
  - you
draft: false
---
```

- Use `YYYY-MM-DD-title-slug.md` filenames.
- Do not rename a published post unless you also create a redirect.
- Keep `description` human-written when possible.
- Use `draft: true` for unfinished posts.
- Keep headings descriptive and scannable.
- Add `<!-- more -->` after the opening excerpt once the post is ready.
- Prefer one clear category and a small set of useful tags.

## Commands

- Create a post: `npm run post:new -- "Post Title"`
- Check SEO metadata: `npm run seo:check`
- Generate missing descriptions: `npm run desc:generate -- --write`
- Generate sitemap XML: `npm run sitemap:generate`
- Generate AI-readable content map: `npm run content-map:generate`
- Suggest internal cross-links: `npm run crosslink:suggest`
- Run locally: `npm run dev`
- Build: `npm run build`

## Cross-Linking Workflow

This follows the pattern from `jxnl/blog`: summarize the existing content, then let an agent reason over the map before adding links.

1. Run `npm run content-map:generate`.
2. Run `npm run crosslink:suggest` or inspect `content-map.json` manually.
3. Add 2-5 internal links only when they provide genuine reader value.
4. Use relative Markdown links to other posts, for example `./2026-05-24-first-post.md`.
5. Use descriptive anchor text. Avoid vague anchors like "click here" or "this post".
6. Do not link every keyword. A link should answer "what would the reader want next?"

Useful internal-link patterns:

- Foundational: link to a basic concept when a post assumes it.
- Sequential: link posts that form a learning path.
- Complementary: link a related post that covers a different angle.
- Case study: link to a concrete example when discussing an abstract idea.

## Editing Guidance

- Make small, focused edits.
- Do not change site design unless explicitly asked.
- Do not add a heavy framework unless there is a concrete need.
- Keep scripts dependency-light.
- Prefer structured frontmatter changes over ad hoc string edits.

# 我的規則

- 如果我請你幫我寫入文章時，不要自動化部署，除非我叫你部署。