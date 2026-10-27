import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('site/.vitepress/dist');
let total = 0;
let missingH1: string[] = [];
let multipleH1: string[] = [];
let missingTitle: string[] = [];
let missingDesc: string[] = [];
let missingCanon: string[] = [];
let multipleCanon: string[] = [];

function walk(dir: string) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (f.endsWith('.html')) {
      total++;
      const text = fs.readFileSync(full, 'utf8');
      const rel = path.relative(distDir, full).replace(/\\/g, '/');

      const h1s = text.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
      if (h1s.length === 0) missingH1.push(rel);
      if (h1s.length > 1) multipleH1.push(rel);

      const titles = text.match(/<title[^>]*>[\s\S]*?<\/title>/gi) || [];
      if (titles.length === 0) missingTitle.push(rel);

      const descs = text.match(/<meta\s+name=["']description["']/gi) || [];
      if (descs.length === 0) missingDesc.push(rel);

      const canons = text.match(/<link\s+[^>]*rel=["']canonical["']/gi) || [];
      if (canons.length === 0) missingCanon.push(rel);
      if (canons.length > 1) multipleCanon.push(rel);
    }
  }
}

walk(distDir);

console.log(`[CHECK] 扫描总数: ${total} 个 HTML 页面`);
console.log(`[CHECK] 缺少 H1: ${missingH1.length} (${missingH1.join(', ') || '无'})`);
console.log(`[CHECK] 多个 H1: ${multipleH1.length} (${multipleH1.join(', ') || '无'})`);
console.log(`[CHECK] 缺少 Title: ${missingTitle.length} (${missingTitle.join(', ') || '无'})`);
console.log(`[CHECK] 缺少 Description: ${missingDesc.length} (${missingDesc.join(', ') || '无'})`);
console.log(`[CHECK] 缺少 Canonical: ${missingCanon.length} (${missingCanon.join(', ') || '无'})`);
console.log(`[CHECK] 多个 Canonical: ${multipleCanon.length} (${multipleCanon.join(', ') || '无'})`);
