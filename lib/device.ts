/**
 * 多设备与观察层级去重模块
 * 覆盖测试向量 G：热点与客户端观察去重
 */

export interface DeviceObservationItem {
  id: string;
  deviceAlias: string;
  taskId?: string;
  observedBytes: bigint;
  tier: 'app' | 'device' | 'hotspot-hop' | 'gateway' | 'provider-exit';
  eventFingerprint?: string; // 时间戳+外网目标脱敏特征
}

export interface DeduplicationResult {
  effectiveTotalBytes: bigint;
  duplicateDeductedBytes: bigint;
  unconfirmedItems: DeviceObservationItem[];
  reasons: string[];
}

/**
 * 测试向量 G: 跨设备/跨层级去重汇总
 * 规则：
 * 1. 同一物理外网任务在热点分享端 (hotspot-hop) 与终端客户端 (device) 均被记录时，属于网络中继，对外传输仅计 10GB 而非 20GB。
 * 2. 无法确认是否同一事件时，必须标注为“待核对”，禁止仅因字节数相同强行合并。
 */
export function aggregateDeviceObservations(items: DeviceObservationItem[]): DeduplicationResult {
  let effectiveTotal = 0n;
  let duplicateDeducted = 0n;
  const unconfirmed: DeviceObservationItem[] = [];
  const reasons: string[] = [];

  // 按任务指纹分组
  const groupsByFingerprint = new Map<string, DeviceObservationItem[]>();

  for (const item of items) {
    if (!item.eventFingerprint && !item.taskId) {
      // 无法确认事件关联性
      unconfirmed.push(item);
      effectiveTotal += item.observedBytes;
      continue;
    }

    const key = item.taskId || item.eventFingerprint!;
    if (!groupsByFingerprint.has(key)) {
      groupsByFingerprint.set(key, []);
    }
    groupsByFingerprint.get(key)!.push(item);
  }

  for (const [key, group] of groupsByFingerprint.entries()) {
    if (group.length === 1) {
      effectiveTotal += group[0].observedBytes;
    } else {
      // 检查是否包含热点中继 + 设备客户端重复观察
      const hasHotspot = group.some(i => i.tier === 'hotspot-hop');
      const hasDevice = group.some(i => i.tier === 'device');

      if (hasHotspot && hasDevice) {
        // 同一事件的热点与终端去重，保留最大的一笔外网观察值
        const maxBytes = group.reduce((max, i) => i.observedBytes > max ? i.observedBytes : max, 0n);
        const sumBytes = group.reduce((sum, i) => sum + i.observedBytes, 0n);
        effectiveTotal += maxBytes;
        duplicateDeducted += (sumBytes - maxBytes);
        reasons.push(`任务 [${key}]: 识别到手机热点与电脑客户端对同一外网任务的多级观察，已按外网单次传输 ${maxBytes} 字节计入，剔除中继重复计数 ${sumBytes - maxBytes} 字节。`);
      } else {
        // 同一 fingerprint 但层级不同且缺乏中继明确关系
        effectiveTotal += group[0].observedBytes;
        for (let j = 1; j < group.length; j++) {
          unconfirmed.push(group[j]);
        }
        reasons.push(`任务 [${key}]: 存在同标识的重复记录，已标记待核对。`);
      }
    }
  }

  return {
    effectiveTotalBytes: effectiveTotal,
    duplicateDeductedBytes: duplicateDeducted,
    unconfirmedItems: unconfirmed,
    reasons,
  };
}
