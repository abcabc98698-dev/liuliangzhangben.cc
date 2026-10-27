import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('site/.vitepress/dist');
const unflagged: { file: string; href: string; rel: string }[] = [];

function walk(dir: string) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (f.endsWith('.html')) {
      const rel = path.relative(distDir, full).replace(/\\/g, '/');
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/<a\s+[^>]*href=["'](https?:\/\/[^"']*)["'][^>]*>/gi);
      for (const m of matches) {
        const href = m[1];
        const tag = m[0];
        if (href.includes('jichangbang.org')) {
          const relMatch = tag.match(/rel=["']([^"']*)["']/i);
          const relAttr = relMatch ? relMatch[1] : '';
          const hasRequired = /nofollow/i.test(relAttr) && /sponsored/i.test(relAttr) && /noopener/i.test(relAttr);
          if (!hasRequired) {
            unflagged.push({ file: rel, href, rel: relAttr });
          }
        }
      }
    }
  }
}
walk(distDir);

console.log('Total unflagged links to jichangbang.org:', unflagged.length);
const filesSet = new Set(unflagged.map(u => u.file));
console.log('Total unique HTML files containing unflagged links:', filesSet.size);

// Group by URL pattern
const patterns: Record<string, number> = {};
for (const u of unflagged) {
  const baseHref = u.href.split('?')[0];
  patterns[baseHref] = (patterns[baseHref] || 0) + 1;
}
console.log('Breakdown by base URL:', patterns);

// Sample 5
console.log('Sample 5:');
unflagged.slice(0, 5).forEach(u => console.log(`- In ${u.file}: href="${u.href}" rel="${u.rel}"`));
