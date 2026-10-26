import fs from 'node:fs';
import path from 'node:path';

console.log('[CHECK] 正在执行敏感凭据与隐私数据审查...');

const IGNORED_DIRS = ['.git', 'node_modules', '.vitepress/dist', 'site/.vitepress/dist'];

const SUSPICIOUS_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,                // OpenAI key 模式
  /ghp_[a-zA-Z0-9]{20,}/,               // GitHub token 模式
  /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_-]{16,}['"]/i,
  /sub\.[\w.-]+\/api\/v1\/client\/subscribe\?token=/, // 订阅直链
  /vmess:\/\/[a-zA-Z0-9+/=]+/,          // 明文节点链接
  /vless:\/\/[a-zA-Z0-9@.-]+/,
  /trojan:\/\/[a-zA-Z0-9@.-]+/,
  /ss:\/\/[a-zA-Z0-9+/=]+/,
];

let leakCount = 0;

function scanDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');

    if (IGNORED_DIRS.some(ignored => relPath.startsWith(ignored))) {
      continue;
    }

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.vue') || file.endsWith('.json') || file.endsWith('.md'))) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const pattern of SUSPICIOUS_PATTERNS) {
        if (pattern.test(content)) {
          console.error(`[FAIL] 在文件 ${relPath} 中检测到敏感特征: ${pattern}`);
          leakCount++;
        }
      }
    }
  }
}

scanDirectory(process.cwd());

if (leakCount > 0) {
  console.error(`[FAIL] 审查发现 ${leakCount} 处潜在隐私或凭据泄漏！`);
  process.exit(1);
}

console.log('[PASS] 隐私与安全审查通过：未发现任何 API Key、明文节点凭据或用户私有日志！');
