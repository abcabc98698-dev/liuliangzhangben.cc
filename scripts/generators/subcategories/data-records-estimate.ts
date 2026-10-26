import { SubcategoryData } from './types';

export const SUBCATEGORY_DATA_RECORDS_ESTIMATE: Record<string, SubcategoryData> = {
  'records/baseline': {
    catSlug: 'records',
    subSlug: 'baseline',
    title: '记录来源与基线',
    tagline: '系统性确立流量记账的物理真理源，解决多源计数冲突与观察层级混淆',
    firstPrinciples: [
      {
        title: '观察层级的物理不可替代性',
        content: '数据在网络中经过应用层 Socket、操作系统 TUN 虚拟网卡、物理无线/以太网网卡与服务商 RADIUS 网关。由于 TCP 握手报头、TLS 1.3 密文封装与代理协议私有报头（如 Shadowsocks AEAD、VLESS）的存在，各层数据天然呈现逐层递增的物理特征（膨胀率约 3%~8%）。脱离观察层级谈论流量大小毫无科学依据。'
      },
      {
        title: '单一权威真理源 (SSOT) 锁定准则',
        content: '在建立账本时，必须明确区分“业务意图用量”（应用层）、“代理出网用量”（TUN/代理内核）与“商业计费扣量”（服务端网关）。记账与核算必须以客户端代理内核 TUN 的出站流量作为对账基准，严禁将不同层级的计数器直接相加或混用。'
      },
      {
        title: '时间戳半开区间严格闭环',
        content: '任何统计采样都必须绑定 ISO 8601 毫秒级时间戳与显式时区偏移。服务周期边界必须统一按 [T_start, T_end) 半开区间归集，避免因跨时区或月末交界处的相位差产生虚假的数据突变。'
      }
    ],
    topologyTitle: '记录来源分层与网络观察拓扑',
    topologyAscii: `+--------------------------------------------------------------------------+
| 记录来源物理分层与数据流转拓扑 (Observation Hierarchy)                   |
+--------------------------------------------------------------------------+
| [Layer 1: 应用程序 Application Socket]                                    |
|   - 观察对象: 浏览器、下载器、AI 客户端 (HTTP GET/POST, WebSocket)       |
|   - 计量特性: 纯业务有效载荷 (Net Content Payload)，无加密与传输开销     |
|                                     │                                    |
|                                     ▼                                    |
| [Layer 2: 客户端代理内核 TUN 虚拟网卡 (Clash / Surge / Sing-box)]          |
|   - 观察对象: TUN 网卡出站与分流引擎 (DIRECT vs PROXY)                   |
|   - 计量特性: 权威对账基准！包含协议分流、DNS 解析与代理私有报头         |
|                                     │                                    |
|                                     ▼                                    |
| [Layer 3: 操作系统物理网卡 Physical Interface (Wi-Fi en0 / 蜂窝 pdp_ip0)]  |
|   - 观察对象: 硬件网卡物理收发总字节 (以太网帧 + IP/TCP 报头)            |
|   - 计量特性: 包含局域网投屏、内网 NAS、系统更新等全部流量，极易被误算   |
|                                     │ (公网加密跨境传输)                 |
|                                     ▼                                    |
| [Layer 4: 服务端接入网关 RADIUS Interim-Update Daemon]                   |
|   - 观察对象: 出口中继捕获物理字节乘以节点倍率 M                         |
|   - 计量特性: 商业结算唯一扣量依据，受定时批量落库延迟与双向计费影响     |
+--------------------------------------------------------------------------+`,
    topologyExplanation: '理解上述四层拓扑后，便能清晰识别“为什么系统流量总比代理流量多”以及“为什么本地记录与后台扣量存在微小开销差异”。正确的操作是仅采集 Layer 2 的 PROXY 出站数据作为记账基线。',
    clusterDetails: {
      sources: {
        scenarioPainPoint: '多设备与多软件同时开启时，不知道该信任哪个计数器，直接把系统网卡和客户端流量累加导致账单虚增 2 倍。',
        engineeringSolution: '确立客户端代理 TUN 虚拟网卡为唯一采集点，剔除 DIRECT 国内流量与局域网广播。',
        takeaway: '建立端到端唯一的流量采集真理源，彻底杜绝数据源重复污染。'
      },
      fields: {
        scenarioPainPoint: '账本中缺乏方向、单位进制与时区字段，导致后续对账时无法还原 1GB 究竟是十进制还是二进制。',
        engineeringSolution: '规范最小记账数据集：记录时间 (ISO 8601)、物理上传/下载字节数、节点名称、标称倍率与数据源标签。',
        takeaway: '规范数据格式，确保账本具备跨周期追溯与机器可读性。'
      },
      sampling: {
        scenarioPainPoint: '偶尔记一次账导致周期中间出现巨大断层；或者频繁重启客户端导致累计计数器回滚。',
        engineeringSolution: '建立增量记录习惯，在客户端重启时以新会话起点打锚点，采用固定周期采样补足离散缺口。',
        takeaway: '通过严密采样机制消除客户端重启归零造成的负数陷阱。'
      },
      'evidence-labels': {
        scenarioPainPoint: '实测值、预估值与异常值混杂在同一张表内，找客服核对时缺乏清晰证据标签被驳回。',
        engineeringSolution: '为每条记录打上实测 (measured)、估算 (modeled)、待确认 (unverified) 标签，并脱敏敏感订阅链接。',
        takeaway: '形成合规审计证据包，使每次对账都有据可查。'
      }
    },
    comparisonTable: [
      {
        dimension: '统计来源选择',
        commonMistake: '直接抄录操作系统【设置】中的网络总用量',
        technicalMechanism: '系统统计包含局域网 AirDrop、NAS 传输与国内直连流量',
        impactMagnitude: '虚报 50% ~ 300% 流量',
        recommendedStrategy: '仅提取代理软件 TUN 虚拟网卡中的 PROXY 分组数据'
      },
      {
        dimension: '单位进制混淆',
        commonMistake: '将 1GB 随意当做 1024MB 或 1000MB 混算',
        technicalMechanism: '服务商计费多采用十进制 SI (1GB=10^9B)，客户端采用二进制 (1GiB=2^30B)',
        impactMagnitude: '固定存在 7.37% 系统性换算误差',
        recommendedStrategy: '账本底层一律以整数字节 (Bytes) 存储，展示时明确标注 GB/GiB'
      },
      {
        dimension: '客户端软件重启',
        commonMistake: '软件重启后累计数归零，账本简单相减得出负数',
        technicalMechanism: '操作系统网卡或代理进程重启会重置内核计数器',
        impactMagnitude: '破坏全局趋势统计与累加准确性',
        recommendedStrategy: '监测到当前读数小于上次读数时，开启新统计分段并打上基线锚点'
      },
      {
        dimension: '时区结算断层',
        commonMistake: '本地按北京时间 (UTC+8) 核算，服务商按 UTC 结算',
        technicalMechanism: '月末交界处存在 8 小时相位差，月末用量被计入下月',
        impactMagnitude: '跨月统计产生 10% ~ 30% 假性差额',
        recommendedStrategy: '账本中显式记录服务商结算时区，统一采用半开区间切片'
      },
      {
        dimension: '协议加密开销',
        commonMistake: '下载 1GB 文件后要求后台扣量分毫不差等于 1GB',
        technicalMechanism: 'TLS 1.3 握手、TCP ACK 确认包与代理协议标头带来物理损耗',
        impactMagnitude: '正常物理膨胀 2% ~ 5%',
        recommendedStrategy: '在模型中将协议外包头计入正常链路损耗，不列为异常多扣'
      }
    ],
    auditChecklist: [
      '第一步：确认当前主用记账设备上的代理内核是否开启 TUN 模式或独立虚拟网卡。',
      '第二步：核对代理软件的分流规则，确保国内常用域名与私网网段走 DIRECT，不被计入代理统计。',
      '第三步：在账本初始行记录当月起步基线（记录初始日期、服务后台剩余额度与本地计数器底数）。',
      '第四步：规范每次记账的字段结构，包含时间、上行、下行、节点名称与标称倍率。',
      '第五步：遇客户端崩溃或设备重启，立即标记“分段断点”，重新建立当前基线。',
      '第六步：每周对照一次服务商后台概览数据，校验增量是否在合理误差区间内。',
      '第七步：导出账本备份前，检查是否已剥离订阅密钥与个人隐私凭据。'
    ],
    faqs: [
      {
        question: '为什么网页版流量账本无法自动读取我整台电脑的应用流量？',
        answer: '出于现代浏览器的严格安全沙箱机制，普通网页绝无权限越权读取宿主操作系统的底层网卡或扫描其他软件的进程网络。任何声称能自动读取全机流量的网页均为虚假宣传或恶意钓鱼。本站坚持客户端纯本地运算，数据由用户主动导入或记录，确保绝对隐私安全。'
      },
      {
        question: 'Clash 核心与 Surge 显示的用量为什么会有一点点微小出入？',
        answer: '不同代理核心对 DNS 解析请求、ICMP Ping 测速包以及 TCP 重传报文的统计口径存在微小差异。此外，部分核心仅统计 TCP 净载荷，部分核心则统计 IP 报文全长。这种在 1%~3% 内的微小差距属于网络工程正常容差，无需过虑。'
      },
      {
        question: '为什么我在家使用软路由透明代理，手机上的客户端不显示用量？',
        answer: '当软路由承担网关透明代理时，流量在离开手机后直接在软路由的内核中被接管和加密，手机本机无需运行代理软件，因此手机本地客户端不会产生任何代理流量记录。此时必须以软路由系统统计或服务后台作为真理源。'
      }
    ],
    targetPath: '/recommend/',
    campaign: 'records_baseline_sub',
    ctaTitle: '想要完全摆脱记账困扰？查看高透明度、明明白白计费的标杆服务',
    ctaText: '前往主站查看高透明度节点榜单'
  },

  'records/management': {
    catSlug: 'records',
    subSlug: 'management',
    title: '账本管理与复盘',
    tagline: '掌握本地数据持久化、去重导入、长效多维趋势复盘与协作更正技巧',
    firstPrinciples: [
      {
        title: '无服务器隐私保护与本地持久化机制',
        content: '数据主权属于用户。专业的账本系统绝不把用户的网络使用痕迹上传至任何中心化云端数据库。通过 LocalStorage、IndexedDB 与受控文件导出实现本地持久化，兼顾安全与跨设备流转。'
      },
      {
        title: '幂等导入与唯一指纹防重逻辑',
        content: '在批量导入 CSV 或抓包日志时，必须基于 [Timestamp + Node + Bytes + Direction] 计算唯一 SHA-256 哈希指纹。重复导入相同文件时自动跳过已存在记录，避免账本数据被无意翻倍。'
      },
      {
        title: '审计轨迹与不可逆更正日志 (Audit Trail)',
        content: '财务记账的核心铁律是“不允许直接覆写或物理抹除历史数据”。当发现抄录错误时，必须通过追加更正记录（Adjustment Entry）并注明更正原因，保留完整的历史核查链条。'
      }
    ],
    topologyTitle: '账本管理生命周期与审计流转图',
    topologyAscii: `+--------------------------------------------------------------------------+
| 账本数据流转与持久化生命周期 (Data Management Architecture)              |
+--------------------------------------------------------------------------+
| [原始输入源 Source]                                                      |
|   ├── 手工录入 (Daily Manual Entry)                                      |
|   ├── 代理客户端日志导出 (CSV/JSON Exporter)                             |
|   └── 截屏/脱敏账单抄录 (Redacted OCR/Note)                              |
|                          │                                               |
|                          ▼                                               |
| [数据接入网关 Ingestion Gateway]                                         |
|   ├── 字段标准化 (Units normalized to Bytes, Timezone aligned)           |
|   ├── 幂等去重检测 (Fingerprint Dedup via Hash Map)                      |
|   └── 格式安全校验 (Anti-CSV Injection: sanitize '=', '+', '-')          |
|                          │                                               |
|                          ▼                                               |
| [本地安全存储引擎 Local Storage Engine (Pure Client-Side)]               |
|   ├── 内存运行时状态 (Pinia / Vue Reactive State)                       |
|   ├── 本地加密持久化 (Browser LocalStorage / IndexedDB)                  |
|   └── 增量更正日志表 (Audit Trail & Change Logs)                         |
|                          │                                               |
|                          ▼                                               |
| [复盘分析与导出层 Analytics & Export]                                     |
|   ├── 日/周/月度加权聚合视图 (Time-Window Aggregate)                     |
|   ├── 节点倍率消耗占比饼图 (Multiplier Consumption Ratio)                |
|   └── 安全脱敏导回报表 (Sanitized JSON/CSV Export)                        |
+--------------------------------------------------------------------------+`,
    topologyExplanation: '严格遵循无云端依赖的纯本地运行范式。用户可随时将账本导出为标准文件，在更换电脑或清空浏览器时实现秒级无损迁移。',
    clusterDetails: {
      'local-storage': {
        scenarioPainPoint: '浏览器清理缓存或重启后，记了几周的流量账本彻底丢失，只能从零开始。',
        engineeringSolution: '养成定期一键导出 JSON 备份的习惯，或在独立干净的专用浏览器配置中运行账本。',
        takeaway: '本地存储结合周期性快照，实现零云端依赖的永续数据保存。'
      },
      'file-import': {
        scenarioPainPoint: '从客户端导出的 CSV 列名混乱，导入后数值错位，甚至多次导入导致数字重复累加。',
        engineeringSolution: '建立标准字段映射向导，利用唯一时间戳与哈希指纹实现幂等过滤，自动剔除重复行。',
        takeaway: '规范导入清洗管道，让任何外部数据源都能安全无缝汇入账本。'
      },
      summaries: {
        scenarioPainPoint: '只有离散的流水明细，看不出周期内用量是在哪几天被集中消耗的，无法提前预警额度枯竭。',
        engineeringSolution: '按自然日与计费月自动聚合成趋势直方图，标识出高峰日与异常脉冲消耗。',
        takeaway: '宏观趋势与微观流水结合，精准捕捉异常流量洪峰。'
      },
      'audit-trail': {
        scenarioPainPoint: '发现前期抄错了一行数字，直接改掉后导致与以前导出的旧报告对不上，无法追溯差异根源。',
        engineeringSolution: '执行红字冲销机制（更正行记录正负差额），并在备注中清晰标注原因为“手误校正”。',
        takeaway: '遵循财务级审计规范，确保账本历史记录始终具备可解释性。'
      }
    },
    comparisonTable: [
      {
        dimension: '数据保存模式',
        commonMistake: '误以为网页数据会自动同步到个人云端账号',
        technicalMechanism: '本站绝无后端数据库，数据仅驻留于当前浏览器的本地存储沙箱中',
        impactMagnitude: '清空浏览器历史记录可能导致数据丢失',
        recommendedStrategy: '点击【导出备份】下载 .json 格式快照，存放在个人安全目录'
      },
      {
        dimension: '重复文件导入',
        commonMistake: '担心多次导入同一个月的对账单会使流量计算翻倍',
        technicalMechanism: '现代账本系统基于时间戳与字节指纹计算哈希，同指纹自动去重',
        impactMagnitude: '无智能去重时导致统计值虚增 100%',
        recommendedStrategy: '启用【幂等导入】开关，导入前自动比对已存在记录'
      },
      {
        dimension: '异常数据更正',
        commonMistake: '在历史行中直接修改原始数值',
        technicalMechanism: '直接篡改历史破坏了前后基线的连贯性，导致周期结算校验失败',
        impactMagnitude: '使得前期的月度报表与当前报表发生不可追溯的断裂',
        recommendedStrategy: '新增一条带【更正标签】的差额记录，注明原由与关联的原始单号'
      },
      {
        dimension: '安全防注入',
        commonMistake: '在导出 CSV 时未对单元格中的特殊字符进行转义',
        technicalMechanism: '以 =、+、-、@ 开头的文本可能被 Excel 解析为 DDE 宏公式执行',
        impactMagnitude: '对账文件在他人电脑打开时可能触发安全警告或恶意代码',
        recommendedStrategy: '导出时在所有公式触发字符前自动添加单引号强制降级为纯文本'
      }
    ],
    auditChecklist: [
      '第一步：每周五或每个计费周期的最后一天，打开账本管理面板进行周度复盘。',
      '第二步：核对本周期内是否存在未标注来源的“孤立记录”。',
      '第三步：比对汇总视图中的总消耗与服务商用户中心显示的扣量，记录绝对差额。',
      '第四步：针对大于 5% 的差额，排查是否存在未记录的倍率节点或流媒体超前缓存。',
      '第五步：点击【导出本地备份】，将带有时间戳的账本备份归档至个人网盘。',
      '第六步：若在公共电脑上操作，测试完毕后点击【彻底清空本地缓存】，保护使用习惯隐私。'
    ],
    faqs: [
      {
        question: '为什么流量账本导出的 CSV 在 Excel 中打开会出现中文乱码？',
        answer: '这是由于 Excel 在 Windows 环境下默认使用 ANSI/GBK 编码打开文件所致。本站导出的标准 CSV 均附带 UTF-8 BOM 头，全面兼容现代 Excel、WPS 以及 Numbers。如果仍遇乱码，可在 Excel【数据】选项卡中选择【从文本/CSV】导入并选择 UTF-8 编码。'
      },
      {
        question: '我换了新电脑，怎样把旧电脑上的流量账本完整搬移过来？',
        answer: '在旧电脑的账本管理页面点击【导出全量 JSON 备份】，将生成的 .json 文件传输至新电脑，在新电脑上打开流量账本点击【导入备份】，即可 100% 原样恢复所有历史明细与配置。'
      }
    ],
    targetPath: '/pricing/',
    campaign: 'records_management_sub',
    ctaTitle: '账本复盘发现当前套餐总是不够用或严重浪费？',
    ctaText: '前往主站比对容量适中、性价比极高的新方案'
  },

  'estimate/models': {
    catSlug: 'estimate',
    subSlug: 'models',
    title: '单任务模型与基线',
    tagline: '拆解离散单项网络任务的物理字节模型，从根本上终结盲目估算',
    firstPrinciples: [
      {
        title: '任务物理容量与传输时长守恒公式',
        content: '任何单项网络任务的理论最小物理传输量由其业务净载荷决定：$$V_{\\text{task}} = \\text{Bitrate} \\times T_{\\text{duration}} \\quad \\text{或} \\quad V_{\\text{task}} = \\sum \\text{File Sizes}$$。实际网络开销为物理载荷乘以协议封装损耗与重传放大系数。'
      },
      {
        title: '样本典型性与长尾极值分离',
        content: '建立任务估算模型时，切忌以“单次最理想测速”作为日常基线。必须将常规稳态任务（如日常网页浏览 300MB/天）与离散大任务（如系统安装包更新 15GB/次）分层建模，避免平均数掩盖极端尖峰。'
      },
      {
        title: '代理分流接管范围与非代理豁免',
        content: '并非所有本机流量都会经过节点加速。分流规则中命中的 DIRECT 流量（如国内视频、国内网盘、局域网备份）必须在估算前被完全剔除，仅对规则判定为 PROXY 的目标域名计算额度消耗。'
      }
    ],
    topologyTitle: '单任务流量模型拆解拓扑',
    topologyAscii: `+--------------------------------------------------------------------------+
| 单任务流量模型构成与流转拓扑 (Task Traffic Anatomy)                      |
+--------------------------------------------------------------------------+
| [任务输入定义 Task Parameters]                                           |
|   ├── 业务类型: 视频流媒体 / AI 交互 / 文件同步 / 网页浏览              |
|   ├── 时长与次数: 持续时间 T (秒/小时) 或 调用频次 N (次)                |
|   └── 业务码率 / 单次体积: Bitrate (Mbps) 或 单文件体积 S (MB)          |
|                          │                                               |
|                          ▼                                               |
| [网络传输损耗修正 Transport Overhead Adjustment]                         |
|   ├── 传输层包头: TCP/IP Header (40~52 字节/包)                         |
|   ├── 安全与代理头: TLS Record (21B) + Shadowsocks/Trojan Header (约36B) |
|   ├── 链路重传损耗: 国际丢包率引发的 Retransmission (+1% ~ +8%)         |
|   └── 预缓冲废弃因子: 流媒体播放退出造成的预加载浪费 (+15% ~ +40%)       |
|                          │                                               |
|                          ▼                                               |
| [节点计费规则折算 Node Accounting Mapping]                               |
|   ├── 节点倍率加权: M (0.5x ~ 3.0x)                                      |
|   ├── 计费方向: 下行单向 (Down-only) vs 上下行双向 (Bi-directional)      |
|   └── 结算步长取整: 最小连接取整 (Block Step, 如不足 100KB 按 100KB)     |
|                          │                                               |
|                          ▼                                               |
| [最终账单应扣额度 Output Billed Quota]                                   |
|   - Billed Quota = (V_task * (1 + Overhead) * (1 + Waste)) * M           |
+--------------------------------------------------------------------------+`,
    topologyExplanation: '通过严谨的逐层修正模型，用户可以提前算出任意一项任务在特定节点下的真实扣量，不再被“为什么下了 1GB 扣了 1.5GB”所困扰。',
    clusterDetails: {
      'baseline-sample': {
        scenarioPainPoint: '拿深夜空载时的极速下载作为常态基线，估算出的月度需求与实际大相径庭。',
        engineeringSolution: '在早中晚不同时段各采样 3 次稳态任务，取中位数而非峰值作为基线样本。',
        takeaway: '剔除极端偶发样本，建立可信的稳态任务基准线。'
      },
      'task-size': {
        scenarioPainPoint: '只算视频时长不算分辨率，以为看 2 小时 4K 视频和看 2 小时 720P 耗费流量差不多。',
        engineeringSolution: '根据分辨率码率换算表（4K 约 16~25 Mbps，1080P 约 3~5 Mbps）精确推导文件量。',
        takeaway: '以客观码率为锚点，实现按时长到按字节的严谨换算。'
      },
      'unit-rate': {
        scenarioPainPoint: '混淆网络速率 Mbps (兆比特/秒) 与存储容量 MB/s (兆字节/秒)，导致估算结果出现 8 倍巨大偏差。',
        engineeringSolution: '严格执行除以 8 换算准则，并乘以时间常数：$$100\\text{ Mbps} \\times 3600\\text{s} \\div 8 \\div 1024 = 43.95\\text{ GB/小时}$$。',
        takeaway: '理顺 bps 与 Byte 物理进制，彻底杜绝 8 倍算力差错。'
      },
      'traffic-scope': {
        scenarioPainPoint: '把全机流量全盘当做代理加速流量，导致预算远远高出真实所需套餐档位。',
        engineeringSolution: '根据代理软件规则集（GEOIP-CN、DIRECT 列表）剔除内网与国内流量，只为出海部分买单。',
        takeaway: '精准圈定代理接管边界，拒绝为不需要加速的国内流量买单。'
      }
    },
    comparisonTable: [
      {
        dimension: '视频流媒体任务',
        commonMistake: '误以为视频看多少秒就只传多少秒数据',
        technicalMechanism: '流媒体播放器采用超前切片缓冲策略，退出时末尾 30~60 秒缓冲作废',
        impactMagnitude: '短视频频密切换时实际流量膨胀 40% ~ 100%',
        recommendedStrategy: '在单任务估算模型中对碎片化观看增加 30% 缓冲损耗冗余'
      },
      {
        dimension: '大文件同步任务',
        commonMistake: '认为 10GB 的网盘备份文件只需要 10GB 流量',
        technicalMechanism: '国际公网跨境丢包引发 TCP 窗口回退与数据包重传',
        impactMagnitude: '晚高峰弱网环境下重传开销增加 5% ~ 12%',
        recommendedStrategy: '优先选择低丢包的专线（IPLC/IEPL）节点执行大任务传输'
      },
      {
        dimension: 'AI 代码辅助任务',
        commonMistake: '以为提问一个 10 字问题只消耗几十字节',
        technicalMechanism: 'Cursor 等代码工具会静默把整个项目目录与数个关联代码文件打包上传',
        impactMagnitude: '单次提问上行载荷瞬间达到数 MB',
        recommendedStrategy: '将 AI 任务归入“重度上行”模型，在双向计费节点下按 3~5 倍放大估算'
      }
    ],
    auditChecklist: [
      '第一步：列出日常出海任务清单（如：每日看 YouTube 1 小时、查阅文献、GitHub 代码拉取）。',
      '第二步：核对各任务的对应码率或文件体积均值。',
      '第三步：结合本站【流量需求估算器】，输入时长与单次大小，输出理论物理用量。',
      '第四步：根据拟使用的节点倍率（如 1.0x 或 1.5x），折算后台实际扣量。',
      '第五步：针对高频中断或手机移动场景，附加 15% 的重传与预加载容差。',
      '第六步：汇总各项任务，得出单日基准用量，为周期预测提供可靠输入。'
    ],
    faqs: [
      {
        question: '看 YouTube 4K 视频 1 小时大概会消耗多少流量？',
        answer: 'YouTube 4K (2160p 60fps) 的平均码率通常在 16 Mbps ~ 25 Mbps 之间。按中位数 20 Mbps 计算，1 小时物理视频数据量约为：$$20\\text{ Mbps} \\times 3600\\text{ 秒} \\div 8 = 9{,}000\\text{ MB} \\approx 8.79\\text{ GB}$$。若加上预缓冲与 1.0x 节点计费，1 小时 4K 观看建议按 9.5 GB ~ 11 GB 规划。'
      },
      {
        question: '为什么下载 Steam 游戏时，明明显示下了 50GB，代理软件却显示走了 60GB？',
        answer: 'Steam 下载通常采用高度并发的多线程分块传输。在部分不稳定线路上，若个别线程发生校验失败，Steam 客户端会丢弃已下载的损坏分块并重新拉取。此外，如果未配置分流规则导致 Steam CDN 直连走成了代理，就会把本该国内直连的流量全部计入代理消耗。'
      }
    ],
    targetPath: '/pricing/',
    campaign: 'estimate_models_sub',
    ctaTitle: '任务模型已建立？前往主站寻找带宽充足、不卡顿的专线套餐',
    ctaText: '前往主站查看高速大带宽套餐榜'
  },

  'estimate/forecast': {
    catSlug: 'estimate',
    subSlug: 'forecast',
    title: '周期预测与结果验证',
    tagline: '将离散任务组合为月度周期预测，引入极端情景与误差回看修正',
    firstPrinciples: [
      {
        title: '泊松分布与离散任务组合法则',
        content: '日常出海需求由“高频轻度任务”（日常浏览、聊天）与“低频偶发尖峰”（系统重装、大促下载、追剧马拉松）组成。月度总用量模型为基线稳态分量与泊松脉冲分量之和：$$V_{\\text{month}} = 30 \\times V_{\\text{daily}} + \\sum_{i=1}^k V_{\\text{spike}, i}$$。'
      },
      {
        title: '安全余量冗余原则 (Safety Margin)',
        content: '在工程预算中，切忌将“理想计算值”直接当做采购上限。网络环境存在不可控的节点倍率上调、后台静默同步与软件更新重试。权威的周期预测必须保留 $20\\% \\sim 30\\%$ 的安全缓冲区，避免在月末关键时刻断流。'
      },
      {
        title: '后验误差反馈与模型闭环修正 (Feedback Loop)',
        content: '每次计费周期结束时，必须执行后验比对：$$\\text{Error Rate} = \\frac{V_{\\text{actual}} - V_{\\text{forecast}}}{V_{\\text{forecast}}} \\times 100\\%$$。若连续两个周期误差超出 15%，必须重新校准单任务码率参数或排查未授权设备的蹭网消耗。'
      }
    ],
    topologyTitle: '周期预测演进与误差校准闭环',
    topologyAscii: `+--------------------------------------------------------------------------+
| 周期预测与误差自校准闭环系统 (Forecasting Feedback Loop)                 |
+--------------------------------------------------------------------------+
| [第 1 阶段: 任务组合预测 Composition Forecast]                           |
|   ├── 基础日用量: 工作日 baseline (0.8 GB/天) * 22天 = 17.6 GB           |
|   ├── 周末峰值用量: 周末加权 (3.5 GB/天) * 8天 = 28.0 GB                 |
|   └── 偶发项目计划: 月度大任务预留 (如大模型权重拉取) = 20.0 GB          |
|                          │                                               |
|                          ▼                                               |
| [第 2 阶段: 风险与极端情景模拟 Risk & Stress Scenarios]                  |
|   ├── 乐观情景 (外出少、低分辨率): 预测值 * 0.85                         |
|   ├── 基准情景 (常规使用): 预测值 * 1.00 = 65.6 GB                       |
|   └── 悲观情景 (周末通宵追剧 + 专线倍率): 预测值 * 1.35 = 88.5 GB        |
|                          │                                               |
|                          ▼                                               |
| [第 3 阶段: 匹配采购档位 Quota Tier Selection]                           |
|   └── 推荐选择覆盖悲观情景下限的套餐档位 (如 100 GB / 月档)              |
|                          │                                               |
|                          ▼ (周期运行结束，提取实际后台账单)              |
| [第 4 阶段: 误差回看与参数修正 Feedback Calibration]                     |
|   ├── 计算绝对差额与相对误差率: Delta = V_actual - V_forecast            |
|   ├── 归因识别: 是否低估了 AI 上行？是否多用了 2.0x 专线？              |
|   └── 输出更新参数，作为下周期预算输入的最新基线                         |
+--------------------------------------------------------------------------+`,
    topologyExplanation: '通过闭环反馈机制，连续运行 2~3 个周期后，预测误差可收敛至 5% 以内，实现既不花冤枉钱、又绝不断流的完美平衡。',
    clusterDetails: {
      composition: {
        scenarioPainPoint: '简单用单日用量乘以 30 天，完全忽略了周末用量往往是工作日 3~5 倍的事实。',
        engineeringSolution: '区分工作日（以文字、办公为主）与周末（以影视、娱乐为主）建立分段加权模型。',
        takeaway: '消除平摊均值假象，真实反映周内与周末的作息节奏。'
      },
      scenarios: {
        scenarioPainPoint: '按刚刚好的额度买套餐，月末遇到突发大文件下载直接用尽断网，影响关键业务。',
        engineeringSolution: '设计悲观极端情景，将长假出游、突发紧急下载计入冗余缓冲区。',
        takeaway: '预留防熔断弹性安全带，确保关键时刻网络可用。'
      },
      'period-fit': {
        scenarioPainPoint: '预测周期与服务商账单周期错位，用自然月预测去匹配 15 号重置的套餐导致判断失真。',
        engineeringSolution: '将任务分配的时间轴精确对齐服务商实际的【账单重置日】窗口。',
        takeaway: '对齐财务结算窗口，使预测具有真实的账单指导意义。'
      },
      validation: {
        scenarioPainPoint: '每个月买完套餐就扔在一边，从来不对账，下个月继续重复错误的购买档位。',
        engineeringSolution: '月末花 5 分钟执行三项比对：总消耗偏差、闲置率与有效单价，驱动下周期优化。',
        takeaway: '建立复盘闭环，持续修正个人消费模型。'
      }
    },
    comparisonTable: [
      {
        dimension: '预测周期选择',
        commonMistake: '按整年平均值估算月度需求',
        technicalMechanism: '网络需求存在强烈的季节性波动（寒暑假、春节假期、大促期间）',
        impactMagnitude: '淡旺季流量差距可达 200% 以上',
        recommendedStrategy: '按月度动态预测，或在淡季选择按量方案、旺季升级大月付'
      },
      {
        dimension: '极端情景冗余',
        commonMistake: '预算紧贴理论值，不留任何余量',
        technicalMechanism: '服务商网络抖动可能迫使用户切换至高倍率备用节点',
        impactMagnitude: '突发高倍率消耗可能在数小时内吃掉全月 30% 额度',
        recommendedStrategy: '购买套餐时保证标称额度 >= 悲观预测值的 1.2 倍'
      },
      {
        dimension: '闲置率容忍度',
        commonMistake: '追求 100% 用尽额度，把剩余 20GB 视为“巨大亏损”',
        technicalMechanism: '固定套餐的商业本质是“购买可用性带宽保证”，而非纯商品称重',
        impactMagnitude: '为了用光额度盲目下载垃圾文件，反而浪费时间和电力',
        recommendedStrategy: '将 15%~25% 的月末剩余额度视为合理的“防断流保险费”'
      }
    ],
    auditChecklist: [
      '第一步：统计过去 3 个月服务后台的实际月均消耗均值。',
      '第二步：列出下个月已知的新增计划（如追新剧、跨境线上会议、项目联调）。',
      '第三步：将基础日常用量与新增计划叠加，计算基准预测值。',
      '第四步：乘以 1.25 安全系数，得出推荐采购档位。',
      '第五步：如果算出的需求介于两个套餐档位之间（如 120GB，而套餐只有 100GB 和 200GB），评估是否使用按量包补足缺口。',
      '第六步：月末生成对账复盘卡，记录实际与预测的偏差百分比。'
    ],
    faqs: [
      {
        question: '如果我预测自己一个月用 120GB，但服务商只有 100GB 和 200GB 两个档位，该怎么选？',
        answer: '最佳策略是：购买 100GB 的月付套餐作为主力，同时在账户中常备一个不限时的【按量补充包】。月付 100GB 跑完后，系统会自动平滑切换扣除按量包中的余额，既避免了直接购买 200GB 档位每月浪费 80GB 的高额月租，又确保了网络绝不会中断。'
      },
      {
        question: '预测很准，但月末几天流量突然像瀑布一样掉得飞快，可能是什么原因？',
        answer: '这通常是以下三个隐蔽原因造成的：1. 系统后台自动下载了大型版本更新安装包（如 iOS 或 Windows Update）；2. 某些云存储客户端（如 Google Drive 或 OneDrive）开启了高频自动同步；3. 不小心连接了 2.0x 或 3.0x 的高倍率专线节点进行大文件下载。'
      }
    ],
    targetPath: '/recommend/',
    campaign: 'estimate_forecast_sub',
    ctaTitle: '周期需求已算清？前往主站寻找额度池充裕、绝不卡脖子的精选服务',
    ctaText: '前往主站查看大额度套餐排行榜'
  }
};
