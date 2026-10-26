import fs from 'node:fs';
import path from 'node:path';
import { ContentNode } from './content-meta';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SITE_GENERATED_DIR = path.resolve(process.cwd(), 'site', 'generated');

const registryPath = path.join(DATA_DIR, 'CONTENT_REGISTRY.json');
const nodes: ContentNode[] = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
const validUrls = new Set(nodes.map(n => n.url));

// 另外支持静态资源与主站外部链接
const invalidLinks = new Map<string, string[]>();

function walk(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full);
    } else if (e.name.endsWith('.md')) {
      const content = fs.readFileSync(full, 'utf-8');
      const matches = content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
      for (const m of matches) {
        let link = m[2].trim();
        if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('#')) continue;
        if (!link.startsWith('/')) continue;
        // 去除 query 和 hash
        link = link.split('?')[0].split('#')[0];
        if (!link.endsWith('/')) link += '/';
        if (!validUrls.has(link)) {
          if (!invalidLinks.has(link)) invalidLinks.set(link, []);
          invalidLinks.get(link)!.push(full.replace(SITE_GENERATED_DIR, ''));
        }
      }
    }
  }
}

walk(SITE_GENERATED_DIR);

console.log(`[LINK VALIDATION] 发现 ${invalidLinks.size} 个无效站内链接目标:`);
for (const [url, files] of invalidLinks.entries()) {
  console.log(`  Invalid URL: ${url} (出现在 ${files.length} 个文件中, 示例: ${files[0]})`);
}
