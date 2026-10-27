import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('site/.vitepress/dist');
const imgTags: { file: string; tag: string }[] = [];

function walk(dir: string) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (f.endsWith('.html')) {
      const c = fs.readFileSync(full, 'utf8');
      const matches = c.matchAll(/<img\s+[^>]*>/gi);
      for (const m of matches) {
        imgTags.push({ file: path.relative(distDir, full).replace(/\\/g, '/'), tag: m[0] });
      }
    }
  }
}
walk(distDir);
console.log('Total img tags across site:', imgTags.length);
let missingAlt = 0;
let missingWidthHeight = 0;
for (const it of imgTags) {
  if (!it.tag.includes('alt=')) missingAlt++;
  if (!it.tag.includes('width=') && !it.tag.includes('style="width:')) missingWidthHeight++;
}
console.log('Missing alt:', missingAlt);
console.log('Missing width/height:', missingWidthHeight);
if (imgTags.length > 0) {
  console.log('Sample img tags:');
  imgTags.slice(0, 5).forEach(i => console.log(`- In ${i.file}: ${i.tag}`));
}
