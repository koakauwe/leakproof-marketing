import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: 'static',
  site: 'https://leakproofmarketing.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  adapter: cloudflare()
});