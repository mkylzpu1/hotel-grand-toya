#!/usr/bin/env node
// 変更されたja.jsonの「差分部分」だけを検出し、en/zh/koに機械翻訳を反映するスクリプト
// 手動で書き換えた既存の翻訳（差分に入らない部分）は上書きしません。

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

function shouldTranslate(key, value) {
  if (typeof value !== 'string') return false;
  if (SKIP_KEYS.has(key)) return false;
  if (/^https?:\/\//.test(value)) return false;
  if (/^\d+$/.test(value)) return false;
  if (value.trim().length <= 1) return false; // アイコン用の1文字漢字など
  return true;
}

// oldとnewを比較し、変更/追加されたリーフのパスと値を集める
function diffLeaves(oldObj, newObj, prefix = []) {
  const results = [];
  if (Array.isArray(newObj)) {
    newObj.forEach((item, i) => {
      const oldItem = Array.isArray(oldObj) ? oldObj[i] : undefined;
      results.push(...diffLeaves(oldItem, item, [...prefix, i]));
    });
  } else if (newObj && typeof newObj === 'object') {
    for (const key of Object.keys(newObj)) {
      const oldVal = oldObj && typeof oldObj === 'object' ? oldObj[key] : undefined;
      results.push(...diffLeaves(oldVal, newObj[key], [...prefix, key]));
    }
  } else if (typeof newObj === 'string') {
    if (newObj !== oldObj) {
      const lastKey = prefix[prefix.length - 1];
      if (shouldTranslate(typeof lastKey === 'string' ? lastKey : '', newObj)) {
        results.push({ path: prefix, value: newObj });
      }
    }
  }
  return results;
}

function getAtPath(obj, pathArr) {
  return pathArr.reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setAtPath(obj, pathArr, value, referenceObj) {
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
    const diffs = diffLeaves(oldJa, newJa);

    if (diffs.length === 0) {
      console.log('翻訳対象の変更なし');
      continue;
    }
    console.log(`${diffs.length}件の変更を検出`);

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

      for (const { path: p, value } of diffs) {
        const oldTargetValue = getAtPath(oldTarget, p);
        const newTargetValue = getAtPath(targetContent, p);

        // ★ここが追加ポイント★
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

      fs.mkdirSync(path.dirname(targetFile), { recursive: true });
      fs.writeFileSync(targetFile, JSON.stringify(targetContent, null, 2) + '\n', 'utf8');
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
