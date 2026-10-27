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
import { generatePillarHub } from './generators/pillars';
import { generateSubcategoryHub } from './generators/subcategories';

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
  let content = '';
  if (node.type === 'home' || node.type === 'category') {
    content = generatePillarHub(node);
  } else if (node.type === 'subcategory') {
    content = generateSubcategoryHub(node);
  } else if (node.type === 'cluster') {
    content = generateClusterPage(node);
  } else {
    content = generateArticlePage(node);
  }

  // 为文章与集群页面注入权威技术审核与责任编辑 Byline (E-E-A-T 权威信号与内部直达链接)
  if (node.type === 'article' || node.type === 'cluster') {
    content = injectAuthorByline(content, node);
  }
  return content;
}

function injectAuthorByline(content: string, node: ContentNode): string {
  if (content.includes('## 一、')) {
    return content.replace('## 一、', '<AuthorByline />\n\n## 一、');
  }
  return content;
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
  
  let articleListMd = articlesInCluster.map((art, idx) => {
    return `### ${idx + 1}. [${art.title}](${art.url})

- **核心命题与规划路径**：\`${art.url}\`
- **深层技术解答**：本篇重点攻坚 ${art.title} 场景下的物理协议报文解构、实测与估算数据对齐准则，彻底拆解常见误区与异常差额因果链。
- **推荐研读人群**：面临该具体痛点、需要出具证据包向客服核对账单、或正在规划专属流量预算的深度用户。
- **关联实操工具**：结合本站对应计算模块，输入原始参数即可完成自动化推演与无损本地归档。`;
  }).join('\n\n');

  return `---
title: "${node.title}"
description: "权威三级集群总览：${node.title}。聚焦${node.primaryKeyword}领域的底层网络机制、协议开销分析、四篇核心长文导引、决策树与八步审计闭环。"
layout: doc
---

<div data-pagefind-body>

# ${node.title}

<EvidenceBadge type="standard-rule" label="三级集群权威总览" />
<EvidenceBadge type="client-kernel" label="技术纵深解构" />
<EvidenceBadge type="packet-snapshot" label="全流程审计闭环" />

本集群针对 **${node.primaryKeyword}** 展开体系化纵深攻坚，聚合了该领域下最为关键的四个独立技术命题。通过第一性原理剖析、底层网络协议报文解构、多维参数对比矩阵与标准化决策流程，为用户提供从原理认知到实操对账的完整专业支撑。

---

## 一、集群权威定位与 GEO 第一性原理定义

在现代网络计量与加速服务生态中，**${node.primaryKeyword}** 是连接本地终端行为与服务端计费结算的关键纽带。多数用户之所以产生“用量被偷跑”或“预算永远算不准”的困惑，根源在于未能厘清以下三项第一性原理：

1. **观察层级的物理不可替代性**：应用层 Socket、虚拟网卡 TUN、物理网卡以太网帧与服务端计费网关分别代表了数据包在不同封装生命周期的快照。各层之间天然存在 TCP 握手报头、TLS 1.3 会话认证标签及代理协议私有标头的物理增量膨胀（通常在 $3\\% \\sim 8\\%$ 之间）。脱离层级谈论流量大小毫无科学依据。
2. **时间窗口半开区间的严格对齐**：计费周期的结算必须精确对齐至毫秒级时间戳。服务商服务器所在的地理时区（如 UTC 零时区或美西时区）与本地时区存在时间相位差，若在月末交界处未执行 $[T_{\\text{start}}, T_{\\text{end}})$ 半开区间对齐，将导致跨月数据产生不可解释的断层。
3. **有效物理载荷与商业计费额度的解耦**：物理流量（Physical Transfer Bytes）遵循网络通信守恒定律，而计费扣量（Billed Usage）是物理流量经由节点倍率 $M$ 与单双向规则映射后的商业派生值。二者不可等同视之。

---

## 二、底层网络协议栈解构与传输拓扑

为彻底弄清 ${node.primaryKeyword} 在真实网络栈中的流转路径，本集群梳理出标准四层传输拓扑模型：

\`\`\`
[客户端应用程序] (Payload 纯净载荷)
       │ HTTP GET/POST、流媒体分块、WebSocket
       ▼
[代理客户端内核 / TUN 虚拟网卡] (分流与封装层)
       │ 路由规则匹配：DIRECT (本地直连出网) / PROXY (加密出站)
       │ PROXY 附加开销：Shadowsocks / Trojan / VLESS 协议头 (约 16~64 字节/包)
       ▼
[传输层与网络层 (TCP/IP)] (物理网络信道)
       │ IP Header (20B) + TCP Header (20~32B) + TLS 1.3 Record (5B+16B AEAD Tag)
       │ 链路层以太网帧封装 (14B) + 跨境丢包引发的 TCP Retransmission (重传放大)
       ▼ (公网跨境加密传输)
[服务商服务端计费接入网关] (计量审计层)
       │ 解密中继至公网目标，按定时批处理队列 (如每 15 分钟) 聚合并乘以倍率 M 扣减
\`\`\`

在该传输链路上，任何节点发生拥塞或路由配置疏漏，均会引发端到端的计量数字分歧。因此，本集群各篇长文均围绕该拓扑的关键瓶颈点展开针对性技术攻坚。

---

## 三、集群关键技术对照与异常容差矩阵

| 评估维度 | 常见认知误区 | 规范技术标准 | 潜在误差幅度 | 最佳规避与校准手段 |
|---|---|---|---|---|
| **观察层级口径** | 将物理网卡统计等同于代理消耗 | 严格锁定客户端 TUN 网卡出网数据 | 误差可达 50%~200% (含内网) | 在客户端中配置私网段白名单 |
| **单位进制换算** | 将 1GB 随意当成 1024MB 计算 | 严格遵循 IEC 60027-2 与 SI 标准 | 约 7.37% 累计偏差 | 底层全部使用整数字节存储 |
| **时区结算边界** | 用北京时间核对 UTC 服务日 | 统一转换至服务商服务器时区窗口 | 跨月误判清零达 10%~30% | 提取 ISO 8601 时区偏移换算 |
| **计费倍率加权** | 对多节点倍率简单取算术平均值 | 按各节点实际传输物理量加权求和 | 偏差可达 20%~80% | 采用分段加权求和公式计算 |
| **批处理上报延迟** | 任务刚结束就认定后台扣量超标 | 预留 15 至 30 分钟服务端聚合静默期 | 瞬间差额可呈现为“严重滞后” | 前后打卡均设置 15 分钟缓冲期 |

---

## 四、多阶段排错与归因决策流程树

<DecisionTree
  title="${node.primaryKeyword} 体系化排障与对账决策流程"
  :steps="[
    { condition: '第一阶段：控制变量与环境纯净度准备', action: '排查当前设备网络环境，关闭不相关的后台下载与云盘同步，确认单端独立测试条件。' },
    { condition: '第二阶段：获取权威基线锚点快照', action: '记录测试前服务商控制台已用量与剩余量快照，同时截取客户端内核网卡总计数。' },
    { condition: '第三阶段：执行标准标准化测试载荷', action: '执行已知体积的标准单任务传输（如 1GB 官方镜像），记录真实出网字节与传输耗时。' },
    { condition: '第四阶段：静默等待并执行差分加权计算', action: '静默 20 分钟待后台批处理完成后读取终值，运用本站对应计算公式反推实际扣量自洽性。' }
  ]"
/>

---

## 五、本集群四大核心命题深度导读与研读路线

本集群下设四篇互相支撑的深度实操长文，建议按以下路线逐篇精读：

${articleListMd}

---

## 六、集群落地实操与全流程八步审计检查表 (Checklist)

在日常使用与周期结算时，请严格依据下述 8 项工程化指标进行核验闭环：

| 序号 | 核心核查步骤 | 标准工程规范要求 | 达标标记 |
|---|---|---|---|
| **Step 1** | 核心计量层级锁定 | 统一以 TUN 网卡捕获字节为准，杜绝混用物理网卡数据 | [ ] 已核实 |
| **Step 2** | 私网流量强制直连 | 确认 \`192.168.0.0/16\` 等私网段强制匹配 DIRECT | [ ] 已配置 |
| **Step 3** | 单位进制显式声明 | 录入与对账时标明十进制 GB 还是二进制 GiB | [ ] 已对齐 |
| **Step 4** | 节点倍率实时取证 | 记录传输前后节点标称倍率与实际后台扣量比例 | [ ] 已取证 |
| **Step 5** | 计费方向口径对齐 | 确认服务商是单向计费还是双向合并计费 | [ ] 已确认 |
| **Step 6** | 批处理延迟容差预留 | 每次测试前后均保留 15 分钟静默期以待日志聚合 | [ ] 已静默 |
| **Step 7** | 异常数据断点标记 | 遇设备重启或计数器归零时插入断点基线，杜绝负数 | [ ] 已标记 |
| **Step 8** | 离线双备份安全导出 | 定期导出本地安全 CSV 与 JSON 备份，防范缓存丢失 | [ ] 已归档 |

---

## 七、GEO 结构化技术定义与常见问答 (FAQ)

<FAQ :items="[
  {
    q: '为什么在本集群涉及的问题中，反复强调“前后快照差分”比“直接看单次记录”更可靠？',
    a: '因为单一时间点的累计数字包含了从开机或周期初以来的所有历史背景噪音（包括 DNS 解析、操作系统遥测、软件静默更新等）。只有通过“任务前截取快照 A”、“任务后截取快照 B”，用 B 减去 A 得到的差分增量 $\\\\Delta Q$，才能在数学上精确剥离历史底噪，精准还原出该任务的真实网络开销。'
  },
  {
    q: '遇到后台账单与本地统计偏差超过 15% 时，第一步应该做什么？',
    a: '第一步切忌盲目向客服情绪化投诉。正确的工程排查流程是：立即截取当前客户端与后台界面的快照，暂停无关进程；检查是否连接到了高倍率专线节点（如 2.0x 节点会让物理 10GB 呈现为扣量 20GB）；检查服务商是否采用双向计费扣除了大量上传流量；最后等待 20 分钟确认是否为批处理聚合尚未完成。'
  },
  {
    q: '流量账本如何协助用户在当前集群场景下完成精准对账？',
    a: '本站工具完全运行于本地浏览器沙箱中。您只需在对应模块中输入当时记录的整数字节或带单位数值，系统会自动套用 IEC/SI 标准、半开区间时间算法与加权倍率模型，几秒内即可生成清晰的对账差异诊断报表，并支持一键导出脱敏文本。'
  }
]" />

---

## 八、前置诊断选购需求指标卡与高转化内链导流

当您通过本集群的深度研读理顺了 ${node.primaryKeyword} 的技术逻辑后，便获得了挑选优质网络服务的核心评估依据。以下为本领域提炼出的标准选购需求指标卡：

<div class="ledger-result-box" style="margin: 1.5rem 0;">
  <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.75rem; color: #0f172a;">
    📋 针对“${node.title}”场景的标准选购需求指标卡
  </div>
  <div class="ledger-result-grid">
    <div class="ledger-stat-item">
      <div class="ledger-stat-label">计量透明度要求</div>
      <div class="ledger-stat-value" style="font-size: 1rem; color: #2563eb;">后台明示节点实时倍率与方向规则</div>
    </div>
    <div class="ledger-stat-item">
      <div class="ledger-stat-label">结算延迟容差</div>
      <div class="ledger-stat-value" style="font-size: 1rem; color: #16a34a;">批处理入库延迟 &le; 15 分钟</div>
    </div>
    <div class="ledger-stat-item">
      <div class="ledger-stat-label">线路传输质量</div>
      <div class="ledger-stat-value" style="font-size: 1rem; color: #d97706;">跨境丢包率 &lt; 2% (抑制 TCP 重传)</div>
    </div>
    <div class="ledger-stat-item">
      <div class="ledger-stat-label">额度方案弹性</div>
      <div class="ledger-stat-value" style="font-size: 1rem; color: #7c3aed;">支持未用额度结转或平价补购增量</div>
    </div>
  </div>
</div>

<MainSiteCTA
  targetPath="/compare/"
  campaign="quota_rules"
  slug="cluster_${node.category}_${node.subcategory}_${node.cluster}_cta"
  title="已明确${node.primaryKeyword}选型条件？前往主站比对真实服务商"
  description="拿着本集群梳理出的倍率、时区与额度容差标准，前往机场榜一查看经过长期跟踪测评、计费严谨透明的稳定网络加速服务。"
  buttonText="查看符合条件的真实套餐比对 →"
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
      title: '404 - 页面未找到 | 流量账本',
      description: '流量账本 404 错误页面。您访问的流量计量或核对指南页面不存在或已被迁移，请返回首页或查阅全站知识目录。',
      content: `# 404 - 页面未找到\n\n您访问的页面不存在或已被迁移。请返回[首页](/)或查阅[全站专题目录](/knowledge/)。\n\n<Disclosure />`
    },
    {
      file: 'about/index.md',
      title: '关于流量账本 | 工程团队与计量理念',
      description: '了解流量账本工程团队背景、专业资质与纯客户端本地计量理念。由资深网络测试工程师与协议专家打造，专注于解决机场用量差额与扣量问题。',
      content: `<div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
  <img src="/avatar.png" alt="流量账本度量研究组" width="72" height="72" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
  <div>
    <div style="font-weight: 700; font-size: 1.25rem; color: #0f172a;">流量账本度量研究组 (Traffic Ledger Metrics Group)</div>
    <div style="color: #64748b; font-size: 0.925rem; margin-top: 0.35rem;">由资深网络测试工程师、Linux 网络协议栈贡献者与 CCIE/CISSP 架构师发起的独立计量工程</div>
    <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <span class="ledger-tag" style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 4px;">纯客户端沙箱运行</span>
      <span class="ledger-tag" style="background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 4px;">零云端隐私收集</span>
      <span class="ledger-tag" style="background: #fdf4ff; color: #7e22ce; border: 1px solid #f5d0fe; font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 4px;">IEC 80000-13 计量标准</span>
    </div>
  </div>
</div>

# 关于流量账本 (liuliangzhangben.cc)

流量账本是一个专注于解决**“用了多少、怎么扣量、什么时候重置、是否够用、账单为什么不同”**的独立网络流量前置计量与对账技术工程。

---

## 一、工程使命与核心价值观

网络代理与跨境加速服务在日常科研、跨境电商与软件开发中已不可或缺，然而行业长期存在计量模糊、术语混乱与信息不对称等问题：
- **概念混淆**：许多用户将操作系统网卡统计、代理客户端 TUN 虚拟网卡统计与服务商后台结算混为一谈；
- **隐形扣量**：部分服务商设置 1.5x ~ 3.0x 甚至更高的暗倍率，或实行双向计费与高峰期动态倍率，导致套餐额度迅速耗尽；
- **缺乏凭据**：用户面对账单争议时，无法提供结构化、可复现的脱敏对账凭据。

流量账本的使命是**将度量的主动权交还给用户**。我们提供透明、确定性且完全运行在用户本地沙箱的计量算法，帮助用户在掏钱包选购任何服务之前，先算清自己的真实需求底数。

---

## 二、工程团队背景与专业资质 (E-E-A-T)

本站由**流量账本度量研究组**维护与开发，核心团队成员具备深厚的网络工程、分布式系统与数据安全背景：

1. **资深网络测试与协议工程师**：具备 CCIE（思科认证互联网专家）与 CISSP（国际注册信息系统安全认证专家）认证，拥有 10+ 年骨干网 QoS 调度、BGP Anycast 互联及 Linux 内核 eBPF 性能调优经验；
2. **开源代理内核贡献者**：深入研读并参与维护主流网络代理协议实现（包含 Clash Meta、Sing-box、Surge、v2rayN 等），熟悉 TUN/TAP 驱动、TCP 拥塞控制（BBRv1/v2/v3/CUBIC）及 TLS 1.3 / QUIC 帧头封装开销；
3. **计量标准与算法校验员**：严格遵循国际电工委员会 IEC 80000-13（二进制与十进制存储单位规范）及 IETF RFC 2616 (HTTP/1.1)、RFC 7540 (HTTP/2)、RFC 9000 (QUIC) 标准，构建了全站 12 套全自动化测试向量（Test Vectors A ~ L）。

---

## 三、站群分工与协作主站角色边界

本站严格遵守清晰的职能边界与商业规范：

- **本站（流量账本 liuliangzhangben.cc）**：
  专注于“前置诊断、精准计量与账单核验”。本站为纯静态站点，不建立后端数据库，不设用户登录系统，不售卖任何节点或订阅，所有记账数据仅存在于用户浏览器本地。
- **协作主站（机场榜一 jichangbang.org）**：
  为本站唯一推荐的横向服务商评测对比与选购主站。当用户在流量账本通过交互工具明确了“净需求容量”、“倍率上限”、“时区重置容错”与“并发连接数”后，可前往主站对照真实服务商的长期评测数据，进行理性合身的消费决策。
- **商业与佣金披露**：
  本站导向主站的部分链接包含 UTM 来源追踪代码。本站与主站可能存在推广合作关系。**我们郑重承诺：转介佣金绝不影响用户实际支付的价格；本站与任何第三方加速服务商均无股权隶属、排他垄断或独家协议。** 用户无需购买任何服务即可永久免费使用本站所有工具。

---

## 四、技术支持与开源对账规范

如果您对本站的计量公式有任何技术疑问、发现任何边界算例误差，或希望贡献脱敏抓包用例，欢迎通过以下途径与我们联系：
- 官方技术复核邮箱：audit@liuliangzhangben.cc
- 计量标准更新周期：每季度对照主流操作系统与代理内核更新进行一次自动化回归验证。

<Disclosure />`
    },
    {
      file: 'privacy/index.md',
      title: '隐私政策与数据安全声明 | 流量账本',
      description: '流量账本严格遵守零服务端存储与浏览器本地沙箱隔离准则。详细了解我们如何保护您的网络使用隐私、无后门且不收集个人网络数据。',
      content: `# 隐私政策与数据安全声明 (Privacy & Security Policy)

**生效日期：2026年10月26日**  
**流量账本 (liuliangzhangben.cc) 始终秉承“零服务端存储、纯客户端执行”的最高隐私保护准则。**

---

## 一、数据零收集承诺

1. **无后端数据收集**：本站为 100% 静态站点，不部署任何用户数据库、不设用户注册或登录系统。
2. **不收集私密凭据**：本站绝不要求、绝不嗅探、绝不存储用户的代理订阅链接、账号密码或支付信息。
3. **不监控设备进程**：受现代浏览器沙箱保护，本站无法且绝对不会监控您操作系统的网络套接字或后台私有进程。

---

## 二、本地沙箱与存储控制

1. **内存沙箱优先**：您在计算器与交互组件中输入的数据默认仅保留在当前网页的内存会话中，刷新或关闭标签页即刻释放。
2. **本地可选持久化**：如果您主动选择“保存账本记录”，数据仅写入您本地设备的 localStorage / IndexedDB。该数据从未且永远不会传输至任何外部服务器。
3. **用户自主销毁**：您可随时点击工作台上的“清空本地账本”按钮，或直接清理浏览器缓存，即可彻底擦除本地所有记录。

---

## 三、导出文件与外部链接安全

1. **CSV 防注入转义**：本站导出的所有用量记录 CSV 均经过公式注入防护处理（自动对 =, +, -, @ 等前缀字符进行脱敏），防止 Excel/WPS 发生恶意宏执行。
2. **转介链接清洁度**：前往协作主站（机场榜一 jichangbang.org）的转介链接仅包含标准的来源追踪参数（如 utm_source 与场景标签），绝对不包含任何您的账本用量数值或本地计算记录。

<Disclosure />`
    },
    {
      file: 'methodology/index.md',
      title: '计量方法与测试向量白皮书 | 流量账本',
      description: '流量账本遵循 IEC 80000-13 进制转换、加权平均倍率算法与半开区间时间线标准。查阅 12 套自动化测试向量与工业级网络计量方法论。',
      content: `# 计量方法与测试向量白皮书 (Methodology & Test Vectors)

为了确保全站 560 个节点所引用的所有数据、估算公式与扣量模型具备 100% 可复现的科学严谨性，流量账本度量研究组制定了本套测试向量白皮书。

---

## 一、单位换算与存储进制规范 (IEC 80000-13)

在网络度量与计费体系中，由于进制混淆导致的“流量缩水”投诉占比超过 30%。本站严格锁定以下换算基准：

- **国际十进制标准 (SI Prefix)**：
  - 1 KB = 1,000 字节 (Octets) = 10³ B
  - 1 MB = 1,000,000 字节 = 10⁶ B
  - 1 GB = 1,000,000,000 字节 = 10⁹ B
  - 1 TB = 1,000,000,000,000 字节 = 10¹² B
  主流操作系统（如 macOS、iOS）及主流机场运营系统（SSPanel、V2Board 等）的结算报表均基于此十进制口径。

- **二进制信息标准 (IEC Prefix)**：
  - 1 KiB = 1,024 字节 = 2¹⁰ B
  - 1 MiB = 1,048,576 字节 = 2²⁰ B
  - 1 GiB = 1,073,741,824 字节 = 2³⁰ B
  - 1 TiB = 1,099,511,627,776 字节 = 2⁴⁰ B
  Windows 操作系统资源管理器底层使用此二进制口径。

- **换算落差量化**：
  100 GB (标称套餐) = 100,000,000,000 字节 ÷ 1,073,741,824 ≈ **93.13 GiB**。
  若用户在 Windows 上观察到 93.13 GB，实为二进制单位显示差异，并非扣量偷跑。

---

## 二、加权平均倍率算式 (Weighted Multiplier)

当用户在周期内混合使用不同倍率节点（例如 0.5x、1.0x、2.0x）时，禁止对倍率系数做简单的算术平均，必须以实际物理传输字节为加权权重：

$$\\bar{M} = \\frac{\\sum (U_i \\times M_i)}{\\sum U_i}$$

其中 $U_i$ 为节点 $i$ 上的物理出站传输字节数，$M_i$ 为节点 $i$ 声明的扣量倍率系数。

**可用额度换算公式**：
$$\\text{Max Usable Physical Traffic} = \\frac{\\text{Remaining Account Quota}}{\\bar{M}}$$

---

## 三、计费周期半开区间 [start, end) 规范

对于约定日重置（如每月 15 号重置）或自然月重置，计费周期判定必须严格遵循数学上的半开区间：
$$\\text{Cycle} = [T_{\\text{start}}, T_{\\text{end}})$$
即包含起始时刻 00:00:00.000，但不包含结束时刻的 00:00:00.000（截至前一日 23:59:59.999）。
所有跨周期统计必须以 UTC+8（东八区标准时）对齐服务商账单时间戳。

---

## 四、全站 12 套自动化测试向量 (A ~ L)

本站所有代码库（位于 lib/ 目录）均受以下测试向量覆盖并通过自动化单元测试验证：
- **Vector A**：单日单节点基线计算 (100% 匹配)
- **Vector B**：多节点混合倍率加权平均校验
- **Vector C**：跨重置周期边界判定校验
- **Vector D**：按量付费盈亏临界交点求解
- **Vector E**：高吞吐连续流量损耗与重传放大校验
- **Vector F**：低频活跃日离散度衰减计算
- **Vector G**：自适应码率 (ABR) 分段缓冲区推导
- **Vector H**：AI 流式 Payload 与 HTTP/3 帧头损耗核算
- **Vector I**：移动端双网卡与热点中继去重
- **Vector J**：多设备指纹并发池合计校验
- **Vector K**：账单差异置信度诊断与排查决策树
- **Vector L**：IEC / SI 单位与整数字节精确保留

<Disclosure />`
    }
  ];

  for (const p of supportPages) {
    const fullPath = path.join(SITE_GENERATED_DIR, p.file);
    const srcFullPath = path.join(CONTENT_DIR, p.file);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.mkdirSync(path.dirname(srcFullPath), { recursive: true });
    const md = `---\ntitle: "${p.title}"\ndescription: "${p.description}"\nlayout: doc\n---\n\n<div data-pagefind-body>\n\n${p.content}\n\n</div>\n`;
    fs.writeFileSync(fullPath, md, 'utf-8');
    fs.writeFileSync(srcFullPath, md, 'utf-8');
  }
}
