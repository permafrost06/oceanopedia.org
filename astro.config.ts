import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";

export default defineConfig({
  site: "https://oceanopedia.org",
  trailingSlash: "always",
  server: {
    host: "0.0.0.0",
  },
  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeRaw,
        [rehypePrettyCode, { theme: "dracula", keepBackground: false }],
      ],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
