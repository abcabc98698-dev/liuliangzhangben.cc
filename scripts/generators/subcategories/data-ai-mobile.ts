import { SubcategoryData } from './types';

export const SUBCATEGORY_DATA_AI_MOBILE: Record<string, SubcategoryData> = {
  'ai/workloads': {
    catSlug: 'ai',
    subSlug: 'workloads',
    title: 'AI任务的网络构成',
    tagline: '拆解上下文Prompt注入、多模态大图上传、流式SSE分块与编程助手的物理网络负载',
    firstPrinciples: [
      {
        title: 'Token 计费与物理网络字节解耦公理',
        content: '大模型服务商按 Token 计费，网络加速服务商按网络字节（Bytes）计费。二者遵循完全不同的物理规律。100 万纯文本 Tokens 经 UTF-8 编码净大小仅约 3.5 MB；但结合 HTTP/2 JSON 封装、完整历史对话上下文重发（Context Window Injection）与 System Prompt 携带，实际每次 API 请求发送的上行网络载荷通常是输出纯文本的 10~50 倍！'
      },
      {
        title: '多模态 (Vision/Audio) 的数量级爆炸',
        content: '文本交互是纯粹的轻量网络请求，而一旦进入多模态领域（上传高分辨率截屏、长语音识别、AI 生图/生视频），数据量发生量级质变：单张未压缩的 4K 截图上传载荷可达 8~15 MB；生成一段 5 秒的短视频下行消耗可达 50~100 MB。多模态任务是 AI 场景下流量暴涨的核心根源。'
      },
      {
        title: '流式传输 (Server-Sent Events) 的包头碎片放大',
        content: '为实现打字机逐字输出效果，AI 普遍采用 `stream: true` 模式。服务器通过 HTTP/2 DATA 帧以 1~2 个 Token 为单位高频推送 SSE 报文。一个仅含 5 字节内容的单词外层必须包裹 100+ 字节的 JSON 结构与 TLS 记录头，产生显著的“小包协议头损耗”，物理流量比非流式响应多出 15%~30%。'
      }
    ],
    topologyTitle: 'AI API 交互链路与协议封装拓扑',
    topologyAscii: `+--------------------------------------------------------------------------+
| 现代 AI 任务 (Cursor / ChatGPT API) 网络数据流转拓扑                     |
+--------------------------------------------------------------------------+
| 用户在客户端发起对话或代码重构请求 ("帮我优化这个函数")                  |
|                         │                                                |
|                         ▼                                                |
| [应用层 Application Layer (HTTP/2 POST to api.anthropic.com)]            |
|   ├── 用户提问文本: 25 字节 ("帮我优化这个函数")                          |
|   ├── System Instructions: 4,500 字节 (角色设定、安全提示词)             |
|   ├── 项目多文件上下文 Context: 85,000 字节 (自动附带 index.ts + utils.ts)|
|   └── 工具函数定义 Tools Schema: 28,000 字节 (20+ 外部函数调用声明)      |
|   └── L1 上行净载荷小计: 117,525 字节 (~115 KB 物理载荷!)                |
|                         │                                                |
|                         ▼                                                |
| [传输与代理封装层 (VLESS + Reality on TCP Port 443)]                     |
|   ├── 客户端出站切分: 80+ TCP 分段 (MSS 1460)，附加 TLS 1.3 记录头       |
|   └── 上行实际物理吞吐: 124,000 字节 (~121 KB Wire Traffic)              |
|                         │                                                |
|                         ▼ (双向计费节点 US-Silicon-Valley [1.0x])         |
| [服务端流式 SSE 逐字返回 (400 Tokens Output)]                            |
|   ├── 下行流式切片: 180 个 HTTP/2 DATA 帧 (每个帧均携带 JSON 协议外壳)    |
|   └── 下行实际物理吞吐: 38,000 字节 (~37 KB Wire Traffic)                |
|                         │                                                |
|                         ▼                                                |
| [计费网关双向汇总核算 Committed]:                                        |
|   ├── 上行 121 KB + 下行 37 KB = 158 KB 真实计费扣量                     |
|   └── 终极真相: 上行输入占用全流程 76.5% 的流量！提问比回答更耗流量！    |
+--------------------------------------------------------------------------+`,
    topologyExplanation: '通过解构现代 AI 工具的抓包拓扑，用户便能彻底领悟为什么在代码助手（Cursor/Copilot）中，写代码的流量消耗远远大于在网页版 ChatGPT 聊天，其根源在于本地上下文文件的全量上行注射。',
    clusterDetails: {
      dialogue: {
        scenarioPainPoint: '以为和 AI 聊两句只花了几十个字，不知道长对话时每次提问都会把前面几十轮的历史记录全部重新上传一遍。',
        engineeringSolution: '养成定期在新主题开启【新对话 (New Chat)】的习惯，阻断历史上下文雪球式膨胀。',
        takeaway: '及时开启全新会话，阻断历史记录隐形上传滚雪球。'
      },
      documents: {
        scenarioPainPoint: '向 Claude/Kimi 上传一本 50MB 的 PDF 论文让它总结，直接造成上百 MB 的双向上行流量。',
        engineeringSolution: '在本地先对 PDF 执行去图纯文本提取（如 pdftotext），仅上传几百 KB 的纯文本进行分析。',
        takeaway: '本地先清洗再上传，规避笨重大文件盲目吃带宽。'
      },
      multimodal: {
        scenarioPainPoint: '使用 Midjourney 或视频生成工具时，频繁生成和下载高清图片与视频导致流量以 GB 为单位流失。',
        engineeringSolution: '将多模态 AI 任务归入重度吞吐模型，搭配 0.5x~1.0x 大容量节点使用。',
        takeaway: '把控多模态巨额吞吐，为大图生图规划充裕配额。'
      },
      coding: {
        scenarioPainPoint: '使用 Cursor/Windsurf 编程，每天正常写代码，一个月下来代理软件显示跑了上百 GB 流量。',
        engineeringSolution: '合理配置 `.cursorignore`，忽略 `node_modules` 与构建产物，防止整个代码库被自动上传。',
        takeaway: '规范忽略规则，阻断代码助手后台滥发海量文件。'
      }
    },
    comparisonTable: [
      {
        dimension: '纯文本日常对话 (ChatGPT Web)',
        commonMistake: '误以为文字聊天很耗流量',
        technicalMechanism: '单次交互网络载荷通常在 5 KB ~ 50 KB 之间',
        impactMagnitude: '一个月全天高频聊天，累计消耗仅在 300 MB ~ 1.5 GB',
        recommendedStrategy: '纯文本 AI 交互完全无需担忧额度，任意轻量套餐均可从容承接'
      },
      {
        dimension: '代码编辑器助手 (Cursor / Copilot)',
        commonMistake: '以为敲代码只传当前光标所在的一两行字符',
        technicalMechanism: '自动索引并打包整个项目中的相关文件及目录树作为 Prompt 注入',
        impactMagnitude: '高频保存与自动补全可导致单日上行吞吐达到 1 GB ~ 3 GB',
        recommendedStrategy: '在项目根目录严密编写 `.cursorignore`，配置分流走单向计费节点'
      },
      {
        dimension: 'AI 画图与视频生成 (Sora / Kling)',
        commonMistake: '以为生成失败或者放弃的预览图不耗流量',
        technicalMechanism: '预览帧与高分辨率最终视频均需从海外 CDN 完整下行拉取',
        impactMagnitude: '生成 10 个视频切片可瞬间消耗 1 GB ~ 3 GB 物理下行',
        recommendedStrategy: '配置专门的流媒体大吞吐节点，避免使用高倍率专线'
      }
    ],
    auditChecklist: [
      '第一步：在项目根目录下检查是否存在 `.cursorignore` 或 `.gitignore`，确认大型目录已排除。',
      '第二步：检查常用 AI 工具所绑定的代理节点，核实该节点是否支持 OpenAI/Anthropic 原生解锁。',
      '第三步：在长文本或长代码对话超过 20 轮后，主动点击【新建会话】重置上下文窗口。',
      '第四步：需要上传 PDF 分析时，优先将文件压缩或转为 Markdown 纯文本后再行提交。',
      '第五步：针对频繁调用 API 的开发者，在脚本中配置合理的重试限制（Max Retries <= 3）。',
      '第六步：月末在账本中将 AI 任务独立列为一类，复盘其在总体出海流量中的占比。'
    ],
    faqs: [
      {
        question: '为什么有时候用 Cursor 总是提示网络超时断连，但看网页却很正常？',
        answer: '这是因为 Cursor 的 API 请求需要维持极长周期的长连接（SSE 流式返回一个完整复杂函数可能需要 30~60 秒）。许多普通公网机场为了防范滥用，会在防火墙中设置激进的【TCP 空闲超时（Idle Timeout）】规则（如空闲 15 秒强制发送 TCP RST 断开）。如果节点长连接保活能力较弱，就会频繁报错超时。使用 AI 编程必须选择支持长连接保活的稳定专线节点。'
      },
      {
        question: '使用 ChatGPT 官方 API，网络流量扣费和 OpenAI 的 Token 扣费有什么联系吗？',
        answer: '二者在财务上完全独立。OpenAI 扣除的是你的 OpenAI 账户绑定的美元信用卡余额（按 Token 计算输入/输出费用）；而网络加速服务商扣除的是你在机场购买的 GB 流量配额（按网络传输物理字节计算）。二者之间不存在任何互通，只要数据包经过了代理节点，哪怕 OpenAI 返回报错（如 429 报错），网络流量也已经被真实消耗并被机场扣除。'
      }
    ],
    targetPath: '/recommend/',
    campaign: 'ai_workloads_sub',
    ctaTitle: '高频使用 ChatGPT 与 Cursor 需要极致稳定与长连接保活？',
    ctaText: '前往主站查看 AI 原生解锁稳定专线榜'
  },

  'ai/accounting': {
    catSlug: 'ai',
    subSlug: 'accounting',
    title: 'AI计量边界与额度计划',
    tagline: '理顺 Token、费用与字节边界，治理重试风暴与中断损耗，构建安全的 AI 预算闭环',
    firstPrinciples: [
      {
        title: '双向计费与不对称上行核算公理',
        content: 'AI 交互是典型的“重度上行、碎片下行”业务。在双向计费的节点机制下，上行 Prompt 流量被完全等同于下行计算。若使用 2.0x 专线节点调用代码助手，上传 100MB 上下文代码将直接在后台扣除 200MB 配额。必须将双向倍率纳入 AI 任务的采购成本核算。'
      },
      {
        title: 'API 错误重试雪崩放大律 (Exponential Retry Storm)',
        content: '当遇到 API Rate Limit (429) 或网络中断 (504) 时，未经限制的自动重试脚本（如循环死试）会在极短时间内反复重发数万字的大 Prompt。一次失败的任务若自动重试 5 次，不仅未获得有效答案，反而直接产生 5 倍的纯无用上行物理流量。'
      },
      {
        title: '隐私边界与商业大模型反向爬虫防护',
        content: '在出海线路上运行 AI 任务时，部分用户直接开启全机透明代理。本地私有代码库、内部凭据文件若被未经审计的本地大模型插件静默上传，将引发极其严重的合规与隐私灾难。必须在代理层对私网地址与敏感域名建立强制拦截规则。'
      }
    ],
    topologyTitle: 'AI 预算管理与重试风暴防护拓扑',
    topologyAscii: `+--------------------------------------------------------------------------+
| AI 任务预算控制与重试阻断机制 (AI Accounting & Governance)               |
+--------------------------------------------------------------------------+
| 用户发起批处理调用或自动 Agent 循环 (Autonomous Loop)                    |
|                         │                                                |
|                         ▼                                                |
| [第 1 层防线: 本地速率与重试熔断器 (Rate Limiter & Breaker)]             |
|   ├── 指数退避算法: 重试间隔 1s -> 2s -> 4s (严禁无间隔暴力重试)        |
|   └── 最大尝试次数硬限制: Max Attempts = 3 (三次失败立即告警熔断)        |
|   └── 成果: 彻底杜绝 504 错误引发的百万 Token / GB 级无效死循环          |
|                         │                                                |
|                         ▼                                                |
| [第 2 层防线: 分流引流与计费方向匹配]                                    |
|   ├── AI 文本交互 (高频但纯文本) -> 引流至 [单向计费/低倍率专线]         |
|   └── 多模态大模型生图生视频 -> 引流至 [0.5x 大容量大带宽公网节点]      |
|                         │                                                |
|                         ▼                                                |
| [第 3 层防线: 周期资产精细配比]                                          |
|   ├── 预算编制: 结合 Token 消耗反推物理字节需求                          |
|   └── 组合配置: 核心办公专线 (防封号) + 弹性按量包 (防月底任务中断)      |
+--------------------------------------------------------------------------+`,
    topologyExplanation: '通过在本地应用层建立重试熔断机制，并在代理层针对性分流，开发者可以彻底规避因自动化 Agent 失控导致的流量额度一夜暴毙。',
    clusterDetails: {
      tokens: {
        scenarioPainPoint: '混淆 Token 账单与机场流量账单，以为花 10 美元买了 OpenAI API，机场里的流量就不会扣。',
        engineeringSolution: '理清二者属于两个完全独立的商业实体，在预算中分别列支 API 费用与加速流量费用。',
        takeaway: '厘清双轨计费主体，建立清晰的独立预算模型。'
      },
      retries: {
        scenarioPainPoint: '脚本在后台持续遭遇 429 限流，死循环重发了几千次，第二天一早发现几十 GB 流量全部扣光。',
        engineeringSolution: '在所有 Python/Node.js 脚本中引入指数退避库（如 tenacity），设置单任务重试熔断。',
        takeaway: '部署自动熔断机制，勒住重试失控狂奔的缰绳。'
      },
      privacy: {
        scenarioPainPoint: '担心自己的聊天记录和敏感代码在经过机场节点时被中间人偷窥窃取。',
        engineeringSolution: '明确 HTTPS/TLS 1.3 的端到端加密性质：代理节点仅能看到目标 IP 和数据包体积，绝无可能解密明文。',
        takeaway: '认识 TLS 强加密屏障，消除盲目恐慌，守住安全边界。'
      },
      budget: {
        scenarioPainPoint: '团队搞 AI 研发，没做好用量规划，关键演示时刻节点额度枯竭报错，造成商务重大事故。',
        engineeringSolution: '为 AI 研发线采购独立的团队多设备套餐，开启双倍安全冗余与多地域自动故障切换。',
        takeaway: '实施业务专属配额规划，为关键研发筑牢冗余底座。'
      }
    },
    comparisonTable: [
      {
        dimension: '原生 IP 解锁对 AI 的影响',
        commonMistake: '使用劣质机房 IP 频繁访问 OpenAI 导致被批量封号',
        technicalMechanism: 'OpenAI 部署了极其严格的 Cloudflare 与欺诈风控模型，识别机房 ASN 代理',
        impactMagnitude: '触发 403 Access Denied 报错，甚至导致个人 ChatGPT 账号被永久注销',
        recommendedStrategy: '必须选用明确支持【OpenAI / Claude 原生解锁】的家宽或优质专线节点'
      },
      {
        dimension: '脚本高频并发并发数',
        commonMistake: '写多线程爬虫式调用 LLM，瞬间并发发起 100 个请求',
        technicalMechanism: '触发服务商 RADIUS 审计网关的“异常攻击流”防御，IP 被临时拉黑封锁',
        impactMagnitude: '节点瞬间断流，且由于大量连接重建造成流量严重多扣',
        recommendedStrategy: '在客户端限制并发连接池上限（如 `max_connections = 10`）'
      },
      {
        dimension: 'API 报错返回时的流量扣减',
        commonMistake: '以为 API 报错返回 400/500，机场就不会扣减流量',
        technicalMechanism: '只要客户端与服务端完成了物理 TCP/TLS 通信，网卡即产生了真实出网字节',
        impactMagnitude: '一次错误上传的上百 KB 流量照样被计费网关全额扣减',
        recommendedStrategy: '在本地对输入格式做严格前置校验，防止无效脏数据上传出网'
      }
    ],
    auditChecklist: [
      '第一步：检查当前正在运行的 AI 项目代码，核实调用重试逻辑是否设置了上限（<= 3 次）。',
      '第二步：核对所用节点的解封状态，在浏览器中测试能否正常秒开 chatgpt.com。',
      '第三步：对于自动化跑批任务，先行小规模运行 10 次，测量单次平均物理流量消耗。',
      '第四步：根据总任务次数测算总需求，确认套餐剩余额度 >= 测算值的 1.5 倍。',
      '第五步：任务启动后，在控制台监控前 10 分钟的成功率与错误率指标。',
      '第六步：若出现异常连续重试，立即手动杀死进程并排查根因。'
    ],
    faqs: [
      {
        question: '为什么使用香港节点打不开 ChatGPT，但用美国或日本节点就能正常打开？',
        answer: '这是 OpenAI 官方的地域合规限制政策所决定的。OpenAI 官方目前对来自中国香港机房的 IP 实施了严格的区域访问屏蔽（访问时通常提示 403 错误或“Not available in your country”）。因此，使用 AI 业务时，必须在代理软件中配置分流规则，将 OpenAI 和 Claude 的相关域名定向引流至美国、日本、新加坡或英国等受支持地区的节点。'
      },
      {
        question: '在终端里用 curl 或 Python 调用 API，怎么才能走代理加速？',
        answer: '很多开发者在终端运行代码时发现连不上海外 API，这是因为系统终端默认不会自动继承代理软件的接管。你需要在终端执行环境或代码前注入环境变量：`export https_proxy=http://127.0.0.1:7890`（将 7890 替换为你的代理客户端本地混合端口）；或者在代理软件中开启【增强模式 / TUN 虚拟网卡模式】，即可实现系统所有进程的全局静默透明接管。'
      }
    ],
    targetPath: '/recommend/',
    campaign: 'ai_accounting_sub',
    ctaTitle: '想要原生解锁、极低延迟且绝不被封号的顶级 AI 加速方案？',
    ctaText: '前往主站查看 AI 原生解锁精选榜'
  },

  'mobile/counters': {
    catSlug: 'mobile',
    subSlug: 'counters',
    title: '手机统计与网络范围',
    tagline: '攻克 iOS 与 Android 原生系统流量统计差异，理顺 Wi-Fi、蜂窝与热点层级嵌套',
    firstPrinciples: [
      {
        title: '移动端原生计数器口径差异律',
        content: 'iOS 与 Android 在系统层级的网络计量设计上存在根本性分歧：**Apple iOS** 的【蜂窝网络】统计仅记录 SIM 卡移动蜂窝数据，对 Wi-Fi 流量完全不记录，且绝对不会随自然月自动归零，必须用户手动点击“还原统计数据”；而 **Android 系统** 则提供了按月重置日自动清零，并支持独立查看 Wi-Fi 与蜂窝双网消耗。'
      },
      {
        title: '个人热点 Layer 3 网络地址转换 (NAT) 嵌套',
        content: '当手机开启个人热点供电脑使用时，手机底层执行标准的 SNAT（源地址转换）。从运营商蜂窝基站和服务端计费网关的视角来看，所有流量均仅显示为“来自手机这一个单点 IP 的出站数据”。而在用户本地，电脑客户端与手机系统同时记录了这笔 1GB 数据。建立账本时，必须确立以对公网出站的终端为唯一记账基准，彻底剔除中继端重复统计。'
      },
      {
        title: '蜂窝与 Wi-Fi 动态切网引发的会话重置损耗',
        content: '在移动出行中（如走出家门 Wi-Fi 断开瞬间切入 5G 蜂窝），TCP 长连接会被运营商强制中断并重建。在弱网切换瞬间，可能发生局部数据包丢弃，导致客户端发起无缝 TCP 重传与 TLS 握手重建，产生数 MB 级微小的协议切换损耗。'
      }
    ],
    topologyTitle: '移动热点 NAT 中继与双重计数拓扑',
    topologyAscii: `+--------------------------------------------------------------------------+
| 手机充当移动热点 (Hotspot) 时的网络流转与双重计数陷阱                    |
+--------------------------------------------------------------------------+
| 电脑端 (MacBook): 发起 1.00 GB 视频拉取请求                              |
|   └── 本地 Clash TUN 虚拟网卡记录: "Proxy Egress: 1.00 GB" (真实业务发生端)|
|                          │ (通过 Wi-Fi 局域网传输至手机)                  |
|                          ▼                                               |
| 手机端 (iPhone Gateway):                                                 |
|   ├── 网桥接口 bridge100 接收电脑报文，执行 SNAT 地址转换                |
|   ├── 蜂窝接口 pdp_ip0 出站发送给 5G 基站                                |
|   └── iOS 系统设置统计显示: 【个人热点 - MacBook】: +1.00 GB             |
|                          │ (公网跨境加密传输)                            |
|                          ▼                                               |
| 机场服务端计费网关 RADIUS:                                               |
|   └── 捕获来自 iPhone 蜂窝 IP 的数据流: 准确扣除 1.00 GB (1.0x 节点)      |
|                                                                          |
| [终极记账防重铁律]:                                                      |
|   - 真实出海消耗总量: 仅有 1.00 GB！                                     |
|   - 严重错误做法: 把电脑记的 1GB + 手机记的 1GB 相加 = 算出 2GB (虚增 100%!)|
|   - 正确做法: 仅记录发出业务请求的电脑端，手机端在此场景仅视为物理透明中继!|
+--------------------------------------------------------------------------+`,
    topologyExplanation: '通过上述拓扑解构，用户可以彻底消除“手机开热点导致流量翻倍”的心理误解。数据只在公网上跑了一次，只要不犯把两端直接相加的初级统计错误，账目就会分毫不差。',
    clusterDetails: {
      android: {
        scenarioPainPoint: '安卓系统里不同品牌（小米、华为、三星）的流量管理界面完全不同，不知道该看哪个数值。',
        engineeringSolution: '统一忽略厂商自定义的浮夸报表，直接在代理客户端（如 Clash Meta for Android）内部查看精确字节。',
        takeaway: '穿透定制系统迷雾，以代理核心内部读数作为可信标尺。'
      },
      ios: {
        scenarioPainPoint: 'iPhone 用户从来不知道系统统计从来不自动归零，以为上面显示的几百 GB 是这一个月用的。',
        engineeringSolution: '明确 iOS 的累积不归零机制，在每月账单日手动点击【还原统计数据】，或直接看代理软件内部明细。',
        takeaway: '破解 iOS 不归零陷阱，建立手动月度归零纪律。'
      },
      switching: {
        scenarioPainPoint: '手机进出电梯时网络反复在 Wi-Fi 和蜂窝之间跳跃，导致代理软件断流卡死甚至重复扣量。',
        engineeringSolution: '在手机客户端中开启【自动重连】与合理的连接超时检测，优化双网切换容差。',
        takeaway: '优化切网容忍机制，保障弱网切换丝滑平稳。'
      },
      hotspot: {
        scenarioPainPoint: '给笔记本开热点办公，回家一看手机卡流量和机场额度双双告急，不知道具体被哪个进程吃掉了。',
        engineeringSolution: '电脑连接热点后立即勾选【设为按流量计费的连接】（Metered Connection），阻断系统后台更新。',
        takeaway: '开启按流量计费开关，封杀笔记本后台吃流量恶习。'
      }
    },
    comparisonTable: [
      {
        dimension: 'Apple iOS 流量统计',
        commonMistake: '误以为系统显示的数字就是当月消耗',
        technicalMechanism: '从手机出厂激活或上次手动点击还原之日起无限期累加',
        impactMagnitude: '显示的数字往往是半年甚至一整年的历史总和',
        recommendedStrategy: '在每月账单日滑动到页面最底部点击【还原统计数据】'
      },
      {
        dimension: '热点下的电脑后台更新',
        commonMistake: '开热点时电脑随便挂机，未做任何网络保护',
        technicalMechanism: 'Windows Update 或 macOS 会把热点当做普通 Wi-Fi，静默全速拉取大更新',
        impactMagnitude: '半小时内后台下载 4GB~6GB 系统补丁，瞬间打爆手机蜂窝与节点配额',
        recommendedStrategy: '在电脑 Wi-Fi 设置中务必开启【按流量计费】或开启【低数据模式】'
      },
      {
        dimension: '手机 Wi-Fi 助理 (Wi-Fi Assist)',
        commonMistake: '以为连着家里的 Wi-Fi 就绝对不会消耗手机蜂窝流量',
        technicalMechanism: '当 Wi-Fi 信号微弱时，iOS 系统会自动悄悄调用蜂窝网络补充带宽',
        impactMagnitude: '在不知不觉中消耗巨额移动蜂窝流量',
        recommendedStrategy: '在【设置 - 蜂窝网络】最底部，手动关闭【无线局域网助理】'
      }
    ],
    auditChecklist: [
      '第一步：检查手机【设置 - 蜂窝网络】中最底部的【上次还原时间】。',
      '第二步：如果时间久远，立即点击【还原统计数据】，作为下月对比的新起点。',
      '第三步：滑动至最底部，确认【无线局域网助理】已手动关闭。',
      '第四步：针对需要连热点的电脑，在系统网络设置中开启【按流量计费的连接】。',
      '第五步：在移动代理客户端中查看分应用的用量排行，锁定异常跑量 App。',
      '第六步：月末对照手机系统蜂窝总数与机场后台扣量，检验是否在合理吻合区间。'
    ],
    faqs: [
      {
        question: '为什么我手机连着家里的 Wi-Fi，手机上的机场代理软件依然在跑流量？',
        answer: '这是完全正常的！代理软件记录的是“经过它出海加密的数据量”，它不在乎底层是走的手机 5G 还是家里的 Wi-Fi 宽带。你在家里用手机看 YouTube，流量走的是宽带网络，不消耗你的手机卡话费流量，但由于它访问的是海外目标，依然需要由机场节点进行境外中继，因此机场后台的账户额度依然会被正常扣减。'
      },
      {
        question: '苹果手机上的 Loon / Shadowrocket 显示的流量准确吗？',
        answer: '非常准确！这类专业代理工具在 iOS 系统中注册了标准的 Network Extension（网络扩展 TUN 网卡），所有出海应用的 TCP/UDP 数据流都必须无一例外地穿过这个沙箱。它们直接从内核捕获物理出站字节，其精确度甚至高于系统自带的模糊估算。'
      }
    ],
    targetPath: '/recommend/',
    campaign: 'mobile_counters_sub',
    ctaTitle: '手机端移动出海需要极速秒连与省电轻量配置？查看主站精选推荐',
    ctaText: '前往主站查看移动端极速省电套餐'
  },

  'mobile/management': {
    catSlug: 'mobile',
    subSlug: 'management',
    title: '手机用量管理与复盘',
    tagline: '治理后台应用静默刷新、照片流跨端同步与短视频预加载，构建移动端节流闭环',
    firstPrinciples: [
      {
        title: '移动端后台静默唤醒与能耗守恒',
        content: '移动操作系统（iOS Background App Refresh / Android WorkManager）允许应用在息屏休眠状态下定期唤醒拉取最新内容。若未配置严格的分流策略，社交软件、新闻流与网盘会在后台频繁建立海外连接同步未压缩原图或视频切片，在夜间产生持续的“幽灵式流量偷跑”。'
      },
      {
        title: '照片流与媒体库自动备份的阻断法则',
        content: 'Google Photos、iCloud 云盘及各种海外相册服务默认在检测到网络连通时自动将相册中的 4K 视频与无损 RAW 格式照片同步出海。一个刚拍完家庭聚会视频的用户，可能在回到家的一瞬间被后台同步吃掉数十 GB 额度。必须强制设置此类高吞吐备份“仅在手动确认时触发”。'
      },
      {
        title: '换机迁移与订阅配置的受控恢复',
        content: '在使用系统迁移工具（如 iPhone 一键换机或安卓换机助手）时，旧手机上的代理客户端配置、本地账本缓存与失效的节点配置会被原样克隆到新机。若旧机未妥善解绑，两台设备同时使用同一个节点订阅可能触发服务商的【设备数超限 / 异地并发风暴】。'
      }
    ],
    topologyTitle: '移动端后台应用治理与节流拓扑',
    topologyAscii: `+--------------------------------------------------------------------------+
| 手机移动端流量节流与后台静默阻断拓扑 (Mobile Traffic Control)            |
+--------------------------------------------------------------------------+
| 手机硬件处于息屏待机状态 (Screen Locked / Overnight)                     |
|                         │                                                |
|                         ▼                                                |
| [潜在后台静默跑量源 Background Triggers]                                 |
|   ├── 风险源 A: 相册自动同步 (iCloud / Google Photos 4K 原图备份)        |
|   ├── 风险源 B: App Store / Google Play 应用夜间静默自动更新             |
|   └── 风险源 C: 社交软件后台静默刷新 (推特/Instagram 自动预加载视频)     |
|                         │                                                |
|                         ▼                                                |
| [移动端三道防线部署 (Tri-Layer Defense)]                                 |
|   ├── 防线 1: 系统层治理 -> 关闭【后台 App 刷新】，应用更新改纯手动      |
|   ├── 防线 2: 相册策略 -> 关闭【使用蜂窝数据备份】，仅保留手动上传       |
|   └── 防线 3: 代理分流层 -> 在分流规则中将 Apple/Google 备份强制锁定 DIRECT|
|                         │                                                |
|                         ▼                                                |
| [成果: 彻底杜绝夜间静默偷跑，息屏 8 小时出海流量严格控制在 < 500 KB 级别!]|
+--------------------------------------------------------------------------+`,
    topologyExplanation: '通过系统设置与代理分流规则的双重卡口，移动用户可以彻底消除早晨醒来“流量突然少了好几 GB”的惊悚体验。',
    clusterDetails: {
      background: {
        scenarioPainPoint: '晚上睡觉前手机好好的，早上醒来一看出海流量少了 5GB，怀疑服务商半夜暗扣。',
        engineeringSolution: '进入手机设置排查后台刷新与云备份，在代理软件日志中按连接时间排查凌晨会话。',
        takeaway: '揪出半夜静默偷跑真凶，让待机出海流量归零。'
      },
      takeover: {
        scenarioPainPoint: '开了全局代理，导致微信、淘宝、抖音等全部国内应用都走海外节点绕一圈，又慢又费流量。',
        engineeringSolution: '坚决关闭全局代理（Global），严格选用基于 GEOIP 与规则列表的【规则分流（Rule）】模式。',
        takeaway: '严禁滥用全局模式，确保国内业务直连不绕路。'
      },
      reminders: {
        scenarioPainPoint: '在户外用手机看视频太入迷，完全不知道已经把全月额度跑光了，直到收到短信才追悔莫及。',
        engineeringSolution: '在手机操作系统中设置【单日/单月蜂窝流量上限告警】，达到 80% 时强行弹窗提醒。',
        takeaway: '构筑硬件级用量告警红线，规避沉浸式娱乐超额。'
      },
      migration: {
        scenarioPainPoint: '换了新手机后直接导入旧备份，结果旧手机和新手机同时在线，被机场系统判定多地共享直接封号。',
        engineeringSolution: '换机后首先在旧设备上完全注销代理配置，再在新设备上以单点登录重新激活。',
        takeaway: '规范换机解绑流程，远离并发超限连带封停。'
      }
    },
    comparisonTable: [
      {
        dimension: '全局模式 (Global) vs 规则模式 (Rule)',
        commonMistake: '为图“万无一失”全天常开全局模式',
        technicalMechanism: '全局模式强制将所有国内 App、微信视频通话、局域网连接全部加密发送至海外机房',
        impactMagnitude: '日常流量消耗翻倍暴涨 300%~500%，且国内应用变卡',
        recommendedStrategy: '日常使用 100% 保持在【规则分流（Rule）】模式下运行'
      },
      {
        dimension: '短视频自动播放 (Autoplay)',
        commonMistake: '在社交软件中允许蜂窝网络下视频自动全画质起播',
        technicalMechanism: '手指滑动时，屏幕外的下一个甚至下两个视频已经在后台预载',
        impactMagnitude: '即使只是快速刷过信息流，也会在后台拉取几十 MB 视频数据',
        recommendedStrategy: '在 Twitter/X、Reddit 等应用设置中，将视频自动播放设为【仅限 Wi-Fi】'
      },
      {
        dimension: '应用商店自动下载更新',
        commonMistake: '开启了【自动下载 App 更新与 iOS 系统升级】',
        technicalMechanism: '一个大型游戏更新可达 3GB~5GB，会在检测到网络良好时后台静默拉取',
        impactMagnitude: '在毫无预警的情况下直接瞬间消耗掉小半个套餐',
        recommendedStrategy: '关闭自动下载，所有大型更新安排在连接家庭 Wi-Fi 时手动执行'
      }
    ],
    auditChecklist: [
      '第一步：打开 iOS【设置 - 通用 - 后台 App 刷新】，关闭非必要社交与资讯软件的开关。',
      '第二步：检查相册备份设置，确认未开启出海代理线路上的自动原图上传。',
      '第三步：打开代理客户端，确认分流模式处于【Rule / 规则判定】，而非【Global】。',
      '第四步：在社交应用（Twitter/Reddit）设置中，将视频自动播放修改为【仅 Wi-Fi】。',
      '第五步：换机前，确认旧设备已完全退出并删除订阅配置。',
      '第六步：每周在账本中记录一次移动端的消耗进度，保持对余量的掌控。'
    ],
    faqs: [
      {
        question: '为什么我的手机开启代理后耗电速度明显变快了？',
        answer: '这是由于代理软件作为独立的后台常驻进程，必须在 CPU 中对每一个网络数据包执行实时的 AES/ChaCha20 对称加解密运算。如果你的代理规则配置不当导致大量国内高频应用也被接管，CPU 会被迫持续处于高主频运行。只要将模式切回严格的【规则分流】，让大部分国内流量走 DIRECT 直连，手机发热和耗电就会大幅改善。'
      },
      {
        question: '安卓手机后台总会被系统杀掉代理进程，导致经常断流怎么办？',
        answer: '在安卓系统中，必须对代理客户端（如 Clash Meta 或 v2rayNG）给予三项核心权限：1. 在电池管理中将该应用设为【无限制 / 不受电池优化控制】；2. 在多任务切换界面对该应用卡片点击【加锁】防误杀；3. 允许该应用开启【自启动】与【关联启动】权限。'
      }
    ],
    targetPath: '/recommend/',
    campaign: 'mobile_mgmt_sub',
    ctaTitle: '移动端需要极度省电、低后台损耗的轻量稳定线路？查看主站推荐',
    ctaText: '前往主站查看低功耗移动专线榜'
  }
};
