<template>
  <div style="margin: 2rem 0;">
    <h3 v-if="title" style="margin-bottom: 1rem;">{{ title }}</h3>

    <div v-for="(item, idx) in items" :key="idx" style="border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 0.75rem; overflow: hidden; background: #fff;">
      <button
        style="width: 100%; text-align: left; padding: 0.85rem 1.25rem; background: #f8fafc; border: none; font-size: 0.95rem; font-weight: 600; color: #1e293b; cursor: pointer; display: flex; justify-content: space-between; align-items: center;"
        @click="toggle(idx)"
      >
        <span>{{ item.q }}</span>
        <span style="font-size: 1.1rem; color: #64748b;">{{ openIndex === idx ? '−' : '+' }}</span>
      </button>

      <div
        v-show="openIndex === idx"
        style="padding: 1rem 1.25rem; font-size: 0.9rem; color: #475569; line-height: 1.6; border-top: 1px solid #e2e8f0;"
      >
        {{ item.a }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title?: string;
  items: {
    q: string;
    a: string;
  }[];
}>();

const openIndex = ref<number | null>(0);

function toggle(idx: number) {
  openIndex.value = openIndex.value === idx ? null : idx;
}
</script>
