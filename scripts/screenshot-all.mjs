import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl = 'http://localhost:4321';
const lang = 'ja';

// サイト内の主要ページを列挙(実際のルートに合わせて調整)
const pages = ['', 'rooms', 'onsen', 'cuisine', 'facilities', 'access', 'faq'];

const outDir = 'screenshots';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const path of pages) {
  const url = `${baseUrl}/${lang}/${path ? path + '/' : ''}`;
  console.log(`撮影中: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle' });
  const name = path || 'top';
  await page.screenshot({
    path: `${outDir}/${name}.png`,
    fullPage: true, // ページ全体を1枚に(スクロール含む全体像)
  });
}

await browser.close();
console.log(`完了: ${outDir}/ に ${pages.length}枚保存しました`);
