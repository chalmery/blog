import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://chalmery.github.io',
  publicDir: './static',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'min-light', dark: 'night-owl' },
      defaultColor: false,
    },
  },
});
