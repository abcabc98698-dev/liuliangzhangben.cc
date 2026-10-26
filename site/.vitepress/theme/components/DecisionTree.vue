<template>
  <div class="decision-tree-container">
    <div style="font-size: 1.05rem; font-weight: 600; color: #0f172a; margin-bottom: 0.75rem;">
      {{ title || '决策流程树' }}
    </div>

    <div v-for="(step, index) in steps" :key="index" class="decision-step">
      <div style="font-weight: 600; font-size: 0.9rem; color: #1e293b; margin-bottom: 0.25rem;">
        节点 {{ index + 1 }}：{{ step.condition }}
      </div>
      <div style="font-size: 0.85rem; color: #475569; line-height: 1.5;">
        ↳ {{ step.action }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  steps: {
    condition: string;
    action: string;
  }[];
}>();
</script>
