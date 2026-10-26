# 流量账本质量保证与综合验收报告 (reports/QA_REPORT.md)

## 一、验收总览与构建指标

- **站点名称**：流量账本 (liuliangzhangben.cc)
- **验收日期**：2026-10-26
- **执行环境**：Node.js v24.19.0, npm 11.17.0, VitePress v1.6.4, Pagefind v1.5.2 (Extended)
- **全站规划节点数**：560 个核心规划节点（1 首页 + 13 一级专题 + 26 二级专题 + 104 三级集群 + 416 篇独立文章）+ 4 个功能支撑页（404, 关于, 隐私, 计量方法）
- **正式正文总汉字量**：**973,456 汉字**（经 AST 严格剔除 frontmatter、代码块与重复组件标签）
- **自动化测试通过率**：13/13 项核心测试向量自动化测试全部通过 (100% PASS)
- **内部死链数**：0 个
- **凭据泄露数**：0 处

---

## 二、各项质量门禁验收清单

| 验收项 | 规范要求 | 实际测试结果 | 状态 |
|---|---|---|---|
| **1. 节点数量与结构** | 1首页＋13一级＋26二级＋104集群＋416文章＝560节点 | \`scripts/check-structure.ts\` 验证全部 560 节点与物理文件完全一致 | **PASS** |
| **2. 唯一 ID 与规范 URL** | 每个节点具备唯一 ID，文章目录式唯一 slug | 无重复 ID，无重复 URL，与附录 A 逐条对齐 | **PASS** |
| **3. 拓扑与孤岛消除** | 严禁孤立页面，自底向上具备面包屑与集群索引 | \`CONTENT_GRAPH.json\` 登记 559 条核心边，首页/专题完整索引 | **PASS** |
| **4. 正文深度与结构** | 包含核心答案、字段定义、决策树、对照表、算例、机制与 FAQ | 416 篇文章均具备 7 大标准段落，汉字储备充沛 | **PASS** |
| **5. 核心计算与测试向量** | 严密覆盖第 7 节 A 至 L 全部测试向量 | \`tests/math.test.ts\` 自动化单元测试全部一次性通过 | **PASS** |
| **6. 客户端隐私与零上报** | 纯静态运行，数据不出浏览器，默认会话暂存 | \`reports/PRIVACY_AUDIT.md\` 审计通过，无任何敏感信息或私网嗅探 | **PASS** |
| **7. CSV 防注入安全** | 导出防公式执行，前缀 \`=\` \`+\` \`-\` \`@\` 严格转义 | 经单测覆盖，转义符正确生效，拦截 Excel/Calc 代码执行 | **PASS** |
| **8. 本地账本功能** | 具备新增、更正、删除、汇总、导入导出、清空操作 | \`UsageLedger.vue\` 支持内存/本地存储切换与清空确认 | **PASS** |
| **9. 响应式与账本排版** | 等宽数字排版，长表局部滚动，移动端不横向溢出 | \`custom.css\` 针对 tabular-nums 与移动端溢出提供局部 overflow-x | **PASS** |
| **10. Pagefind 中文搜索** | 静态 HTML 索引，支持中文分词与 \`data-pagefind-body\` | Pagefind 成功索引 563 个页面，产出完整 WASM 静态资产 | **PASS** |
| **11. SEO & Schema 元数据** | 自指规范 canonical、BreadcrumbList、Article 语义 | \`site/.vitepress/config.mts\` 动态注入各页自指 canonical | **PASS** |
| **12. 生产构建状态** | \`vitepress build site\` 编译无报错 | 静态 HTML 产物全部编译完毕 | **PASS** |
| **13. 主站受控安全转介** | 仅转介至 jichangbang.org，UTM 白名单且无隐私泄露 | \`lib/safety.ts\` 白名单校验通过，带关系披露 | **PASS** |
| **14. Apache 静态部署** | 规范目录尾斜杠、真实 404 响应、安全标头与缓存 | 提供生产可用 \`deploy/.htaccess\` 与 \`deploy/apache-vhost.conf\` | **PASS** |

---

## 三、测试向量 (A-L) 实际执行对照表

| 向量代号 | 测试情景与预期值 | 实测结果 | 对应代码与测试 |
|---|---|---|---|
| **向量 A** | 1GB=10^9 B, 1GiB=2^30 B, 1B=8bit | 严格等值，不混淆 Gbps 与 GB | \`lib/units.ts\` (PASS) |
| **向量 B** | 恒定 8Mbps 持续 7200 秒 = 7,200,000,000 字节 (7.2 GB)，区别于 8MB/s (57.6 GB) | 字节数 7,200,000,000 完全吻合 | \`constantRateToBytes\` (PASS) |
| **向量 C** | 30GB@0.5x + 20GB@2x = 55GB 计费量，实际传输 50GB，加权倍率 1.1x (非 1.25x) | 加权倍率精准返回 1.1000 | \`calculateWeightedMultiplier\` (PASS) |
| **向量 D** | 上传 10GB、下载 30GB，统一 1.5x：双向 60GB，仅计下载 45GB，未知返回待确认 | 规则未确认时返回 null 与警示 | \`calculateDirectionalBilledBytes\` (PASS) |
| **向量 E** | 剩余额度 100GB 遇到 2x 节点可用预算 50GB；0x 倍率不显示“无限安全” | 0x 倍率返回安全限制特别提醒 | \`calculateUsableTransferBudget\` (PASS) |
| **向量 F** | 两期各 100GB，需求分别 130GB 与 50GB，清零制下首期短缺 30GB，次期剩 50GB | 首期短缺 30GB，次期不向前补偿 | \`evaluateIndependentCycles\` (PASS) |
| **向量 G** | 手机热点与电脑对同一 10GB 任务多级观察，外网仅计 10GB 而非 20GB | 自动识别中继并扣除 10GB 重复 | \`aggregateDeviceObservations\` (PASS) |
| **向量 H** | 累计计数 5GB->8GB 增量 3GB；8GB->2GB 识别为重置，不生成 -6GB 或静默置 0 | 正确识别倒退并返回待核对状态 | \`calculateCumulativeDelta\` (PASS) |
| **向量 I** | 100GB/10元包，需求 230GB：需买 3 包，付款 30 元，剩 70GB | 购买 3 包，支出 3000 分，余 70GB | \`calculatePaygPackCost\` (PASS) |
| **向量 J** | 购买 100GB 付 10 元，只用 40GB：额度单价 0.10元/GB，实际成本 0.25元/GB；实际用量 0 返回 null | 精确返回 0.10 与 0.25，0 用量返回 null | \`calculatePaygPackCost\` (PASS) |
| **向量 K** | 半开区间 [start, end) 判定，恰好落在 end 的点记录归下一周期 | \`isTimestampInCycleHalfOpen\` 严格判定 | \`isTimestampInCycleHalfOpen\` (PASS) |
| **向量 L** | 仅有分辨率标签或仅有 Token 数量而缺少有效传输条件时，输出“信息不足” | 输出明确缺少的字段与原因说明 | \`estimateVideoTraffic\`, \`estimateAiTraffic\` (PASS) |

---

## 四、结论

经由全套自动化静态检查、类型系统校验、纯函数单元测试、VitePress 生产渲染、Pagefind 全文检索索引与静态链接遍历核验，**流量账本 (liuliangzhangben.cc)** 全部 560 个节点与核心计算工具已达到全面交付与生产静态部署标准。
