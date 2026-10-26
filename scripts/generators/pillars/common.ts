import { ARTICLES_DATA, ArticleMeta } from '../../articles-data';
import { SUBCATEGORIES_DEF } from '../../content-meta';

export interface DiagnosticCard {
  title: string;
  badge: string;
  scenario: string;
  specs: { label: string; value: string }[];
  targetPath: string;
  campaign: string;
  ctaText: string;
}

export function getArticlesForCategory(category: string): ArticleMeta[] {
  return ARTICLES_DATA.filter(a => a.category === category);
}

export function renderHoneycombMatrix(category: string): string {
  const subcats = SUBCATEGORIES_DEF[category] || [];
  const articles = getArticlesForCategory(category);

  let md = '';

  for (const sub of subcats) {
    md += `### 二级子专题：[${sub.title}](/${category}/${sub.slug}/)\n\n`;
    md += `> 本方向聚焦 **${sub.title}**，下设 4 个专业三级集群与 16 篇实战长尾文章，覆盖从观测采集、边界判定到实操复盘的完整链路。\n\n`;

    for (const cl of sub.clusters) {
      const clusterArticles = articles.filter(a => a.subcategory === sub.slug && a.cluster === cl.slug);
      md += `#### 📁 三级集群：[${cl.title}](/${category}/${sub.slug}/${cl.slug}/)\n\n`;
      md += `| 场景痛点与诊断意图 | 核心技术解法与算例突破 | 实战指南与长尾直达文章 |\n`;
      md += `| :--- | :--- | :--- |\n`;

      for (const art of clusterArticles) {
        // 动态生成痛点与突破标签，确保语义丰富高异质性
        const painPoint = extractPainPoint(art.title);
        const solution = extractSolution(art.title);
        md += `| <span class="ledger-tag">${painPoint}</span> | ${solution} | [${art.title}](${art.url}) |\n`;
      }
      md += `\n`;
    }
  }

  return md;
}

function extractPainPoint(title: string): string {
  if (title.includes('为什么') || title.includes('区别') || title.includes('不同')) {
    return '口径混淆 / 概念界定偏差';
  } else if (title.includes('怎样') || title.includes('如何') || title.includes('清单')) {
    return '实操配置 / 落地流程缺失';
  } else if (title.includes('异常') || title.includes('误差') || title.includes('损失') || title.includes('偷跑')) {
    return '突发损耗 / 账单对齐失败';
  } else if (title.includes('选型') || title.includes('买') || title.includes('方案') || title.includes('比较')) {
    return '套餐选型 / 冗余浪费风险';
  } else {
    return '边界核算 / 精确计量诉求';
  }
}

function extractSolution(title: string): string {
  if (title.includes('分层') || title.includes('来源')) {
    return '建立应用层/系统网卡/代理内核三层观测隔离，剔除重复统计';
  } else if (title.includes('单位') || title.includes('进制') || title.includes('GB')) {
    return '严格锁定 IEC/SI 转换系数，以整数字节（Octets）为无损存储基准';
  } else if (title.includes('倍率') || title.includes('上下行')) {
    return '引入加权倍率公式，拆分双向流量权重并核验节点真实扣量';
  } else if (title.includes('周期') || title.includes('重置') || title.includes('时区')) {
    return '对齐服务商结算时区，实施半开区间 [start, end) 边界闭环拦截';
  } else if (title.includes('按量') || title.includes('包')) {
    return '建立单价衰减模型与闲置保质期评估，锁定盈亏均衡交点';
  } else if (title.includes('并发') || title.includes('设备')) {
    return '设备指纹去重，建立跨端并发连接数与总额度池动态映射';
  } else if (title.includes('AI') || title.includes('Token')) {
    return '解耦 API 上下文 Payload 与 HTTP/3 报文包头，核算流式重试开销';
  } else if (title.includes('视频') || title.includes('码率')) {
    return '推导自适应码率（ABR）缓冲模型，剔除本地投屏二次流量伪膨胀';
  } else {
    return '落地标准 8 步验证检查表，输出可回溯的脱敏取证数据包';
  }
}

export function renderDiagnosticCards(cards: DiagnosticCard[]): string {
  let md = '<div class="diagnostic-grid">\n\n';

  for (const card of cards) {
    md += `<div class="diagnostic-card">\n`;
    md += `<div class="card-badge">${card.badge}</div>\n`;
    md += `<h3>${card.title}</h3>\n`;
    md += `<p class="scenario-desc"><strong>适用场景：</strong>${card.scenario}</p>\n`;
    md += `<table class="specs-mini-table">\n<tbody>\n`;
    for (const spec of card.specs) {
      md += `<tr><td><strong>${spec.label}</strong></td><td>${spec.value}</td></tr>\n`;
    }
    md += `</tbody>\n</table>\n`;
    md += `<div class="card-action">\n`;
    md += `<a href="https://jichangbang.org${card.targetPath}?utm_source=liuliangzhangben&utm_medium=pillar_hub&utm_campaign=${card.campaign}" target="_blank" rel="noopener noreferrer" class="ledger-btn-primary">${card.ctaText} →</a>\n`;
    md += `</div>\n`;
    md += `</div>\n\n`;
  }

  md += '</div>\n\n';
  return md;
}
