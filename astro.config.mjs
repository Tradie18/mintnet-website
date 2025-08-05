import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://mint-network.co',
  integrations: [tailwind(), sitemap({
    filter: (page) => {
      // Exclude URLs with query parameters
      if (page.includes('?')) return false;
      
      return true;
    },
    changefreq: 'monthly',
    lastmod: new Date(),
    serialize(item) {
      // Set home page to highest priority
      if (item.url === 'https://mint-network.co/') {
        return {
          ...item,
          priority: 1.0,
          changefreq: 'monthly',
        };
      }
      
      return item;
    },
  }), react()],
  output: 'static',
  build: {
    // Assets path
    assets: 'assets',
    // Minify output
    minify: 'true'
  },
  vite: {
    // Add any Vite-specific configurations here
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {} // No need to manually chunk for this simple site
        }
      }
    }
  }
});