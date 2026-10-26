<template>
  <div class="main-site-cta-card">
    <h4>{{ title || '已核对本周期额度与倍率？前往主站比较实际服务' }}</h4>
    <p>
      {{ description || '当前各项用量条件已明确。若需要对比符合该额度、倍率规则与重置周期的真实服务商套餐，可前往主站查看详细评测与规则对照。' }}
    </p>

    <div v-if="conditionSummary" class="ledger-result-box" style="margin-bottom: 1rem;">
      <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; color: #334155;">已明确的选购需求条件卡：</div>
      <div style="font-size: 0.85rem; color: #475569;">{{ conditionSummary }}</div>
    </div>

    <div class="main-site-cta-footer">
      <a
        :href="safeTargetUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="ledger-btn ledger-btn-primary"
      >
        {{ buttonText || '在机场榜一比较实际套餐 →' }}
      </a>

      <div style="font-size: 0.8rem; color: #64748b;">
        共同运营合作披露 · 无需购买即可完整使用本站所有工具
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { buildSafeMainSiteUrl, UtmCampaign } from '@lib/safety';

const props = withDefaults(
  defineProps<{
    targetPath?: string;
    campaign?: UtmCampaign;
    slug?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    conditionSummary?: string;
  }>(),
  {
    targetPath: '/pricing/',
    campaign: 'usage_selection',
    slug: 'inline_card',
  }
);

const safeTargetUrl = computed(() => {
  return buildSafeMainSiteUrl(props.targetPath, props.campaign, props.slug);
});
</script>
