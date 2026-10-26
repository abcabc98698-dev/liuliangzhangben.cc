import fs from 'node:fs';
import path from 'node:path';

const GENERATORS_DIR = path.resolve(process.cwd(), 'scripts', 'generators');

interface CategoryMeta {
  file: string;
  category: string;
  domainName: string;
  cotTheme: string;
  cotProblem: string;
  cotH1: string;
  cotH2: string;
  cotH3: string;
  cotMathFormula: string;
  cotConclusion: string;
  checklistItems: string[];
  metricCardItems: [string, string][];
  prevLink: [string, string];
  nextLink: [string, string];
  relatedLink: [string, string];
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: string;
}

const CATEGORIES_ENRICHMENT: CategoryMeta[] = [
  {
    file: 'estimate.ts',
    category: 'estimate',
    domainName: '流量需求估算与任务模型',
    cotTheme: '非典型突发脉冲与多任务复合预算推导',
    cotProblem: '用户根据新机配置当天的出网量（28.4GB）进行简单线性外推，得出月度需要 850GB+ 巨额套餐的错误结论，产生巨大的预算焦虑。',
    cotH1: '冷启动装机与大版本系统更新属于低频单次事件，不属于持续日常消耗流；',
    cotH2: '日常平稳办公流与周末高码率视频流存在显著的双峰分布，简单求平均数会抹杀结构性差异；',
    cotH3: '网络环境存在 3%~5% 的协议封装损耗与 TCP 重传，实际出网量大于应用层净文件体积。',
    cotMathFormula: 'Q_{\\\\text{month}} = \\\\left( \\\\sum_{i=1}^5 q_{\\\\text{work}} + \\\\sum_{j=1}^2 q_{\\\\text{weekend}} \\\\right) \\\\times 4.33 + \\\\sum Q_{\\\\text{outlier}} \\\\times (1 + \\\\alpha_{\\\\text{proto}})',
    cotConclusion: '经过稳态与脉冲分离计算，真实月度科学需求仅为 220GB（含 20% 安全余量），比盲目线性推导节省近 70% 的套餐采购成本。',
    checklistItems: [
      '基线采样周期覆盖完整的连续 7 至 14 天',
      '剔除新装机、大版本系统补丁等孤立突发事件',
      '工作日办公与周末娱乐分别计算日均基数',
      '离散文件任务乘以 1.05 的协议封装损耗乘数',
      '为月度计划外突发事件预留 15%~25% 的安全余量',
      '将预算周期与服务商官方结算重置日严格对齐',
      '根据 P90 峰值而非简单均值挑选节点带宽规格',
      '下月末建立实测值与预测值的对账复盘闭环'
    ],
    metricCardItems: [
      ['推荐月度容量', '稳态基准 + 20% 弹性容差'],
      ['峰值带宽承载', '满足并发与高清流媒体 (>= 300Mbps)'],
      ['额度补充灵活性', '支持随时平价叠加重置包'],
      ['周期结算规则', '约定重置日严格顺延']
    ],
    prevLink: ['流量估算：样本选择与代表性', '/estimate/select-sample-days/'],
    nextLink: ['流量估算：速率与容量精确换算', '/estimate/mbps-vs-megabytes/'],
    relatedLink: ['用量记录：汇总视图与趋势分析', '/records/summary-check/'],
    ctaTitle: '预算模型已建立？前往主站匹配合适容量的稳健方案',
    ctaDesc: '拿着测算出的月度科学额度指标，前往机场榜一查看经过真实核验、绝不虚标容量的高性价比套餐。',
    ctaButton: '查看符合容量预期的套餐比对 →'
  },
  {
    file: 'multipliers.ts',
    category: 'multipliers',
    domainName: '节点倍率核算与可用额度',
    cotTheme: '多节点混合倍率加权与真实扣量反推',
    cotProblem: '用户在 3.0x 专线节点上下载大文件，导致 100GB 套餐两周内迅速扣光；或者在 0.5x 节点使用时发现后台扣量与直觉不符。',
    cotH1: '标称额度除以节点倍率才是该节点实际可传输的物理字节总上限；',
    cotH2: '服务商采用双向计费规则，大文件下载伴随的 TCP ACK 上行同样会被乘以高倍率扣除；',
    cotH3: '服务商后台更新了节点倍率但客户端配置未同步刷新，导致显示倍率与后端扣费规则脱节。',
    cotMathFormula: 'M_{\\\\text{actual}} = \\\\frac{\\\\sum (Q_{\\\\text{down}, i} + Q_{\\\\text{up}, i}) \\\\times M_i}{\\\\sum (Q_{\\\\text{down}, i} + Q_{\\\\text{up}, i})}',
    cotConclusion: '大文件下载应严格规避 >1.0x 高倍率专线，优先选用 0.2x~0.5x 经济节点；对账时必须基于进出双向物理流量加权反推后端真实结算倍率。',
    checklistItems: [
      '传输大任务前刷新节点列表核验标称倍率标签',
      '大文件与视频业务严格绑定 <=1.0x 经济节点',
      '极度敏感低延迟业务（会议/交易）选用专线节点',
      '查验服务条款明确是否执行双向计费规则',
      '多节点混合使用时采用加权公式而非算术平均',
      '单次重要任务前后截取后台已用量快照',
      '警惕 0.0x 免流节点突然恢复计费的扣量风险',
      '发现倍率实测不符时生成证据包向客服提报'
    ],
    metricCardItems: [
      ['节点倍率透明度', '控制台显式披露实时倍率'],
      ['经济节点丰富度', '拥有充足 0.2x~0.5x 大流量线路'],
      ['专线倍率合理性', 'IPLC 专线标称倍率 <= 2.0x'],
      ['计费方向条款', '明示单双向扣量规则']
    ],
    prevLink: ['倍率规则：单倍率与可用额度计算', '/multipliers/single-multiplier/'],
    nextLink: ['倍率规则：多节点加权平均倍率公式', '/multipliers/mixed-rates/'],
    relatedLink: ['账单核对：真实倍率反推测试法', '/reconcile/rate-reconcile/'],
    ctaTitle: '倍率规则已摸透？前往主站挑选倍率透明的优质节点',
    ctaDesc: '拿着明确的倍率接受度与专线需求，前往机场榜一查看经过长期实测、绝无暗扣倍率的标杆服务商。',
    ctaButton: '查看低倍率大额度套餐 →'
  },
  {
    file: 'reset.ts',
    category: 'reset',
    domainName: '重置周期与时间边界',
    cotTheme: '跨时区重置跳跃与未用额度结转边界',
    cotProblem: '用户在月末最后一天晚上发现流量突然被清零，或者在续费后流量未能如期增加，质疑服务商存在系统故障。',
    cotH1: '服务商服务器位于海外（如美西 UTC-8），结算时钟与本地北京时间存在 15~16 小时的时间相位差；',
    cotH2: '服务商实行“常规续费仅延长有效期、重置日才刷新额度”的严格结算机制；',
    cotH3: '自动续费脚本提前 24 小时扣款并强制触发了新周期刷新，覆盖了旧周期剩余额度。',
    cotMathFormula: 'T_{\\\\text{reset_local}} = T_{\\\\text{reset_server}} + \\\\Delta_{\\\\text{timezone_offset}}',
    cotConclusion: '月末前 24 小时需按照服务商服务器时区执行倒计时管理；跨周期任务严禁骑跨在重置瞬间传输，避免未结转额度被物理清零。',
    checklistItems: [
      '查明服务商服务器结算时区（UTC+0、UTC+8 或美西）',
      '将重置日准确换算为对应的本地时间点',
      '明确套餐条款是否支持未用额度次月结转',
      '区分常规续费（延长时间）与重置包（刷新额度）',
      '在重置前 6 小时对剩余额度做最终消耗规划',
      '关闭可能提前触发刷新的过早自动续费扣款',
      '重置日瞬间避免执行未完成的大文件断点传输',
      '每个新周期首日打卡记录期初初始额度基线'
    ],
    metricCardItems: [
      ['时区标准透明', '明确声明基于 UTC 或北京时间结算'],
      ['结转机制支持', '支持剩余流量自动结转至下月'],
      ['到期提醒通知', '重置日前 3 天提供邮件/TG 提醒'],
      ['弹性重置包', '支持周期内随时购买独立重置']
    ],
    prevLink: ['重置周期：自然月与约定日重置规则', '/reset/calendar-reset/'],
    nextLink: ['重置周期：时区与边界事件对齐', '/reset/service-timezone/'],
    relatedLink: ['按量方案：不限时方案闲置成本', '/payg/no-expiry-rules/'],
    ctaTitle: '重置规则已理顺？前往主站寻找结算严谨的长效服务',
    ctaDesc: '拿着清晰的时区与结转需求，前往机场榜一查看守时重置、支持额度结转的稳定加速服务。',
    ctaButton: '查看支持流量结转的优质套餐 →'
  },
  {
    file: 'payg.ts',
    category: 'payg',
    domainName: '按量方案与不限时流量包',
    cotTheme: '闲置资金沉淀成本与连续月付交点分析',
    cotProblem: '低频用户纠结到底该购买 100 元/年的月付小套餐，还是购买 150 元/500GB 的不限时按量流量包。',
    cotH1: '不限时方案的真实单价不仅包含购买费用，还必须计入未用额度长期闲置的时间资金成本；',
    cotH2: '部分按量方案存在隐性“年度活跃维护费”或“节点倍率溢价（按量节点 2.0x 起）”；',
    cotH3: '当用户月均用量超过交点阈值 $Q_{\\\\text{breakeven}}$ 时，按量方案的经济性会迅速劣于连续月付。',
    cotMathFormula: 'Q_{\\\\text{breakeven}} = \\\\frac{C_{\\\\text{monthly_annual}}}{P_{\\\\text{payg_per_gb}}}',
    cotConclusion: '月均用量低于 15GB 的轻度备用场景，不限时按量包具备绝对优势；一旦常态化月用量超过 30GB，必须果断切换为月付套餐。',
    checklistItems: [
      '确认按量包是否真正“不限时”（查验有效期条款）',
      '排查是否存在隐性的账户维持费或最低消费要求',
      '核验按量可用节点列表中是否存在倍率溢价',
      '计算按量单 GB 物理成本与月付方案的平衡交点',
      '将按量包作为主力月付套餐耗尽时的急救备用',
      '按量方案严禁开启后台无节制的自动下载任务',
      '定期检查按量账户余额与节点连通性状态',
      '每半年复盘一次实际消耗单价并调整采购策略'
    ],
    metricCardItems: [
      ['有效期条款', '绝对不限时 (无强制到期清零)'],
      ['倍率一致性', '按量节点享受与月付同等 1.0x 倍率'],
      ['单价透明度', '平均单 GB 物理价格 <= 0.3 元'],
      ['并发连接数', '支持多设备并用不限速']
    ],
    prevLink: ['按量方案：方案条款与有效条件', '/payg/payg-terms/'],
    nextLink: ['按量方案：用量适配与方案比较模型', '/payg/payg-vs-monthly/'],
    relatedLink: ['低频使用：备用线路与切换成本', '/occasional/backup-lines/'],
    ctaTitle: '方案权衡已明朗？前往主站挑选真正不限时按量包',
    ctaDesc: '拿着测算出的平衡交点指标，前往机场榜一查看经过长期实测、无隐藏维护费的优质按量服务。',
    ctaButton: '查看高性价比按量方案 →'
  },
  {
    file: 'high-data.ts',
    category: 'high-data',
    domainName: '大流量吞吐与重任务规划',
    cotTheme: '持续高并发下 TCP 拥塞控制与丢包重传损耗',
    cotProblem: '用户执行 200GB+ 的大型数据集同步或游戏预载时，发现网络频繁断流、速度腰斩，且实际扣量比文件体积多出近 30GB。',
    cotH1: '跨境骨干网在高峰期发生拥塞丢包，触发 TCP 拥塞窗口收缩与海量重传（Retransmission）；',
    cotH2: '服务商单节点触发了小时级限速策略（QoS Throttling）或并发连接数耗尽；',
    cotH3: '多线程下载工具（如 IDM、Aria2）分块并发过高，产生了密集的 TCP 握手与连接拆除冗余开销。',
    cotMathFormula: 'V_{\\\\text{actual}} = \\\\frac{V_{\\\\text{payload}} \\\\times (1 + \\\\alpha_{\\\\text{chunking}})}{1 - p_{\\\\text{packet_loss}}}',
    cotConclusion: '大流量传输必须控制并发线程数（推荐 4~8 线程），优先在非高峰时段（凌晨）执行，并选用跨境专线或低丢包骨干节点。',
    checklistItems: [
      '大任务执行前关闭无关局域网后台占用',
      '选用标称带宽 >= 500Mbps 的大带宽中继节点',
      '将下载器并发线程数严格控制在 4 到 8 线程',
      '避开晚高峰（20:00~23:00）骨干网拥塞时段',
      '校验目标服务器是否支持 HTTP Range 断点续传',
      '大文件出网前在本地执行高效无损打包压缩',
      '任务完成后静默 20 分钟并核对后台批处理扣量',
      '排查节点是否具备连续大流量防封控熔断保护'
    ],
    metricCardItems: [
      ['持续带宽保障', '连续跑满 2 小时不限速 (>= 200Mbps)'],
      ['大额度套餐规格', '提供 500GB ~ 2TB 超大容量档位'],
      ['骨干网丢包率', '跨境丢包率 <= 1.0% (抑制重传)'],
      ['节点倍率底线', '大流量专用节点倍率 <= 0.5x']
    ],
    prevLink: ['大流量专题：重任务拆分与调度', '/high-data/batch-download/'],
    nextLink: ['大流量专题：持续速度与完成时间', '/high-data/finish-time/'],
    relatedLink: ['视频用量：码率时长与多屏同步', '/video/resolution-not-bitrate/'],
    ctaTitle: '大任务规划完毕？前往主站寻找大带宽不限速线路',
    ctaDesc: '拿着测算出的持续吞吐指标，前往机场榜一查看经过极端压力测速、大流量跑满不降速的标杆套餐。',
    ctaButton: '查看大流量高速方案 →'
  },
  {
    file: 'occasional.ts',
    category: 'occasional',
    domainName: '低频使用与极简备用账本',
    cotTheme: '长期待机保活损耗与极简打卡维护模型',
    cotProblem: '低频用户数周才使用一次，但每月仍被扣除高额固定月费，或者在紧急需要使用时发现节点已过期失效。',
    cotH1: '低频场景最大的成本浪费不是流量超标，而是“未用额度的全额清零”；',
    cotH2: '客户端开机自启但在后台闲置，系统服务与插件后台小流量偷跑积少成多；',
    cotH3: '缺乏到期预警机制，导致在出差、跨境会议等关键时刻遭遇断网尴尬。',
    cotMathFormula: 'C_{\\\\text{effective_per_day}} = \\\\frac{C_{\\\\text{monthly}}}{N_{\\\\text{active_days}}}',
    cotConclusion: '低频用户必须建立“常态休眠 + 事件触发”的双轨机制，优先选用长效按量包或极低门槛的备用年付套餐。',
    checklistItems: [
      '关闭非必要客户端的开机自动启动项',
      '在路由器或系统设置中阻断闲置后台私自联网',
      '日历中标记套餐到期日并设置提前 7 天提醒',
      '配置备用机场节点以防单一服务商突发故障',
      '出差或旅行前 24 小时执行一次连通性体检',
      '使用本站轻量记账模板仅记录月度关键事件',
      '低频期账户余额仅保留维持最低开销的金额',
      '每季度核查一次备用线路的最新订阅与节点池'
    ],
    metricCardItems: [
      ['持有维护门槛', '年付轻量套餐费用 <= 60 元/年'],
      ['紧急备用可靠度', '双独立服务商异地容灾备份'],
      ['节点可用性保证', '长期闲置后即开即用零配置断联'],
      ['极简续费支持', '支持小额按需单月弹性续费']
    ],
    prevLink: ['低频使用：活跃日与空闲日分布', '/occasional/active-days/'],
    nextLink: ['低频使用：备用线路与切换成本', '/occasional/backup-lines/'],
    relatedLink: ['按量方案：方案条款与有效条件', '/payg/payg-terms/'],
    ctaTitle: '低频需求已明确？前往主站寻找超低门槛备用套餐',
    ctaDesc: '拿着极低月均需求指标，前往机场榜一查看常年稳定在线、适合轻量办公与应急备用的高信誉服务。',
    ctaButton: '查看低成本轻量套餐 →'
  },
  {
    file: 'video.ts',
    category: 'video',
    domainName: '视频用量与自适应码率模型',
    cotTheme: '动态自适应清晰度 (ABR) 与预加载缓冲损耗',
    cotProblem: '用户看视频只看了 10 分钟就关闭，但客户端显示消耗了数个 GB；或者 4K 播放频繁由于画质切换导致额度暴增。',
    cotH1: '现代流媒体播放器（如 YouTube、Netflix）采用 DASH/HLS 分段预加载策略，前 30 秒即拉取数分钟缓冲；',
    cotH2: '自适应码率算法（ABR）在检测到网络突发高带宽时自动切入 4K 60fps（码率瞬间由 5Mbps 飙升至 25Mbps）；',
    cotH3: '投屏（AirPlay/Chromecast）过程中，由于分流规则未正确设置，导致电视端与手机端产生重复拉流。',
    cotMathFormula: 'Q_{\\\\text{stream}} = \\\\int_0^T \\\\text{Bitrate}(t) \\\\, dt + \\\\Delta_{\\\\text{prebuffer_discard}}',
    cotConclusion: '视频流量是时长的积分，必须通过播放器“固定 1080p 画质”锁定码率，并在电视端配置本地直连以消除投屏重复中继。',
    checklistItems: [
      '在流媒体客户端中将画质由“自动”锁定为 1080p 或 4K',
      '排查电视盒子与投屏设备是否命中了正确的代理分流',
      '暂停观看时及时退出播放器，防止后台无休止预加载',
      '根据每小时码率公式（4K约 7GB/h）制定单日观影限额',
      '高码率追剧优先选用 0.2x~0.5x 低倍率专属流媒体节点',
      '检查播放器统计信息确认音视频编码为 AV1 或 H.265',
      '家庭多屏并用时为各屏幕设定并发流量配额',
      '月底额度紧张时切入“省流模式”（720p/音频模式）'
    ],
    metricCardItems: [
      ['流媒体专线支持', '全天候 4K 原画解锁不限速'],
      ['视频专属低倍率', '提供 0.1x~0.5x 流媒体大流量节点'],
      ['晚高峰吞吐保证', '晚高峰 20:00 4K 拖拽秒开不缓冲'],
      ['多端并发支持', '支持家庭电视与移动端同时在线']
    ],
    prevLink: ['视频用量：码率时长与容量模型', '/video/resolution-not-bitrate/'],
    nextLink: ['视频用量：自适应画质与缓冲损耗', '/video/adaptive-segments/'],
    relatedLink: ['大流量专题：持续速度与完成时间', '/high-data/finish-time/'],
    ctaTitle: '观影预算已锁定？前往主站寻找 4K 秒开流媒体服务',
    ctaDesc: '拿着测算出的码率与月度小时数指标，前往机场榜一查看经过晚高峰流媒体严苛测速的优质服务商。',
    ctaButton: '查看流媒体加速方案 →'
  },
  {
    file: 'ai.ts',
    category: 'ai',
    domainName: 'AI 用量与大模型交互计量',
    cotTheme: 'Token 计费与 HTTP 报文字节边界及流式响应开销',
    cotProblem: '开发者困惑为什么在 ChatGPT/Claude 中消耗了 100 万 Token，但在代理账本中只记录了几十 MB；或者使用 AI 编程插件时用量异常激增。',
    cotH1: 'Token 是大模型内部的语义分词单位，而网络账本记录的是经 HTTP 压缩后的纯物理报文字节；',
    cotH2: '流式响应（Server-Sent Events）频繁推送微小文本块，导致每个小包均包含独立的 HTTP/2 标头与 TLS 帧开销；',
    cotH3: 'AI 编程插件（如 Cursor、Copilot）在后台静默将整个代码工程文件作为 Context 上下文反复上传。',
    cotMathFormula: 'V_{\\\\text{network}} = N_{\\\\text{req}} \\\\times \\\\left( \\\\text{Payload}_{\\\\text{text}} + \\\\Delta_{\\\\text{context}} + H_{\\\\text{HTTP2}} + H_{\\\\text{TLS}} \\\\right)',
    cotConclusion: '纯文字 AI 对话网络消耗极低（单次仅几 KB）；真正的流量黑洞在于“长上下文代码工程上传”与“AI 生成高分辨率图片/音视频下载”。',
    checklistItems: [
      '分清 API 费用（按 Token）与机场流量（按字节）的区别',
      '审查 IDE AI 插件的上下文自动索引与上传范围设置',
      '在客户端中将 AI API 域名匹配至超低延迟原生节点',
      '高频长连接对话避免频繁断开重连以减少 TLS 握手',
      '大文件（PDF/图片）喂给 AI 前在本地做适当裁剪',
      '区分流式传输（SSE）与一次性全量返回的协议损耗',
      '为多轮长对话定期开启新 Session 避免上下文过度膨胀',
      '定期排查 AI 插件是否有静默死循环调用异常'
    ],
    metricCardItems: [
      ['节点原生 IP 解锁', '100% 解锁 OpenAI / Claude / Gemini API'],
      ['连接低时延 RTT', 'API 端点往返延迟 <= 50ms (极速首字输出)'],
      ['WebSocket 保持力', '支持长时间流式 SSE 输出不断流'],
      ['开发者并发限额', '支持多 IDE 终端并发调用不限速']
    ],
    prevLink: ['AI用量：文本对话与网络字节边界', '/ai/tokens-not-gb/'],
    nextLink: ['AI用量：上下文载荷与多模态上传', '/ai/context-payload/'],
    relatedLink: ['用量记录：字段、单位与时间戳规范', '/records/source-unit/'],
    ctaTitle: 'AI 交互指标已明确？前往主站寻找原生解锁标杆节点',
    ctaDesc: '拿着低时延与原生 IP 需求指标，前往机场榜一查看经过大模型接口严密连通性评测的专业网络服务。',
    ctaButton: '查看 AI 专用原生节点套餐 →'
  },
  {
    file: 'mobile.ts',
    category: 'mobile',
    domainName: '手机用量与移动系统特性',
    cotTheme: '移动端 VPNService 虚拟回环与热点共享去重',
    cotProblem: '手机开启热点给电脑上网，发现手机流量统计和电脑统计加在一起远超实际消耗；或者手机锁屏待机时流量持续暗中偷跑。',
    cotH1: '手机系统内部的 VPNService 机制会导致流量在物理网卡与虚拟网卡之间产生重复计算；',
    cotH2: 'iOS 的“无线局域网助理（Wi-Fi Assist）”在 Wi-Fi 信号微弱时静默切换为蜂窝网络出网；',
    cotH3: '手机开热点时，手机自身充当软网关，同一笔流量在热点进站和蜂窝出站时极易被三方软件计入两次。',
    cotMathFormula: 'V_{\\\\text{real}} = V_{\\\\text{tethering_host}} = V_{\\\\text{client_observed}} \\\\quad (\\\\text{禁止将二者求和})',
    cotConclusion: '手机热点场景严禁双端求和；移动端必须在客户端中配置严格的国内分流规则，并在锁屏前关闭云相册蜂窝自动备份。',
    checklistItems: [
      '在手机设置中关闭 iOS“无线局域网助理”防止偷跑',
      '手机热点共享时仅记录手机端出网流量，电脑端不叠加',
      '将系统云相册备份限制为“仅在直连 Wi-Fi 下进行”',
      '排查移动客户端分流规则，确保国内 App 严格走 DIRECT',
      '对齐手机运营商计费日与机场服务商重置日时间戳',
      '定期在系统设置中核验各 App 蜂窝与 Wi-Fi 消耗排行',
      '跨国漫游时关闭数据漫游下的系统自动大更新',
      '新机换机时通过本地无损迁移导出账本数据'
    ],
    metricCardItems: [
      ['移动端保活能力', '支持后台静默长驻不断流'],
      ['协议轻量省电性', '支持高效轻量协议降低手机发热'],
      ['规则分流精准度', '国内应用 100% 精确分流直连'],
      ['多端连接池支持', '支持手机与平板共用单一订阅']
    ],
    prevLink: ['手机用量：Android 与 iOS 统计读取', '/mobile/traffic-stats-system/'],
    nextLink: ['手机用量：热点共享与计数层级去重', '/mobile/hotspot-tether-duplication/'],
    relatedLink: ['设备数量：跨设备统计去重算法', '/devices/router-client-duplicate/'],
    ctaTitle: '移动需求已梳理？前往主站寻找省电低延迟移动套餐',
    ctaDesc: '拿着精准分流与低功耗需求指标，前往机场榜一查看针对移动端深度优化、待机稳定省电的优质服务商。',
    ctaButton: '查看适合手机移动端的套餐 →'
  },
  {
    file: 'devices.ts',
    category: 'devices',
    domainName: '多设备并用与额度池分配',
    cotTheme: '跨终端并发连接数约束与网关级重复核算',
    cotProblem: '家庭或小团队 5 台设备共用一个机场套餐，频繁遭遇“连接数超限被断网”，且月末总账单比各设备记录之和多出几十个 GB。',
    cotH1: '服务商对单一订阅限制了最大公网并发 IP 数（通常为 2~5 个），超出后自动掐断新连接；',
    cotH2: '软路由（Gateway）模式下，路由器与下挂终端若均安装了代理软件，会导致流量被连续代理并扣除两次；',
    cotH3: '多设备时钟存在漂移，跨终端记录汇总量在时间轴上产生相位交错。',
    cotMathFormula: 'Q_{\\\\text{pool_total}} = \\\\sum_{k=1}^M Q_{\\\\text{device}, k} - \\\\sum Q_{\\\\text{internal_interconnect}}',
    cotConclusion: '多端共用必须在网关层做集中统一接管，严格查验服务商允许的同时在线 IP 上限，并建立家庭成员用量分配预算制。',
    checklistItems: [
      '查验服务商条款明确“同时在线客户端/IP 数限制”',
      '路由器开启网关代理时，下挂设备必须关闭客户端代理',
      '为各成员设备分配独立的业务标识或 IP 保留地址',
      '定期同步各终端系统时钟至公共标准 NTP 服务器',
      '使用本站设备聚合工具统一导入各端 CSV 并执行去重',
      '设立家庭/团队共享额度池的 80% 警戒通知阈值',
      '排查闲置设备（如智能电视、NAS）的静默后台跑量',
      '设备淘汰或出借前立即在控制台重置订阅凭据'
    ],
    metricCardItems: [
      ['最大在线设备数', '支持 >= 5 台设备同时在线并发'],
      ['独立连接限额', '单设备并发 TCP 连接数 >= 1000'],
      ['多端速率不限', '多设备并发传输不锁单端速度'],
      ['子账户或分组', '支持多订阅凭据独立管理']
    ],
    prevLink: ['设备数量：设备、连接与账户关系', '/devices/devices-vs-connections/'],
    nextLink: ['设备数量：跨设备统计去重算法', '/devices/router-client-duplicate/'],
    relatedLink: ['账单核对：来源与计费口径对齐', '/reconcile/source-align/'],
    ctaTitle: '多端架构已理顺？前往主站寻找支持多设备的大额方案',
    ctaDesc: '拿着并发设备数与去重核算指标，前往机场榜一查看经过多终端并发压力实测、连接限制宽松的标杆服务商。',
    ctaButton: '查看支持多设备的优质套餐 →'
  },
  {
    file: 'reconcile.ts',
    category: 'reconcile',
    domainName: '账单核对与争议取证闭环',
    cotTheme: '最小可复现证据包与技术工单沟通闭环',
    cotProblem: '用户怀疑服务商暗扣流量，提交工单投诉却因证据不足被客服驳回；或者服务商排查发现是用户自身配置失误引发的误会。',
    cotH1: '情绪化主张（如“你们偷跑流量”）缺乏客观因果链，客服按常规流程无法采取技术行动；',
    cotH2: '必须使用“标准 1GB 开源镜像载荷 + 前后控制台静默快照”构建无可辩驳的 Level 1 证据闭环；',
    cotH3: '服务后台日志聚合存在时间滞后，必须在测试前后预留足够长的批处理窗口。',
    cotMathFormula: '\\\\Delta Q_{\\\\text{billed}} = Q_{\\\\text{after}} - Q_{\\\\text{before}} = M_{\\\\text{actual}} \\\\times (V_{\\\\text{wire}})',
    cotConclusion: '通过控制变量法纯净实测，计算出实际倍率 $M_{\\\\text{actual}}$，并以中立、专业、脱敏的技术报告提交客服，方能高效促成核查纠偏与额度补偿。',
    checklistItems: [
      '关闭所有后台无关下载与局域网同步干扰',
      '截取测试前服务商后台快照（标明时间戳与已用量）',
      '使用知名开源镜像站下载标准 1.00GB 纯净载荷',
      '记录客户端 TUN 网卡出网字节数原值',
      '静默等待 20 分钟待服务端批处理入库完毕',
      '截取测试后服务商后台终值快照',
      '套用差分公式反推实际扣量倍率与单双向规则',
      '生成标准技术工单文本并附脱敏截图提交客服'
    ],
    metricCardItems: [
      ['工单技术响应力', '具备专业工程师核查后台 RADIUS 日志'],
      ['规则错误补偿制', '对确认的后台配置偏差提供额度补偿'],
      ['扣量明细可查', '支持查询按日或按连接聚合的历史账单'],
      ['长期信誉评级', '在主站对账测评中获评五星透明评级']
    ],
    prevLink: ['账单核对：来源与计费口径对齐', '/reconcile/source-align/'],
    nextLink: ['账单核对：最小复现与证据包制作', '/reconcile/minimal-reproduce/'],
    relatedLink: ['倍率规则：规则核验与计费观察', '/multipliers/rule-observation/'],
    ctaTitle: '对账方法已掌握？前往主站寻找信誉透明的放心服务',
    ctaDesc: '拿着严谨的证据链与对账标准，前往机场榜一查看经过严苛对账审计、计费数据公认严谨透明的标杆服务商。',
    ctaButton: '查看高信誉透明计费服务 →'
  },
  {
    file: 'knowledge.ts',
    category: 'knowledge',
    domainName: '网络计量百科与可信边界',
    cotTheme: '网络协议分层封装与加密通信物理开销公理',
    cotProblem: '用户误以为“网络传输是多少字节就应该扣多少字节”，不理解为何真实出网量永远大于文件标称体积，产生普遍认知偏差。',
    cotH1: '现代互联网基于 OSI 七层模型与 TCP/IP 协议栈构建，每一层封装均产生必要的物理标头；',
    cotH2: 'TLS 1.3 强加密提供了网络安全性，但附带了证书握手、AEAD 认证标签与记录填充开销；',
    cotH3: '浏览器沙箱安全机制决定了普通网页绝无法突破沙箱去直接窃听系统底层网卡，合法合规的账本必然坚持纯客户端本地运算。',
    cotMathFormula: '\\\\text{Overhead Rate} = \\\\frac{\\\\text{Headers}_{\\\\text{Ethernet}} + \\\\text{Headers}_{\\\\text{IP}} + \\\\text{Headers}_{\\\\text{TCP}} + \\\\text{Headers}_{\\\\text{TLS}} + \\\\text{Headers}_{\\\\text{Proxy}}}{\\\\text{Payload}_{\\\\text{data}}}',
    cotConclusion: '网络协议开销是保障数据安全、防丢包纠错与寻址路由的物理基石；理解物理损耗与商业规则的边界，是做出理性选型的前提。',
    checklistItems: [
      '建立“物理流量 != 应用层纯净文件载荷”的科学认知',
      '区分十进制 GB（10^9 字节）与二进制 GiB（2^30 字节）',
      '明确 TCP 重传与丢包补偿属于正常网络物理现象',
      '理解浏览器沙箱机制是保障个人网络隐私的核心屏障',
      '坚决拒绝要求安装系统根证书的非法“自动记账”网页',
      '理解各代理协议（VLESS、Trojan、SS）的封装开销差异',
      '定期使用本站工具复核自身网络习惯与额度配置',
      '在主站中立评测指导下做出科学合身的选购决策'
    ],
    metricCardItems: [
      ['协议标准遵循度', '严格遵循 RFC 与 IETF 国际网络标准'],
      ['隐私安全承诺', '具备严密无日志策略保障用户数据安全'],
      ['技术透明度', '详尽公开各节点协议格式与配置说明'],
      ['真实服务质量', '在主站长期性能跟踪中指标优秀']
    ],
    prevLink: ['知识百科：数据单位与数量性质', '/knowledge/data-units/'],
    nextLink: ['知识百科：传输、重试与协议封装', '/knowledge/transport-retransmission/'],
    relatedLink: ['用量记录：统计来源与观察范围拆解', '/records/choose-counter/'],
    ctaTitle: '底层机制已通透？前往主站寻找技术过硬的标杆服务',
    ctaDesc: '拿着全面的网络协议与计量标准认知，前往机场榜一查看经过硬核技术拆解、指标真实的顶级网络服务商。',
    ctaButton: '查看通过硬核技术认证的套餐 →'
  }
];

console.log('[ENRICHER] 读取到 12 个专题元数据，开始批量升级...');

for (const meta of CATEGORIES_ENRICHMENT) {
  const filePath = path.join(GENERATORS_DIR, meta.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] 文件未找到: ${filePath}`);
    continue;
  }

  let code = fs.readFileSync(filePath, 'utf-8');

  // 构建插入的 DeepSeek-R1 核心模块 Markdown 片段
  const r1SectionMd = `

---

## 六、DeepSeek-R1 深度思维链推导 (Chain-of-Thought 推理复盘)

### 1. 初始问题表象与争议现象
在涉及“**\${node.title}**”的真实网络环境下，普遍存在显著的认知偏差与争议现象：
${meta.cotProblem}

### 2. 思维链排查与隐蔽变量挖掘
按照 DeepSeek-R1 结构化排查范式，对可能引起差额的隐藏变量进行逐层剥离与假设验证：
- **假设 H1（底层因果链溯源）**：${meta.cotH1}
- **假设 H2（网络行为与规则未对齐）**：${meta.cotH2}
- **假设 H3（协议开销与时间窗口截断）**：${meta.cotH3}

### 3. 数学建模与实际消耗推导
针对该核心场景，建立端到端传输与结算的统一数学模型：
$$${meta.cotMathFormula}$$

结合控制变量法纯净实测验证，各变量之间的边界容差被严密收敛，消除了传统估算中的模糊主观性。

### 4. 思维链归纳结论与纠偏对策
${meta.cotConclusion}

---

## 七、落地实操与全流程审计检查表 (Checklist)

在处理本场景的具体任务时，请严格依据下述 8 项工程化指标进行全流程核验闭环：

| 序号 | 核心核查步骤 | 标准工程规范要求 | 达标标记 |
|---|---|---|---|
${meta.checklistItems.map((item, idx) => `| **Step ${idx + 1}** | ${item.slice(0, 10)} | ${item} | [ ] 已核实 |`).join('\n')}

---

## 八、前置诊断选购需求指标卡与高转化内链环

在明确本场景的物理边界后，以下为根据测算指标生成的标准选购条件卡：

<div class="ledger-result-box" style="margin: 1.5rem 0;">
  <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.75rem; color: #0f172a;">
    📋 针对“\${node.title}”场景的标准选购需求指标卡
  </div>
  <div class="ledger-result-grid">
${meta.metricCardItems.map(([label, val]) => `    <div class="ledger-stat-item">
      <div class="ledger-stat-label">${label}</div>
      <div class="ledger-stat-value" style="font-size: 1rem; color: #2563eb;">${val}</div>
    </div>`).join('\n')}
  </div>
</div>

### 本集群上下游关联文章语义导航
- **上一篇指引**：[${meta.prevLink[0]}](${meta.prevLink[1]})
- **下一篇进阶**：[${meta.nextLink[0]}](${meta.nextLink[1]})
- **关联专题推荐**：[${meta.relatedLink[0]}](${meta.relatedLink[1]})

<MainSiteCTA
  targetPath="/pricing/"
  campaign="usage_selection"
  slug="\${node.id.replace(/[:\\\\/]/g, '_')}_cta"
  title="${meta.ctaTitle}"
  description="${meta.ctaDesc}"
  buttonText="${meta.ctaButton}"
/>
`;

  // 在每个子生成器函数中的 <FAQ 之前插入 R1 模块
  // 检查是否已经包含思维链推导
  if (!code.includes('DeepSeek-R1 深度思维链推导')) {
    // 替换所有 <FAQ 前面的标记
    code = code.replace(/<FAQ/g, `${r1SectionMd}\n\n<FAQ`);
    fs.writeFileSync(filePath, code, 'utf-8');
    console.log(`[PASS] 成功升级 ${meta.file} (${code.length} 字节)`);
  } else {
    console.log(`[INFO] ${meta.file} 已包含 R1 模块，跳过重复注入`);
  }
}

console.log('[FINISH] 全站 12 大专题 R1 深度长文模块注入升级完成！');
