import { describe, it, expect } from 'vitest';
import {
  toBytes,
  formatBytes,
  constantRateToBytes,
  constantMegabytesPerSecondToBytes,
  BYTE_FACTORS,
} from '../lib/units';
import {
  calculateWeightedMultiplier,
  calculateDirectionalBilledBytes,
  calculateUsableTransferBudget,
} from '../lib/multiplier';
import {
  evaluateIndependentCycles,
  isTimestampInCycleHalfOpen,
  estimateCrossBoundarySplit,
} from '../lib/reset';
import { calculatePaygPackCost } from '../lib/payg';
import { calculateCumulativeDelta, sumIntervalDeltas } from '../lib/ledger';
import { aggregateDeviceObservations } from '../lib/device';
import { estimateVideoTraffic, estimateAiTraffic } from '../lib/estimator';
import { sanitizeCsvCell, buildSafeMainSiteUrl } from '../lib/safety';

describe('第七节 核心公式、边界与测试向量 (A-L)', () => {
  // 测试向量 A: 单位严格定义
  it('向量 A: 1GB = 1,000,000,000 字节，1GiB = 1,073,741,824 字节，1字节 = 8比特', () => {
    expect(BYTE_FACTORS.GB).toBe(1_000_000_000n);
    expect(BYTE_FACTORS.GiB).toBe(1_073_741_824n);
    expect(toBytes(1, 'GB')).toBe(1_000_000_000n);
    expect(toBytes(1, 'GiB')).toBe(1_073_741_824n);
  });

  // 测试向量 B: 恒定速率换算
  it('向量 B: 恒定 8Mbps 持续 7200 秒换算为 7,200,000,000 字节 (7.2 GB)，与 8MB/s (57.6 GB) 严格区分', () => {
    const bytesMbps = constantRateToBytes(8, 7200);
    expect(bytesMbps).toBe(7_200_000_000n);
    expect(formatBytes(bytesMbps, 'GB', 1)).toBe('7.2 GB');

    const bytesMBps = constantMegabytesPerSecondToBytes(8, 7200);
    expect(bytesMBps).toBe(57_600_000_000n);
    expect(bytesMBps).not.toBe(bytesMbps);
    expect(bytesMBps / bytesMbps).toBe(8n);
  });

  // 测试向量 C: 混合倍率加权计算
  it('向量 C: 30GB@0.5x + 20GB@2x = 55GB 计费量；实际传输 50GB，按传输加权倍率 1.1x (非算术平均 1.25x)', () => {
    const segments = [
      { actualBytes: toBytes(30, 'GB'), multiplier: 0.5 },
      { actualBytes: toBytes(20, 'GB'), multiplier: 2.0 },
    ];
    const res = calculateWeightedMultiplier(segments);
    expect(res.totalActualBytes).toBe(toBytes(50, 'GB'));
    expect(res.totalBilledBytes).toBe(toBytes(55, 'GB'));
    expect(res.weightedMultiplier).toBe(1.1);
    expect(res.weightedMultiplier).not.toBe(1.25);
  });

  // 测试向量 D: 上下行计费规则判定
  it('向量 D: 上传 10GB、下载 30GB，统一倍率 1.5x：双向计费 60GB，仅计下载 45GB，规则未知时返回待确认', () => {
    const up = toBytes(10, 'GB');
    const down = toBytes(30, 'GB');

    const bi = calculateDirectionalBilledBytes(up, down, 1.5, 'bidirectional');
    expect(bi.status).toBe('confirmed');
    expect(bi.billedBytes).toBe(toBytes(60, 'GB'));

    const downOnly = calculateDirectionalBilledBytes(up, down, 1.5, 'download-only');
    expect(downOnly.status).toBe('confirmed');
    expect(downOnly.billedBytes).toBe(toBytes(45, 'GB'));

    const unconfirmed = calculateDirectionalBilledBytes(up, down, 1.5, 'unconfirmed');
    expect(unconfirmed.status).toBe('unconfirmed');
    expect(unconfirmed.billedBytes).toBeNull();
  });

  // 测试向量 E: 剩余计费额度换算可用预算与 0x 倍率处理
  it('向量 E: 剩余 100GB 遇到 2x 节点可用预算 50GB；0x 倍率不显示“无限安全可用”并给出警示', () => {
    const quota100 = toBytes(100, 'GB');
    const normal = calculateUsableTransferBudget(quota100, 2.0);
    expect(normal.usableTransferBytes).toBe(toBytes(50, 'GB'));
    expect(normal.isInfiniteSpecialCase).toBe(false);

    const zero = calculateUsableTransferBudget(quota100, 0);
    expect(zero.usableTransferBytes).toBeNull();
    expect(zero.isInfiniteSpecialCase).toBe(true);
    expect(zero.warningNote).toContain('免扣量不等于无限安全可用');
  });

  // 测试向量 F: 两个不结转周期结算
  it('向量 F: 两个不结转周期各 100GB，需求分别 130GB 和 50GB：首期短缺 30GB，次期剩余 50GB，后一期不补前一期', () => {
    const cycles = [
      { quotaBytes: toBytes(100, 'GB'), demandBytes: toBytes(130, 'GB') },
      { quotaBytes: toBytes(100, 'GB'), demandBytes: toBytes(50, 'GB') },
    ];
    const res = evaluateIndependentCycles(cycles);
    expect(res[0].shortageBytes).toBe(toBytes(30, 'GB'));
    expect(res[0].balanceBytes).toBe(0n);

    expect(res[1].shortageBytes).toBe(0n);
    expect(res[1].balanceBytes).toBe(toBytes(50, 'GB'));
  });

  // 测试向量 G: 手机热点与电脑重复观察去重
  it('向量 G: 手机热点与电脑对同一 10GB 外网任务多级观察，对外传输仅计 10GB 而非 20GB', () => {
    const tenGb = toBytes(10, 'GB');
    const items = [
      { id: '1', deviceAlias: 'iPhone', taskId: 'sync-task-1', observedBytes: tenGb, tier: 'hotspot-hop' as const },
      { id: '2', deviceAlias: 'MacBook', taskId: 'sync-task-1', observedBytes: tenGb, tier: 'device' as const },
    ];
    const res = aggregateDeviceObservations(items);
    expect(res.effectiveTotalBytes).toBe(tenGb);
    expect(res.duplicateDeductedBytes).toBe(tenGb);
  });

  // 测试向量 H: 累计计数器倒退与重启识别
  it('向量 H: 累计计数 5GB->8GB 增量 3GB；后来 8GB->2GB 识别为重置，不生成 -6GB 或静默截成 0', () => {
    const five = toBytes(5, 'GB');
    const eight = toBytes(8, 'GB');
    const two = toBytes(2, 'GB');

    const normal = calculateCumulativeDelta(five, eight);
    expect(normal.status).toBe('normal-increment');
    expect(normal.deltaBytes).toBe(toBytes(3, 'GB'));

    const rollback = calculateCumulativeDelta(eight, two, false);
    expect(rollback.status).toBe('counter-reset-or-rollback');
    expect(rollback.deltaBytes).toBeNull();
  });

  // 测试向量 I: 整包购买计算与成本分离
  it('向量 I: 100GB/10元包，统一 1x 需求 230GB：需买 3 包，付款 30 元，剩 70GB', () => {
    const packSize = toBytes(100, 'GB');
    const needed = toBytes(230, 'GB');
    const res = calculatePaygPackCost(packSize, 1000, needed, needed);

    expect(res.packsToBuy).toBe(3);
    expect(res.totalCostCents).toBe(3000); // 30 元
    expect(res.leftoverBytes).toBe(toBytes(70, 'GB'));
  });

  // 测试向量 J: 额度单价 vs 实际使用单位成本
  it('向量 J: 购买 100GB 付 10 元，只实际用 40GB：额度单价 0.10元/GB，实际使用成本 0.25元/GB；实际用量 0 时返回 null', () => {
    const packSize = toBytes(100, 'GB');
    const actual40 = toBytes(40, 'GB');
    const res = calculatePaygPackCost(packSize, 1000, packSize, actual40);

    expect(res.quotaUnitPricePerGB).toBe(0.1);
    expect(res.actualUsageUnitCostPerGB).toBe(0.25);

    const resZero = calculatePaygPackCost(packSize, 1000, packSize, 0n);
    expect(resZero.actualUsageUnitCostPerGB).toBeNull();
  });

  // 测试向量 K: 半开区间 [start, end)
  it('向量 K: 恰好落在 end 的点记录归下一周期，不属于当前周期', () => {
    const start = 1000;
    const end = 2000;
    expect(isTimestampInCycleHalfOpen(1000, start, end)).toBe(true);
    expect(isTimestampInCycleHalfOpen(1999, start, end)).toBe(true);
    expect(isTimestampInCycleHalfOpen(2000, start, end)).toBe(false); // 恰好落在 end 归下一周期
  });

  // 测试向量 L: 信息不足拒绝臆测 GB 数
  it('向量 L: 仅有 Token 数或仅有分辨率标签而缺少有效传输条件时，输出信息不足，禁止编造 GB 数', () => {
    const videoRes = estimateVideoTraffic({ resolutionTag: '1080p' });
    expect(videoRes.status).toBe('insufficient-data');
    if (videoRes.status === 'insufficient-data') {
      expect(videoRes.missingFields).toContain('实测码率 (bitrateMbps)');
    }

    const aiRes = estimateAiTraffic({ tokenCount: 100000 });
    expect(aiRes.status).toBe('insufficient-data');
    if (aiRes.status === 'insufficient-data') {
      expect(aiRes.explanation).toContain('Token 属于模型计算配额，并非网络传输字节');
    }
  });

  // 安全与注入测试
  it('安全检查: CSV 公式注入转义与主站 URL 构造', () => {
    expect(sanitizeCsvCell('=SUM(A1:A10)')).toBe(`"'=SUM(A1:A10)"`);
    expect(sanitizeCsvCell('+12345')).toBe(`"'+12345"`);
    expect(sanitizeCsvCell('@cmd')).toBe(`"'@cmd"`);
    expect(sanitizeCsvCell('Normal text')).toBe(`"Normal text"`);

    const mainUrl = buildSafeMainSiteUrl('/pricing/', 'usage_selection', 'test-page');
    expect(mainUrl).toContain('https://jichangbang.org/pricing/?');
    expect(mainUrl).toContain('utm_source=liuliangzhangben.cc');
    expect(mainUrl).toContain('utm_campaign=usage_selection');
  });
});
