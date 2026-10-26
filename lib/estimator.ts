/**
 * 需求估算器核心算法模块
 * 覆盖测试向量 L：信息不足时拒绝臆测 GB 数
 */

export interface VideoEstimateInput {
  bitrateMbps?: number;
  durationMinutes?: number;
  resolutionTag?: string; // 如 "1080p", "4K"
}

export interface AiEstimateInput {
  tokenCount?: number;
  observedRequestBytes?: bigint;
  observedFileBytes?: bigint;
  taskDurationSeconds?: number;
}

export type EstimateOutcome<T> = 
  | { status: 'success'; data: T }
  | { status: 'insufficient-data'; missingFields: string[]; explanation: string };

/**
 * 视频流量估算
 * 测试向量 L 约束：仅有分辨率标签而无实测码率与有效时长时，必须输出“信息不足”，禁止盲目套用万能固定 GB
 */
export function estimateVideoTraffic(input: VideoEstimateInput): EstimateOutcome<{
  estimatedBytes: bigint;
  bitrateUsedMbps: number;
  durationMinutesUsed: number;
}> {
  const missing: string[] = [];
  if (input.bitrateMbps === undefined || input.bitrateMbps <= 0) {
    missing.push('实测码率 (bitrateMbps)');
  }
  if (input.durationMinutes === undefined || input.durationMinutes <= 0) {
    missing.push('播放时长 (durationMinutes)');
  }

  if (missing.length > 0) {
    return {
      status: 'insufficient-data',
      missingFields: missing,
      explanation: '信息不足：同一分辨率（如 1080p/4K）因平台编码、帧率与自适应策略不同，码率差异极大。未提供实测码率或有效时长前，无法生成可复查的真实流量数值。',
    };
  }

  // 码率 (Mbps) * 10^6 * (durationMinutes * 60) / 8
  const durationSec = BigInt(Math.round(input.durationMinutes! * 60));
  const bitsPerSec = BigInt(Math.round(input.bitrateMbps! * 1_000_000));
  const estimatedBytes = (bitsPerSec * durationSec) / 8n;

  return {
    status: 'success',
    data: {
      estimatedBytes,
      bitrateUsedMbps: input.bitrateMbps!,
      durationMinutesUsed: input.durationMinutes!,
    },
  };
}

/**
 * AI 用量估算
 * 测试向量 L 约束：仅有 Token 数、无请求文件/载荷测量条件时，禁止臆造固定 Token->GB 转换系数
 */
export function estimateAiTraffic(input: AiEstimateInput): EstimateOutcome<{
  totalNetworkBytes: bigint;
  payloadBytes: bigint;
  overheadEstimatedBytes: bigint;
}> {
  // 必须有可观察到的请求或文件字节
  const hasObservedBytes = (input.observedRequestBytes !== undefined && input.observedRequestBytes > 0n) ||
                           (input.observedFileBytes !== undefined && input.observedFileBytes > 0n);

  if (!hasObservedBytes) {
    return {
      status: 'insufficient-data',
      missingFields: ['已观测网络载荷 (observedRequestBytes/observedFileBytes)'],
      explanation: '信息不足：Token 属于模型计算配额，并非网络传输字节。仅有 Token 数量而无实际 HTTP 载荷、附件体积与会话数据时，严禁生造固定换算比例。',
    };
  }

  const reqBytes = input.observedRequestBytes || 0n;
  const fileBytes = input.observedFileBytes || 0n;
  const payloadBytes = reqBytes + fileBytes;

  // 基础传输开销按实际传输估算
  return {
    status: 'success',
    data: {
      totalNetworkBytes: payloadBytes,
      payloadBytes,
      overheadEstimatedBytes: 0n,
    },
  };
}
