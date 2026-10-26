import fs from 'node:fs';
import path from 'node:path';

const files = [
  'index.md',
  'records/index.md',
  'estimate/index.md',
  'multipliers/index.md',
  'reset/index.md',
  'payg/index.md',
  'high-data/index.md',
  'occasional/index.md',
  'video/index.md',
  'ai/index.md',
  'mobile/index.md',
  'devices/index.md',
  'reconcile/index.md',
  'knowledge/index.md'
];

console.log('=== 14 个顶级 Pillar Hub 详细字数统计 ===');
let totalChars = 0;
let totalHan = 0;

for (const f of files) {
  const p = path.join('content', f);
  const text = fs.readFileSync(p, 'utf-8');
  const hanCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  totalChars += text.length;
  totalHan += hanCount;
  console.log(`${f.padEnd(25)} 汉字数: ${hanCount.toString().padStart(6)} 字 | 总字符: ${text.length.toString().padStart(7)}`);
}

console.log('----------------------------------------------------');
console.log(`Pillar Hub 汉字总数: ${totalHan} 字 | 总字符数: ${totalChars}`);
