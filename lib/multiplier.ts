/**
 * 流量倍率计算与核查模块
 * 严格覆盖测试向量 C, D, E
 */

import { RateRuleType, MultiplierCalculationResult } from './types';

export interface MultiplierSegment {
  actualBytes: bigint;
  multiplier: number;
  label?: string;
}

/**
 * 测试向量 C: 计算多段传输的计费量与加权平均倍率
 * 计费量 = sum(各段传输字节 * 该段倍率)
 * 加权倍率 = 总计费量 / 总传输量
 */
export function calculateWeightedMultiplier(segments: MultiplierSegment[]): {
  totalActualBytes: bigint;
  totalBilledBytes: bigint;
  weightedMultiplier: number;
} {
  if (segments.length === 0) {
    return { totalActualBytes: 0n, totalBilledBytes: 0n, weightedMultiplier: 0 };
  }

  let totalActual = 0n;
  let totalBilledScaled = 0n; // 放大 10000 倍处理小数

  for (const seg of segments) {
    if (seg.multiplier < 0) {
      throw new Error(`倍率不能为负数: ${seg.multiplier}`);
    }
    totalActual += seg.actualBytes;
    const multScaled = BigInt(Math.round(seg.multiplier * 10_000));
    totalBilledScaled += (seg.actualBytes * multScaled);
  }

  if (totalActual === 0n) {
    return { totalActualBytes: 0n, totalBilledBytes: 0n, weightedMultiplier: 0 };
  }

  const totalBilledBytes = totalBilledScaled / 10_000n;
  const weightedMultiplier = Number(totalBilledScaled) / Number(totalActual) / 10_000;

  return {
    totalActualBytes: totalActual,
    totalBilledBytes,
    weightedMultiplier: Math.round(weightedMultiplier * 10_000) / 10_000,
  };
}

/**
 * 测试向量 D: 方向计费扣量计算
 * uploadBytes, downloadBytes
 * directionRule: 'bidirectional' | 'download-only' | 'upload-only' | 'unconfirmed'
 */
export function calculateDirectionalBilledBytes(
  uploadBytes: bigint,
  downloadBytes: bigint,
  multiplier: number,
  ruleType: RateRuleType
): {
  status: 'confirmed' | 'unconfirmed';
  billedBytes: bigint | null;
  ruleExplanation: string;
} {
  if (multiplier < 0) {
    throw new Error(`倍率不能为负数: ${multiplier}`);
  }

  const multScaled = BigInt(Math.round(multiplier * 10_000));

  if (ruleType === 'unconfirmed') {
    return {
      status: 'unconfirmed',
      billedBytes: null,
      ruleExplanation: '计费方向规则未明确（双向或单向计费待核实），禁止默认选用较低或较高结果。',
    };
  }

  let effectiveBytes = 0n;
  let explanation = '';

  if (ruleType === 'bidirectional') {
    effectiveBytes = uploadBytes + downloadBytes;
    explanation = '双向计费：实际上传与实际下载合并计算倍率。';
  } else if (ruleType === 'download-only') {
    effectiveBytes = downloadBytes;
    explanation = '仅计费下载：上传流量免计费或不计入套餐扣量。';
  } else if (ruleType === 'upload-only') {
    effectiveBytes = uploadBytes;
    explanation = '仅计费上传：罕见单向下行免计费规则。';
  }

  const billed = (effectiveBytes * multScaled) / 10_000n;
  return {
    status: 'confirmed',
    billedBytes: billed,
    ruleExplanation: explanation,
  };
}

/**
 * 测试向量 E: 剩余计费额度换算可用传输预算
 * usableBudget = remainingBilledQuota / multiplier
 * 0倍或免扣量特殊处置：不显示“无限安全可用”，返回明确警示
 */
export function calculateUsableTransferBudget(
  remainingBilledQuotaBytes: bigint,
  multiplier: number
): {
  usableTransferBytes: bigint | null;
  isInfiniteSpecialCase: boolean;
  warningNote?: string;
} {
  if (remainingBilledQuotaBytes < 0n) {
    throw new Error('剩余额度不能为负数');
  }
  if (multiplier < 0) {
    throw new Error('倍率不能为负数');
  }

  if (multiplier === 0) {
    return {
      usableTransferBytes: null,
      isInfiniteSpecialCase: true,
      warningNote: '当前节点为 0 倍或免扣量节点。请注意：免扣量不等于无限安全可用，通常伴随速率限制、时段限制、单任务上限或公平使用条款（FUP）。',
    };
  }

  const multScaled = BigInt(Math.round(multiplier * 10_000));
  const usable = (remainingBilledQuotaBytes * 10_000n) / multScaled;

  return {
    usableTransferBytes: usable,
    isInfiniteSpecialCase: false,
  };
}
