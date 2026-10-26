/**
 * 周期重置与边界时间计算模块
 * 覆盖测试向量 F 与 K，支持半开区间 [start, end)
 */

export interface CycleQuotaResult {
  cycleIndex: number;
  startDate: string; // ISO string
  endDate: string;   // ISO string (半开区间，exclusive)
  quotaBytes: bigint;
  demandBytes: bigint;
  balanceBytes: bigint; // 结余（若无结转，仅当期使用）
  shortageBytes: bigint; // 缺口
}

/**
 * 测试向量 F: 模拟多周期独立额度结算（不结转）
 * 验证：前一周期短缺不能被后一周期的结余弥补
 */
export function evaluateIndependentCycles(
  cycles: { quotaBytes: bigint; demandBytes: bigint }[]
): CycleQuotaResult[] {
  return cycles.map((c, idx) => {
    if (c.quotaBytes < 0n || c.demandBytes < 0n) {
      throw new Error('额度与需求不能为负数');
    }
    const shortage = c.demandBytes > c.quotaBytes ? c.demandBytes - c.quotaBytes : 0n;
    const balance = c.quotaBytes > c.demandBytes ? c.quotaBytes - c.demandBytes : 0n;

    return {
      cycleIndex: idx + 1,
      startDate: '',
      endDate: '',
      quotaBytes: c.quotaBytes,
      demandBytes: c.demandBytes,
      balanceBytes: balance,
      shortageBytes: shortage,
    };
  });
}

/**
 * 测试向量 K: 半开区间 [start, end) 归属判定
 * 若 timestamp === end，属于下一周期，而非当前周期
 */
export function isTimestampInCycleHalfOpen(
  timestampMs: number,
  startMs: number,
  endMs: number
): boolean {
  return timestampMs >= startMs && timestampMs < endMs;
}

/**
 * 跨边界任务拆分评估
 * 若只有任务总量且无子时间段测量证据，禁止宣称已精确拆分
 */
export function estimateCrossBoundarySplit(
  totalBytes: bigint,
  taskStartMs: number,
  taskEndMs: number,
  boundaryMs: number
): {
  isPrecise: boolean;
  priorCycleEstimatedBytes: bigint;
  nextCycleEstimatedBytes: bigint;
  disclaimer: string;
} {
  if (taskEndMs <= boundaryMs) {
    return {
      isPrecise: true,
      priorCycleEstimatedBytes: totalBytes,
      nextCycleEstimatedBytes: 0n,
      disclaimer: '任务完全落在前一周期。',
    };
  }
  if (taskStartMs >= boundaryMs) {
    return {
      isPrecise: true,
      priorCycleEstimatedBytes: 0n,
      nextCycleEstimatedBytes: totalBytes,
      disclaimer: '任务完全落在后一周期。',
    };
  }

  // 跨界但缺少真实分段抓包证据，仅能按线性时间提供明示估算
  const totalDuration = taskEndMs - taskStartMs;
  if (totalDuration <= 0) {
    return {
      isPrecise: false,
      priorCycleEstimatedBytes: totalBytes,
      nextCycleEstimatedBytes: 0n,
      disclaimer: '任务起止时间异常，无法估算。',
    };
  }

  const priorDuration = boundaryMs - taskStartMs;
  const ratioScaled = (BigInt(priorDuration) * 10_000n) / BigInt(totalDuration);
  const priorBytes = (totalBytes * ratioScaled) / 10_000n;
  const nextBytes = totalBytes - priorBytes;

  return {
    isPrecise: false,
    priorCycleEstimatedBytes: priorBytes,
    nextCycleEstimatedBytes: nextBytes,
    disclaimer: '警告：跨重置边界任务缺少真实分段日志，此处仅按时间比例进行明示估算，不能作为精确对账证据。',
  };
}

/**
 * 生成自然月周期的半开区间 [start, end)
 * 年、月（1-12）
 */
export function getCalendarMonthHalfOpenRange(year: number, month: number, timezoneOffsetHours = 8): {
  startMs: number;
  endMs: number;
  startDateIso: string;
  endDateIso: string;
} {
  // 基于 UTC 时间计算指定时区边界
  const startUtcMs = Date.UTC(year, month - 1, 1, -timezoneOffsetHours, 0, 0, 0);
  const endUtcMs = Date.UTC(year, month, 1, -timezoneOffsetHours, 0, 0, 0);

  return {
    startMs: startUtcMs,
    endMs: endUtcMs,
    startDateIso: new Date(startUtcMs).toISOString(),
    endDateIso: new Date(endUtcMs).toISOString(),
  };
}
