import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('site/.vitepress/dist');
const htmlFiles: string[] = [];

function walk(dir: string) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (f.endsWith('.html')) {
      htmlFiles.push(full);
    }
  }
}
walk(distDir);

console.log('--- 1. 文件统计 ---');
console.log('Total HTML files in dist:', htmlFiles.length);

// 1. Robots.txt
console.log('\n--- 2. Robots.txt 检查 ---');
const robotsDist = path.join(distDir, 'robots.txt');
if (fs.existsSync(robotsDist)) {
  const robotsText = fs.readFileSync(robotsDist, 'utf8');
  console.log('robots.txt exists.');
  console.log('Has Disallow: / ?', /Disallow:\s*\/\s*$/m.test(robotsText));
  console.log('Explicit Googlebot:', /User-agent:\s*Googlebot/i.test(robotsText));
  console.log('Explicit Bingbot:', /User-agent:\s*Bingbot/i.test(robotsText));
  console.log('Explicit Baiduspider:', /User-agent:\s*Baiduspider/i.test(robotsText));
  console.log('Explicit yisouspider:', /User-agent:\s*yisouspider/i.test(robotsText));
  console.log('Sitemap line:', (robotsText.match(/Sitemap:\s*.+/i) || [])[0]);
} else {
  console.log('robots.txt NOT found in dist!');
}

// 2. Canonical & Noindex & Schema & Outbound links & Empty links
console.log('\n--- 3. 全页面 HTML 深入扫描 ---');
let canonicalCount = 0;
const canonicalErrors: { file: string; href: string; reason: string }[] = [];
const noindexPages: string[] = [];
let schemaCount = 0;
const schemaTypes: Record<string, number> = {};
const outboundLinks: { page: string; href: string; rel: string; isSponsored: boolean }[] = [];
let emptyHrefs = 0;
let hashHrefs = 0;
const mixedContent: { page: string; src: string }[] = [];
const titles: Map<string, string[]> = new Map();
const descriptions: Map<string, string[]> = new Map();
const h1s: Map<string, string[]> = new Map();
const internalGraph: Map<string, Set<string>> = new Map();

for (const file of htmlFiles) {
  const rel = path.relative(distDir, file).replace(/\\/g, '/');
  const urlPath = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
  const normUrl = urlPath.endsWith('/') ? urlPath : urlPath + '/';
  internalGraph.set(normUrl, new Set());

  const content = fs.readFileSync(file, 'utf8');

  // Canonical
  const canonMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
                     content.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  if (canonMatch) {
    canonicalCount++;
    const href = canonMatch[1];
    if (!href.startsWith('https://liuliangzhangben.cc')) {
      canonicalErrors.push({ file: rel, href, reason: 'not formal domain' });
    }
  } else {
    canonicalErrors.push({ file: rel, href: 'none', reason: 'missing canonical' });
  }

  // Noindex
  if (/<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(content) ||
      /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(content)) {
    noindexPages.push(rel);
  }

  // Mixed content (http:// images or scripts)
  const httpMatches = content.match(/<(?:img|script|link)[^>]+(?:src|href)=["']http:\/\/[^"']+["']/gi);
  if (httpMatches) {
    for (const m of httpMatches) {
      mixedContent.push({ page: rel, src: m });
    }
  }

  // Title, Desc, H1
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    const t = titleMatch[1].trim();
    if (!titles.has(t)) titles.set(t, []);
    titles.get(t)!.push(rel);
  }
  const descMatch = content.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i);
  if (descMatch) {
    const d = descMatch[1].trim();
    if (!descriptions.has(d)) descriptions.set(d, []);
    descriptions.get(d)!.push(rel);
  }
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    const h = h1Match[1].replace(/<[^>]+>/g, '').trim();
    if (!h1s.has(h)) h1s.set(h, []);
    h1s.get(h)!.push(rel);
  }

  // Links
  const linkMatches = content.matchAll(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>/gi);
  for (const m of linkMatches) {
    const href = m[1];
    const fullTag = m[0];
    const relMatch = fullTag.match(/rel=["']([^"']*)["']/i);
    const relAttr = relMatch ? relMatch[1] : '';

    if (href === '') emptyHrefs++;
    if (href === '#') hashHrefs++;

    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (!href.includes('liuliangzhangben.cc')) {
        const isSponsored = /sponsored/i.test(relAttr) || /nofollow/i.test(relAttr);
        outboundLinks.push({ page: rel, href, rel: relAttr, isSponsored });
      }
    } else if (href.startsWith('/')) {
      const cleanTarget = href.split('#')[0].split('?')[0];
      const targetNorm = cleanTarget.endsWith('/') ? cleanTarget : cleanTarget + '/';
      internalGraph.get(normUrl)!.add(targetNorm);
    }
  }

  // Schema JSON-LD
  const jsonLdMatches = content.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const sm of jsonLdMatches) {
    schemaCount++;
    try {
      const parsed = JSON.parse(sm[1]);
      const t = parsed['@type'] || 'unknown';
      schemaTypes[t] = (schemaTypes[t] || 0) + 1;
    } catch {
      schemaTypes['invalid_json'] = (schemaTypes['invalid_json'] || 0) + 1;
    }
  }
}

console.log('Canonical tag count:', canonicalCount, '/', htmlFiles.length);
console.log('Canonical anomalies count:', canonicalErrors.length);
console.log('Pages with noindex meta:', noindexPages.length, noindexPages);
console.log('Mixed content (http://) items:', mixedContent.length);
console.log('Empty href="" count:', emptyHrefs);
console.log('Hash href="#" count:', hashHrefs);
console.log('Schema JSON-LD blocks found:', schemaCount, 'Types:', schemaTypes);

// Duplicate Titles / Descriptions / H1s
let dupTitles = 0;
let dupDescs = 0;
let dupH1s = 0;
for (const [t, pList] of titles.entries()) {
  if (pList.length > 1) dupTitles += (pList.length - 1);
}
for (const [d, pList] of descriptions.entries()) {
  if (pList.length > 1) dupDescs += (pList.length - 1);
}
for (const [h, pList] of h1s.entries()) {
  if (pList.length > 1) dupH1s += (pList.length - 1);
}
console.log(`Duplicate Titles: ${dupTitles}, Duplicate Descriptions: ${dupDescs}, Duplicate H1s: ${dupH1s}`);

// Outbound links check
console.log('\n--- 4. 出站外链与商业推广链接核查 ---');
console.log('Total external links found:', outboundLinks.length);
const unflaggedAffiliate: { page: string; href: string; rel: string }[] = [];
for (const ob of outboundLinks) {
  if (ob.href.includes('jichangbang.org')) {
    if (!ob.rel.includes('nofollow') || !ob.rel.includes('sponsored') || !ob.rel.includes('noopener')) {
      unflaggedAffiliate.push(ob);
    }
  }
}
console.log('Unflagged affiliate links (must be 0):', unflaggedAffiliate.length);
if (unflaggedAffiliate.length > 0) {
  console.log('Sample unflagged links:', unflaggedAffiliate.slice(0, 5));
}

// Sitemap.xml check
console.log('\n--- 5. Sitemap.xml 检查 ---');
const sitemapPath = path.join(distDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const smText = fs.readFileSync(sitemapPath, 'utf8');
  const urlsInSitemap = smText.match(/<loc>([^<]+)<\/loc>/g) || [];
  console.log('Total URLs in sitemap.xml:', urlsInSitemap.length);
  const nonFormalDomain = urlsInSitemap.filter(u => !u.includes('https://liuliangzhangben.cc'));
  console.log('URLs not using formal domain:', nonFormalDomain.length);
  const lastmodList = smText.match(/<lastmod>([^<]+)<\/lastmod>/g) || [];
  console.log('Sample lastmods (first 5):', lastmodList.slice(0, 5));
  // check 404 in sitemap
  const has404 = urlsInSitemap.some(u => u.includes('404'));
  console.log('Has 404 in sitemap?', has404);
} else {
  console.log('sitemap.xml NOT found in dist!');
}

// Click Depth & Orphan pages
console.log('\n--- 6. 内部链接与点击深度分析 ---');
const depths: Map<string, number> = new Map();
const queue: { url: string; depth: number }[] = [{ url: '/', depth: 0 }];
depths.set('/', 0);

while (queue.length > 0) {
  const current = queue.shift()!;
  const neighbors = internalGraph.get(current.url);
  if (neighbors) {
    for (const n of neighbors) {
      if (!depths.has(n)) {
        depths.set(n, current.depth + 1);
        queue.push({ url: n, depth: current.depth + 1 });
      }
    }
  }
}

let depth0 = 0, depth1 = 0, depth2 = 0, depth3 = 0, depth4Plus = 0;
let unreachablePages: string[] = [];

for (const [url] of internalGraph.entries()) {
  if (!depths.has(url)) {
    unreachablePages.push(url);
  } else {
    const d = depths.get(url)!;
    if (d === 0) depth0++;
    else if (d === 1) depth1++;
    else if (d === 2) depth2++;
    else if (d === 3) depth3++;
    else depth4Plus++;
  }
}

console.log(`Click Depth distribution: Depth 0 (Home): ${depth0}, Depth 1: ${depth1}, Depth 2: ${depth2}, Depth 3: ${depth3}, Depth 4+: ${depth4Plus}`);
console.log('Unreachable / Orphan pages count:', unreachablePages.length);
if (unreachablePages.length > 0) {
  console.log('Sample unreachable pages:', unreachablePages.slice(0, 5));
}

// Word count distribution from content registry
console.log('\n--- 7. 正文内容字数分布 ---');
const registry = JSON.parse(fs.readFileSync('data/CONTENT_REGISTRY.json', 'utf8'));
let countUnder300 = 0;
let countUnder500 = 0;
let count500to1500 = 0;
let count1500to3000 = 0;
let countOver3000 = 0;

for (const node of registry) {
  const relDir = node.url.replace(/^\//, '').replace(/\/$/, '');
  const filePath = path.resolve('content', relDir ? relDir : '', 'index.md');
  if (fs.existsSync(filePath)) {
    const txt = fs.readFileSync(filePath, 'utf8');
    const hanzi = (txt.match(/[\u4e00-\u9fa5]/g) || []).length;
    if (hanzi < 300) countUnder300++;
    else if (hanzi < 500) countUnder500++;
    else if (hanzi < 1500) count500to1500++;
    else if (hanzi < 3000) count1500to3000++;
    else countOver3000++;
  }
}
console.log(`Word Count (Chinese Characters): <300: ${countUnder300}, 300-499: ${countUnder500}, 500-1499: ${count500to1500}, 1500-2999: ${count1500to3000}, >=3000: ${countOver3000}`);
