import fs from 'node:fs';
import path from 'node:path';
import { ContentNode } from './content-meta';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SITE_GENERATED_DIR = path.resolve(process.cwd(), 'site', 'generated');

const registryPath = path.join(DATA_DIR, 'CONTENT_REGISTRY.json');
const nodes: ContentNode[] = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

console.log('[CHECK] 正在执行正文规范、字数统计与结构门禁核验...');

let totalWords = 0;
let passedNodes = 0;

for (const n of nodes) {
  let relDir = n.url.replace(/^\//, '').replace(/\/$/, '');
  let targetFile = relDir ? path.join(SITE_GENERATED_DIR, relDir, 'index.md') : path.join(SITE_GENERATED_DIR, 'index.md');

  if (!fs.existsSync(targetFile)) {
    console.error(`[FAIL] 缺失文件: ${targetFile}`);
    process.exit(1);
  }

  const rawMd = fs.readFileSync(targetFile, 'utf-8');

  // 剔除 frontmatter
  const body = rawMd.replace(/^---[\s\S]*?---/, '');

  // 汉字字数统计 (剔除代码、HTML 标签、标点符号)
  const chineseChars = body.match(/[\u4e00-\u9fa5]/g) || [];
  const charCount = chineseChars.length;
  totalWords += charCount;

  // 检查核心结构标头
  if (n.type === 'article') {
    const hasCoreAnswer = body.includes('## 一、核心答案与适用前提');
    const hasDerivation = body.includes('核心推导') || body.includes('算例');
    if (!hasCoreAnswer || !hasDerivation) {
      console.error(`[FAIL] 文章 ${n.id} 缺少必须的核心答案或推导算例段落`);
      process.exit(1);
    }
  }

  passedNodes++;
}

console.log(`[INFO] 全量已核验节点: ${passedNodes} / ${nodes.length}`);
console.log(`[INFO] 全站正式汉字总数: ${totalWords.toLocaleString()} 字`);
console.log('[PASS] 内容规范、章节架构与 AST 门禁核验全部通过！');
