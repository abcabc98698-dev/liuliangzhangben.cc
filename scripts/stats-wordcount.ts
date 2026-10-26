import fs from 'node:fs';
import path from 'node:path';
import { ContentNode } from './content-meta';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SITE_GENERATED_DIR = path.resolve(process.cwd(), 'site', 'generated');

const registryPath = path.join(DATA_DIR, 'CONTENT_REGISTRY.json');
const nodes: ContentNode[] = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

let articleCount = 0;
let clusterCount = 0;
let subcategoryCount = 0;
let categoryCount = 0;

let articleChineseChars: number[] = [];
let articleTotalChars: number[] = [];
let clusterChineseChars: number[] = [];
let clusterTotalChars: number[] = [];

const catStats: Record<string, { zh: number[]; total: number[] }> = {};

for (const n of nodes) {
  let relDir = n.url.replace(/^\//, '').replace(/\/$/, '');
  let targetFile = relDir ? path.join(SITE_GENERATED_DIR, relDir, 'index.md') : path.join(SITE_GENERATED_DIR, 'index.md');

  if (!fs.existsSync(targetFile)) continue;
  const rawMd = fs.readFileSync(targetFile, 'utf-8');
  const body = rawMd.replace(/^---[\s\S]*?---/, '');
  const zh = (body.match(/[\u4e00-\u9fa5]/g) || []).length;
  const total = body.length;

  if (n.type === 'article') {
    articleCount++;
    articleChineseChars.push(zh);
    articleTotalChars.push(total);

    const cat = n.category || 'unknown';
    if (!catStats[cat]) catStats[cat] = { zh: [], total: [] };
    catStats[cat].zh.push(zh);
    catStats[cat].total.push(total);
  } else if (n.type === 'cluster') {
    clusterCount++;
    clusterChineseChars.push(zh);
    clusterTotalChars.push(total);
  } else if (n.type === 'subcategory') {
    subcategoryCount++;
  } else if (n.type === 'category') {
    categoryCount++;
  }
}

function avg(arr: number[]) {
  return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
}

console.log('--- 内容规模统计 ---');
console.log(`文章 (Article) 数量: ${articleCount}`);
console.log(`文章中文字数: Min=${Math.min(...articleChineseChars)}, Max=${Math.max(...articleChineseChars)}, Avg=${avg(articleChineseChars)}`);
console.log(`文章总字符数 (含英文/公式/代码/标点): Min=${Math.min(...articleTotalChars)}, Max=${Math.max(...articleTotalChars)}, Avg=${avg(articleTotalChars)}`);
console.log('--------------------');
console.log(`三级聚合页 (Cluster) 数量: ${clusterCount}`);
console.log(`三级聚合页中文字数: Min=${Math.min(...clusterChineseChars)}, Max=${Math.max(...clusterChineseChars)}, Avg=${avg(clusterChineseChars)}`);
console.log(`三级聚合页总字符数: Min=${Math.min(...clusterTotalChars)}, Max=${Math.max(...clusterTotalChars)}, Avg=${avg(clusterTotalChars)}`);
console.log('--------------------');
console.log('各专题文章字数均值 breakdown:');
for (const [cat, s] of Object.entries(catStats)) {
  console.log(`  [${cat.padEnd(12)}] 汉字均值: ${avg(s.zh)}, 总字符均值: ${avg(s.total)} (样本: ${s.zh.length}篇)`);
}
