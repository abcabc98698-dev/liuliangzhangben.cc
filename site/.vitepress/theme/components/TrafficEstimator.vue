<template>
  <div class="ledger-tool-card">
    <div class="ledger-tool-header">
      <div class="ledger-tool-title">综合流量需求估算器 (Traffic Estimator)</div>
      <div class="evidence-badge model-estimate">情景推导模型</div>
    </div>

    <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 1rem;">
      基于实际任务、使用时长、文件体积与使用频率建立低、中、高三种情景，拒绝万能固定日均值。
    </div>

    <div class="ledger-input-group">
      <div>
        <label class="ledger-input-label">常规网页与文本浏览 (小时/天)</label>
        <input type="number" min="0" step="0.5" class="ledger-input-control" v-model.number="webHours" />
      </div>
      <div>
        <label class="ledger-input-label">视频流媒体播放 (小时/天)</label>
        <input type="number" min="0" step="0.5" class="ledger-input-control" v-model.number="videoHours" />
      </div>
      <div>
        <label class="ledger-input-label">预计平均视频码率 (Mbps)</label>
        <input type="number" min="1" step="1" class="ledger-input-control" v-model.number="videoBitrateMbps" />
      </div>
      <div>
        <label class="ledger-input-label">每月大文件下载/同步总量 (GB)</label>
        <input type="number" min="0" step="10" class="ledger-input-control" v-model.number="fileTransferGb" />
      </div>
      <div>
        <label class="ledger-input-label">月有效活跃使用天数</label>
        <input type="number" min="1" max="31" class="ledger-input-control" v-model.number="activeDays" />
      </div>
    </div>

    <div class="ledger-result-box">
      <div style="font-size: 0.95rem; font-weight: 600; color: #1e293b; margin-bottom: 0.75rem;">
        月度需求情景预测区间 (不冒充确定性概率)
      </div>
      <div class="ledger-result-grid">
        <div class="ledger-stat-item" style="border-left: 3px solid #64748b; padding-left: 0.75rem;">
          <div class="ledger-stat-label">低负荷情景 (仅常规轻量任务)</div>
          <div class="ledger-stat-value" style="color: #475569;">{{ scenarios.low.toFixed(1) }} GB</div>
          <div style="font-size: 0.75rem; color: #64748b;">自适应码率降低 40%</div>
        </div>
        <div class="ledger-stat-item" style="border-left: 3px solid #2563eb; padding-left: 0.75rem;">
          <div class="ledger-stat-label">基准情景 (日常标准任务)</div>
          <div class="ledger-stat-value" style="color: #2563eb;">{{ scenarios.base.toFixed(1) }} GB</div>
          <div style="font-size: 0.75rem; color: #64748b;">设定参数正常运行</div>
        </div>
        <div class="ledger-stat-item" style="border-left: 3px solid #dc2626; padding-left: 0.75rem;">
          <div class="ledger-stat-label">高负荷情景 (大文件+集中追剧)</div>
          <div class="ledger-stat-value" style="color: #dc2626;">{{ scenarios.high.toFixed(1) }} GB</div>
          <div style="font-size: 0.75rem; color: #64748b;">码率浮动+重传 30% 余量</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const webHours = ref(2);
const videoHours = ref(1.5);
const videoBitrateMbps = ref(6);
const fileTransferGb = ref(20);
const activeDays = ref(22);

const scenarios = computed(() => {
  // 基础日常每小时消耗
  // web: ~0.15 GB/hr
  const webDailyGb = webHours.value * 0.15;
  // video: mbps * 3600 / 8 / 1000 = video GB/hr
  const videoHourlyGb = (videoBitrateMbps.value * 3600) / 8000;
  const videoDailyGb = videoHours.value * videoHourlyGb;

  const baseMonthly = (webDailyGb + videoDailyGb) * activeDays.value + fileTransferGb.value;

  return {
    low: Math.max(5, baseMonthly * 0.7),
    base: Math.max(10, baseMonthly),
    high: Math.max(15, baseMonthly * 1.35),
  };
});
</script>
