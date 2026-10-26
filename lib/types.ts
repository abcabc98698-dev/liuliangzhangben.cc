/**
 * 流量账本核心数据模型与类型定义
 * 依据项目指令第六节与第九节标准
 */

export type DataUnit = 'B' | 'KB' | 'KiB' | 'MB' | 'MiB' | 'GB' | 'GiB';

export type TrafficDirection = 'download' | 'upload' | 'both' | 'unknown';

export type ValueKind = 
  | 'interval-delta'      // 区间增量
  | 'cumulative-counter'  // 累计计数器
  | 'quota-balance'       // 额度余额
  | 'estimate';           // 估算值

export type SourceKind =
  | 'device-os'       // 操作系统原生统计
  | 'proxy-client'   // 代理客户端内核
  | 'router-firmware'// 路由器固件
  | 'provider-panel' // 机场用户后台
  | 'manual-test'    // 手工测速或测试文件
  | 'user-estimate'; // 用户假设估算

export type RateRuleType =
  | 'bidirectional'  // 上下行均计费
  | 'download-only'  // 仅计费下载
  | 'upload-only'    // 仅计费上传
  | 'unconfirmed';   // 未明确

export interface UsageObservation {
  id: string;
  sourceKind: SourceKind;
  scope: string; // e.g. "global", "proxy-only", "app:chrome"
  observedAt: string; // ISO 8601
  measurementStart?: string;
  measurementEnd?: string;
  sourceTimezone: string; // e.g. "Asia/Shanghai"
  accountAlias?: string;
  poolId?: string;
  deviceAlias: string;
  taskId?: string;
  direction: TrafficDirection;
  rateRuleId?: string;
  valueKind: ValueKind;
  rawBytes: string; // 无损字符串形式的整数字节
  displayUnit: DataUnit;
  evidenceRef?: string;
  notes?: string;
}

export interface BillingRule {
  id: string;
  name: string;
  version: string;
  ruleType: RateRuleType;
  defaultMultiplier: number;
  timeSegmentMultipliers?: {
    startHour: number; // 0-23
    endHour: number;   // 0-23
    multiplier: number;
  }[];
  nodeMultipliers?: Record<string, number>;
  rolloverAllowed: boolean;
  rolloverCapBytes?: string;
  resetType: 'calendar-month' | 'fixed-day' | 'fixed-days' | 'anniversary';
  resetDay?: number; // 1-31
  fixedDaysInterval?: number;
  serviceExpiryDate?: string;
  sourceCheckedAt: string;
}

export interface MultiplierCalculationResult {
  actualTransferBytes: bigint;
  billedBytes: bigint;
  weightedMultiplier: number;
  directionRuleApplied: RateRuleType;
  isRuleConfirmed: boolean;
  notes: string[];
}

export interface PaygCompareOption {
  name: string;
  packSizeBytes: bigint;
  packPriceCents: number; // 最小货币单位：分
  validityDays: number | null; // null 表示无固定到期
  multiplier: number;
}

export interface PaygAnalysis {
  neededBytes: bigint;
  packsToBuy: number;
  totalCostCents: number;
  leftoverBytes: bigint;
  quotaUnitPricePerGB: number; // 元 / GB
  actualUsageUnitCostPerGB: number | null; // 元 / GB，若实际使用为0则为 null
}

export interface ReconcileDifference {
  observedBytes: bigint;
  expectedBilledBytes: bigint;
  actualBilledBytes: bigint;
  deltaBytes: bigint;
  percentageDiff: number | null;
  possibleCauses: string[];
  isUnconfirmed: boolean;
}
