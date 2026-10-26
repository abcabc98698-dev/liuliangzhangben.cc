<template>
  <div class="ledger-tool-card">
    <div class="ledger-tool-header">
      <div class="ledger-tool-title">视频流量与码率换算器 (Video Estimator)</div>
      <div class="evidence-badge standard-rule">严密速率换算</div>
    </div>

    <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 1rem;">
      覆盖测试向量 B 与 L：以实测码率与播放时长推算真实流量，拒绝仅凭“1080p”或“4K”标签盲目套用固定万能 GB 数。
    </div>

    <div class="ledger-input-group">
      <div>
        <label class="ledger-input-label">视频分辨率参考</label>
        <select class="ledger-input-control" v-model="selectedResolution" @change="onResolutionChange">
          <option value="custom">自定义输入实测码率 (推荐)</option>
          <option value="1080p">常见 1080p (参考范围 4~8 Mbps)</option>
          <option value="4k">常见 4K (参考范围 15~35 Mbps)</option>
          <option value="label-only">仅有分辨率标签 (模拟信息不足测试)</option>
        </select>
      </div>
      <div>
        <label class="ledger-input-label">持续平均码率 (Mbps)</label>
        <input type="number" min="0" step="0.5" class="ledger-input-control" v-model.number="bitrateMbps" :disabled="selectedResolution === 'label-only'" />
      </div>
      <div>
        <label class="ledger-input-label">观看时长 (小时)</label>
        <input type="number" min="0" step="0.5" class="ledger-input-control" v-model.number="durationHours" :disabled="selectedResolution === 'label-only'" />
      </div>
    </div>

    <div class="ledger-result-box">
      <div v-if="outcome.status === 'success'">
        <div class="ledger-result-grid">
          <div class="ledger-stat-item">
            <div class="ledger-stat-label">本次观看总传输量</div>
            <div class="ledger-stat-value" style="color: #2563eb;">{{ outcome.gb?.toFixed(2) }} GB</div>
          </div>
          <div class="ledger-stat-item">
            <div class="ledger-stat-label">整数字节精准值</div>
            <div class="ledger-stat-value" style="font-size: 0.9rem; color: #475569;">{{ outcome.bytes }} B</div>
          </div>
        </div>
        <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.5rem;">
          * 演算说明：恒定 {{ bitrateMbps }} Mbps 持续 {{ durationHours }} 小时，公式：({{ bitrateMbps }} × 10^6 × {{ durationHours * 3600 }}) ÷ 8 = {{ outcome.bytes }} 字节。
        </div>
      </div>

      <div v-else style="color: #ea580c; font-size: 0.9rem;">
        ⚠️ {{ outcome.explanation }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { estimateVideoTraffic } from '@lib/estimator';

const selectedResolution = ref('custom');
const bitrateMbps = ref<number | undefined>(8);
const durationHours = ref<number | undefined>(2);

function onResolutionChange() {
  if (selectedResolution.value === '1080p') {
    bitrateMbps.value = 6;
    durationHours.value = 2;
  } else if (selectedResolution.value === '4k') {
    bitrateMbps.value = 25;
    durationHours.value = 2;
  } else if (selectedResolution.value === 'label-only') {
    bitrateMbps.value = undefined;
    durationHours.value = undefined;
  }
}

const outcome = computed(() => {
  if (selectedResolution.value === 'label-only' || !bitrateMbps.value || !durationHours.value) {
    const res = estimateVideoTraffic({ resolutionTag: '1080p' });
    if (res.status === 'insufficient-data') {
      return {
        status: 'insufficient-data',
        explanation: res.explanation,
      };
    }
  }

  const res = estimateVideoTraffic({
    bitrateMbps: bitrateMbps.value,
    durationMinutes: (durationHours.value || 0) * 60,
  });

  if (res.status === 'success') {
    const oneGb = 1_000_000_000n;
    return {
      status: 'success',
      bytes: res.data.estimatedBytes.toString(),
      gb: Number(res.data.estimatedBytes) / Number(oneGb),
    };
  }

  return {
    status: 'insufficient-data',
    explanation: res.explanation,
  };
});
</script>
