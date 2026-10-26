/**
 * 按量付费与流量包成本比较模块
 * 覆盖测试向量 I 与 J
 */

import { PaygAnalysis } from './types';

/**
 * 测试向量 I & J: 计算流量包整包购买及其实际使用单位成本
 * @param packSizeBytes 每包容量（字节）
 * @param packPriceCents 每包价格（分）
 * @param neededBytes 实际需求或已用字节
 * @param actualUsageBytes 实际发生的消耗字节（若为买前计划，通常与 neededBytes 一致；若为买后复盘，可能低于购买总量）
 */
export function calculatePaygPackCost(
  packSizeBytes: bigint,
  packPriceCents: number,
  neededBytes: bigint,
  actualUsageBytes: bigint
): PaygAnalysis {
  if (packSizeBytes <= 0n) {
    throw new Error('流量包容量必须大于 0');
  }
  if (packPriceCents < 0) {
    throw new Error('流量包价格不能为负数');
  }
  if (neededBytes < 0n || actualUsageBytes < 0n) {
    throw new Error('用量不能为负数');
  }

  // 整包购买计算：ceil(neededBytes / packSizeBytes)
  let packsToBuy = 0;
  if (neededBytes > 0n) {
    const div = neededBytes / packSizeBytes;
    const rem = neededBytes % packSizeBytes;
    packsToBuy = Number(div) + (rem > 0n ? 1 : 0);
  }

  const totalCostCents = packsToBuy * packPriceCents;
  const totalPurchasedBytes = BigInt(packsToBuy) * packSizeBytes;
  const leftoverBytes = totalPurchasedBytes > neededBytes ? totalPurchasedBytes - neededBytes : 0n;

  // 1 GB = 1,000,000,000 字节
  const oneGb = 1_000_000_000n;

  // 额度单价（元 / GB）：packPriceCents / (packSizeBytes in GB) / 100
  const packSizeGb = Number(packSizeBytes) / Number(oneGb);
  const quotaUnitPricePerGB = packSizeGb > 0 ? (packPriceCents / 100) / packSizeGb : 0;

  // 实际使用单位成本（元 / GB）：totalCostCents / (actualUsageBytes in GB) / 100
  // 测试向量 J: 实际用量为 0 时不可计算，禁止输出 Infinity 或 0
  let actualUsageUnitCostPerGB: number | null = null;
  if (actualUsageBytes > 0n && totalCostCents > 0) {
    const actualUsageGb = Number(actualUsageBytes) / Number(oneGb);
    actualUsageUnitCostPerGB = (totalCostCents / 100) / actualUsageGb;
    // 保留四位小数
    actualUsageUnitCostPerGB = Math.round(actualUsageUnitCostPerGB * 10_000) / 10_000;
  }

  return {
    neededBytes,
    packsToBuy,
    totalCostCents,
    leftoverBytes,
    quotaUnitPricePerGB: Math.round(quotaUnitPricePerGB * 10_000) / 10_000,
    actualUsageUnitCostPerGB,
  };
}
