---
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
   服务商根据其后台规则计算后从您账户中扣除的额度。公式为：`计费量 = 实际传输量 × 节点倍率`（若为双向计费，则合并上下行）。
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
