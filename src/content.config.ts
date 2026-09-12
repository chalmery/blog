import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const stringList = z.union([z.string(), z.array(z.string())]).transform((value) =>
  Array.isArray(value) ? value : [value],
);

// YAML 会把无时区日期解析为 UTC；旧 Hexo 文章写的是上海本地时间。
const shanghaiDate = z.preprocess((value) => {
  if (value instanceof Date) return new Date(value.valueOf() - 8 * 60 * 60 * 1000);
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.test(value)) {
    return new Date(`${value.replace(' ', 'T')}+08:00`);
  }
  return value;
}, z.coerce.date());

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: shanghaiDate,
    updated: shanghaiDate.optional(),
    abbrlink: z.union([z.string(), z.number()]).transform(String),
    categories: stringList.default(['未分类']),
    tags: stringList.default([]),
    toc: z.boolean().optional(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
