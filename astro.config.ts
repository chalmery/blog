import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    locales: ["zh"],
    defaultLocale: "zh",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
  redirects: {
    "/1991895274": "/posts/1991895274/",
    "/2750220333": "/posts/2750220333/",
    "/1290989454": "/posts/1290989454/",
    "/2024009606": "/posts/2024009606/",
    "/1984631303": "/posts/1984631303/",
    "/1239163162": "/posts/1239163162/",
    "/3073513525": "/posts/3073513525/",
    "/2427860074": "/posts/2427860074/",
    "/1698904213": "/posts/1698904213/",
    "/4078686809": "/posts/4078686809/",
    "/2402782093": "/posts/2402782093/",
    "/379577363": "/posts/379577363/",
    "/2861842578": "/posts/2861842578/",
    "/2690763544": "/posts/2690763544/",
    "/503294022": "/posts/503294022/",
    "/2520100274": "/posts/2520100274/",
    "/1839521991": "/posts/1839521991/",
    "/2260828129": "/posts/2260828129/",
    "/3542956005": "/posts/3542956005/",
    "/1069363226": "/posts/1069363226/",
  },
});
