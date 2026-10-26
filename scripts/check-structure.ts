import fs from 'node:fs';
import path from 'node:path';
import { ContentNode } from './content-meta';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SITE_GENERATED_DIR = path.resolve(process.cwd(), 'site', 'generated');

const registryPath = path.join(DATA_DIR, 'CONTENT_REGISTRY.json');
if (!fs.existsSync(registryPath)) {
  console.error('[FAIL] CONTENT_REGISTRY.json 不存在');
  process.exit(1);
}

const nodes: ContentNode[] = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

console.log(`[CHECK] 正在核验全站 560 节点结构规范...`);

const ids = new Set<string>();
const urls = new Set<string>();
let missingFiles = 0;

let homeCount = 0;
let catCount = 0;
let subCount = 0;
let clusterCount = 0;
let articleCount = 0;

for (const n of nodes) {
  // 1. 唯一性校验
  if (ids.has(n.id)) {
    console.error(`[FAIL] 发现重复节点 ID: ${n.id}`);
    process.exit(1);
  }
  ids.add(n.id);

  if (urls.has(n.url)) {
    console.error(`[FAIL] 发现重复 URL: ${n.url}`);
    process.exit(1);
  }
  urls.add(n.url);

  // 2. 统计分类层级
  if (n.type === 'home') homeCount++;
  else if (n.type === 'category') catCount++;
  else if (n.type === 'subcategory') subCount++;
  else if (n.type === 'cluster') clusterCount++;
  else if (n.type === 'article') articleCount++;

  // 3. 检查 generated 物理文件是否存在
  let relDir = n.url.replace(/^\//, '').replace(/\/$/, '');
  let targetFile = relDir ? path.join(SITE_GENERATED_DIR, relDir, 'index.md') : path.join(SITE_GENERATED_DIR, 'index.md');

  if (!fs.existsSync(targetFile)) {
    console.error(`[FAIL] 缺失物理正文文件: ${targetFile}`);
    missingFiles++;
  }
}

console.log(`[INFO] 统计汇总: 首页(${homeCount}), 一级专题(${catCount}), 二级子专题(${subCount}), 三级集群(${clusterCount}), 独立文章(${articleCount})`);
console.log(`[INFO] 总节点数: ${nodes.length}`);

if (homeCount !== 1 || catCount !== 13 || subCount !== 26 || clusterCount !== 104 || articleCount !== 416) {
  console.error(`[FAIL] 节点数量与结构要求不符！预期: 1+13+26+104+416 = 560`);
  process.exit(1);
}

if (missingFiles > 0) {
  console.error(`[FAIL] 存在 ${missingFiles} 个缺失物理文件`);
  process.exit(1);
}

console.log('[PASS] 全站 560 个节点结构、唯一 ID、唯一规范 URL 及物理文件全部校验通过！');
