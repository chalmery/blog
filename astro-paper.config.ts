import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://chalmery.github.io/",
    title: "chalmery",
    description:
      "这里记录技术，也记录生活；整理已经明白的，探索仍然困惑的。",
    author: "chalmery",
    profile: "https://github.com/chalmery",
    ogImage: "avatar.jpg",
    lang: "zh",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 10,
    perIndex: 5,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: false,
  },
  socials: [
    { name: "github", url: "https://github.com/chalmery" },
    { name: "mail", url: "mailto:chaochaoycc@gmail.com" },
  ],
  shareLinks: [],
});
