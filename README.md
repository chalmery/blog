# chalmery

基于 [Astro](https://astro.build/) 的纯静态个人博客。默认输出 HTML 和 CSS，不向浏览器发送 JavaScript。

## 本地开发

需要 Node.js 24 或更高版本。

```sh
npm install
npm run dev
```

生产构建与预览：

```sh
npm run build
npm run preview
```

## 写文章

在 `src/content/blog/` 新建 Markdown 文件，frontmatter 示例：

```yaml
---
title: 文章标题
categories: 思考
tags:
  - 日常
abbrlink: 1234567890
date: 2026-09-12 12:00:00
updated: 2026-09-12 12:00:00
---
```

`abbrlink` 是文章的永久链接，必须保持唯一。现有文章沿用 Hexo 生成的数字链接，因此迁移后旧 URL 不会改变。

## 部署

推送 `main` 分支后，GitHub Actions 会构建 `dist/`，再通过仓库 Secret `GH_PAGES_DEPLOY_KEY` 发布到 `chalmery/chalmery.github.io` 的 `master` 分支。
