import { defineSumiConfig } from "./src/types/config";

export default defineSumiConfig({
  site: {
    url: "https://chalmery.github.io/",
    title: "chalmery",
    description: "风物长宜放眼量，熬过寒冬便是春。",
    author: "chalmery",
    profile: "https://github.com/chalmery",
    avatar: "https://img-yangcc.oss-cn-beijing.aliyuncs.com/mine/avatar.jpg",
    favicon: "https://img-yangcc.oss-cn-beijing.aliyuncs.com/mine/coffee.svg",
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
