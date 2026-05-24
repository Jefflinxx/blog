# Blog

A writing-first personal blog built with MkDocs Material and JavaScript authoring tools.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Node.js is used for local authoring scripts:

```bash
npm run post:new -- "Post Title"
npm run seo:check
npm run dev
```

## Structure

- `docs/writing/posts/`: Markdown posts
- `scripts/`: JavaScript authoring and SEO tools
- `mkdocs.yml`: site config
- `AGENTS.md`: AI editing rules

## Before Publishing

```bash
npm run seo:check
npm run sitemap:generate
npm run build
```
