#!/usr/bin/env node
// 変更されたja.jsonの「差分部分」だけを検出し、en/zh/koに機械翻訳を反映するスクリプト
// 手動で書き換えた既存の翻訳（差分に入らない部分）は上書きしません。
//
// 追加仕様（画像パスの強制複製）:
// Decap CMSは widget: list に i18n: true を指定すると、その配下フィールドの
// i18n: duplicate 指定を無視してしまう既知の制限がある
// (公式ドキュメント: "List widgets only support i18n: true. i18n configuration
// on sub fields is ignored.")。そのため、リスト内の画像フィールド（例:
// access.sceneryItems[].img、facilities-page の各 items[].image.src など）が
// 他言語タブでも編集可能になり、意図せず ja と値がズレることがある。
// この対策として、値が画像ファイルパスに見える場合はキー名を問わず「翻訳」ではなく
// 「jaの値をそのまま複製」する。CMS側の設定ミスではなく、CMS本体の制限を
// スクリプト側で補うための処理。

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const TARGET_LOCALES = [
  { code: 'en', pair: 'ja|en' },
  { code: 'zh', pair: 'ja|zh-CN' },
  { code: 'ko', pair: 'ja|ko' },
];

// 翻訳しないキー名（URL・ID・アイコン文字・数値系など）
const SKIP_KEYS = new Set([
  'href',
  'url',
  'src',
  'img',
  'image',
  'icon',
  'id',
  'slug',
  'key',
  'code',
  'className',
  'place_id',
  'email',
  'tel',
  'fax',
  'postalCode',
  'reservationUrl',
  'reservationHref',
  'embedUrl',
  'openMapUrl',
  'routeUrl',
  'officialSite',
  'officialTimetableUrl',
  'mapEmbedUrl',
  'order',
  'recruitCount',
  'sectionId',
  'showDivider',
  'centerText',
  'tallImagePosition',
  'isFirstFloor',
  'isPartner',
  'isFeatured',
  'isImportant',
  'date',
  'status',
  'salaryType',
  'employmentType',
  'category', // ← 追加：enum固定値のため翻訳対象外
]);

// 画像ファイルパスかどうかを判定する（キー名ではなく値そのもので判定する）。
// この判定に一致した文字列は、キー名が何であれ「複製対象」として扱う。
function isImagePath(value) {
  if (typeof value !== 'string') return false;
  return /\.(jpe?g|png|gif|webp|svg|avif)(\?.*)?$/i.test(value.trim());
}

function shouldTranslate(key, value) {
  if (typeof value !== 'string') return false;
  if (SKIP_KEYS.has(key)) return false;
  // キー名に url / href が含まれる場合は個別登録なしで一律スキップ
  // (linkHref, secondaryLinkHref, reservationUrl など今後追加されるフィールドの対策漏れを防ぐ)
  if (/url/i.test(key) || /href$/i.test(key)) return false;
  if (/^https?:\/\//.test(value)) return false;
  if (/^\d+$/.test(value)) return false;
  // 画像ファイルパスは翻訳せず、複製対象として別途処理する（isImagePathに委譲）
  if (isImagePath(value)) return false;
  if (value.trim().length <= 1) return false; // アイコン用の1文字漢字など
  return true;
}

// oldとnewを比較し、変更/追加されたリーフを「翻訳対象」と「複製対象(画像パス)」に分けて集める
function collectDiffs(oldObj, newObj, prefix = []) {
  const translate = [];
  const duplicate = [];

  function walk(oldNode, newNode, currentPath) {
    if (Array.isArray(newNode)) {
      newNode.forEach((item, i) => {
        const oldItem = Array.isArray(oldNode) ? oldNode[i] : undefined;
        walk(oldItem, item, [...currentPath, i]);
      });
    } else if (newNode && typeof newNode === 'object') {
      for (const key of Object.keys(newNode)) {
        const oldVal = oldNode && typeof oldNode === 'object' ? oldNode[key] : undefined;
        walk(oldVal, newNode[key], [...currentPath, key]);
      }
    } else if (typeof newNode === 'string') {
      if (newNode !== oldNode) {
        if (isImagePath(newNode)) {
          duplicate.push({ path: currentPath, value: newNode });
          return;
        }
        const lastKey = currentPath[currentPath.length - 1];
        if (shouldTranslate(typeof lastKey === 'string' ? lastKey : '', newNode)) {
          translate.push({ path: currentPath, value: newNode });
        }
      }
    }
  }

  walk(oldObj, newObj, prefix);
  return { translate, duplicate };
}

function getAtPath(obj, pathArr) {
  return pathArr.reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setAtPath(obj, pathArr, value) {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const key = pathArr[i];
    const nextKeyIsIndex = typeof pathArr[i + 1] === 'number';
    if (cur[key] === undefined) {
      cur[key] = nextKeyIsIndex ? [] : {};
    }
    cur = cur[key];
  }
  cur[pathArr[pathArr.length - 1]] = value;
}

async function translateText(text, pair) {
  if (!text.trim()) return '';
  const url =
    'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + pair;
  const res = await fetch(url);
  const data = await res.json();
  const t = data?.responseData?.translatedText;
  if (!t || /MYMEMORY WARNING/i.test(t)) {
    throw new Error(`translate failed for "${text.slice(0, 20)}...": ${t}`);
  }
  return t;
}

function readJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function getOldJaContent(file, baseRef) {
  try {
    const out = execSync(`git show ${baseRef}:${file}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return JSON.parse(out);
  } catch {
    return {}; // 新規ファイル
  }
}

async function main() {
  const baseRef = process.env.BASE_REF || 'HEAD~1';
  const changedFiles = process.argv.slice(2);
  if (changedFiles.length === 0) {
    console.log('対象ファイルなし');
    return;
  }

  for (const jaFile of changedFiles) {
    if (!jaFile.endsWith('.ja.json')) continue;
    console.log(`\n--- ${jaFile} ---`);

    const newJa = readJsonSafe(jaFile);
    const oldJa = getOldJaContent(jaFile, baseRef);
    const { translate: diffs, duplicate: dupDiffs } = collectDiffs(oldJa, newJa);

    if (diffs.length === 0 && dupDiffs.length === 0) {
      console.log('翻訳・複製対象の変更なし');
      continue;
    }
    if (diffs.length > 0) console.log(`${diffs.length}件の翻訳対象の変更を検出`);
    if (dupDiffs.length > 0) console.log(`${dupDiffs.length}件の画像パス変更を検出（複製対象）`);

    for (const { code, pair } of TARGET_LOCALES) {
      const targetFile = jaFile.replace(/\.ja\.json$/, `.${code}.json`);
      const oldTarget = (() => {
        try {
          const out = execSync(`git show ${baseRef}:${targetFile}`, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'ignore'],
          });
          return JSON.parse(out);
        } catch {
          return {}; // 対象言語ファイルがまだ存在しない = 新規作成
        }
      })();
      const targetContent = readJsonSafe(targetFile);

      // --- 翻訳対象（従来どおり。手入力済みの場合はスキップする） ---
      for (const { path: p, value } of diffs) {
        const oldTargetValue = getAtPath(oldTarget, p);
        const newTargetValue = getAtPath(targetContent, p);

        // 対象言語側の同じ箇所が「このコミットで既に変わっている」＝人力で入力済みとみなしてスキップ
        if (newTargetValue !== oldTargetValue) {
          console.log(`  [${code}] ${p.join('.')}: 手入力済みとみなしスキップ`);
          continue;
        }

        try {
          const translated = await translateText(value, pair);
          setAtPath(targetContent, p, translated);
          console.log(
            `  [${code}] ${p.join('.')}: "${value.slice(0, 20)}..." -> "${translated.slice(0, 20)}..."`,
          );
        } catch (err) {
          console.warn(`  [${code}] 翻訳失敗（スキップ）: ${err.message}`);
        }
      }

      // --- 複製対象（画像パス。CMS上で他言語タブから書き換えられていても、
      //     jaの値で強制的に上書きして「言語共通」の状態に復元する） ---
      for (const { path: p, value } of dupDiffs) {
        const before = getAtPath(targetContent, p);
        setAtPath(targetContent, p, value);
        if (before !== value) {
          console.log(`  [${code}] ${p.join('.')}: 画像パスを複製 -> "${value}"（元: "${before}"）`);
        } else {
          console.log(`  [${code}] ${p.join('.')}: 画像パスは既に一致`);
        }
      }

      fs.mkdirSync(path.dirname(targetFile), { recursive: true });
      fs.writeFileSync(targetFile, JSON.stringify(targetContent, null, 2) + '\n', 'utf8');
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
