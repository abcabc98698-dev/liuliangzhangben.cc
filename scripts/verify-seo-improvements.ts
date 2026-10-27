import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('site/.vitepress/dist');
const allHtml: string[] = [];

function walk(dir: string) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (f.endsWith('.html')) allHtml.push(full);
  }
}
walk(distDir);

console.log(`[VERIFY] 扫描产物目录，共发现 ${allHtml.length} 个 HTML 页面`);

// 1. 结构化数据 Schema.org 检查
let filesWithJsonLd = 0;
let totalSchemas = 0;
let breadcrumbCount = 0;
let articleCount = 0;
let websiteCount = 0;
let orgCount = 0;

for (const f of allHtml) {
  const content = fs.readFileSync(f, 'utf8');
  const scripts = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  if (scripts && scripts.length > 0) {
    filesWithJsonLd++;
    for (const s of scripts) {
      totalSchemas++;
      try {
        const jsonStr = s.replace(/<script type="application\/ld\+json">/i, '').replace(/<\/script>/i, '');
        const parsed = JSON.parse(jsonStr);
        if (parsed['@type'] === 'BreadcrumbList') breadcrumbCount++;
        if (parsed['@type'] === 'TechArticle' || parsed['@type'] === 'Article') articleCount++;
        if (parsed['@type'] === 'WebSite') websiteCount++;
        if (parsed['@type'] === 'Organization') orgCount++;
      } catch (e) {
        console.error('JSON-LD parse error in file:', f);
      }
    }
  }
}

console.log(`[SCHEMA] 包含 JSON-LD 结构化数据的页面: ${filesWithJsonLd} / ${allHtml.length}`);
console.log(`[SCHEMA] 结构化数据类型分布: BreadcrumbList(${breadcrumbCount}), Article(${articleCount}), WebSite(${websiteCount}), Organization(${orgCount})`);

// 2. 描述重复度检查
const descMap: Record<string, string[]> = {};
for (const f of allHtml) {
  const content = fs.readFileSync(f, 'utf8');
  const m = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (m) {
    const desc = m[1].trim();
    const rel = path.relative(distDir, f).replace(/\\/g, '/');
    descMap[desc] = descMap[desc] || [];
    descMap[desc].push(rel);
  }
}

const dupDescs = Object.entries(descMap).filter(([_, files]) => files.length > 1);
console.log(`[DESCRIPTION] 重复 Description 组数: ${dupDescs.length}`);
if (dupDescs.length > 0) {
  dupDescs.forEach(([desc, files]) => console.log(`  - 重复组 (${files.length}个): "${desc.slice(0, 30)}..." -> ${files.join(', ')}`));
}

// 3. 孤立页面与内部链接入度检查
const internalLinksInDegree: Record<string, number> = {};
for (const f of allHtml) {
  const rel = '/' + path.relative(distDir, f).replace(/\\/g, '/').replace(/index\.html$/, '');
  internalLinksInDegree[rel] = 0;
}

for (const f of allHtml) {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.matchAll(/<a\s+[^>]*href=["'](\/[^"']*)["'][^>]*>/gi);
  for (const m of matches) {
    let target = m[1].split('#')[0].split('?')[0];
    if (target !== '' && !target.endsWith('/')) target += '/';
    if (internalLinksInDegree[target] !== undefined) {
      internalLinksInDegree[target]++;
    }
  }
}

const zeroInDegree = Object.entries(internalLinksInDegree).filter(([url, deg]) => deg === 0 && !url.includes('404'));
console.log(`[ORPHAN] 孤立页面数量（入度为0且非404页）: ${zeroInDegree.length}`);
console.log(`[SUPPORT IN-DEGREE] /about/ 入度: ${internalLinksInDegree['/about/']}, /privacy/ 入度: ${internalLinksInDegree['/privacy/']}, /methodology/ 入度: ${internalLinksInDegree['/methodology/']}`);

// 4. 作者署名检查
let articlesWithByline = 0;
for (const f of allHtml) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('author-byline') || content.includes('流量账本度量研究组')) {
    articlesWithByline++;
  }
}
console.log(`[EEAT BYLINE] 包含责任编辑与技术复核署名的页面: ${articlesWithByline}`);

// 5. Logo 属性检查
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const logoMatch = indexHtml.match(/<img[^>]*class=["'][^"']*logo[^"']*["'][^>]*>/i);
console.log(`[LOGO TAG]`, logoMatch ? logoMatch[0] : '未找到 Logo 标签');
