import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('site/.vitepress/dist');
const descs = new Map<string, string[]>();

function walk(dir: string) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (f.endsWith('.html')) {
      const rel = path.relative(distDir, full).replace(/\\/g, '/');
      const content = fs.readFileSync(full, 'utf8');
      const m = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
      if (m) {
        const d = m[1].trim();
        if (!descs.has(d)) descs.set(d, []);
        descs.get(d)!.push(rel);
      }
    }
  }
}
walk(distDir);

for (const [d, list] of descs.entries()) {
  if (list.length > 1) {
    console.log(`Duplicated desc (${list.length} pages):`, d);
    console.log('Pages:', list);
  }
}
