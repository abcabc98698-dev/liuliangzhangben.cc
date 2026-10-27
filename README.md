<div align="center">

<img src="./site/public/avatar.png" alt="流量账本 Logo" width="120" height="120" style="border-radius: 50%; box-shadow: 0 4px 16px rgba(0,0,0,0.12);" />

# 流量账本 (liuliangzhangben.cc)

### 工业级网络代理流量计量、加权扣量复核、重置周期诊断与对账技术工程

[![Framework: VitePress](https://img.shields.io/badge/Framework-VitePress%201.6.4-4f46e5.svg?style=flat-square&logo=vite)](https://vitepress.dev/)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript%205.7-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Testing: Vitest](https://img.shields.io/badge/Tests-13%2F13%20PASS-success.svg?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Static Search: Pagefind](https://img.shields.io/badge/Search-Pagefind%20v1.5-ff5e00.svg?style=flat-square)](https://pagefind.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)

[![Nodes Coverage](https://img.shields.io/badge/Nodes%20Coverage-560%20%2F%20560%20(100%25)-blue.svg?style=flat-square)](https://liuliangzhangben.cc)
[![Chinese Content](https://img.shields.io/badge/Total%20Words-1.66M%2B%20Chars-informational.svg?style=flat-square)](https://liuliangzhangben.cc)
[![SEO Health Score](https://img.shields.io/badge/SEO%20Health-98.8%20%2F%20100-brightgreen.svg?style=flat-square)](https://liuliangzhangben.cc/sitemap.xml)
[![Dead Links](https://img.shields.io/badge/Dead%20Links-0%20(Strict%20Pass)-success.svg?style=flat-square)](https://liuliangzhangben.cc)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Client--Side-teal.svg?style=flat-square)](https://liuliangzhangben.cc/privacy/)

<p align="center">
  <a href="https://liuliangzhangben.cc"><strong>探索在线站点 🌐</strong></a> ·
  <a href="#-核心交互工作台"><strong>交互工具箱 🛠️</strong></a> ·
  <a href="#-全站十三大核心专题图谱"><strong>知识图谱 📚</strong></a> ·
  <a href="#-核心算法与测试向量-a-至-l"><strong>算法白皮书 📐</strong></a> ·
  <a href="#-快速开始"><strong>快速开始 🚀</strong></a>
</p>

</div>

---

## 📖 项目简介

**流量账本 (liuliangzhangben.cc)** 是一个专注于解决 **“实际到底用了多少”**、**“后台究竟怎么扣量”**、**“额度在什么时候清零重置”**、**“现有套餐是否真正够用”** 以及 **“本地记录为什么和账单相差甚远”** 的独立网络流量前置度量与对账技术工程。

本站严格坚守**纯静态客户端架构 (Client-Side Sandboxing)**：
- ❌ **不设置** 后端用户数据库与登录系统；
- ❌ **不要求** 绑定任何订阅链接、账号密码或节点凭据；
- ❌ **不嗅探** 操作系统的底层私有网络套接字；
- ✅ **所有记账、换算、对账与情景推导均在用户本地浏览器安全执行**；
- ✅ **支持脱敏数据本地存储、清洁 CSV 导出（防公式注入）与一键本地销毁**。

---

## 🏛️ 系统架构与四层观测拓扑

绝大多数“流量偷跑”和“扣量过快”争议，本质上源于观察者身处不同网络拓扑层级所产生的**口径错配**。本项目建立了严密的四层度量拓扑：

```
+-------------------------------------------------------------------------+
|                  全网流量度量四层观察体系 (Wire Topology)                |
+-------------------------------------------------------------------------+
| [Layer 1: 业务应用层]  浏览器/YouTube/ChatGPT/Steam 呈现的纯应用层数据量 |
|     ↓ (应用层开销: HTTP/2/3 报头、TLS 1.3 握手、JSON 序列化冗余: +3%~8%)   |
| [Layer 2: 操作系统层]  系统 Socket、虚拟网卡 (TUN/TAP) 捕获的原始 IP 数据报  |
|     ↓ (传输层开销: TCP 头部 20B、UDP 头部 8B、MTU 分片与丢包重传: +2%~15%) |
| [Layer 3: 本地代理层]  Clash / Sing-box / Surge 出站加密封装 (Shadowsocks/  |
|                        VMess / VLESS / Trojan / Hysteria2 协议包头: +5%~12%)|
|     ↓ (公网物理链路: 运营商 QoS 丢包、TCP 重传放大、双向计费上下行汇总)     |
| [Layer 4: 服务端出口]  机场节点出口 RADIUS / v2ray Accounting 计费采集点     |
|     ↓ (计费倍率乘积: 物理出站字节数 × 节点倍率系数 0.5x ~ 3.0x)             |
| [最终账单扣量额度] 真正从您套餐中扣减的计费资产 (Billed Usage Bytes)      |
+-------------------------------------------------------------------------+
```

---

## 🗂️ 全站十三大核心专题图谱 (560 节点规模)

全站构建了完整的树状 Topic Cluster 知识蜂巢网络，覆盖 **1 首页 + 13 一级 Pillar Hub + 26 二级子专题 + 104 三级集群 + 416 篇实战长尾文章**，正式正文总汉字量达 **166.6 万字**：

| 一级专题入口 | 核心业务定位 | 核心痛点与算法突破 | 下辖规模 |
| :--- | :--- | :--- | :--- |
| [用量记录](/records/) | 统计来源与账本管理 | 区分客户端 TUN、物理网卡与后台；规范整数字节基准 | 2 子专题 / 8 集群 / 32 篇 |
| [流量估算](/estimate/) | 任务模型与周期预测 | 建立低/中/高情景模型，推导恒定码率与突发离散任务 | 2 子专题 / 8 集群 / 32 篇 |
| [倍率规则](/multipliers/) | 扣量公式与加权计算 | 彻底讲透 0.5x~3.0x 节点差异，解耦单双向计费权重 | 2 子专题 / 8 集群 / 32 篇 |
| [重置周期](/reset/) | 时间线与额度结转 | 自然月/账单日重置，对齐 $[T_{\text{start}}, T_{\text{end}})$ 半开区间 | 2 子专题 / 8 集群 / 32 篇 |
| [按量方案](/payg/) | 流量包与整包阶梯 | 求解整包购买闲置成本与真实使用单价盈亏交点 | 2 子专题 / 8 集群 / 32 篇 |
| [大流量专题](/high-data/) | 重任务拆分与持续吞吐 | 解决百 GB 同步、系统更新与高峰期链路丢包重传损耗 | 2 子专题 / 8 集群 / 32 篇 |
| [低频使用](/occasional/) | 活跃日与备用账本 | 解决间歇使用、假期出游与备用线路的防过期机制 | 2 子专题 / 8 集群 / 32 篇 |
| [视频用量](/video/) | 码率时长与多屏同步 | 自适应码率 (ABR) 分段缓冲区推导与电视投屏去重 | 2 子专题 / 8 集群 / 32 篇 |
| [AI用量](/ai/) | Token 与网络字节边界 | 厘清 Token 配额与 HTTP 报文字节区别，核算流式损耗 | 2 子专题 / 8 集群 / 32 篇 |
| [手机用量](/mobile/) | 移动系统与热点中继 | 移动端多网卡去重，手机开热点电脑上网的去重记账 | 2 子专题 / 8 集群 / 32 篇 |
| [设备数量](/devices/) | 跨端去重与额度池 | 一人多端、家庭共享并发连接数约束与去重合计 | 2 子专题 / 8 集群 / 32 篇 |
| [账单核对](/reconcile/) | 差异诊断与取证闭环 | 对齐观察点，排查批处理延迟、重传封装与取整误差 | 2 子专题 / 8 集群 / 32 篇 |
| [知识百科](/knowledge/) | 计量网络与可信边界 | IEC/SI 进制原理、TCP 重传、分流规则影响与证据分级 | 2 子专题 / 8 集群 / 32 篇 |

---

## 🛠️ 核心交互工作台 (Vue 3 Components)

全站提供 8 款纯客户端本地安全运行的交互计量工具：

- 📊 **`UsageLedger.vue` (本地流量账本)**：支持添加、统计、筛选多设备用量记录，支持安全 CSV/JSON 导出（防公式注入）与本地清空。
- 🧮 **`MultiplierCalculator.vue` (加权倍率计算器)**：输入多节点传输量与倍率系数，精确计算真实计费扣量与加权平均倍率。
- ⏱️ **`ResetTimeline.vue` (周期时间线结算器)**：根据起始日、重置规则与时区，推算下一次清零时刻与半开区间可用倒计时。
- ⚖️ **`PaygComparator.vue` (按量与周期方案比较器)**：计算整包闲置成本，绘制按量付费与周期月付的盈亏平衡临界点。
- 📈 **`TrafficEstimator.vue` (多情景需求估算器)**：按网页、影音、代码、AI 交互时长，输出低/中/高置信区间建议。
- 🎬 **`VideoEstimator.vue` (视频码率与时长测算器)**：支持 1080P/4K/8K 码率换算与 ABR 缓冲预加载冗余推演。
- 📱 **`DeviceAggregator.vue` (多端并发与去重汇总器)**：模拟多端并用、家庭共享环境下的并发连接数与总额度池消耗。
- 🔍 **`ReconciliationPanel.vue` (账单差异排查面板)**：多维度诊断本地网卡记录与服务商后台差额的归因流向。

---

## 📐 核心算法与测试向量 (A 至 L)

本站所有核心算法均在 `lib/` 具有整数字节与精确十进制实现，通过 Vitest 全自动化覆盖（`tests/math.test.ts` 13/13 PASS）：

```math
\text{加权平均倍率：} \bar{M} = \frac{\sum (U_i \times M_i)}{\sum U_i} \qquad \text{最大可用物理流量：} T_{\text{max}} = \frac{Q_{\text{remaining}}}{\bar{M}}
```

- **向量 A（单位规范）**：严格遵循 IEC 80000-13。$1\text{ GB} = 10^9\text{ B}$，$1\text{ GiB} = 2^{30}\text{ B}$，$1\text{ B} = 8\text{ bit}$。
- **向量 B（恒定速率）**：恒定 $8\text{ Mbps}$ 持续 $7200\text{ s}$ 产生 $7.2\text{ GB}$ 物理传输，与 $8\text{ MB/s}$ ($57.6\text{ GB}$) 严格区分。
- **向量 C（加权倍率）**：$30\text{GB} @ 0.5\text{x} + 20\text{GB} @ 2.0\text{x} = 55\text{GB}$ 计费扣量，加权倍率为 $1.1\text{x}$，严禁算术平均。
- **向量 D（方向规则）**：上传 $10\text{GB}$、下载 $30\text{GB}$ @ $1.5\text{x}$：双向计费扣 $60\text{GB}$，仅下行扣 $45\text{GB}$。
- **向量 E（0x倍率警示）**：剩余额度 $100\text{GB}$ 在 $2.0\text{x}$ 节点可用预算为 $50\text{GB}$；$0\text{x}$ 倍率特别警示其非无限安全。
- **向量 F（独立周期结算）**：清零制下首期短缺不可通过次期结余逆向填补。
- **向量 G（热点中继去重）**：手机热点与电脑对同一外网任务的多级观察，对外传输仅计一次。
- **向量 H（计数器重启识别）**：识别累计计数归零重置，避免负增量或异常溢出。
- **向量 I & J（按量整包分离）**：整包购买支出与实际使用折算单价分离求解。
- **向量 K（半开区间判定）**：时间戳对齐 $[T_{\text{start}}, T_{\text{end}})$ 半开区间。
- **向量 L（拒绝对称臆测）**：仅有分辨率标签而无实测网络条件时，明确输出“信息不足”。

---

## 🔍 SEO 与搜索引擎基础设施

- **Sitemap 健全度**：`https://liuliangzhangben.cc/sitemap.xml` 自动收录 563 个正式 URL，时间戳自然离散化。
- **爬虫放行合规**：`robots.txt` 显式支持 `Googlebot`、`Bingbot`、`Baiduspider`、`yisouspider`（神马搜索）及主流 AI 爬虫。
- **Schema.org JSON-LD**：全站 564 个页面 100% 注入结构化数据（包含 564 处 `BreadcrumbList`、562 处 `TechArticle`、`WebSite`、`Organization` 与 `AboutPage`）。
- **商业外链合规**：所有 1,189 处指向外部主站的转介链接 100% 具备 `rel="nofollow sponsored noopener"` 与 `target="_blank"`，杜绝触发 Link Spam。
- **E-E-A-T 权威凭据**：全站文章均挂载资深网络测试工程师（CCIE/CISSP 规范）责任编辑与技术复核署名。
- **0 孤立页 & 0 死链**：页脚全局直达支撑页，全站死链数严格保持为 0。

---

## 💻 快速开始

### 依赖环境
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装与运行
```bash
# 1. 克隆代码仓库
git clone https://github.com/abcabc98698-dev/liuliangzhangben.cc.git
cd liuliangzhangben.cc

# 2. 安装项目依赖
npm install

# 3. 运行核心公式单元测试 (Vitest)
npm test

# 4. 运行全量代码审查 (类型检查 + 单元测试 + 560节点规范 + 正文门禁 + 隐私安全 + 文本查重)
npm run check:all

# 5. 启动本地开发服务
npm run dev

# 6. 执行全量生产编译 (VitePress SSG + Pagefind 中文分词索引 + 死链扫描)
npm run build

# 7. 本地预览生产构建产物 (端口 5188)
npm run preview
```

---

## 📂 项目目录结构

```text
liuliangzhangben.cc/
├── content/                   # 560 节点深度 Markdown 生产源文档
├── data/
│   ├── CONTENT_REGISTRY.json  # 560 节点规范元数据注册表
│   ├── CONTENT_GRAPH.json     # 全站 559 条父子与关联拓扑边
│   └── KEYWORD_OWNERSHIP.md   # 560 个页面主关键词权属登记表
├── lib/                       # 纯函数数学计量算法与安全库 (TypeScript)
│   ├── units.ts               # IEC 80000-13 进制转换模型
│   ├── multiplier.ts          # 加权倍率与单双向计算
│   ├── reset.ts               # 半开区间周期边界判断
│   ├── payg.ts                # 按量阶梯盈亏平衡模型
│   ├── ledger.ts              # 计数器重置识别与安全汇总
│   ├── device.ts              # 跨端热点中继去重
│   ├── estimator.ts           # 任务码率与需求估算
│   ├── reconcile.ts           # 账单差异诊断决策树
│   └── safety.ts              # 安全 CSV 导出与清洁 UTM
├── scripts/                   # 自动化工程构建与质量审计脚本
│   ├── content-prepare.ts     # 560 节点 Markdown 生成管道
│   ├── check-structure.ts     # 结构规范与节点唯一性门禁
│   ├── check-content.ts       # 正文字数统计与结构门禁
│   ├── check-links.ts         # 全站产物内部死链扫描
│   ├── check-secrets.ts       # 敏感凭据零泄露审计
│   └── audit-similarity.ts    # Jaccard 内容相似度审查
├── site/                      # VitePress 站点工程源码
│   ├── .vitepress/
│   │   ├── config.mts         # 路由、导航、SEO Head 与 Schema 生成引擎
│   │   └── theme/             # 极简白账本风格主题与 Vue3 交互组件
│   ├── public/                # 网站公开静态资源 (avatar.png, robots.txt)
│   └── generated/             # SSG 正式编译输入目录
├── tests/                     # 自动化测试套件 (Vitest)
│   └── math.test.ts           # 核心测试向量 A 至 L
├── deploy/                    # Apache 生产部署配置文件
│   ├── .htaccess              # 规范尾斜杠、真实 404、安全标头与协商缓存
│   └── apache-vhost.conf      # VirtualHost 生产部署参考配置
├── PROGRESS.json              # 项目全生命周期进度与指标数据
├── seo-health-report.md       # 预防性 SEO 健康检查与优化审计报告
└── README.md                  # 本项目自述文件
```

---

## 🤝 协作主站与角色边界说明

本项目（**流量账本 liuliangzhangben.cc**）与唯一选购协作主站（**[机场榜一 jichangbang.org](https://jichangbang.org)**）保持明确的角色边界：
- **流量账本**：专注于中立客观的“前置计量、账本记录与扣量诊断”，不提供任何商业节点订阅销售，所有计算在用户本地运行。
- **机场榜一**：专注于真实加速服务商的横向网络性能评测与选购对比。
- **中立与免责声明**：当用户在流量账本理清用量需求清单后，可通过清洁转介链接前往主站比对真实套餐。转介佣金绝不影响用户实际支付价格，流量账本与任何第三方加速服务商均无资产隶属或排他垄断协议。

---

## 📄 开源许可证

本项目基于 [MIT 许可证](./LICENSE) 开源。欢迎全球网络工程师、开发者与极客共同参与完善度量算法与测试向量！
