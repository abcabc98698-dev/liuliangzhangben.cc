import fs from 'node:fs';
import path from 'node:path';
import { ContentNode } from './content-meta';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const GENERATORS_DIR = path.resolve(process.cwd(), 'scripts', 'generators');
const SCRIPTS_DIR = path.resolve(process.cwd(), 'scripts');

const registryPath = path.join(DATA_DIR, 'CONTENT_REGISTRY.json');
const nodes: ContentNode[] = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
const validUrlSet = new Set(nodes.map(n => n.url));

// 100% 精确对齐 560 节点规范路由表
const URL_FIX_MAP: Record<string, string> = {
  '/reconcile/source-align/': '/reconcile/alignment/basis/',
  '/estimate/period-fit/': '/estimate/forecast/period-fit/',
  '/estimate/unit-rate/': '/estimate/models/unit-rate/',
  '/estimate/composition/': '/estimate/forecast/composition/',
  '/knowledge/dns-routing/': '/knowledge/network/routing/',
  '/high-data/heavy-tasks/': '/high-data/demand/task-inventory/',
  '/estimate/scenarios/': '/estimate/forecast/scenarios/',
  '/estimate/validation/': '/estimate/forecast/validation/',
  '/reset/calendar-vs-billing-cycle/': '/reset/boundaries/calendar/',
  '/reset/remaining-expiry/': '/reset/boundaries/remaining/',
  '/estimate/task-size/': '/estimate/models/task-size/',
  '/estimate/traffic-scope/': '/estimate/models/traffic-scope/',
  '/knowledge/data-units/': '/knowledge/measurement/units/',
  '/video/schedule-allowance/': '/video/plans/schedule/',
  '/high-data/continuous-speed/': '/high-data/demand/capacity/',
  '/multipliers/single-multiplier/': '/multipliers/calculation/single-rate/',
  '/knowledge/transport-retransmission/': '/knowledge/network/transport/',
  '/mobile/traffic-stats-system/': '/mobile/counters/android/',
  '/mobile/hotspot-tether-duplication/': '/mobile/counters/hotspot/',
  '/multipliers/mixed-rates/': '/multipliers/calculation/mixed-rates/',
  '/multipliers/rule-observation/': '/multipliers/verification/sources/',
  '/multipliers/exceptions/': '/multipliers/verification/exceptions/',
  '/payg/payg-vs-monthly/': '/payg/fit/comparison/',
  '/knowledge/price-efficiency/': '/knowledge/measurement/value/',
  '/multipliers/dynamic-rates/': '/multipliers/calculation/rate-history/',
  '/multipliers/multipath/': '/multipliers/verification/path-accounting/',
  '/reconcile/minimal-reproduce/': '/reconcile/resolution/evidence/',
  '/reset/timezone-boundary/': '/reset/boundaries/timezone/',
  '/multipliers/bilateral-accounting/': '/multipliers/calculation/directions/',
  '/reconcile/rate-reconcile/': '/reconcile/alignment/components/',
  '/multipliers/plan-fit/': '/multipliers/verification/selection/',
  '/payg/extra-charges/': '/payg/terms/constraints/',
  '/occasional/active-vs-idle-days/': '/occasional/patterns/active-days/',
  '/occasional/backup-switching/': '/occasional/patterns/backup/',
  '/payg/balance-validity/': '/payg/terms/definitions/',
  '/occasional/balance-and-validity/': '/occasional/maintenance/account-check/',
  '/records/evidence-labels/': '/records/baseline/evidence-labels/',
  '/knowledge/trusted-boundaries/': '/knowledge/network/trust/',
  '/reconcile/audit-trail-bundle/': '/reconcile/alignment/basis/',
  '/video/streaming-bitrate/': '/video/models/bitrate/',
  '/video/multiscreen-concurrent/': '/video/models/multiscreen/',
  '/video/live-streaming-webrtc/': '/video/plans/live/',
  '/devices/concurrent-limits/': '/devices/allocation/concurrency/',
  '/video/adaptive-resolution-buffering/': '/video/models/adaptive/',
  '/video/reconcile-video/': '/video/plans/verify/'
};

// 严格验证所有目标 URL
let allValid = true;
for (const [k, target] of Object.entries(URL_FIX_MAP)) {
  if (!validUrlSet.has(target)) {
    console.error(`[ERROR] 修复目标不存在于注册表: ${target} (源: ${k})`);
    allValid = false;
  }
}

if (!allValid) {
  process.exit(1);
}

console.log(`[FIX-LINKS] 全部 ${Object.keys(URL_FIX_MAP).length} 个修复目标 100% 存在且有效！开始批量替换源码...`);

const targetFiles = [
  ...fs.readdirSync(GENERATORS_DIR).map(f => path.join(GENERATORS_DIR, f)),
  path.join(SCRIPTS_DIR, 'enrich-all-v2.ts'),
  path.join(SCRIPTS_DIR, 'enrich-clusters-v3.ts'),
  path.join(SCRIPTS_DIR, 'content-prepare.ts')
];

let totalReplacements = 0;

for (const file of targetFiles) {
  if (!fs.existsSync(file) || !file.endsWith('.ts')) continue;
  let content = fs.readFileSync(file, 'utf-8');
  let fileReplacements = 0;

  for (const [broken, fixed] of Object.entries(URL_FIX_MAP)) {
    if (content.includes(broken)) {
      content = content.replaceAll(broken, fixed);
      fileReplacements++;
      totalReplacements++;
    }
  }

  if (fileReplacements > 0) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`[PASS] 成功替换 ${path.basename(file)} (${fileReplacements} 处断链映射)`);
  }
}

console.log(`[FINISH] 全站源码链接批量修复完毕，共计修复 ${totalReplacements} 处！`);
