<template>
  <span :class="['evidence-badge', typeClass]">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    type?: 'service-claim' | 'client-kernel' | 'model-estimate' | 'packet-snapshot' | 'standard-rule';
    label?: string;
  }>(),
  {
    type: 'standard-rule',
    label: '工程规范'
  }
);

const typeClass = computed(() => {
  return props.type;
});
</script>
