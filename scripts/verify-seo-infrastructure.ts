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

console.log(`[VERIFY-INFRA] 扫描产物目录，共发现 ${allHtml.length} 个 HTML 页面`);

// 1. 验证首页与文章页的 SEO Head
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const articleFile = allHtml.find(f => f.includes('records') && !f.endsWith('records\\index.html') && !f.includes('baseline') && !f.includes('management')) || allHtml[10];
const sampleArticleHtml = fs.readFileSync(articleFile, 'utf8');

function inspectHead(html: string, name: string) {
  console.log(`\n=== 检查 [${name}] 的 SEO Head ===`);
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1];
  const desc = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1];
  const canonical = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)?.[1];
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i)?.[1];
  const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i)?.[1];
  const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/i)?.[1];
  const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i)?.[1];
  const twitterCard = html.match(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']*)["']/i)?.[1];
  const renderer = html.match(/<meta\s+name=["']renderer["']\s+content=["']([^"']*)["']/i)?.[1];
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();

  console.log('Title:', title);
  console.log('Description:', desc?.slice(0, 50) + '...');
  console.log('Canonical:', canonical);
  console.log('Robots:', robots);
  console.log('OG Title:', ogTitle);
  console.log('OG URL:', ogUrl);
  console.log('OG Image:', ogImage);
  console.log('Twitter Card:', twitterCard);
  console.log('Browser Renderer:', renderer);
  console.log('H1:', h1);
}

inspectHead(indexHtml, '首页 (index.html)');
inspectHead(sampleArticleHtml, '独立实战文章页 (records/sources/system-vs-app-stats)');

// 2. 检查全站禁止的脏域名 (localhost, temp, http://, www.)
let dirtyCount = 0;
const forbiddenPatterns = [
  /href=["']http:\/\/liuliangzhangben\.cc/i,
  /href=["']https?:\/\/localhost/i,
  /href=["']https?:\/\/[^"']*\.pages\.dev/i,
  /href=["']https?:\/\/[^"']*\.vercel\.app/i,
  /<link[^>]*rel=["']canonical["'][^>]*href=["'][^"']*www\.liuliangzhangben\.cc/i
];

for (const f of allHtml) {
  const content = fs.readFileSync(f, 'utf8');
  for (const pat of forbiddenPatterns) {
    if (pat.test(content)) {
      console.error(`[DIRTY URL ERROR] 发现违规域名: ${pat} in ${f}`);
      dirtyCount++;
    }
  }
}
console.log(`\n[DOMAIN CLEANLINESS] 脏域名与临时域名违规检测: ${dirtyCount === 0 ? 'PASS (0 处违规)' : `FAIL (${dirtyCount} 处违规)`}`);

// 3. 检查 Sitemap
const sitemapPath = path.join(distDir, 'sitemap.xml');
const sitemapExists = fs.existsSync(sitemapPath);
let sitemapUrlsCount = 0;
let sitemapHas404 = false;
let sitemapAllFormal = true;

if (sitemapExists) {
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
  const locs = sitemapXml.match(/<loc>([^<]+)<\/loc>/g) || [];
  sitemapUrlsCount = locs.length;
  sitemapHas404 = locs.some(l => l.includes('404'));
  sitemapAllFormal = locs.every(l => l.includes('https://liuliangzhangben.cc/'));
}
console.log(`\n[SITEMAP] sitemap.xml 存在: ${sitemapExists}, URL 数量: ${sitemapUrlsCount}, 包含404: ${sitemapHas404}, 100% 正式主域: ${sitemapAllFormal}`);

// 4. 检查 robots.txt
const robotsPath = path.join(distDir, 'robots.txt');
const robotsContent = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : '';
console.log('\n[ROBOTS.TXT 内容核对]');
console.log(robotsContent);
