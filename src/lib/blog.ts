import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export async function getPosts() {
  return (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

export function postUrl(post: Post) {
  return `/${post.data.abbrlink}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function readingTime(post: Post) {
  const text = (post.body ?? '').replace(/```[\s\S]*?```|<[^>]+>|[#>*_`\[\]()-]/g, '');
  const han = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const words = (text.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.ceil((han + words * 1.5) / 350));
}

export function countValues(posts: Post[], key: 'tags' | 'categories') {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const value of post.data[key]) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));
}
