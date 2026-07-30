import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
// import sitemap from '@astrojs/sitemap'; // ビルドエラー(reduce of undefined)のため一時無効化。原因: baseパス+動的[lang]ルーティングとの相性問題と推測。公開前に再調査して有効化する。

const SITE = 'https://mkylzpu1.github.io';
const BASE = '/hotel-grand-toya/';

export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [
    react(),
    tailwind(),
    // sitemap({...}) // 一時無効化中
  ],
});
