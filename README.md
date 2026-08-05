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

### バックエンド設定（必須）

`public/admin/config.yml` の以下を必ず環境に合わせて変更してください。

```yaml
backend:
  name: github
  repo: your-org/your-repo # ← 実際のリポジトリ名（owner/repo）に置き換える
  branch: main
```

### ローカルでの動作確認

`local_backend: true` を指定しているため、ローカルでは以下の2つを同時に起動することでGit認証なしにCMSの動作確認ができます。

```bash
# ターミナル1: ローカルGitプロキシ
npm run cms

# ターミナル2: Astro開発サーバー
npm run dev
```

その後 http://localhost:4321/admin/index.html# にアクセスすると、ローカルのGitリポジトリに直接コミットする形でCMSを試せます（本番投入前の動作確認用。本番のGitHub backend認証とは別物です）。
