# ホテルグランドトーヤ 公式サイト（Astro + React + 多言語対応 + Decap CMS）

日本語 / English / 中文 / 한국어 の4言語対応。コンテンツはすべて [Decap CMS](https://decapcms.org/) から編集できる構成になっています。

## セットアップ

```bash
npm install
```

## ローカル開発

```bash
npm run dev
```

http://localhost:4321 で確認できます（`/` は自動的に `/ja/` へリダイレクトされます）。

## ビルド

```bash
npm run build
npm run preview
```

## 多言語構成

- `astro.config.mjs` の `i18n` 設定で `ja`（デフォルト） / `en` / `zh` / `ko` を定義。全言語URLに `/ja/`, `/en/`, `/zh/`, `/ko/` のプレフィックスが付きます。
- `src/pages/[lang]/index.astro` が4言語ぶんの静的ページを生成し、`src/content/**/*.{locale}.json` からコンテンツを取得します。
- ページを追加する場合も同様に `src/pages/[lang]/xxx.astro` の形式で作成し、`getStaticPaths` で `locales` をループしてください。

## コンテンツ管理（Decap CMS）

### 構成

- 管理画面: `public/admin/index.html`（ビルド後は `/admin` からアクセス）
- 設定ファイル: `public/admin/config.yml`
- コンテンツ実体: `src/content/**/*.json`（Astro Content Collectionsとしてスキーマ検証されます。スキーマ定義は `src/content/config.ts`）

Decap CMSの [i18n機能](https://decapcms.org/docs/i18n/)（`structure: multiple_files`）を使用しており、CMS上で1つの記事として編集すると、言語ごとに `xxx.ja.json` / `xxx.en.json` / `xxx.zh.json` / `xxx.ko.json` が生成・更新されます。これがそのままAstroのContent Collectionsに読み込まれます。

コレクション一覧:

| CMS上の名称             | 内容                                                                | 実体パス                                          |
| ----------------------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| サイト設定              | サイトタイトル・住所・電話・フッター文言                            | `src/content/site/site.{locale}.json`             |
| ナビゲーション          | ヘッダー・ドロワーのメニュー項目                                    | `src/content/navigation/navigation.{locale}.json` |
| ヒーローセクション      | トップのファーストビュー                                            | `src/content/hero/hero.{locale}.json`             |
| トップページ セクション | コンセプト・客室・温泉・お料理・館内（5項目、フォルダコレクション） | `src/content/top-sections/{slug}.{locale}.json`   |
| アクセスセクション      | アクセス・周辺観光                                                  | `src/content/access/access.{locale}.json`         |

画像パスやリンク先URL、アイコン文字など「言語に依存しない項目」は `i18n: duplicate` を指定し、CMS上では各言語で同じ値が複製されます（誤って言語ごとにバラバラの画像・リンクにならないようにするためです）。

### バックエンド設定（必須）

`public/admin/config.yml` の以下を必ず環境に合わせて変更してください。

```yaml
backend:
  name: github
  repo: your-org/your-repo # ← 実際のリポジトリ名（owner/repo）に置き換える
  branch: main
```

GitHub backendを使う場合、Decap CMSの認証には OAuth クライアントが必要です。

- **Netlifyでホスティングする場合**: Netlifyの「Identity + Git Gateway」または「GitHub OAuth」を有効にするだけで動作します（[Decap CMS公式ドキュメント](https://decapcms.org/docs/github-backend/)参照）。
- **Netlify以外（Vercel等）でホスティングする場合**: 別途 [decap-cms-oauth-provider](https://decapcms.org/docs/external-oauth-clients/) 等でOAuthプロキシを自前で用意する必要があります。

### ローカルでの動作確認

`local_backend: true` を指定しているため、ローカルでは以下の2つを同時に起動することでGit認証なしにCMSの動作確認ができます。

```bash
# ターミナル1: ローカルGitプロキシ
npm run cms

# ターミナル2: Astro開発サーバー
npm run dev
```

その後 http://localhost:4321/admin/index.html# にアクセスすると、ローカルのGitリポジトリに直接コミットする形でCMSを試せます（本番投入前の動作確認用。本番のGitHub backend認証とは別物です）。

## 構成

- `src/pages/[lang]/index.astro` … トップページ（言語ごとに生成、各セクションを組み立て）
- `src/pages/index.astro` … `/` → `/ja/` へのリダイレクト
- `src/content/` … Decap CMSが編集するコンテンツ本体（JSON、Content Collectionsでスキーマ検証）
- `src/components/top/*.tsx` … 各セクションのReactコンポーネント（すべてprops駆動、テキストのハードコードなし）
  - `Header.tsx` はナビ開閉のstateを持つため `client:load` でハイドレーション
  - それ以外は静的表示のみのためJSは出力されません（コスト最小化）
- `src/layouts/Layout.astro` … 共通レイアウト（`<head>`・Header・Footerの組み立て、hreflang出力）
- `src/styles/global.css` … 元サイトのCSSをそのまま移植
- `public/admin/` … Decap CMS管理画面
- `public/assets/` … 画像・テクスチャ（ビルド時にそのままコピーされます）
