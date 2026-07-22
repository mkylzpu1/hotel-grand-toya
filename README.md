# ホテルグランドトーヤ 公式サイト（Astro + React）

## セットアップ

```bash
npm install
```

## ローカル開発

```bash
npm run dev
```

http://localhost:4321 で確認できます。

## ビルド

```bash
npm run build
npm run preview
```

## 構成

- `src/pages/index.astro` … トップページ（各セクションを組み立て）
- `src/components/*.jsx` … 各セクションのReactコンポーネント
  - `HeaderHero.jsx` はナビ開閉のstateを持つため `client:load` でハイドレーション
  - それ以外は静的表示のみのためJSは出力されません（コスト最小化）
- `src/layouts/Layout.astro` … 共通レイアウト（`<head>`など）
- `src/styles/global.css` … 元サイトのCSSをそのまま移植
- `public/assets/` … 画像・テクスチャ（ビルド時にそのままコピーされます）
