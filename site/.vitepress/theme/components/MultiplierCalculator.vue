<template>
  <div class="ledger-tool-card">
    <div class="ledger-tool-header">
      <div class="ledger-tool-title">倍率扣量与可用额度计算器 (Multiplier Calculator)</div>
      <div class="evidence-badge standard-rule">严密加权模型</div>
    </div>

    <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 1rem;">
      覆盖测试向量 C, D, E：加权倍率计算、方向扣量规则（单向/双向）、剩余额度可用传输预算推算。
    </div>

    <!-- 模式切换 -->
    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
      <button :class="['ledger-btn', mode === 'weighted' ? 'ledger-btn-primary' : 'ledger-btn-secondary']" @click="mode = 'weighted'">
        混合多节点加权计算
      </button>
      <button :class="['ledger-btn', mode === 'direction' ? 'ledger-btn-primary' : 'ledger-btn-secondary']" @click="mode = 'direction'">
        上下行方向扣量核算
      </button>
      <button :class="['ledger-btn', mode === 'budget' ? 'ledger-btn-primary' : 'ledger-btn-secondary']" @click="mode = 'budget'">
        剩余额度传输预算
      </button>
    </div>

    <!-- 模式 1: 多节点加权 -->
    <div v-if="mode === 'weighted'">
      <div style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; color: #1e293b;">
        分段节点用量输入 (例: 30GB @ 0.5x + 20GB @ 2.0x)
      </div>

      <div v-for="(seg, idx) in segments" :key="idx" class="ledger-input-group" style="align-items: flex-end; margin-bottom: 0.75rem;">
        <div>
          <label class="ledger-input-label">节点名称/描述</label>
          <input type="text" class="ledger-input-control" v-model="seg.name" placeholder="例如: 节点 A" />
        </div>
        <div>
          <label class="ledger-input-label">实际传输量 (GB)</label>
          <input type="number" step="0.1" min="0" class="ledger-input-control" v-model.number="seg.gb" />
        </div>
        <div>
          <label class="ledger-input-label">计费倍率</label>
          <input type="number" step="0.1" min="0" class="ledger-input-control" v-model.number="seg.multiplier" />
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button v-if="segments.length > 1" class="ledger-btn ledger-btn-secondary" style="color: #dc2626;" @click="removeSegment(idx)">删除</button>
        </div>
      </div>

      <button class="ledger-btn ledger-btn-secondary" style="margin-bottom: 1rem;" @click="addSegment">+ 增加节点分段</button>

      <div class="ledger-result-box">
        <div class="ledger-result-grid">
          <div class="ledger-stat-item">
            <div class="ledger-stat-label">实际物理传输量</div>
            <div class="ledger-stat-value">{{ weightedResult.totalActualGb.toFixed(2) }} GB</div>
          </div>
          <div class="ledger-stat-item">
            <div class="ledger-stat-label">后台应扣量 (计费量)</div>
            <div class="ledger-stat-value" style="color: #2563eb;">{{ weightedResult.totalBilledGb.toFixed(2) }} GB</div>
          </div>
          <div class="ledger-stat-item">
            <div class="ledger-stat-label">按传输量加权综合倍率</div>
            <div class="ledger-stat-value" style="color: #16a34a;">{{ weightedResult.weightedMultiplier.toFixed(2) }} x</div>
          </div>
        </div>
        <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.5rem;">
          * 说明：综合倍率基于实际传输字节加权计算（计费量 ÷ 实际量），绝不可直接把节点倍率标签作算术平均。
        </div>
      </div>
    </div>

    <!-- 模式 2: 上下行方向扣量 -->
    <div v-else-if="mode === 'direction'">
      <div class="ledger-input-group">
        <div>
          <label class="ledger-input-label">实际上传量 (GB)</label>
          <input type="number" step="0.1" min="0" class="ledger-input-control" v-model.number="dirForm.uploadGb" />
        </div>
        <div>
          <label class="ledger-input-label">实际下载量 (GB)</label>
          <input type="number" step="0.1" min="0" class="ledger-input-control" v-model.number="dirForm.downloadGb" />
        </div>
        <div>
          <label class="ledger-input-label">节点倍率</label>
          <input type="number" step="0.1" min="0" class="ledger-input-control" v-model.number="dirForm.multiplier" />
        </div>
        <div>
          <label class="ledger-input-label">方向计费规则</label>
          <select class="ledger-input-control" v-model="dirForm.ruleType">
            <option value="bidirectional">双向计费 (上传+下载均扣量)</option>
            <option value="download-only">仅计费下载 (上传免费)</option>
            <option value="unconfirmed">规则未确认 (待核实)</option>
          </select>
        </div>
      </div>

      <div class="ledger-result-box">
        <div v-if="directionResult.status === 'confirmed'">
          <div class="ledger-result-grid">
            <div class="ledger-stat-item">
              <div class="ledger-stat-label">扣量计费总量</div>
              <div class="ledger-stat-value" style="color: #2563eb;">{{ directionResult.billedGb?.toFixed(2) }} GB</div>
            </div>
          </div>
          <div style="font-size: 0.85rem; color: #475569; margin-top: 0.5rem;">
            {{ directionResult.explanation }}
          </div>
        </div>
        <div v-else style="color: #ea580c; font-size: 0.9rem;">
          ⚠️ 警告：计费方向规则未明确，禁止任意选用较低计算结果。请在用户后台或联系客服确认上下行扣量规则。
        </div>
      </div>
    </div>

    <!-- 模式 3: 剩余预算 -->
    <div v-else>
      <div class="ledger-input-group">
        <div>
          <label class="ledger-input-label">套餐剩余计费额度 (GB)</label>
          <input type="number" step="1" min="0" class="ledger-input-control" v-model.number="budgetForm.remainingGb" />
        </div>
        <div>
          <label class="ledger-input-label">计划使用节点倍率</label>
          <input type="number" step="0.1" min="0" class="ledger-input-control" v-model.number="budgetForm.multiplier" />
        </div>
      </div>

      <div class="ledger-result-box">
        <div v-if="budgetResult.isInfiniteSpecialCase" style="color: #ea580c; font-size: 0.9rem;">
          {{ budgetResult.warningNote }}
        </div>
        <div v-else class="ledger-result-grid">
          <div class="ledger-stat-item">
            <div class="ledger-stat-label">可传输实际数据预算</div>
            <div class="ledger-stat-value" style="color: #16a34a;">{{ budgetResult.usableGb?.toFixed(2) }} GB</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { calculateWeightedMultiplier, calculateDirectionalBilledBytes, calculateUsableTransferBudget } from '@lib/multiplier';
import { toBytes } from '@lib/units';
import { RateRuleType } from '@lib/types';

const mode = ref<'weighted' | 'direction' | 'budget'>('weighted');

// 模式 1 数据
const segments = ref([
  { name: '低倍率节点', gb: 30, multiplier: 0.5 },
  { name: '高倍率节点', gb: 20, multiplier: 2.0 },
]);

function addSegment() {
  segments.value.push({ name: `节点 ${segments.value.length + 1}`, gb: 10, multiplier: 1.0 });
}

function removeSegment(idx: number) {
  segments.value.splice(idx, 1);
}

const weightedResult = computed(() => {
  const segs = segments.value.map(s => ({
    actualBytes: toBytes(Math.max(0, s.gb || 0), 'GB'),
    multiplier: Math.max(0, s.multiplier || 0),
  }));
  const res = calculateWeightedMultiplier(segs);
  const oneGb = 1_000_000_000n;
  return {
    totalActualGb: Number(res.totalActualBytes) / Number(oneGb),
    totalBilledGb: Number(res.totalBilledBytes) / Number(oneGb),
    weightedMultiplier: res.weightedMultiplier,
  };
});

// 模式 2 数据
const dirForm = ref({
  uploadGb: 10,
  downloadGb: 30,
  multiplier: 1.5,
  ruleType: 'bidirectional' as RateRuleType,
});

const directionResult = computed(() => {
  const up = toBytes(Math.max(0, dirForm.value.uploadGb || 0), 'GB');
  const down = toBytes(Math.max(0, dirForm.value.downloadGb || 0), 'GB');
  const mult = Math.max(0, dirForm.value.multiplier || 0);
  const res = calculateDirectionalBilledBytes(up, down, mult, dirForm.value.ruleType);

  const oneGb = 1_000_000_000n;
  return {
    status: res.status,
    billedGb: res.billedBytes ? Number(res.billedBytes) / Number(oneGb) : null,
    explanation: res.ruleExplanation,
  };
});

// 模式 3 数据
const budgetForm = ref({
  remainingGb: 100,
  multiplier: 2.0,
});

const budgetResult = computed(() => {
  const quota = toBytes(Math.max(0, budgetForm.value.remainingGb || 0), 'GB');
  const mult = Math.max(0, budgetForm.value.multiplier || 0);
  const res = calculateUsableTransferBudget(quota, mult);
  const oneGb = 1_000_000_000n;
  return {
    usableGb: res.usableTransferBytes ? Number(res.usableTransferBytes) / Number(oneGb) : null,
    isInfiniteSpecialCase: res.isInfiniteSpecialCase,
    warningNote: res.warningNote,
  };
});
</script>
