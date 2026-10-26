import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve(process.cwd(), 'site', '.vitepress', 'dist');

if (!fs.existsSync(DIST_DIR)) {
  console.error('[FAIL] dist 目录不存在，请先构建站点');
  process.exit(1);
}

console.log('[CHECK] 正在核验全站内部链接有效性...');

// 递归查找所有 html 文件
function getAllHtmlFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getAllHtmlFiles(DIST_DIR);
console.log(`[INFO] 共扫描 ${htmlFiles.length} 个 HTML 产物文件`);

let brokenLinkCount = 0;
const linkRegex = /href="([^"]+)"/g;

for (const filePath of htmlFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];

    // 忽略外链、锚点、javascript、mailto
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
      continue;
    }

    // 内部链接分析
    const cleanHref = href.split('#')[0].split('?')[0];
    if (!cleanHref || cleanHref === '/') continue;

    // 对应的本地物理文件
    let targetRelative = cleanHref.replace(/^\//, '');
    let targetFile = path.join(DIST_DIR, targetRelative);

    // 如果是指向目录或以斜杠结尾，检查 targetFile/index.html
    let exists = false;
    if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
      exists = true;
    } else if (fs.existsSync(path.join(targetFile, 'index.html'))) {
      exists = true;
    } else if (fs.existsSync(`${targetFile}.html`)) {
      exists = true;
    }

    if (!exists) {
      console.error(`[WARN] 发现潜在死链: 在 ${path.relative(DIST_DIR, filePath)} 中链接至 ${href}`);
      brokenLinkCount++;
    }
  }
}

if (brokenLinkCount > 0) {
  console.error(`[FAIL] 发现 ${brokenLinkCount} 个内部异常链接！`);
  process.exit(1);
}

console.log('[PASS] 全站内部链接与静态产物完整性校验通过 (0 个死链)！');
