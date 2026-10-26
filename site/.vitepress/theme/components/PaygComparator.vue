<template>
  <div class="ledger-tool-card">
    <div class="ledger-tool-header">
      <div class="ledger-tool-title">按量方案与流量包成本比较器 (PAYG Comparator)</div>
      <div class="evidence-badge model-estimate">整包阶梯模型</div>
    </div>

    <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 1rem;">
      覆盖测试向量 I 与 J：整包不可拆分购买阶梯计算、额度标称单价 vs 实际使用单位成本严格分离。
    </div>

    <div class="ledger-input-group">
      <div>
        <label class="ledger-input-label">流量包容量 (GB/包)</label>
        <input type="number" min="1" step="10" class="ledger-input-control" v-model.number="packSizeGb" />
      </div>
      <div>
        <label class="ledger-input-label">单包售价 (元)</label>
        <input type="number" min="0" step="1" class="ledger-input-control" v-model.number="packPriceYuan" />
      </div>
      <div>
        <label class="ledger-input-label">预计任务需求量 (GB)</label>
        <input type="number" min="0" step="5" class="ledger-input-control" v-model.number="neededGb" />
      </div>
      <div>
        <label class="ledger-input-label">买后实际使用量 (GB，复盘使用)</label>
        <input type="number" min="0" step="5" class="ledger-input-control" v-model.number="actualUsageGb" />
      </div>
    </div>

    <div class="ledger-result-box">
      <div class="ledger-result-grid">
        <div class="ledger-stat-item">
          <div class="ledger-stat-label">必须整包购买量</div>
          <div class="ledger-stat-value" style="color: #2563eb;">{{ result.packsToBuy }} 包 ({{ result.packsToBuy * packSizeGb }} GB)</div>
        </div>
        <div class="ledger-stat-item">
          <div class="ledger-stat-label">本次实际现金支出</div>
          <div class="ledger-stat-value" style="color: #0f172a;">¥ {{ (result.totalCostCents / 100).toFixed(2) }}</div>
        </div>
        <div class="ledger-stat-item">
          <div class="ledger-stat-label">任务完成后剩余闲置额度</div>
          <div class="ledger-stat-value" style="color: #64748b;">{{ leftoverGb.toFixed(2) }} GB</div>
        </div>
        <div class="ledger-stat-item">
          <div class="ledger-stat-label">额度标称单价</div>
          <div class="ledger-stat-value">{{ result.quotaUnitPricePerGB.toFixed(3) }} 元/GB</div>
        </div>
        <div class="ledger-stat-item">
          <div class="ledger-stat-label">实际使用真实单位成本</div>
          <div class="ledger-stat-value" style="color: #dc2626;">
            <span v-if="result.actualUsageUnitCostPerGB !== null">
              {{ result.actualUsageUnitCostPerGB.toFixed(3) }} 元/GB
            </span>
            <span v-else style="font-size: 0.85rem; color: #94a3b8;">不可计算 (实际用量为0)</span>
          </div>
        </div>
      </div>

      <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.75rem;">
        * 深度说明：标称单价仅代表购买容量成本；若任务未能完全消耗该包流量，沉没的闲置额度会使实际每 GB 使用成本大幅上升。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { calculatePaygPackCost } from '@lib/payg';
import { toBytes } from '@lib/units';

const packSizeGb = ref(100);
const packPriceYuan = ref(10);
const neededGb = ref(230);
const actualUsageGb = ref(40);

const result = computed(() => {
  const packBytes = toBytes(Math.max(1, packSizeGb.value || 1), 'GB');
  const neededBytes = toBytes(Math.max(0, neededGb.value || 0), 'GB');
  const actualBytes = toBytes(Math.max(0, actualUsageGb.value || 0), 'GB');
  const priceCents = Math.round(Math.max(0, packPriceYuan.value || 0) * 100);

  return calculatePaygPackCost(packBytes, priceCents, neededBytes, actualBytes);
});

const leftoverGb = computed(() => {
  const oneGb = 1_000_000_000n;
  return Number(result.value.leftoverBytes) / Number(oneGb);
});
</script>
