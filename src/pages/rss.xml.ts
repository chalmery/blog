import rss from '@astrojs/rss';
import { getPosts, postUrl } from '../lib/blog';

export async function GET(context: { site: URL }) {
  const posts = await getPosts();
  return rss({
    title: 'chalmery',
    description: '这里记录技术，也记录生活；整理已经明白的，探索仍然困惑的。',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? (post.body ?? '').replace(/```[\s\S]*?```|<[^>]+>|[#>*_`\[\]()-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180),
      link: postUrl(post),
    })),
  });
}
