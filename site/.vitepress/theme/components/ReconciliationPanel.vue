<template>
  <div class="ledger-tool-card">
    <div class="ledger-tool-header">
      <div class="ledger-tool-title">账单核对与扣量差异诊断面板 (Reconciliation Panel)</div>
      <div class="evidence-badge packet-snapshot">多因排查闭环</div>
    </div>

    <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 1rem;">
      输入本地观察量与服务商后台扣量，自动根据倍率与方向规则进行比对，逐项定位差额原因，绝不凭差额武断指控服务方。
    </div>

    <div class="ledger-input-group">
      <div>
        <label class="ledger-input-label">本地观察上传量 (GB)</label>
        <input type="number" min="0" step="0.1" class="ledger-input-control" v-model.number="uploadGb" />
      </div>
      <div>
        <label class="ledger-input-label">本地观察下载量 (GB)</label>
        <input type="number" min="0" step="0.1" class="ledger-input-control" v-model.number="downloadGb" />
      </div>
      <div>
        <label class="ledger-input-label">预期节点倍率</label>
        <input type="number" min="0" step="0.1" class="ledger-input-control" v-model.number="multiplier" />
      </div>
      <div>
        <label class="ledger-input-label">计费方向规则</label>
        <select class="ledger-input-control" v-model="directionRule">
          <option value="bidirectional">双向计费 (上传+下载)</option>
          <option value="download-only">单向计费 (仅下载)</option>
          <option value="unconfirmed">规则未明确</option>
        </select>
      </div>
      <div>
        <label class="ledger-input-label">服务商后台实际扣量 (GB)</label>
        <input type="number" min="0" step="0.1" class="ledger-input-control" v-model.number="actualBilledGb" />
      </div>
    </div>

    <div class="ledger-result-box">
      <div class="ledger-result-grid">
        <div class="ledger-stat-item">
          <div class="ledger-stat-label">本地预期扣量基准</div>
          <div class="ledger-stat-value">
            <span v-if="!analysis.isUnconfirmed">{{ expectedGb.toFixed(2) }} GB</span>
            <span v-else style="font-size: 0.85rem; color: #ea580c;">待确认</span>
          </div>
        </div>
        <div class="ledger-stat-item">
          <div class="ledger-stat-label">后台实际扣量</div>
          <div class="ledger-stat-value">{{ actualBilledGb.toFixed(2) }} GB</div>
        </div>
        <div class="ledger-stat-item">
          <div class="ledger-stat-label">观察差额 (实际 - 预期)</div>
          <div class="ledger-stat-value" :style="{ color: deltaGb > 0.05 ? '#dc2626' : deltaGb < -0.05 ? '#2563eb' : '#16a34a' }">
            {{ deltaGb > 0 ? '+' : '' }}{{ deltaGb.toFixed(2) }} GB
            <span v-if="analysis.percentageDiff !== null" style="font-size: 0.8rem;">({{ analysis.percentageDiff.toFixed(1) }}%)</span>
          </div>
        </div>
      </div>

      <div style="margin-top: 1rem; border-top: 1px solid #e2e8f0; padding-top: 0.75rem;">
        <div style="font-size: 0.9rem; font-weight: 600; color: #1e293b; margin-bottom: 0.35rem;">差额诊断与可能原因排查：</div>
        <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.85rem; color: #475569; line-height: 1.6;">
          <li v-for="(cause, i) in analysis.possibleCauses" :key="i">{{ cause }}</li>
        </ul>
      </div>

      <div style="font-size: 0.775rem; color: #64748b; margin-top: 0.75rem; font-style: italic;">
        * 证据声明：观察差额并非服务方恶意多扣的证据。在向客服反馈前，请务必准备好同一时间段的脱敏截图、网络连接层级记录与时区说明。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { analyzeBillingReconciliation } from '@lib/reconcile';
import { toBytes } from '@lib/units';
import { RateRuleType } from '@lib/types';

const uploadGb = ref(2.0);
const downloadGb = ref(18.0);
const multiplier = ref(1.0);
const directionRule = ref<RateRuleType>('bidirectional');
const actualBilledGb = ref(21.5);

const analysis = computed(() => {
  const up = toBytes(Math.max(0, uploadGb.value || 0), 'GB');
  const down = toBytes(Math.max(0, downloadGb.value || 0), 'GB');
  const actual = toBytes(Math.max(0, actualBilledGb.value || 0), 'GB');
  const mult = Math.max(0, multiplier.value || 0);

  return analyzeBillingReconciliation({
    observedUploadBytes: up,
    observedDownloadBytes: down,
    actualBilledBytes: actual,
    expectedMultiplier: mult,
    directionRule: directionRule.value,
  });
});

const oneGb = 1_000_000_000n;
const expectedGb = computed(() => Number(analysis.value.expectedBilledBytes) / Number(oneGb));
const deltaGb = computed(() => Number(analysis.value.deltaBytes) / Number(oneGb));
</script>
