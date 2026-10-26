/**
 * 流量账本单位换算与速率计算模块
 * 遵循 NIST 与 IEC 标准：
 * 1 KB = 1,000 字节, 1 KiB = 1,024 字节
 * 1 MB = 1,000,000 字节, 1 MiB = 1,048,576 字节
 * 1 GB = 1,000,000,000 字节, 1 GiB = 1,073,741,824 字节
 * 1 字节 = 8 比特
 */

import { DataUnit } from './types';

export const BYTE_FACTORS: Record<DataUnit, bigint> = {
  B: 1n,
  KB: 1_000n,
  KiB: 1_024n,
  MB: 1_000_000n,
  MiB: 1_048_576n,
  GB: 1_000_000_000n,
  GiB: 1_073_741_824n,
};

/**
 * 将指定单位的数值转换为整数字节（BigInt）
 */
export function toBytes(value: number | string, unit: DataUnit): bigint {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || !isFinite(num) || num < 0) {
    throw new Error(`无效的流量数值: ${value}`);
  }

  // 为保证十进制小数不丢失精度，按小数位数缩放计算
  const factor = BYTE_FACTORS[unit];
  const strVal = num.toString();
  if (strVal.includes('.')) {
    const [intPart, decPart] = strVal.split('.');
    const precision = decPart.length;
    const scale = 10n ** BigInt(precision);
    const totalNumerator = BigInt(intPart) * scale + BigInt(decPart);
    return (totalNumerator * factor) / scale;
  }
  return BigInt(Math.floor(num)) * factor;
}

/**
 * 将字节数格式化为人类可读字符串，保留指定小数位
 */
export function formatBytes(bytes: bigint, targetUnit: DataUnit, fractionDigits = 2): string {
  const factor = BYTE_FACTORS[targetUnit];
  const scale = 10n ** BigInt(fractionDigits);
  const scaled = (bytes * scale) / factor;
  const num = Number(scaled) / 10 ** fractionDigits;
  return `${num.toFixed(fractionDigits)} ${targetUnit}`;
}

/**
 * 自动选择最适合的单位进行可读化
 */
export function autoFormatBytes(bytes: bigint, preference: 'decimal' | 'binary' = 'decimal'): string {
  if (preference === 'decimal') {
    if (bytes >= 1_000_000_000n) return formatBytes(bytes, 'GB', 2);
    if (bytes >= 1_000_000n) return formatBytes(bytes, 'MB', 2);
    if (bytes >= 1_000n) return formatBytes(bytes, 'KB', 2);
    return `${bytes} B`;
  } else {
    if (bytes >= 1_073_741_824n) return formatBytes(bytes, 'GiB', 2);
    if (bytes >= 1_048_576n) return formatBytes(bytes, 'MiB', 2);
    if (bytes >= 1_024n) return formatBytes(bytes, 'KiB', 2);
    return `${bytes} B`;
  }
}

/**
 * 测试向量 B: 恒定 Mbps 速率换算为传输字节
 * 公式: (Mbps * 10^6 * seconds) / 8
 */
export function constantRateToBytes(mbps: number, durationSeconds: number): bigint {
  if (mbps < 0 || durationSeconds < 0 || !isFinite(mbps) || !isFinite(durationSeconds)) {
    throw new Error('速率与时长必须为非负有限数字');
  }
  // 8 Mbps * 10^6 * 7200 s / 8 = 7,200,000,000 字节
  const bitsPerSecond = BigInt(Math.round(mbps * 1_000_000));
  const totalBits = bitsPerSecond * BigInt(Math.round(durationSeconds));
  return totalBits / 8n;
}

/**
 * 恒定 MB/s (MegaBytes per second) 速率换算为传输字节
 * 公式: MB/s * 10^6 * seconds
 */
export function constantMegabytesPerSecondToBytes(mBps: number, durationSeconds: number): bigint {
  if (mBps < 0 || durationSeconds < 0 || !isFinite(mBps) || !isFinite(durationSeconds)) {
    throw new Error('速率与时长必须为非负有限数字');
  }
  const bytesPerSecond = BigInt(Math.round(mBps * 1_000_000));
  return bytesPerSecond * BigInt(Math.round(durationSeconds));
}
