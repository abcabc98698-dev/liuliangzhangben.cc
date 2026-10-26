import { ContentNode, SUBCATEGORIES_DEF, CATEGORIES_DEF } from '../../content-meta';
import { ARTICLES_DATA, ArticleMeta } from '../../articles-data';
import { ALL_SUBCATEGORIES_DATA } from './data';
import { SubcategoryData } from './types';

export function generateSubcategoryHub(node: ContentNode): string {
  const catSlug = node.category;
  const subSlug = node.subcategory || '';
  const key = `${catSlug}/${subSlug}`;
  const subData: SubcategoryData | undefined = ALL_SUBCATEGORIES_DATA[key];

  const parentCat = CATEGORIES_DEF.find(c => c.slug === catSlug);
  const parentTitle = parentCat ? parentCat.title : catSlug;

  if (!subData) {
    // Fallback if not matched
    return generateFallbackSubcategory(node);
  }

  const subcatDef = (SUBCATEGORIES_DEF[catSlug] || []).find(s => s.slug === subSlug);
  const clusters = subcatDef?.clusters || [];

  // Generate Section 3: 4 Cluster Cards with their 4 articles
  const clusterCardsMd = clusters.map((cl, cIdx) => {
    const clDetail = subData.clusterDetails[cl.slug] || {
      scenarioPainPoint: '针对该具体细分场景缺乏系统性测量基准与核对标准。',
      engineeringSolution: '遵循网络工程第一性原理，建立精细化参数模型与端到端取证闭环。',
      takeaway: '规范操作流程，消除信息盲区与不必要的流量损耗。'
    };

    const articlesInCluster: ArticleMeta[] = ARTICLES_DATA.filter(
      a => a.category === catSlug && a.subcategory === subSlug && a.cluster === cl.slug
    );

    const articleList = articlesInCluster.map((art, aIdx) => {
      return `  ${aIdx + 1}. [${art.title}](${art.url})`;
    }).join('\n');

    return `### 集群 ${cIdx + 1}：[${cl.title}](/${catSlug}/${subSlug}/${cl.slug}/)

<div class="honeycomb-card" style="border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; background: var(--vp-c-bg-soft);">
  <div style="margin-bottom: 0.75rem;">
    <strong style="color: var(--vp-c-brand-1);">🔍 场景核心痛点：</strong>
    <span style="font-size: 0.95rem;">${clDetail.scenarioPainPoint}</span>
  </div>
  <div style="margin-bottom: 0.75rem;">
    <strong style="color: #10b981;">💡 推荐工程解法：</strong>
    <span style="font-size: 0.95rem;">${clDetail.engineeringSolution}</span>
  </div>
  <div style="margin-bottom: 1rem;">
    <strong style="color: #6366f1;">🎯 预期核心收益：</strong>
    <span style="font-size: 0.95rem;">${clDetail.takeaway}</span>
  </div>

  <div style="border-top: 1px dashed var(--vp-c-divider); padding-top: 0.75rem; margin-top: 0.5rem;">
    <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--vp-c-text-1);">📚 下辖深度攻坚长文导引：</div>
${articleList}
  </div>
</div>`;
  }).join('\n\n');

  // Section 1: First Principles Markdown
  const firstPrinciplesMd = subData.firstPrinciples.map((fp, idx) => {
    return `### ${idx + 1}. ${fp.title}\n${fp.content}`;
  }).join('\n\n');

  // Section 4: Comparison Table Markdown
  const comparisonRowsMd = subData.comparisonTable.map(row => {
    return `| **${row.dimension}** | ${row.commonMistake} | ${row.technicalMechanism} | ${row.impactMagnitude} | ${row.recommendedStrategy} |`;
  }).join('\n');

  // Section 5: Audit Checklist Markdown
  const auditListMd = subData.auditChecklist.map(step => `- ${step}`).join('\n');

  // Section 6: FAQ JSON string for component
  const faqItemsJson = JSON.stringify(subData.faqs);

  return `---
title: "${subData.title} - ${parentTitle}子专题"
description: "${subData.tagline}。提供${subData.title}的第一性原理推导、四层拓扑解构、下属核心集群卡片索引与实操落地检查表。"
layout: doc
---

<div data-pagefind-body>

# ${subData.title}：${parentTitle}纵深子专题

<EvidenceBadge type="standard-rule" label="二级纵深枢纽" />
<EvidenceBadge type="client-kernel" label="技术纵深解构" />
<EvidenceBadge type="packet-snapshot" label="全流程对账闭环" />

在 **${parentTitle}** 的整体技术与财务矩阵中，**${subData.title}** 承担着承上启下的核心枢纽职能。${subData.tagline}。脱离了这一子专题的严密边界界定，上层的宏观预算将失去微观数据支撑，下层的具体操作也会陷入盲目试错。

本子专题从计算机通信原理、计量标准与商业计费公理出发，系统性拆解该领域的底层机制、提供全要素对比矩阵、归集下属四大三级集群与 16 篇实战长文，并给出标准化的八步工程落地清单。

---

## 一、子领域权威定位与 GEO 第一性原理

在进入具体集群前，必须严格确立 ${subData.title} 领域的三大第一性原理与数学模型基石：

${firstPrinciplesMd}

---

## 二、底层数据流转与协议机制拓扑

为彻底揭示 ${subData.title} 在底层网络协议栈中的真实流转路径，本专题梳理出专属工程拓扑图谱：

\`\`\`text
${subData.topologyAscii}
\`\`\`

${subData.topologyExplanation}

---

## 三、下属四大核心集群全景导航与深度文章索引

本子专题下辖 4 个三级核心集群，共计 16 篇深度实操长文。请根据您当前面临的具体痛点，选择对应集群卡片深入研读：

${clusterCardsMd}

---

## 四、全要素技术参数对比与陷阱排查矩阵

以下技术对照大表深度对比了在 **${subData.title}** 涉及的关键场景、变量差异、底层工程原理与应对策略：

| 评估维度 / 场景变量 | 表面误区 / 常见陷阱 | 底层工程机制 / 物理原理 | 潜在影响幅度 / 误差比例 | 权威推荐处理策略 |
| :--- | :--- | :--- | :--- | :--- |
${comparisonRowsMd}

---

## 五、八步工程化实操落地与审计流程

在日常网络计量、预算制定或对账沟通中，推荐严格遵循以下八步标准化审计作业程序：

${auditListMd}

---

## 六、常见核心技术疑难解答 (FAQ)

<FAQ :items='${faqItemsJson}' />

---

## 七、场景化选型与直达主站建议

<MainSiteCTA
  targetPath="${subData.targetPath}"
  campaign="${subData.campaign}"
  slug="${catSlug}_${subSlug}_hub_cta"
  title="${subData.ctaTitle}"
  buttonText="${subData.ctaText} →"
/>

<Disclosure />

</div>
`;
}

function generateFallbackSubcategory(node: ContentNode): string {
  const catSlug = node.category;
  const subSlug = node.subcategory || '';
  const subcatDef = (SUBCATEGORIES_DEF[catSlug] || []).find(s => s.slug === subSlug);
  let clusterListMd = (subcatDef?.clusters || []).map(cl => {
    return `- [${cl.title}](/${catSlug}/${subSlug}/${cl.slug}/)：系统梳理相关核心问题与对照表`;
  }).join('\n');

  return `---
title: "${node.title}"
description: "深入剖析${node.primaryKeyword}的操作准则、实测数据表与决策流程。"
layout: doc
---

<div data-pagefind-body>

# ${node.title}

<EvidenceBadge type="standard-rule" label="二级纵深专题" />
<EvidenceBadge type="model-estimate" label="可复核算例" />

在 ${node.category} 的整体框架中，**${node.primaryKeyword}** 承担着承上启下的关键职能。只有把这一维度的字段定义清楚、把边界测试向量验证完毕，才能确保整个账本的数据链条可追溯、可审计。

---

## 下属核心集群与深度文章索引

${clusterListMd}

---

<MainSiteCTA
  targetPath="/pricing/"
  campaign="quota_rules"
  slug="${catSlug}_${subSlug}_cta"
  title="已明确${node.primaryKeyword}？前往主站比对真实服务"
  buttonText="查看符合条件的套餐方案 →"
/>

<Disclosure />

</div>
`;
}
