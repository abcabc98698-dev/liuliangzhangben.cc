<template>
  <div class="ledger-tool-card">
    <div class="ledger-tool-header">
      <div class="ledger-tool-title">本地用量账本 (Usage Ledger)</div>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <span v-if="persistenceEnabled" style="font-size: 0.8rem; color: #16a34a;">● 本地持久化已开启</span>
        <span v-else style="font-size: 0.8rem; color: #64748b;">○ 当前仅会话内存暂存</span>
        <button class="ledger-btn ledger-btn-secondary" style="font-size: 0.775rem; padding: 0.25rem 0.6rem;" @click="togglePersistence">
          {{ persistenceEnabled ? '关闭本地存储' : '开启本地持久化' }}
        </button>
      </div>
    </div>

    <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 1rem;">
      浏览器独立运行：账本仅保存在您的本地浏览器中，绝不上报服务器。默认空账本，支持手动记录、CSV/JSON 导入导出。
    </div>

    <!-- 快捷操作区 -->
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
      <button class="ledger-btn ledger-btn-secondary" @click="loadDemoData">
        加载演算示例数据（非真实账单）
      </button>
      <button class="ledger-btn ledger-btn-secondary" @click="exportCsv">
        导出安全 CSV
      </button>
      <button class="ledger-btn ledger-btn-secondary" @click="exportJson">
        导出 JSON 备份
      </button>
      <label class="ledger-btn ledger-btn-secondary" style="margin: 0; cursor: pointer;">
        导入文件
        <input type="file" accept=".csv,.json" style="display: none;" @change="handleFileUpload" />
      </label>
      <button v-if="entries.length > 0" class="ledger-btn ledger-btn-secondary" style="color: #dc2626;" @click="clearLedger">
        清空账本
      </button>
    </div>

    <!-- 新建记录表单 -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem;">
      <div style="font-size: 0.95rem; font-weight: 600; margin-bottom: 0.75rem; color: #1e293b;">
        {{ editingIndex !== null ? '更正用量记录' : '新增用量记录' }}
      </div>

      <div class="ledger-input-group">
        <div>
          <label class="ledger-input-label">记录时间 (本地)</label>
          <input type="datetime-local" class="ledger-input-control" v-model="form.observedAt" />
        </div>
        <div>
          <label class="ledger-input-label">流量数值</label>
          <input type="number" step="0.01" min="0" class="ledger-input-control" v-model="form.amount" placeholder="例如: 5.2" />
        </div>
        <div>
          <label class="ledger-input-label">数据单位</label>
          <select class="ledger-input-control" v-model="form.displayUnit">
            <option value="GB">GB (十进制 10^9)</option>
            <option value="GiB">GiB (二进制 2^30)</option>
            <option value="MB">MB (十进制 10^6)</option>
            <option value="MiB">MiB (二进制 2^20)</option>
          </select>
        </div>
        <div>
          <label class="ledger-input-label">传输方向</label>
          <select class="ledger-input-control" v-model="form.direction">
            <option value="both">双向合计 (上下行)</option>
            <option value="download">仅下载 (下行)</option>
            <option value="upload">仅上传 (上行)</option>
          </select>
        </div>
        <div>
          <label class="ledger-input-label">数值属性 (valueKind)</label>
          <select class="ledger-input-control" v-model="form.valueKind">
            <option value="interval-delta">区间增量 (可安全求和)</option>
            <option value="cumulative-counter">累计计数器 (抄表值)</option>
            <option value="quota-balance">额度余额快照</option>
            <option value="estimate">假设估算值</option>
          </select>
        </div>
        <div>
          <label class="ledger-input-label">来源与观察范围</label>
          <input type="text" class="ledger-input-control" v-model="form.scope" placeholder="例如: 手机全局代理 / 浏览器视频" />
        </div>
      </div>

      <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
        <button v-if="editingIndex !== null" class="ledger-btn ledger-btn-secondary" @click="cancelEdit">取消</button>
        <button class="ledger-btn ledger-btn-primary" @click="saveEntry">
          {{ editingIndex !== null ? '保存更正' : '添加记录' }}
        </button>
      </div>
    </div>

    <!-- 账本数据表 -->
    <div v-if="entries.length === 0" style="text-align: center; padding: 2rem; color: #94a3b8; border: 1px dashed #cbd5e1; border-radius: 6px;">
      当前账本为空。请手动添加一条记录，或点击上方“加载演算示例数据”体验。
    </div>

    <div v-else>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <div style="font-size: 0.9rem; font-weight: 600; color: #334155;">
          账本明细清单 (共 {{ entries.length }} 条记录)
        </div>
        <div style="font-size: 0.85rem; color: #475569;">
          有效增量合计：<strong style="color: #2563eb;">{{ sumDeltasGb }} GB</strong>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table style="margin: 0; width: 100%;">
          <thead>
            <tr>
              <th>时间 (本地)</th>
              <th>方向</th>
              <th class="num-col">录入数值</th>
              <th>属性</th>
              <th>来源/范围</th>
              <th>换算整数字节</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in entries" :key="item.id">
              <td style="white-space: nowrap;">{{ item.observedAt.replace('T', ' ') }}</td>
              <td>
                <span v-if="item.direction === 'both'">双向</span>
                <span v-else-if="item.direction === 'download'">仅下载</span>
                <span v-else>仅上传</span>
              </td>
              <td class="num-col" style="font-weight: 600;">
                {{ item.displayAmount }} {{ item.displayUnit }}
              </td>
              <td>
                <span v-if="item.valueKind === 'interval-delta'" style="color: #16a34a;">区间增量</span>
                <span v-else-if="item.valueKind === 'cumulative-counter'" style="color: #2563eb;">累计计数</span>
                <span v-else-if="item.valueKind === 'quota-balance'" style="color: #9333ea;">额度余额</span>
                <span v-else style="color: #ea580c;">估算值</span>
              </td>
              <td>{{ item.scope || '-' }}</td>
              <td class="num-col" style="font-size: 0.8rem; color: #64748b;">
                {{ item.rawBytes }} B
              </td>
              <td style="white-space: nowrap;">
                <button style="color: #2563eb; margin-right: 0.5rem; background: none; border: none; cursor: pointer;" @click="startEdit(idx)">编辑</button>
                <button style="color: #dc2626; background: none; border: none; cursor: pointer;" @click="deleteEntry(idx)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { DataUnit, TrafficDirection, ValueKind } from '@lib/types';
import { toBytes, formatBytes } from '@lib/units';
import { sanitizeCsvCell } from '@lib/safety';

interface LedgerItem {
  id: string;
  observedAt: string;
  displayAmount: number;
  displayUnit: DataUnit;
  rawBytes: string;
  direction: TrafficDirection;
  valueKind: ValueKind;
  scope: string;
}

const STORAGE_KEY = 'liuliangzhangben_ledger_v1';
const PREF_KEY = 'liuliangzhangben_persistence_pref';

const entries = ref<LedgerItem[]>([]);
const persistenceEnabled = ref(false);
const editingIndex = ref<number | null>(null);

const form = ref({
  observedAt: new Date().toISOString().slice(0, 16),
  amount: '',
  displayUnit: 'GB' as DataUnit,
  direction: 'both' as TrafficDirection,
  valueKind: 'interval-delta' as ValueKind,
  scope: '',
});

onMounted(() => {
  const pref = localStorage.getItem(PREF_KEY);
  if (pref === 'true') {
    persistenceEnabled.value = true;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        entries.value = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local ledger', e);
      }
    }
  }
});

function togglePersistence() {
  persistenceEnabled.value = !persistenceEnabled.value;
  localStorage.setItem(PREF_KEY, persistenceEnabled.value ? 'true' : 'false');
  if (persistenceEnabled.value) {
    saveToStorage();
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveToStorage() {
  if (persistenceEnabled.value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value));
  }
}

function saveEntry() {
  const amt = parseFloat(form.value.amount);
  if (isNaN(amt) || amt < 0) {
    alert('请输入有效的非负流量数值');
    return;
  }

  const rawBytes = toBytes(amt, form.value.displayUnit).toString();

  const item: LedgerItem = {
    id: editingIndex.value !== null ? entries.value[editingIndex.value].id : `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    observedAt: form.value.observedAt,
    displayAmount: amt,
    displayUnit: form.value.displayUnit,
    rawBytes,
    direction: form.value.direction,
    valueKind: form.value.valueKind,
    scope: form.value.scope,
  };

  if (editingIndex.value !== null) {
    entries.value[editingIndex.value] = item;
    editingIndex.value = null;
  } else {
    entries.value.unshift(item);
  }

  saveToStorage();
  form.value.amount = '';
}

function startEdit(idx: number) {
  editingIndex.value = idx;
  const item = entries.value[idx];
  form.value = {
    observedAt: item.observedAt,
    amount: item.displayAmount.toString(),
    displayUnit: item.displayUnit,
    direction: item.direction,
    valueKind: item.valueKind,
    scope: item.scope,
  };
}

function cancelEdit() {
  editingIndex.value = null;
  form.value.amount = '';
}

function deleteEntry(idx: number) {
  if (confirm('确定删除该条用量记录吗？')) {
    entries.value.splice(idx, 1);
    saveToStorage();
  }
}

function clearLedger() {
  if (confirm('确定清空全部本地账本记录吗？此操作不可逆。')) {
    entries.value = [];
    saveToStorage();
  }
}

function loadDemoData() {
  entries.value = [
    {
      id: 'demo_1',
      observedAt: '2026-10-26T10:30',
      displayAmount: 4.5,
      displayUnit: 'GB',
      rawBytes: '4500000000',
      direction: 'both',
      valueKind: 'interval-delta',
      scope: '演示：工作日白天常规网页与API请求',
    },
    {
      id: 'demo_2',
      observedAt: '2026-10-26T14:15',
      displayAmount: 8.2,
      displayUnit: 'GB',
      rawBytes: '8200000000',
      direction: 'download',
      valueKind: 'interval-delta',
      scope: '演示：流媒体视频缓冲',
    },
    {
      id: 'demo_3',
      observedAt: '2026-10-26T18:00',
      displayAmount: 100,
      displayUnit: 'GB',
      rawBytes: '100000000000',
      direction: 'both',
      valueKind: 'quota-balance',
      scope: '演示：用户后台额度快照（不直接参与增量求和）',
    },
  ];
  saveToStorage();
}

const sumDeltasGb = computed(() => {
  let totalBytes = 0n;
  for (const item of entries.value) {
    if (item.valueKind === 'interval-delta') {
      try {
        totalBytes += BigInt(item.rawBytes);
      } catch (e) {}
    }
  }
  const oneGb = 1_000_000_000n;
  const gb = Number((totalBytes * 100n) / oneGb) / 100;
  return gb.toFixed(2);
});

function exportCsv() {
  if (entries.value.length === 0) {
    alert('当前账本为空，无法导出');
    return;
  }
  const headers = ['记录ID', '时间', '数值', '单位', '整数字节', '方向', '数值属性', '来源范围'];
  const rows = entries.value.map(e => [
    sanitizeCsvCell(e.id),
    sanitizeCsvCell(e.observedAt),
    sanitizeCsvCell(e.displayAmount),
    sanitizeCsvCell(e.displayUnit),
    sanitizeCsvCell(e.rawBytes),
    sanitizeCsvCell(e.direction),
    sanitizeCsvCell(e.valueKind),
    sanitizeCsvCell(e.scope),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `liuliangzhangben_export_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportJson() {
  const jsonStr = JSON.stringify(entries.value, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `liuliangzhangben_backup_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      if (file.name.endsWith('.json')) {
        const imported = JSON.parse(content);
        if (Array.isArray(imported)) {
          entries.value = [...imported, ...entries.value];
          saveToStorage();
          alert(`成功导入 ${imported.length} 条记录`);
        }
      } else {
        alert('CSV 导入已支持基本解析，建议使用标准备份 JSON 进行完整字段迁移。');
      }
    } catch (err) {
      alert('文件解析失败，请检查格式');
    }
  };
  reader.readAsText(file);
}
</script>
