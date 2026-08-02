# Oceanopedia

Static Astro replacement for oceanopedia.org, built with TypeScript, Tailwind CSS, and pnpm.

## Commands

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Publishing articles

Articles live in `src/content/articles/` as Markdown files. Add a file whose name is the desired URL slug and include this frontmatter:

```yaml
---
title: "Article title"
description: "A short summary for article listings and social previews."
publishedAt: "2026-08-02"
authors: ["Author Name"]
featuredImage: "/uploads/2026/08/featured-image.jpg"
featuredImageAlt: "A useful description of the image"
---
```

Store article media under `public/uploads/`.
