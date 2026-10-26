# 流量账本 (liuliangzhangben.cc)

[![Build & Verification](https://img.shields.io/badge/Verification-PASS-success)](https://liuliangzhangben.cc)
[![Nodes](https://img.shields.io/badge/Planned%20Nodes-560-blue)](https://liuliangzhangben.cc)
[![Chinese Words](https://img.shields.io/badge/Chinese%20Characters-970k%2B-informational)](https://liuliangzhangben.cc)
[![Privacy](https://img.shields.io/badge/Privacy-Zero%20Upload-brightgreen)](https://liuliangzhangben.cc/privacy/)

专注于解决**“用了多少、怎么扣量、什么时候重置、是否够用、账单为什么不同”**的独立网络流量计量、扣量复核、需求估算与对账诊断站点。

- **分站域名**：`https://liuliangzhangben.cc`
- **品牌名称**：流量账本
- **主要语言**：简体中文 (`zh-CN`)
- **唯一选购转化主站**：[机场榜一 (jichangbang.org)](https://jichangbang.org)

---

## 一、核心定位与独立价值

1. **解决真实痛点**：本站不是另一份综合排行榜，也不是纯价格预算站。用户路径为：
   $$\text{记录用量} \\rightarrow \\text{统一单位与范围} \\rightarrow \\text{核对倍率与周期} \\rightarrow \\text{估算需求} \\rightarrow \\text{检查差异} \\rightarrow \\text{有需要时前往主站比对真实服务}$$
2. **独立可用优先**：不跳转主站也必须能完整完成记账、计算、核对和阅读。主站转介不是付款成功；本站不建设虚构注册、订单和支付流程。
3. **零隐私上传与纯客户端安全**：普通浏览器网页绝不嗅探设备私网。所有账本数据保存在用户浏览器本地，支持内存暂存、显式持久化、安全 CSV 导出（防公式注入）与一键销毁。

---

## 二、固定技术栈

- **构建框架**：VitePress (Vue 3 + Vite) + TypeScript
- **正文规范**：Markdown 深度长文 + 品牌化简白主题
- **交互组件**：Vue 3 原生轻量组件 (`UsageLedger`, `MultiplierCalculator`, `ResetTimeline`, `PaygComparator`, `TrafficEstimator`, `VideoEstimator`, `DeviceAggregator`, `ReconciliationPanel`, `EvidenceBadge`, `DecisionTree`, `FAQ`, `MainSiteCTA`, `Disclosure`)
- **离线全文检索**：Pagefind (Extended 中文语言支持，针对静态 HTML 的 \`data-pagefind-body\` 索引)
- **部署环境**：Apache 静态托管（目录规范尾斜杠、真实 404 响应、禁用全量 SPA 首页重写）

---

## 三、目录工程架构

```
liuliangzhangben.cc/
├── content/               # 深度 Markdown 正文（含各节点完整推导与案例）
├── data/
│   ├── CONTENT_REGISTRY.json  # 560 个节点唯一 ID、URL、意图与状态注册表
│   └── CONTENT_GRAPH.json     # 全站 559 条父子拓扑与关联关系边
├── lib/                   # 纯函数计量算法与测试库 (TypeScript)
│   ├── types.ts           # 核心数据模型与枚举
│   ├── units.ts           # NIST/IEC 单位无损转换 (Byte, KB, KiB, MB, MiB, GB, GiB)
│   ├── multiplier.ts      # 加权平均倍率与方向扣量计算
│   ├── reset.ts           # 半开区间 [start, end) 与独立周期结算
│   ├── payg.ts            # 整包阶梯购买与实际使用单价分离计算
│   ├── ledger.ts          # 计数器重启倒退识别与安全求和
│   ├── device.ts          # 手机热点与电脑中继去重
│   ├── estimator.ts       # 任务需求与码率估算模型 (拒绝信息不足臆测)
│   ├── reconcile.ts       # 账单差异诊断与多因排查闭环
│   └── safety.ts          # CSV 公式注入防御与受控主站 UTM 构造
├── scripts/               # 幂等工程管道脚本
│   ├── content-meta.ts     # 13 一级 + 26 二级 + 104 集群元数据定义
│   ├── articles-data.ts    # 附录 A 全部 416 篇固定文章注册数据
│   ├── content-plan.ts     # 生成 560 节点注册表与图谱
│   ├── content-prepare.ts  # 准备正式正文至 site/generated/
│   ├── check-structure.ts  # 560 节点数量与唯一性门禁
│   ├── check-content.ts    # 正文字数统计与结构门禁
│   ├── check-links.ts      # 静态产物内部死链审查
│   └── check-secrets.ts    # 凭据与隐私泄漏静态审查
├── site/                  # VitePress 源码根目录
│   ├── .vitepress/        # VitePress 配置与主题
│   │   ├── config.mts     # 路由、导航、SEO head、Sitemap 配置
│   │   └── theme/         # 简白账本主题、CSS 与组件库
│   ├── public/            # 公共静态图标与资源 (logo.svg, favicon.ico)
│   └── generated/         # 正式发布的 Markdown 源 (srcDir)
├── tests/                 # 核心公式与测试向量自动化测试 (Vitest)
│   └── math.test.ts       # 测试向量 A 至 L 完整测试套件
├── reports/               # 审计与质检交付报告
│   ├── SEO_AUDIT.md       # SEO, GEO 与 AEO 规范审计
│   ├── PRIVACY_AUDIT.md   # 客户端零泄露与防注入审计
│   └── QA_REPORT.md       # 14 项质量门禁全面验收报告
├── deploy/                # Apache 生产部署配置文件
│   ├── .htaccess          # 目录重定向、真实 404、安全标头与缓存策略
│   └── apache-vhost.conf  # VirtualHost 生产部署参考
├── PROJECT_CONTRACT.md    # 项目契约
├── NETWORK_ROLE.md        # 转化主站角色与业务边界
├── KEYWORD_OWNERSHIP.md   # 560 节点主关键词权属登记
├── PROGRESS.json          # 执行进度与指标状态
├── RESUME.md              # 恢复执行与断点指南
└── EXECUTION_LOG.md       # 详细执行日志
```

---

## 四、核心算法与测试向量 (A 至 L)

本站所有核心计算严格通过自动化测试验证：
- **向量 A（单位体系）**：$1\\text{GB} = 10^9\\text{ B}$，$1\\text{GiB} = 2^{30}\\text{ B}$，$1\\text{B} = 8\\text{ bit}$。不混淆速率与容量。
- **向量 B（恒定速率）**：恒定 $8\\text{ Mbps}$ 持续 $7200\\text{ s}$ 等于 $7,200,000,000\\text{ 字节}$ ($7.2\\text{ GB}$)，与 $8\\text{ MB/s}$ ($57.6\\text{ GB}$) 严格区分。
- **向量 C（混合加权倍率）**：$30\\text{GB} @ 0.5\\text{x} + 20\\text{GB} @ 2.0\\text{x} = 55\\text{GB}$ 计费量；加权倍率为 $1.1\\text{x}$，而非算术平均 $1.25\\text{x}$。
- **向量 D（方向规则）**：上传 $10\\text{GB}$、下载 $30\\text{GB}$，统一 $1.5\\text{x}$：双向计费 $60\\text{GB}$，仅下行 $45\\text{GB}$；未确认时返回待确认。
- **向量 E（传输预算与 0x 倍率）**：剩余额度 $100\\text{GB}$ 在 $2.0\\text{x}$ 节点可用预算为 $50\\text{GB}$；$0\\text{x}$ 倍率特别警示其非无限安全。
- **向量 F（独立周期结算）**：两期各 $100\\text{GB}$，需求 $130\\text{GB}$ 与 $50\\text{GB}$，清零制下首期短缺 $30\\text{GB}$，次期结余不可逆向补偿。
- **向量 G（热点中继去重）**：手机热点与电脑对同一 $10\\text{GB}$ 外网任务的多级观察，对外传输仅计一次 $10\\text{GB}$。
- **向量 H（计数器重启识别）**：累计计数 $5\\text{GB}\\rightarrow 8\\text{GB}$ 增量 $3\\text{GB}$；$8\\text{GB}\\rightarrow 2\\text{GB}$ 识别为重置，不生成负数或静默置零。
- **向量 I & J（按量整包与单价分离）**：$100\\text{GB}/10\\text{元}$ 包需求 $230\\text{GB}$ 需买 3 包，支出 30 元剩 $70\\text{GB}$。使用 $40\\text{GB}$ 时实际使用成本为 $0.25\\text{元/GB}$，实际用量为 0 时返回 null。
- **向量 K（半开区间）**：时间戳落在 $[\\text{start}, \\text{end})$，恰好等于 $\\text{end}$ 归属下一周期。
- **向量 L（信息不足拒绝臆测）**：仅有分辨率标签或 Token 数量而无实测传输条件时，明确输出“信息不足”。

---

## 五、常用工程命令

```bash
# 1. 运行核心公式单元测试
npm test

# 2. 运行全量类型检查、单元测试、结构核验与安全审查
npm run check:all

# 3. 规划节点与生成注册表
npm run content:plan

# 4. 准备正式发布 Markdown 正文至 site/generated/
npm run content:prepare

# 5. 执行完整生产构建（包含结构核验、VitePress 静态编译、Pagefind 搜索索引与死链检查）
npm run build

# 6. 本地预览生产构建产物
npm run preview
```

---

## 六、生产部署与上线要求

仅将 `site/.vitepress/dist/` 下的静态产物部署至 Apache Web 服务器的 `DocumentRoot` 中。
将 `deploy/.htaccess` 放置于静态根目录下，确保：
1. 真实 404 响应生效（通过 `ErrorDocument 404 /404.html`）；
2. 目录请求规范保持尾斜杠（`/records/` 对应 `records/index.html`）；
3. 静态带哈希资源具备长缓存，HTML 保持协商重新验证。
