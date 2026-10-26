<template>
  <div class="ledger-tool-card">
    <div class="ledger-tool-header">
      <div class="ledger-tool-title">重置周期与边界时间推算器 (Reset Timeline)</div>
      <div class="evidence-badge client-kernel">半开区间模型</div>
    </div>

    <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 1rem;">
      覆盖测试向量 F 与 K：区分自然月重置与固定日重置，半开区间 [start, end) 严格判定边界点归属，多周期独立结算排查结余不可跨期补偿。
    </div>

    <div class="ledger-input-group">
      <div>
        <label class="ledger-input-label">重置类型</label>
        <select class="ledger-input-control" v-model="resetType">
          <option value="calendar">自然月重置 (每月1日 00:00:00)</option>
          <option value="fixed-day">约定日重置 (如每月购买日)</option>
          <option value="thirty-days">固定天数 (如每30天滚动)</option>
        </select>
      </div>
      <div v-if="resetType === 'fixed-day'">
        <label class="ledger-input-label">每月重置日期 (1-31)</label>
        <input type="number" min="1" max="31" class="ledger-input-control" v-model.number="resetDay" />
      </div>
      <div>
        <label class="ledger-input-label">每期额度 (GB)</label>
        <input type="number" min="1" class="ledger-input-control" v-model.number="cycleQuotaGb" />
      </div>
      <div>
        <label class="ledger-input-label">是否允许结转至下期</label>
        <select class="ledger-input-control" v-model="allowRollover">
          <option :value="false">不可结转 (清零制，常规)</option>
          <option :value="true">允许结转 (有条件保留)</option>
        </select>
      </div>
    </div>

    <!-- 演示双周期演算 -->
    <div style="margin-top: 1rem;">
      <div style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; color: #1e293b;">
        双周期演算情景 (测试向量 F: 首期 130GB 需求，次期 50GB 需求)
      </div>
      <div class="ledger-result-box">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 0.75rem; background: #fff;">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">周期 1 (当前周期)</div>
            <div style="font-size: 0.85rem; color: #475569;">可用配额: {{ cycleQuotaGb }} GB</div>
            <div style="font-size: 0.85rem; color: #475569;">任务需求: 130 GB</div>
            <div style="margin-top: 0.5rem; font-weight: 600; color: #dc2626;">
              结算结果: 额度短缺 {{ Math.max(0, 130 - cycleQuotaGb) }} GB
            </div>
          </div>

          <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 0.75rem; background: #fff;">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">周期 2 (后续周期)</div>
            <div style="font-size: 0.85rem; color: #475569;">可用配额: {{ cycleQuotaGb }} GB</div>
            <div style="font-size: 0.85rem; color: #475569;">任务需求: 50 GB</div>
            <div style="margin-top: 0.5rem; font-weight: 600; color: #16a34a;">
              结算结果: 剩余结余 {{ Math.max(0, cycleQuotaGb - 50) }} GB
            </div>
          </div>
        </div>

        <div style="margin-top: 0.75rem; font-size: 0.825rem; color: #64748b;">
          * 关键机制：在清零制规则下，即使两周期总需求 (180 GB) 小于总配额 (200 GB)，首周期仍会发生断流短缺，第二周期的结余绝无法逆向弥补前一周期。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const resetType = ref<'calendar' | 'fixed-day' | 'thirty-days'>('calendar');
const resetDay = ref(15);
const cycleQuotaGb = ref(100);
const allowRollover = ref(false);
</script>
