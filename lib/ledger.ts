/**
 * 本地账本核心管理模块
 * 覆盖测试向量 H：累计计数器增量与重启/回退检测
 * 严格区分 valueKind: interval-delta, cumulative-counter, quota-balance, estimate
 */

import { UsageObservation, ValueKind } from './types';

export interface CounterDeltaResult {
  previousBytes: bigint;
  currentBytes: bigint;
  deltaBytes: bigint | null;
  status: 'normal-increment' | 'counter-reset-or-rollback' | 'gap-detected';
  notes: string;
}

/**
 * 测试向量 H: 累计计数器差值计算
 * 正常递增：current >= previous，增量为 current - previous
 * 重置/回退：current < previous，不能生成负数或静默截成 0，返回独立状态
 */
export function calculateCumulativeDelta(
  previousBytes: bigint,
  currentBytes: bigint,
  isKnownRestart = false
): CounterDeltaResult {
  if (previousBytes < 0n || currentBytes < 0n) {
    throw new Error('计数器数值不能为负数');
  }

  if (currentBytes >= previousBytes) {
    return {
      previousBytes,
      currentBytes,
      deltaBytes: currentBytes - previousBytes,
      status: 'normal-increment',
      notes: '累计计数器正常递增。',
    };
  }

  // currentBytes < previousBytes：发生重启、计数器归零或更换来源
  return {
    previousBytes,
    currentBytes,
    deltaBytes: isKnownRestart ? currentBytes : null,
    status: 'counter-reset-or-rollback',
    notes: isKnownRestart 
      ? '检测到客户端或服务重启，当前值已作为新周期基线重新累计。'
      : '检测到累计数值倒退（可能发生系统重启、计数溢出或账单清零），禁止输出负数或静默置零，需人工核对。',
  };
}

/**
 * 账本列表安全求和
 * 严格限制：只有同层级且同单位属性的 interval-delta 允许直接累加求和
 * quota-balance 与 estimate 严禁与区间增量混淆直接求和
 */
export function sumIntervalDeltas(observations: UsageObservation[]): {
  totalBytes: bigint;
  validItemCount: number;
  ignoredItems: { id: string; kind: ValueKind; reason: string }[];
} {
  let totalBytes = 0n;
  let validItemCount = 0;
  const ignoredItems: { id: string; kind: ValueKind; reason: string }[] = [];

  for (const obs of observations) {
    if (obs.valueKind === 'interval-delta') {
      try {
        const bytes = BigInt(obs.rawBytes);
        totalBytes += bytes;
        validItemCount++;
      } catch (err) {
        ignoredItems.push({
          id: obs.id,
          kind: obs.valueKind,
          reason: `整数字节解析失败: ${obs.rawBytes}`,
        });
      }
    } else {
      ignoredItems.push({
        id: obs.id,
        kind: obs.valueKind,
        reason: `valueKind 为 ${obs.valueKind}，非区间增量，禁止直接求和。`,
      });
    }
  }

  return {
    totalBytes,
    validItemCount,
    ignoredItems,
  };
}
