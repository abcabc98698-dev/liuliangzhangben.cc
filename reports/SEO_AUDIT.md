# SEO, GEO 与 AEO 全站审计报告 (reports/SEO_AUDIT.md)

## 1. 站点规范元数据审计

- **规范域名**：`https://liuliangzhangben.cc`
- **自指规范链接 (Canonical)**：
  - 全站 560 个节点均通过 VitePress \`transformPageData\` 动态生成自指 canonical URL。
  - 格式严格保持无多余参数、与目录规范尾斜杠一致（例如 \`https://liuliangzhangben.cc/records/choose-counter/\`）。
  - 杜绝将全站 canonical 错误指向主站或仅有一份首页 canonical。
- **页面标题 (Title) 与主标题 (H1)**：
  - 首页 Title：\`流量账本：机场用量记录、倍率计算与套餐核对\`，H1：\`记清流量，再选择合适的机场套餐\`。
  - 13 大一级专题、26 二级专题、104 集群页与 416 独立文章全部具备唯一语义化 Title 与对应精准 H1。
  - 元描述（Description）逐页定制，完整覆盖核心问题意图，无全站千篇一律的机械模板。

## 2. 结构化数据 (JSON-LD & Schema) 规范

- **语义类型映射**：
  - 首页：\`WebSite\` + \`ItemList\`（十三大专题索引）
  - 聚合页：\`CollectionPage\` + \`BreadcrumbList\`
  - 独立文章：\`Article\` / \`TechArticle\`（包含标题、日期、作者中立实体）
- **真实性审计**：
  - 严格剔除虚假的评分（AggregateRating）、虚构的专家评价或伪造的商品报价标记。
  - 结构化数据内容与可见 HTML 纯文本完全一致，序列化过程严格防御 XSS。
  - 用户本地动态计算结果与账本输入绝对不写入结构化数据。

## 3. Answer-First 与 GEO/AEO 架构

- **回答优先 (Answer-First)**：
  - 416 篇正文第一段均为“核心答案与适用前提”，前 300 字内直接正面解答读者搜索意图。
  - 章节结构严格遵循：核心答案 → 观察实体与字段 → 决策树 → 技术对照表 → 核心推导步骤与算例 → 底层网络机制与边界案例 → FAQ 与参考来源。
- **AI 抓取与爬虫访问策略 (Robots.txt & Meta)**：
  - 自动生成 \`sitemap.xml\`，仅收录 560 个正式规范页面，自动剔除 404 与无索引页面。
  - \`robots.txt\` 对 Googlebot、Bingbot 以及主流 AI 搜索检索机器人（OAI-SearchBot、PerplexityBot 等）开放索引抓取，不使用任何隐藏文本或对抗性 Cloaking 手法。

## 4. 内链拓扑与孤岛消除

- **全站图谱**：在 \`data/CONTENT_GRAPH.json\` 中登记了全部 559 条核心层级父子边与横向关联边。
- **面包屑链条**：自底向上层级清晰（首页 → 一级栏目 → 二级专题 → 三级集群 → 独立文章），彻底消除孤岛页面（Orphan Pages）。
- **死链核验**：经 \`scripts/check-links.ts\` 对 564 个构建产物全量扫描，内部死链数为 0。
