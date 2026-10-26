/**
 * 账单核对与差异诊断模块
 * 遵循项目规范：差额不是恶意扣量证据，需逐项分解来源、方向、倍率与时间延迟
 */

import { ReconcileDifference, RateRuleType } from './types';

export interface ReconcileAnalysisInput {
  observedUploadBytes: bigint;
  observedDownloadBytes: bigint;
  actualBilledBytes: bigint;
  expectedMultiplier: number;
  directionRule: RateRuleType;
  updateLagMinutes?: number;
}

export function analyzeBillingReconciliation(input: ReconcileAnalysisInput): ReconcileDifference {
  if (input.expectedMultiplier < 0) {
    throw new Error('倍率不能为负数');
  }

  const multScaled = BigInt(Math.round(input.expectedMultiplier * 10_000));
  let effectiveObservedBytes = 0n;

  if (input.directionRule === 'bidirectional') {
    effectiveObservedBytes = input.observedUploadBytes + input.observedDownloadBytes;
  } else if (input.directionRule === 'download-only') {
    effectiveObservedBytes = input.observedDownloadBytes;
  } else if (input.directionRule === 'upload-only') {
    effectiveObservedBytes = input.observedUploadBytes;
  } else {
    // 未明确规则
    return {
      observedBytes: input.observedUploadBytes + input.observedDownloadBytes,
      expectedBilledBytes: 0n,
      actualBilledBytes: input.actualBilledBytes,
      deltaBytes: 0n,
      percentageDiff: null,
      possibleCauses: ['计费方向规则未明确（双向或单向待核实），无法建立可复算的基准预期值。'],
      isUnconfirmed: true,
    };
  }

  const expectedBilledBytes = (effectiveObservedBytes * multScaled) / 10_000n;
  const deltaBytes = input.actualBilledBytes - expectedBilledBytes;

  const possibleCauses: string[] = [];

  if (deltaBytes === 0n) {
    possibleCauses.push('账单扣量与本地复算值完全吻合。');
  } else {
    // 差额分析
    if (deltaBytes > 0n) {
      possibleCauses.push('后台扣量高于预期：需核实服务方是否对上传/下行采用了双向计费；');
      possibleCauses.push('检查节点实际计费倍率是否已更新，或当前节点含有分段时限倍率；');
      possibleCauses.push('检查是否存在未纳入本地统计的后台同步、系统更新或同一账户其他设备在线；');
      possibleCauses.push('高丢包网络下的 TCP 握手重传与代理协议封装开销（通常占 1%~5% 浮动）。');
    } else {
      possibleCauses.push('后台扣量低于预期：服务面板可能存在统计刷新延迟或批处理缓冲；');
      possibleCauses.push('部分域名/IP命中绕过规则（直连分流），未走代理通道；');
      possibleCauses.push('当前节点存在免计费或低倍率优惠时段。');
    }
  }

  let percentageDiff: number | null = null;
  if (expectedBilledBytes > 0n) {
    const diffScaled = (deltaBytes * 10_000n) / expectedBilledBytes;
    percentageDiff = Number(diffScaled) / 100;
  }

  return {
    observedBytes: effectiveObservedBytes,
    expectedBilledBytes,
    actualBilledBytes: input.actualBilledBytes,
    deltaBytes,
    percentageDiff,
    possibleCauses,
    isUnconfirmed: false,
  };
}
