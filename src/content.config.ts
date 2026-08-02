import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    authors: z.array(z.string()).min(1),
    featuredImage: z.string(),
    featuredImageAlt: z.string().default(""),
  }),
});

export const collections = { articles };
