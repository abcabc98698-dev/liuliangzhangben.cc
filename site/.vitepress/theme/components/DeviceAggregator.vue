<template>
  <div class="ledger-tool-card">
    <div class="ledger-tool-header">
      <div class="ledger-tool-title">多设备与热点中继去重器 (Device Aggregator)</div>
      <div class="evidence-badge client-kernel">分层去重模型</div>
    </div>

    <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 1rem;">
      覆盖测试向量 G：同一物理外网任务在热点分享端与终端客户端均有统计时，自动识别中继层级并剔除重复计数，对外传输仅计一次。
    </div>

    <div style="margin-bottom: 1rem;">
      <div style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; color: #1e293b;">
        当前观察记录清单 (演示测试向量 G 场景)
      </div>

      <div style="overflow-x: auto;">
        <table style="margin: 0; width: 100%;">
          <thead>
            <tr>
              <th>设备标识</th>
              <th>网络观察层级</th>
              <th>任务特征指纹</th>
              <th class="num-col">观察流量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in demoItems" :key="item.id">
              <td>{{ item.deviceAlias }}</td>
              <td>
                <span v-if="item.tier === 'hotspot-hop'" style="color: #ea580c;">手机热点中继 (hotspot-hop)</span>
                <span v-else style="color: #2563eb;">电脑客户端 (device)</span>
              </td>
              <td><code>{{ item.taskId }}</code></td>
              <td class="num-col">{{ item.gb }} GB</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="ledger-result-box">
      <div class="ledger-result-grid">
        <div class="ledger-stat-item">
          <div class="ledger-stat-label">未经去重的简单累加总和</div>
          <div class="ledger-stat-value" style="color: #64748b; text-decoration: line-through;">{{ rawSumGb }} GB</div>
        </div>
        <div class="ledger-stat-item">
          <div class="ledger-stat-label">剔除中继后的真实外网用量</div>
          <div class="ledger-stat-value" style="color: #16a34a;">{{ deduplicatedGb }} GB</div>
        </div>
        <div class="ledger-stat-item">
          <div class="ledger-stat-label">识别并扣除的中继重复量</div>
          <div class="ledger-stat-value" style="color: #ea580c;">{{ duplicateDeductedGb }} GB</div>
        </div>
      </div>

      <div style="margin-top: 0.75rem; font-size: 0.85rem; color: #475569;">
        <div v-for="(reason, i) in result.reasons" :key="i">✓ {{ reason }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { aggregateDeviceObservations } from '@lib/device';
import { toBytes } from '@lib/units';

const demoItems = ref([
  { id: '1', deviceAlias: 'iPhone 15 (热点主机)', tier: 'hotspot-hop' as const, taskId: 'sync-work-files', gb: 10 },
  { id: '2', deviceAlias: 'ThinkPad (连接热点)', tier: 'device' as const, taskId: 'sync-work-files', gb: 10 },
]);

const result = computed(() => {
  const items = demoItems.value.map(d => ({
    id: d.id,
    deviceAlias: d.deviceAlias,
    taskId: d.taskId,
    observedBytes: toBytes(d.gb, 'GB'),
    tier: d.tier,
    eventFingerprint: d.taskId,
  }));

  return aggregateDeviceObservations(items);
});

const oneGb = 1_000_000_000n;
const rawSumGb = computed(() => demoItems.value.reduce((acc, cur) => acc + cur.gb, 0));
const deduplicatedGb = computed(() => Number(result.value.effectiveTotalBytes) / Number(oneGb));
const duplicateDeductedGb = computed(() => Number(result.value.duplicateDeductedBytes) / Number(oneGb));
</script>
