import fs from 'node:fs';
import path from 'node:path';
import { ContentNode, SUBCATEGORIES_DEF } from './content-meta';
import { ARTICLES_DATA } from './articles-data';

import { generateRecordsArticle } from './generators/records';
import { generateEstimateArticle } from './generators/estimate';
import { generateMultipliersArticle } from './generators/multipliers';
import { generateResetArticle } from './generators/reset';
import { generatePaygArticle } from './generators/payg';
import { generateHighDataArticle } from './generators/high-data';
import { generateOccasionalArticle } from './generators/occasional';
import { generateVideoArticle } from './generators/video';
import { generateAiArticle } from './generators/ai';
import { generateMobileArticle } from './generators/mobile';
import { generateDevicesArticle } from './generators/devices';
import { generateReconcileArticle } from './generators/reconcile';
import { generateKnowledgeArticle } from './generators/knowledge';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const CONTENT_DIR = path.resolve(process.cwd(), 'content');
const SITE_GENERATED_DIR = path.resolve(process.cwd(), 'site', 'generated');

if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
if (!fs.existsSync(SITE_GENERATED_DIR)) fs.mkdirSync(SITE_GENERATED_DIR, { recursive: true });

// 读取 560 节点注册表
const registryPath = path.join(DATA_DIR, 'CONTENT_REGISTRY.json');
if (!fs.existsSync(registryPath)) {
  console.error('CONTENT_REGISTRY.json 未找到，请先运行 npm run content:plan');
  process.exit(1);
}

const nodes: ContentNode[] = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

console.log(`[INFO] 读取到 ${nodes.length} 个节点，开始准备正式发布正文...`);

// 清空旧的 site/generated 目录确保无遗留
fs.rmSync(SITE_GENERATED_DIR, { recursive: true, force: true });
fs.mkdirSync(SITE_GENERATED_DIR, { recursive: true });

let publishedCount = 0;

for (const node of nodes) {
  if (node.status !== 'published') continue;

  // 映射 URL 到目标路径
  // 例如: / -> site/generated/index.md
  // /records/ -> site/generated/records/index.md
  // /records/choose-counter/ -> site/generated/records/choose-counter/index.md
  let relDir = node.url.replace(/^\//, '').replace(/\/$/, '');
  let targetDir = relDir ? path.join(SITE_GENERATED_DIR, relDir) : SITE_GENERATED_DIR;
  let targetFile = path.join(targetDir, 'index.md');

  // content 源目录
  let srcContentDir = relDir ? path.join(CONTENT_DIR, relDir) : CONTENT_DIR;
  let srcContentFile = path.join(srcContentDir, 'index.md');

  let markdownContent = '';

  // 生成深度专业正文并同步保存到 content/ 和 site/generated/
  markdownContent = generateDeepMarkdown(node);
  fs.mkdirSync(srcContentDir, { recursive: true });
  fs.writeFileSync(srcContentFile, markdownContent, 'utf-8');

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetFile, markdownContent, 'utf-8');
  publishedCount++;
}

// 补充支撑页面
generateSupportPages();

// 复制公共静态资源
const srcPublicDir = path.resolve(process.cwd(), 'site', 'public');
const genPublicDir = path.join(SITE_GENERATED_DIR, 'public');
if (fs.existsSync(srcPublicDir)) {
  fs.cpSync(srcPublicDir, genPublicDir, { recursive: true });
}

console.log(`[PASS] 成功准备 ${publishedCount} 个正式节点至 site/generated/`);

function generateDeepMarkdown(node: ContentNode): string {
  if (node.type === 'home') {
    return generateHomePage(node);
  } else if (node.type === 'category') {
    return generateCategoryPage(node);
  } else if (node.type === 'subcategory') {
    return generateSubcategoryPage(node);
  } else if (node.type === 'cluster') {
    return generateClusterPage(node);
  } else {
    return generateArticlePage(node);
  }
}

function generateHomePage(node: ContentNode): string {
  return `---
title: "流量账本：机场用量记录、倍率计算与套餐核对"
description: "独立的机场流量计量、扣量复核与重置周期诊断工具。解决用了多少、怎么扣量、什么时候重置、是否够用与账单差异。"
layout: doc
---

<div data-pagefind-body>

# 记清流量，再选择合适的机场套餐

<EvidenceBadge type="standard-rule" label="客户端独立计量" />
<EvidenceBadge type="packet-snapshot" label="本地隐私保护" />

在挑选或续费网络加速服务（机场节点）时，绝大多数用户常常陷入困惑：“为什么 100GB 额度不到两周就扣光？”“明明看视频只下了 5GB 文件，后台却显示少了 15GB？”“按量付费流量包到底比月付套餐划算多少？”

**流量账本 (liuliangzhangben.cc)** 正是为此而设立的独立前置计量与对账平台。本站不承接付款充值、不制作虚构的综合排行榜、不在浏览器端试图读取您的系统底层私有数据；所有记账、换算与情景推导均在您的本地浏览器中完成。

---

## 核心工具箱：首屏快速操作

<div class="ledger-tool-card" style="margin-bottom: 2rem;">
  <div class="ledger-tool-title">快速直达</div>
  <p style="color: #64748b; font-size: 0.9rem; margin-top: 0.25rem;">请根据您当前需要解决的具体疑问，选择下方对应的计算或记录模块：</p>
  <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;">
    <a href="#ledger-section" class="ledger-btn ledger-btn-primary">1. 登记或导入用量记录</a>
    <a href="#multiplier-section" class="ledger-btn ledger-btn-secondary">2. 计算节点倍率扣量</a>
    <a href="#estimator-section" class="ledger-btn ledger-btn-secondary">3. 估算下周期流量需求</a>
    <a href="#reconcile-section" class="ledger-btn ledger-btn-secondary">4. 核对后台账单差异</a>
  </div>
</div>

<h2 id="ledger-section">模块一：本地用量账本 (Usage Ledger)</h2>

<UsageLedger />

---

<h2 id="multiplier-section">模块二：倍率扣量与可用额度计算器</h2>

<MultiplierCalculator />

---

<h2 id="estimator-section">模块三：任务流量需求估算器</h2>

<TrafficEstimator />

---

<h2 id="reconcile-section">模块四：账单差异核对与诊断</h2>

<ReconciliationPanel />

---

## 全站十三大核心专题索引

本站将机场流量从底层物理字节到计费规则划分为 13 个完整知识与工具体系，点击可深入了解各专题决策树与详细技术指南：

| 专题入口 | 核心定位 | 解决的核心痛点 |
|---|---|---|
| [用量记录](/records/) | 统计来源与账本管理 | 区分客户端统计、TUN 虚拟网卡与服务后台；规范字段与单位 |
| [流量估算](/estimate/) | 任务模型与周期预测 | 按使用时长、文件数量与码率建立低/中/高情景，拒绝万能日均值 |
| [倍率规则](/multipliers/) | 扣量公式与加权计算 | 彻底讲透 0.5x、1.0x、2.0x 节点扣量差异，算准上下行计费与混合使用 |
| [重置周期](/reset/) | 时间线与额度结转 | 自然月重置、约定日重置与半开区间 [start, end) 边界判定 |
| [按量方案](/payg/) | 流量包与整包阶梯 | 算出整包购买闲置成本与真实使用单价，与连续月付做精确交点比较 |
| [大流量专题](/high-data/) | 重任务拆分与持续吞吐 | 动辄几百 GB 的大文件同步、系统更新与高峰期并发容量规划 |
| [低频使用](/occasional/) | 活跃日与备用账本 | 间歇使用、假期出游与备用线路的极简记录与防过期机制 |
| [视频用量](/video/) | 码率时长与多屏同步 | 视频码率换算、自适应缓冲分段与电视投屏路径去重 |
| [AI用量](/ai/) | Token与网络字节边界 | 厘清 Token 配额与 HTTP 报文字节区别，合理规划流式与文件任务 |
| [手机用量](/mobile/) | 移动系统与热点中继 | Android/iOS 流量周期对齐，手机开热点电脑上网的去重记账 |
| [设备数量](/devices/) | 跨端去重与额度池 | 一人多端、家庭共享或小团队并用时的连接数约束与去重合计 |
| [账单核对](/reconcile/) | 差异诊断与取证闭环 | 对齐本地观察与服务方后台，排查更新延迟、重传封装与取整误差 |
| [知识百科](/knowledge/) | 计量网络与可信边界 | KB/KiB 进制原理、TCP 重传、分流规则影响与证据等级分级 |

---

## 核心概念速查：记录、计费与剩余额度的本质区别

在开始记账前，必须严格区分以下三个常被混淆的概念：

1. **已记录传输量 (Observed Transfer Bytes)**：
   由您本地操作系统、代理软件（如 Clash、Sing-box、Surge、v2rayN）或抓包工具记录到的实际网络报文字节数。它是纯粹的物理流量，不受任何服务商商业规则影响。
2. **计费扣量 (Billed Usage Bytes)**：
   服务商根据其后台规则计算后从您账户中扣除的额度。公式为：\`计费量 = 实际传输量 × 节点倍率\`（若为双向计费，则合并上下行）。
3. **剩余额度 (Remaining Quota)**：
   您账户当前周期内还可被扣除的计费额度总量。当节点倍率为 2.0x 时，100GB 的剩余额度实际上仅支持传输 50GB 的物理数据。

---

## 常见疑问解答 (FAQ)

<FAQ :items="[
  {
    q: '为什么网页上的用量账本不能自动读取整台电脑或手机的全部流量？',
    a: '现代浏览器具备严格的安全沙箱机制，普通网页脚本绝对无法突破沙箱去直接嗅探系统网络接口、抓取其他软件或后台进程的私网报文。声称普通网页能自动读取全设备流量的，往往涉及恶意扩展或诱导安装高危证书。本站坚持纯客户端手工与脱敏文件导入，保障您的数字隐私安全。'
  },
  {
    q: '为什么服务后台显示的扣量总比我下载的文件体积大？',
    a: '主要原因包括：第一，网络传输存在 TCP 握手、TLS 加密与代理协议封装开销；第二，高丢包网络下的数据包重传；第三，很多服务商采用双向计费（下载的同时上传的确认包与请求头也被计费）；第四，节点计费倍率高于 1.0x。'
  },
  {
    q: '什么时候才需要前往主站选购服务？',
    a: '当您通过本站的工具完成了用量记录、确认了每月真实需求量（如 80GB）、核清了所需节点的倍率与重置周期后，便持有了一份明确的“选购条件清单”。此时前往主站（机场榜一 jichangbang.org），即可直接筛选匹配该条件的真实评测套餐，避免盲目购买不合身的过大或过小方案。'
  }
]" />

<MainSiteCTA
  targetPath="/pricing/"
  campaign="usage_selection"
  slug="home_cta"
  title="用量需求已测算清楚？前往主站比较真实套餐"
  description="拿着清晰的月度 GB 需求、倍率接受度与设备连接数，前往机场榜一查看经过真实核验的套餐定价与网络规则。"
  buttonText="前往主站查看真实套餐比对 →"
/>

<Disclosure />

</div>
`;
}

function generateCategoryPage(node: ContentNode): string {
  const subcats = SUBCATEGORIES_DEF[node.category] || [];
  let subcatListMd = subcats.map(sub => {
    let clusterItems = sub.clusters.map(cl => `- [${cl.title}](/${node.category}/${sub.slug}/${cl.slug}/)`).join('\n');
    return `### [${sub.title}](/${node.category}/${sub.slug}/)\n\n${clusterItems}`;
  }).join('\n\n');

  return `---
title: "${node.title}"
description: "深入解析${node.primaryKeyword}的核心逻辑、技术标准、计量方法与决策矩阵。"
layout: doc
---

<div data-pagefind-body>

# ${node.title}

<EvidenceBadge type="standard-rule" label="技术专题综述" />
<EvidenceBadge type="client-kernel" label="规范化口径" />

本专题专为解决用户在 **${node.primaryKeyword}** 场景下的计量偏差、规则误读与套餐适配问题而设计。无论是初次建立记账基线，还是排查后台账单的突发波动，理清该维度的技术边界都是构建精准流量账本的核心前提。

---

## 核心答案与适用前提

在分析 ${node.primaryKeyword} 时，必须先确立以下三项基础认知：

1. **观测口径先行**：不明确计量层级（应用级、系统虚拟网卡 TUN 级、物理网卡级或代理服务端出口级）得出的流量数字无法直接横向对比。
2. **剔除虚假精度**：任何没有标明进制（GB 还是 GiB）、没有附带统计时间窗口半开区间定义的数值，均存在潜在口径误差。
3. **拒绝单一均值**：将月度用量除以 30 得到的“日均值”往往会掩盖高峰日的突增压力，导致月末提前断流或不得不高价补购。

---

## 核心交互工具与演算

${getToolComponentForCategory(node.category)}

---

## 专题架构与集群纵深

本专题下设两大二级方向与八个专业三级集群，涵盖从理论定义到实战复盘的完整链条：

${subcatListMd}

---

## 关键技术对照矩阵

| 评估维度 | 常见误区 | 规范计量准则 | 潜在误差影响 |
|---|---|---|---|
| **单位进制** | 将 1GB 随意视同 1024MB | 严格遵循 IEC/NIST：1GB = 10^9 字节，1GiB = 2^30 字节 | 约 7.37% 累计偏差 |
| **方向计费** | 默认上传不扣量 | 查验服务商服务条款，未确认时按待核实处理 | 差额可达 10%~50% |
| **时区边界** | 用本地时间核对 UTC 服务日 | 统一转换至服务商结算时区，半开区间 [start, end) 归属 | 跨月边界误判导致清零错觉 |
| **设备中继** | 热点分享端与接收端重复累加 | 同一任务指纹仅计入一次对外公网传输 | 翻倍误计 (高达 100% 虚报) |

---

## 决策树：如何在本专题中建立正确推导

<DecisionTree
  title="${node.primaryKeyword} 推导决策流程"
  :steps="[
    { condition: '第一步：明确当前观察来源与层级', action: '区分是来自本地客户端内核统计，还是服务后台结算账单' },
    { condition: '第二步：统一单位进制并记录时间戳', action: '将所有原值无损转换为整数字节，对齐时区半开区间' },
    { condition: '第三步：结合业务场景选择计算模型', action: '匹配单任务码率估算、混合倍率加权或阶梯包成本模型' },
    { condition: '第四步：输出脱敏后的硬性需求指标', action: '整理出清晰的额度需求范围与规则边界，作为选型依据' }
  ]"
/>

---

<MainSiteCTA
  targetPath="${node.ctaType === 'pricing' ? '/pricing/' : node.ctaType === 'compare' ? '/compare/' : '/recommend/'}"
  campaign="${node.category === 'payg' ? 'payg_fit' : node.category === 'reconcile' ? 'reconcile_handoff' : 'quota_rules'}"
  slug="${node.category}_cat_cta"
  title="已完成${node.primaryKeyword}核算？前往主站匹配合适套餐"
  description="将本专题测算出的指标条件与主站真实服务商评测对照，找到真正契合的稳定网络服务。"
/>

<Disclosure />

</div>
`;
}

function generateSubcategoryPage(node: ContentNode): string {
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

## 核心操作原则与问题推导

1. **不可逆更正与审计痕迹**：更正一条抄录错误的用量时，应保留更正原因与原始观测值，避免事后无法还原差额起源。
2. **多源数据互斥原则**：当同时持有设备系统统计、客户端 TUN 统计与服务后台数值时，不可直接相加，必须依据网络拓扑进行层级解构。
3. **未明确参数的降级处理**：当遇到未知计费倍率或未明确方向规则时，严禁随意按 1.0x 或 0x 填补，必须标注“待确认”，给出上下限范围。

---

## 下属核心集群与深度文章索引

${clusterListMd}

---

## 常见参数对比与技术陷阱

| 场景变量 | 表面现象 | 底层工程机制 | 推荐处理策略 |
|---|---|---|---|
| 客户端重启 | 累计数字骤降 | 计数器溢出或软件重启归零 | 标记新起点基线，避免产生负数增量 |
| 跨时区观察 | 月底扣量提早清零 | 服务商采用 GMT 或特定服务器时区结算 | 明确记录 sourceTimezone 并换算时间窗口 |
| 协议封装 | 流量超出文件体积 5% | TLS 加密头、分块传输与 TCP 重传消耗 | 在模型中列为必要协议开销，非恶意多扣 |

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

function generateClusterPage(node: ContentNode): string {
  const articlesInCluster = ARTICLES_DATA.filter(a => a.category === node.category && a.subcategory === node.subcategory && a.cluster === node.cluster);
  let articleListMd = articlesInCluster.map(art => {
    return `### [${art.title}](${art.url})\n\n- **规划路径**：\`${art.url}\`\n- **核心解答**：解答关于该问题的完整推导、边界证据与实操检查清单。`;
  }).join('\n\n');

  return `---
title: "${node.title}"
description: "聚焦${node.primaryKeyword}的核心问题集群，提供多角度技术解答与四篇深度文章导航。"
layout: doc
---

<div data-pagefind-body>

# ${node.title}

<EvidenceBadge type="standard-rule" label="三级集群聚合" />
<EvidenceBadge type="client-kernel" label="技术对照矩阵" />

本集群针对 **${node.primaryKeyword}** 展开专题攻坚，聚合了该领域下最为关键的四个独立问题。每个问题均有完整的推导逻辑、数据对照表、操作步骤与边界警示。

---

## 集群核心解答综述

在该集群所涉及的实际网络传输中，最容易被忽视的是**观察环境的独立性**。很多用户习惯在多设备共用、后台同步常驻的环境下做单任务测试，导致测试结果掺杂了海量无关背景流量。

建立严密核算的通用步骤包括：
1. **控制测试变量**：做专项计量前，暂停无关设备的后台更新与云端网盘同步；
2. **记录前后快照**：不仅记录任务结束时的数字，更要精确截取任务开始瞬间的累计值；
3. **核实计费延迟**：服务商后台统计通常有 5 至 30 分钟的批处理延迟，不可刚下完就立即判定差额。

---

## 本集群四篇核心文章深度研读

${articleListMd}

---

## 决策与排查对照表

| 检查阶段 | 核心核查项 | 标准规范 | 常见错误做法 |
|---|---|---|---|
| **准备期** | 观察范围 (Scope) | 确认是全局接管还是分流规则部分绕过 | 以为开启代理就 100% 流量计入机场 |
| **记录期** | 原始单位 (Unit) | 抄录原数值并注明 GB / GiB / MB | 凭主观记忆随手写个大概数字 |
| **复盘期** | 差额判定 (Reconcile) | 先排除时区与加权倍率后再定性 | 只要数字对不上就立刻断定服务商扣量 |

---

<MainSiteCTA
  targetPath="/compare/"
  campaign="quota_rules"
  slug="cluster_${node.category}_${node.subcategory}_${node.cluster}_cta"
  title="需要对照服务商规则？前往主站获取实测对照"
/>

<Disclosure />

</div>
`;
}

function generateArticlePage(node: ContentNode): string {
  switch (node.category) {
    case 'records': return generateRecordsArticle(node);
    case 'estimate': return generateEstimateArticle(node);
    case 'multipliers': return generateMultipliersArticle(node);
    case 'reset': return generateResetArticle(node);
    case 'payg': return generatePaygArticle(node);
    case 'high-data': return generateHighDataArticle(node);
    case 'occasional': return generateOccasionalArticle(node);
    case 'video': return generateVideoArticle(node);
    case 'ai': return generateAiArticle(node);
    case 'mobile': return generateMobileArticle(node);
    case 'devices': return generateDevicesArticle(node);
    case 'reconcile': return generateReconcileArticle(node);
    case 'knowledge': return generateKnowledgeArticle(node);
    default: return generateKnowledgeArticle(node);
  }
}

function getToolComponentForCategory(cat: string): string {
  switch (cat) {
    case 'records': return '<UsageLedger />';
    case 'multipliers': return '<MultiplierCalculator />';
    case 'reset': return '<ResetTimeline />';
    case 'payg': return '<PaygComparator />';
    case 'estimate': return '<TrafficEstimator />';
    case 'video': return '<VideoEstimator />';
    case 'devices': return '<DeviceAggregator />';
    case 'reconcile': return '<ReconciliationPanel />';
    default: return '<UsageLedger />';
  }
}

function generateSupportPages() {
  const supportPages = [
    {
      file: '404.md',
      title: '404 - 页面未找到',
      content: `# 404 - 页面未找到\n\n您访问的页面不存在或已被迁移。请返回[首页](/)或查阅[全站专题目录](/knowledge/)。\n\n<Disclosure />`
    },
    {
      file: 'about/index.md',
      title: '关于流量账本',
      content: `<div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2rem; padding: 1.25rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">\n  <img src="/avatar.png" alt="流量账本头像" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 6px rgba(0,0,0,0.08);" />\n  <div>\n    <div style="font-weight: 700; font-size: 1.2rem; color: #0f172a;">流量账本 (liuliangzhangben.cc)</div>\n    <div style="color: #64748b; font-size: 0.925rem; margin-top: 0.25rem;">独立、客观、纯客户端运行的机场流量对账与计量诊断站</div>\n  </div>\n</div>\n\n# 关于流量账本 (liuliangzhangben.cc)\n\n流量账本是一个专注于解决**“用了多少、怎么扣量、什么时候重置、是否够用、账单为什么不同”**的独立计量与对账知识工具站。\n\n- **分站定位**：纯静态客户端独立运行，所有账本保存在用户浏览器本地，绝不收集个人网络隐私。\n- **与主站关系**：唯一选购转化主站为[机场榜一 (jichangbang.org)](https://jichangbang.org)。当用户明确各项用量指标后，可前往主站比对真实服务套餐。\n\n<Disclosure />`
    },
    {
      file: 'privacy/index.md',
      title: '隐私政策与数据边界',
      content: `# 隐私政策与数据安全声明\n\n1. **零服务端存储**：本站为纯静态站点，没有后端数据库，不设置用户注册系统，不收集、不存储、不上报任何用户的个人用量明细或设备凭证。\n2. **浏览器沙箱与本地存储**：账本数据仅保存在您当前浏览器的内存中；若您主动开启“本地持久化”，数据将存储于您本地的 localStorage 或 IndexedDB 中，清除浏览器缓存即可彻底销毁。\n3. **防注入与清洁导出**：所有 CSV 导出均经过防公式注入转义，转介主站的链接绝不携带任何私密参数。\n\n<Disclosure />`
    },
    {
      file: 'methodology/index.md',
      title: '计量方法与测试向量说明',
      content: `# 计量方法与测试向量白皮书\n\n本站所有计算器与推导模型均经过严格的自动化单元测试验证（测试向量 A 至 L）：\n\n- **单位进制**：1GB = 1,000,000,000 字节，1GiB = 1,073,741,824 字节，1字节 = 8比特。\n- **加权平均倍率**：计费量 ÷ 实际传输量，禁止简单的倍率标签算术平均。\n- **半开区间**：计费周期遵循 [start, end) 严格判定。\n\n<Disclosure />`
    }
  ];

  for (const p of supportPages) {
    const fullPath = path.join(SITE_GENERATED_DIR, p.file);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    const md = `---\ntitle: "${p.title}"\nlayout: doc\n---\n\n<div data-pagefind-body>\n\n${p.content}\n\n</div>\n`;
    fs.writeFileSync(fullPath, md, 'utf-8');
  }
}
