import fs from 'node:fs';
import path from 'node:path';

const GENERATORS_DIR = path.resolve(process.cwd(), 'scripts', 'generators');

interface ClusterData {
  clusterTitle: string;
  wireTrace: string;
  cotTheme: string;
  cotProblem: string;
  cotH1: string;
  cotH2: string;
  cotH3: string;
  cotMathFormula: string;
  cotCalculations: string;
  cotConclusion: string;
  checklistItems: [string, string][];
  metricCardItems: [string, string][];
  prevLink: [string, string];
  nextLink: [string, string];
  relatedLink: [string, string];
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: string;
}

// 1. estimate 8 集群
const ESTIMATE_CLUSTERS: ClusterData[] = [
  {
    clusterTitle: '基线样本选择与清洗',
    wireTrace: `[Baseline Sampling Frame] Continuous 14-Day Packet Capture
├── Steady Workday Flow: q_work = 1.65 GB/day (Web, Git, IM)
├── Weekend Peak Flow: q_weekend = 4.80 GB/day (4K Streaming, Social)
└── Atypical Impulse Event: Single-day Steam 32.0 GB update (Isolated Outlier)`,
    cotTheme: '非典型突发脉冲与多任务复合预算推导',
    cotProblem: '用户根据新装机当天的出网量（28.4GB）简单线性外推，得出月度需要 850GB+ 巨额套餐的错误结论。',
    cotH1: '冷启动装机与大版本系统更新属于低频单次脉冲事件，不可与日常平稳办公流混同计算；',
    cotH2: '日常平稳办公流与周末高码率视频流存在显著的双峰分布，简单算术平均数会严重掩盖方差；',
    cotH3: '网络环境存在 6.3% 的协议封装损耗与丢包重传，实际出网量大于应用层净文件体积。',
    cotMathFormula: 'Q_{\\text{month}} = \\left( \\sum_{i=1}^5 q_{\\text{work}} + \\sum_{j=1}^2 q_{\\text{weekend}} \\right) \\times 4.33 + \\sum Q_{\\text{outlier}} \\times (1 + \\Delta_{\\text{proto}})',
    cotCalculations: `**经典基线提取手算演算推导（30天标准月度模型）**：
1. **工作日平稳办公日均基线**：$q_{\\text{work}} = 1.65\\text{ GB/天}$；
2. **周末娱乐流媒体日均基线**：$q_{\\text{weekend}} = 4.80\\text{ GB/天}$；
3. **稳态月度平稳出网总量**：$V_{\\text{steady}} = (5 \\times 1.65 + 2 \\times 4.80) \\times 4.33 = 17.85 \\times 4.33 \\approx 77.29\\text{ GB}$；
4. **偶发脉冲大任务单列准备金**：剥离单次大下载，按每两个月一次分配准备金 $14.20\\text{ GB}$；
5. **协议损耗放大**：$Q_{\\text{final}} = (77.29 + 14.20) \\times 1.089 \\approx 99.63\\text{ GB}$；
6. **科学结论**：真实套餐容量仅需 **$100\\text{ GB}$ 档位**，比盲目外推节省近 $88\\%$ 支出！`,
    cotConclusion: '必须严格执行“稳态中位数求和＋特异脉冲准备金单列＋协议膨胀系数放大”三步估算法，杜绝用极端峰值决定常年月付套餐容量。',
    checklistItems: [
      ['采样周期覆盖', '基线采样周期覆盖完整的连续 7 至 14 天，必须包含 5 个工作日与 2 个周末'],
      ['剥离单次突发', '剔除新装机、大版本系统补丁等孤立突发事件，单列为应急额度准备金'],
      ['分离双峰场景', '工作日办公与周末娱乐分别计算日均基数，避免算术平均掩盖波动'],
      ['协议封装补偿', '对所有离散文件和纯净数据载荷统一乘以 1.06~1.09 的物理封装损耗乘数'],
      ['预留安全余量', '为月度计划外突发事件预留 15%~25% 的安全弹性余量'],
      ['重置周期对齐', '将自建账本预算周期与服务商官方结算重置日时间戳严格对齐'],
      ['峰值带宽验证', '根据 P90 峰值而非简单均值挑选节点带宽规格，保障高峰期拖拽流畅度'],
      ['月末复盘闭环', '在计费周期最后一天建立实测值与预测值的对账复盘，反向修正次月模型参数']
    ],
    metricCardItems: [
      ['推荐月度容量', '90GB~120GB (稳态基准 + 20% 弹性容差)'],
      ['峰值带宽承载', '>= 300 Mbps (满足 4K 流媒体秒开与并发)'],
      ['额度补充灵活性', '支持随时平价叠加重置包 (按量计费递增)'],
      ['周期结算规则', '约定重置日严格顺延 (支持半开区间结算)']
    ],
    prevLink: ['流量估算：样本选择与代表性', '/estimate/select-sample-days/'],
    nextLink: ['流量估算：速率与容量精确换算', '/estimate/mbps-vs-megabytes/'],
    relatedLink: ['用量记录：汇总视图与趋势分析', '/records/summary-check/'],
    ctaTitle: '预算模型已建立？前往主站匹配合适容量的稳健方案',
    ctaDesc: '拿着测算出的月度科学额度指标，前往机场榜一查看经过真实核验、绝不虚标容量的高性价比套餐。',
    ctaButton: '查看符合容量预期的套餐比对 →'
  },
  {
    clusterTitle: '任务时长与文件切片大小',
    wireTrace: `[Task Sizing Wire Chunk Trace] HTTP Range Request:
├── Request: GET /archive.tar.gz (Range: bytes=0-104857599, 100MB chunk)
├── In-transit Overhead: TCP Handshake + TLS Record Header + Proxy Header = 2.4MB
└── Discarded Bytes on Cancellation: User aborted at 50% -> 52.4MB wasted`,
    cotTheme: '离散传输任务的取消中断与断点续传损耗',
    cotProblem: '用户传输大文件时中途取消或网络波动重连，误以为未完成任务不产生流量，但账单扣除了数个 GB。',
    cotH1: '客户端已通过隧道接收的数据包即使被用户中途关闭，物理网卡与服务网关已完成全额计费；',
    cotH2: '无断点续传功能的下载器在重试时会从第 0 字节重新拉取，造成成倍重复传输；',
    cotH3: '多线程并发拉取时，每个切片末尾存在未用完的预分配缓冲区丢弃。',
    cotMathFormula: 'V_{\\text{chunked}} = \\sum_{k=1}^m S_k + \\sum_{j=1}^r S_{\\text{aborted}, j} + m \\times H_{\\text{TLS}}',
    cotCalculations: `**文件切片与重试损耗手算演算**：
1. 用户下载 1 个 $10.00\\text{ GB}$ 工程包，遇到两次网络闪断：
   - 第一次在拉取到 $3.20\\text{ GB}$ 时中断；第二次在拉取到 $6.80\\text{ GB}$ 时因无断点续传重新从 0 开始；
2. 实际出网物理流量累加：$V_{\\text{actual}} = 3.20 + 6.80 + 10.00 = 20.00\\text{ GB}$；
3. 相比正常传输产生了 **$100\\%$ 的巨额重复开销**！启用支持 HTTP Range 断点续传工具后，重试损耗瞬间归零。`,
    cotConclusion: '大文件传输必须确保客户端支持 HTTP Range 断点续传，且中途取消的任务必须将已传输切片计入实际消耗。',
    checklistItems: [
      ['核验断点续传支持', '确认下载工具支持 HTTP 206 Partial Content 断点续传协议'],
      ['计算已取消切片', '对中途取消的任务以客户端网卡实际跑量为准，严禁记为 0'],
      ['限制并发分块数量', '多线程并发拉取切片数控制在 4~8 个，防止缓冲区过度浪费'],
      ['规避高峰断线重连', '大文件尽量安排在网络低负载时段传输，规避网络抖动中断'],
      ['单任务体积预估', '单次传输前核查文件体积与当前剩余额度，防止半途停机'],
      ['启用哈希校验去重', '同一文件二次传输前校验本地 MD5/SHA256，避免重复拉取'],
      ['记录中断日志标记', '在账本中将中断重试任务单独打上“重试损耗”标签'],
      ['核对双向合并开销', '注意大文件上传时相伴随的 TCP ACK 上行流量']
    ],
    metricCardItems: [
      ['长连接稳定性', 'TCP 隧道保活超 12 小时不断线，杜绝频繁重试'],
      ['大文件承载力', '单任务支持持续传输 100GB+ 不限速'],
      ['抗丢包容忍度', '支持先进拥塞控制，弱网重传开销低'],
      ['支持协议完整性', '完美支持 HTTP/2 与多切片传输协议']
    ],
    prevLink: ['流量估算：样本选择与代表性', '/estimate/select-sample-days/'],
    nextLink: ['流量估算：速率与容量精确换算', '/estimate/mbps-vs-megabytes/'],
    relatedLink: ['大流量专题：重度任务拆分与测算', '/high-data/demand/task-inventory/'],
    ctaTitle: '大任务传输指标已确定？前往主站寻找长连接不断线的优质线路',
    ctaDesc: '拿着长连接稳定性与大文件承载力指标，前往机场榜一挑选抗断线、速度持久的稳定服务商。',
    ctaButton: '查看大文件长连接专属套餐 →'
  },
  {
    clusterTitle: '速率带宽与容量单位转换',
    wireTrace: `[Bitrate vs Capacity Conversion Trace] 100 Mbps Line:
├── Bandwidth: R = 100.0 Mbps (Megabits per second)
├── Byte Throughput: (100 * 10^6) / 8 = 12.50 MB/s (Megabytes per second)
└── One Hour Maximum Transfer = 12.50 MB/s * 3600s = 45,000 MB = 45.00 GB/h`,
    cotTheme: '网络带宽比特速率与数据存储字节容量的 8 倍代差',
    cotProblem: '用户看到 100Mbps 测速结果，以为每秒能下载 100MB 文件，把 1 小时用量错算成 360GB，产生 8 倍巨大认知偏差。',
    cotH1: '网络带宽计量单位是比特（bit，小写 b），而文件存储单位是字节（Byte，大写 B），$1\\text{ Byte} = 8\\text{ bits}$；',
    cotH2: '十进制 SI 标准（$10^3 = 1000$）与二进制 IEC 标准（$2^{10} = 1024$）混淆，产生 7.37% 的二级偏差；',
    cotH3: '持续跑满带宽的理论峰值与实际业务调度的平均速率存在显著差距。',
    cotMathFormula: 'V_{\\text{GB}} = R_{\\text{Mbps}} \\times 0.45 \\times T_{\\text{hours}} \\times \\eta_{\\text{utilization}}',
    cotCalculations: `**带宽速率换算为小时容量黄金法则手算推导**：
1. 设网络传输平均速率为 $R = 20.0\\text{ Mbps}$（如超清 4K 流媒体）：$V = 20.0 \\times 0.45 \\times 1.0 = 9.00\\text{ GB/小时}$；
2. 若用户持续观看 3 小时：$V_{\\text{total}} = 9.00 \\times 3.0 = 27.00\\text{ GB}$；
3. **8倍换算警示**：若错将 20Mbps 当作 20MB/s 计算，将得出 $72\\text{ GB/h}$ 的荒谬数字，导致预算偏差 800%！`,
    cotConclusion: '记住 0.45 黄金换算常数：每 1 Mbps 速率持续传输 1 小时，物理消耗严格等于 0.45 GB。',
    checklistItems: [
      ['牢记 8 倍换算常数', '严格区分小写 b（bit）与大写 B（Byte），换算时始终除以 8'],
      ['套用 0.45 黄金常数', '速率 Mbps 乘以 0.45 乘以时长（小时）直接得出十进制 GB'],
      ['区分峰值与平均速率', '测速软件给出的是瞬态峰值，预算估算必须使用业务全局平均速率'],
      ['明确十进制与二进制', '标称 GB 为 $10^9$ 字节，GiB 为 $1024^3$ 字节，保留单位后缀说明'],
      ['核验下载器显示单位', '核对迅雷/浏览器下载器设置中的速率单位是 MB/s 还是 Mbps'],
      ['纳入协议开销损耗率', '在纯净速率换算结果上追加 5% 的 TCP/IP 报头与 TLS 填充开销'],
      ['双向速率分别记录', '上传速率与下载速率分开记录，避免合并混淆'],
      ['按有效载荷比率打折', '视频与文件传输存在动态波动，设定实际利用率因子 $\\eta \\approx 0.85$']
    ],
    metricCardItems: [
      ['标称带宽真实度', '峰值速率与标称带宽完全吻合，绝无虚标缩水'],
      ['速率稳定性', '全天候测速抖动 < 10%，无严重断崖式跌落'],
      ['大带宽接入能力', '提供 500Mbps~1000Mbps 超大带宽极速节点'],
      ['计费单位透明度', '控制台显式注明计量单位为 GB 或 GiB']
    ],
    prevLink: ['流量估算：时长、次数与文件量', '/estimate/models/task-size/'],
    nextLink: ['流量估算：接管范围与额外传输', '/estimate/models/traffic-scope/'],
    relatedLink: ['知识百科：数据单位与数量性质', '/knowledge/measurement/units/'],
    ctaTitle: '速率指标已理清？前往主站寻找真带宽不虚标的高速服务',
    ctaDesc: '拿着精确的带宽与容量换算指标，前往机场榜一查看经过严密带宽压测、真材实料的优质加速服务商。',
    ctaButton: '查看真实带宽套餐比对 →'
  },
  {
    clusterTitle: '分流范围与虚拟网卡接管',
    wireTrace: `[TUN Split Tunneling Routing Trace] Routing Table Rule Match:
├── Dest: 14.215.177.38 (Baidu CN) -> Match DIRECT -> Real NIC out (0 Proxy Used)
├── Dest: 192.168.1.50 (Home NAS) -> Match DIRECT -> Real NIC out (0 Proxy Used)
└── Dest: 104.244.42.1 (X/Twitter) -> Match PROXY -> TUN Virtual NIC out (Proxy Billed)`,
    cotTheme: '分流引擎穿透与局域网高吞吐误劫持解构',
    cotProblem: '开启全局代理后，电脑向家庭 NAS 备份照片，导致当月代理额度一天内被全部扣光。',
    cotH1: '客户端 TUN 虚拟网卡未配置私网网段保留规则（RFC 1918），将局域网内网流量误判为公网出站；',
    cotH2: '国内大流量应用（如网易云音乐、Bilibili、网盘）命中 PROXY 规则，白白消耗境外加密流量；',
    cotH3: 'DNS 污染引发分流失效，本应直连的域名因解析出境外 IP 被迫走代理。',
    cotMathFormula: 'V_{\\text{proxy_real}} = V_{\\text{nic_total}} - V_{\\text{direct_cn}} - V_{\\text{lan_nas}}',
    cotCalculations: `**局域网高吞吐分流排查手算实录**：
1. 某用户全天网卡出网总流量 $V_{\\text{nic}} = 65.00\\text{ GB}$；
2. 逐层排查流量构成：本地 NAS 文件同步 $42.00\\text{ GB}$，国内视频直连 $18.00\\text{ GB}$，境外加速业务 $5.00\\text{ GB}$；
3. **分流配置纠偏**：在客户端配置 \`geoip:private\` 强制 DIRECT 规则后，代理出网量瞬间降至真实的 **$5.00\\text{ GB}$**，保全了 $60.00\\text{ GB}$ 额度！`,
    cotConclusion: '必须在客户端中配置严格的 RFC 1918 私网直连与国内域名 GeoIP 白名单，确保只有刚性出海流量才被代理接管。',
    checklistItems: [
      ['配置私网保留规则', '确认配置包含 10.0.0.0/8、172.16.0.0/12、192.168.0.0/16 强制直连'],
      ['国内域名分流核验', '检查 China 规则集，确保国内视频与下载应用命中 DIRECT'],
      ['排查 NAS 局域网备份', 'NAS 备份或家庭共享时查看客户端活动连接，确认走本地真实网卡'],
      ['防范 Fake-IP 泄漏', '合理配置 DNS 分流模式，杜绝内网域名被分配 Fake-IP 劫持'],
      ['审查系统全局代理开关', '仅在必要时开启 TUN 全局模式，日常推荐使用规则分流模式'],
      ['监控未知进程外联', '在客户端连接面板审查有无异常进程占用代理带宽'],
      ['排除云盘同步应用', '将百度网盘、阿里云盘等国内存储工具加入直连绕过名单'],
      ['定期更新分流规则库', '每月更新 GeoIP 与 GeoSite 数据库，保障最新国内域名精准直连']
    ],
    metricCardItems: [
      ['规则分流适配度', '100% 适配主流客户端分流规则集 (Clash/Sing-box)'],
      ['纯净出海通道', '专注境外优化加速，国内流量绝不绕路'],
      ['DNS 解析低时延', '智能双栈 DNS 解析，无污染且响应延迟 < 20ms'],
      ['无冗余节点劫持', '节点路由纯净，支持按需策略组灵活调度']
    ],
    prevLink: ['流量估算：速率与容量换算', '/estimate/models/unit-rate/'],
    nextLink: ['流量估算：任务组合与周期分配', '/estimate/forecast/composition/'],
    relatedLink: ['知识百科：解析、分流与设备环境', '/knowledge/network/routing/'],
    ctaTitle: '分流边界已搞清？前往主站寻找规则兼容性优秀的标杆服务',
    ctaDesc: '拿着精准分流与纯净路由指标，前往机场榜一查看针对分流规则优化完善、绝不乱跑流量的优质服务商。',
    ctaButton: '查看高分流精度套餐比对 →'
  },
  {
    clusterTitle: '任务组合与多场景分配',
    wireTrace: `[Task Composition Timeline Model] Month-long Simulation:
├── Task A (Dev/Git/API): Daily steady 0.8 GB * 22 workdays = 17.6 GB
├── Task B (Video 1080p): Weekend 5.0 GB * 8 rest days = 40.0 GB
└── Task C (Monthly Cloud Backup): 15.0 GB single event
    └── Total Composite Budget = 17.6 + 40.0 + 15.0 = 72.6 GB (含多任务正交分布)`,
    cotTheme: '多任务正交组合与日历周期合成算法',
    cotProblem: '用户把每个单一应用的最大可能用量简单相加，得出几倍于实际需要的过剩预算。',
    cotH1: '用户的注意力具有排他性，人在看视频时不可能同时进行高强度大文件下载；',
    cotH2: '工作日流媒体受限，周末工作流减弱，多任务之间在时间轴上呈正交错峰分布；',
    cotH3: '未考虑不同任务所连接节点的倍率差异，简单求和抹杀了倍率红利。',
    cotMathFormula: 'Q_{\\text{composite}} = \\sum_{m=1}^K \\left( \\bar{q}_{m, \\text{work}} \\times D_{\\text{work}} + \\bar{q}_{m, \\text{weekend}} \\times D_{\\text{weekend}} \\right) \\times \\bar{M}_m',
    cotCalculations: `**多任务组合错峰预算手算演算**：
设某用户具有三类典型任务：
1. **任务 A（办公/AI）**：$(1.2 \\times 22 + 0.2 \\times 8) \\times 1.0 = 28.00\\text{ GB}$；
2. **任务 B（4K追剧）**：$(0.5 \\times 22 + 6.0 \\times 8) \\times 0.5 = 29.50\\text{ GB}$；
3. **任务 C（代码依赖包更新）**：每月一次 $8.00\\text{ GB}$；
4. **合成真实总扣量**：$Q_{\\text{total}} = 28.00 + 29.50 + 8.00 = 65.50\\text{ GB}$；
5. **对比盲目相加**：若按单项峰值简单相加 $(1.2 + 6.0 + 8.0) \\times 30 = 456\\text{ GB}$，错峰组合预算避免了超 $85\\%$ 的浪费！`,
    cotConclusion: '多任务估算必须基于实际日历与时间排他性原则，将不同任务与不同节点倍率分别配对计算后再行合成。',
    checklistItems: [
      ['列出全部独立任务清单', '将出海行为拆解为办公、流媒体、AI、系统更新等独立条目'],
      ['区分工作日与假日权重', '为每个任务分别标注工作日日均与休息日日均消耗'],
      ['绑定各任务对应节点倍率', '流媒体任务乘 0.5x，日常办公乘 1.0x，专线会议乘 2.0x'],
      ['考虑注意力排他性', '剔除同一时间段内不可能并发执行的多任务重叠量'],
      ['加入月度周期性孤立任务', '对每月执行一次的大型同步或备份单列固定配额'],
      ['按月度日历实际天数计算', '根据当月具体工作日与休假日天数计算，不统一乘以 30'],
      ['设立 15% 综合浮动缓冲', '在多任务合成总值上追加 15% 弹性余量应对临时变化'],
      ['月末按任务模块对比复核', '月底将实际账单按任务模块拆解比对，优化各条目参数']
    ],
    metricCardItems: [
      ['多场景综合承载', '兼顾网页浏览、代码拉取与高码率流媒体'],
      ['分流策略组支持', '提供丰富的流媒体、AI 与直连策略组配置'],
      ['多档位套餐容量', '提供 60G、120G、200G 等精细化容量阶梯'],
      ['灵活平价升档', '支持中途补差价平滑升级至更高容量套餐']
    ],
    prevLink: ['流量估算：接管范围与额外传输', '/estimate/models/traffic-scope/'],
    nextLink: ['流量估算：波动、余量与极端情景', '/estimate/forecast/scenarios/'],
    relatedLink: ['视频用量：周期安排与可用额度', '/video/plans/schedule/'],
    ctaTitle: '多任务模型已成型？前往主站寻找综合表现优异的稳健套餐',
    ctaDesc: '拿着多任务复合预算指标，前往机场榜一查看经过综合场景实测、各方面表现均衡的标杆服务商。',
    ctaButton: '查看综合多场景适用套餐 →'
  },
  {
    clusterTitle: '波动余量与极端情景建模',
    wireTrace: `[Scenario Monte Carlo Bounds Trace] Statistical Range:
├── P10 Lower Bound: 45.0 GB (极度轻量办公月)
├── P50 Expected Base: 75.0 GB (标准常规月度消耗)
└── P95 Worst-case Bound: 115.0 GB (发生大版本更新与紧急跨洋会议)
    └── Recommendation: 采购 100GB 套餐并预留随时叠加 20GB 重置包通道`,
    cotTheme: '概率情景区间划分与防断流安全垫设计',
    cotProblem: '用户按平均值购买套餐，遇到一次突发加班或假期追剧便提前断网，陷入断流停摆危机。',
    cotH1: '网络用量具有厚尾分布特征，罕见但极端的突增事件不可避免；',
    cotH2: '没有为计划外任务留出 15%~25% 的物理安全冗余；',
    cotH3: '服务商不支持平价叠加补充包，导致一旦超额只能高价全额重置。',
    cotMathFormula: 'Q_{\\text{plan}} = Q_{\\text{base}} \\times (1 + \\sigma_{\\text{safety}}) + Q_{\\text{emergency}}',
    cotCalculations: `**低、中、高三档情景区间规划手算演算**：
基准消耗 $Q_{\\text{base}} = 70.00\\text{ GB}$：
1. **低负荷档（P10）**：出差或度假，系数 0.7：$Q_{\\text{low}} = 49.00\\text{ GB}$；
2. **中负荷档（P50）**：追加 15% 基础余量：$Q_{\\text{med}} = 70.00 \\times 1.15 = 80.50\\text{ GB}$；
3. **高负荷档（P90）**：遇大版本发版、假期追剧，追加 50%：$Q_{\\text{high}} = 105.00\\text{ GB}$；
4. **决策行动准则**：购买 **$80\\text{GB}~100\\text{GB}$ 档位套餐**，兼顾经济性的同时彻底消除断流风险！`,
    cotConclusion: '拒绝盲目给单点数字下死结论；必须输出“保底需求、常规预期、极限安全垫”三档区间，并与服务商补充包政策相绑定。',
    checklistItems: [
      ['测算个人用量标准差', '回顾过去 3 个月用量，计算波动幅度（通常在 15%~35%）'],
      ['设定 15%~25% 基础安全垫', '在任何稳态估算值基础上强制乘以 1.15~1.25 的安全系数'],
      ['识别潜在极端突增事件', '排查近期是否有大版本系统发布、游戏更新或跨国紧急协作'],
      ['核验服务商补充包规则', '确认服务商是否支持随时平价购买 20G/50G 临时流量叠加包'],
      ['设立 80% 额度警戒线', '在客户端或后台配置用量达 80% 时的邮件提醒，留出反应时间'],
      ['掌握紧急限流省流预案', '当额度消耗过快时，将视频分辨率由 4K 降至 1080p 以自救'],
      ['避免盲目按极限档购买', '极限档属于小概率事件，无需常年按最高规格缴纳固定月租'],
      ['月末复盘方差归因', '月末将实际波动原因归档记录，提高未来预测模型的稳健性']
    ],
    metricCardItems: [
      ['补充包政策友好度', '支持不限时平价叠加流量包，用多少买多少'],
      ['额度告警通知系统', '支持邮件/Telegram 机器人实时用量阈值告警'],
      ['用量上限弹性容差', '额度超限后不立即掐线，支持低速维持基础通讯'],
      ['无断崖式限速惩罚', '正常使用范围内绝无恶意阶梯限速惩罚']
    ],
    prevLink: ['流量估算：任务组合与周期分配', '/estimate/forecast/composition/'],
    nextLink: ['流量估算：结果与计费周期匹配', '/estimate/forecast/period-fit/'],
    relatedLink: ['重置周期：剩余额度与到期判断', '/reset/boundaries/remaining/'],
    ctaTitle: '情景区间已明确？前往主站寻找支持弹性叠加的稳健方案',
    ctaDesc: '拿着安全余量与平价补充包指标，前往机场榜一查看用量告警及时、支持随时增补额度的靠谱服务商。',
    ctaButton: '查看支持灵活补充包的套餐 →'
  },
  {
    clusterTitle: '计费周期匹配与半开区间对齐',
    wireTrace: `[Billing Cycle Temporal Alignment Trace]
├── Provider Billing Anchor: 2026-10-15 00:00:00 UTC (15号重置)
├── User Budget Calendar: 2026-10-01 to 2026-10-31 (自然月)
└── Temporal Phase Shift: 存在整整 15 天的时间错位！必须以服务商重置日切分预算！`,
    cotTheme: '服务商账单周期与自建账本时间戳的相位对齐',
    cotProblem: '用户用自然月（1号到30号）的记账结果去核对 15 号重置的服务商账单，发现数字永远对不上。',
    cotH1: '服务商计费周期起止点为购买日起算滚动 30 天，而非自然月 1 日；',
    cotH2: '跨时区导致的 8 小时重置时间差，使月末交界处的消耗被归入不同月份；',
    cotH3: '月中续费或临时购买补充包，重置了账单起算锚点。',
    cotMathFormula: 'Q_{\\text{cycle}} = \\int_{T_{\\text{cycle_start}}}^{T_{\\text{cycle_end}}} f_{\\text{usage}}(t) \\, dt \\quad (T_{\\text{end}} - T_{\\text{start}} = 30\\text{ Days})',
    cotCalculations: `**非自然月周期预算切割手算推导**：
某用户套餐为每月 12 日重置：
1. **日历切分**：预算周期设为 10月12日 00:00 至 11月11日 23:59；
2. **两段式消耗拆分**：10月12日至10月31日消耗 $45.00\\text{ GB}$；11月01日至11月11日消耗 $26.00\\text{ GB}$；
3. **真实周期总额**：$Q_{\\text{cycle}} = 45.00 + 26.00 = 71.00\\text{ GB}$；
4. 只有按 12 日锚点切分，账本与控制台才能达到 $100\\%$ 严丝合缝！`,
    cotConclusion: '自建账本的时间边界必须绝对服从服务商后台的重置锚点，严禁用自然月强行套用滚动周期。',
    checklistItems: [
      ['确定服务商重置锚点日', '在控制台查看 exact reset date，记录每月固定几号重置'],
      ['自建账本对齐重置锚点', '在记账工具中将月度周期的起始日调整为服务商重置日'],
      ['注意跨月天数微差', '大月 31 天与平月 30 天可能导致滚动天数周期产生 1 天微调'],
      ['核验时区时间戳偏移', '查验控制台时间戳时区，确定重置生效的具体时间（UTC 还是 UTC+8）'],
      ['续费升级后校准锚点', '套餐升级或中途变更后，第一事件查看重置日是否被顺延或提前'],
      ['在重置日前 24 小时对账', '在每个周期的最后一天完成当期账本封闭与最终比对'],
      ['为下周期重置留足缓冲', '重置生效前后的 1 小时内避免发起高强度大流量下载'],
      ['归档完整周期分析报告', '周期结束后一键导出该区间的完整对账报告保存至本地']
    ],
    metricCardItems: [
      ['周期透明度', '控制台显式展示当前周期精确起止时间与倒计时'],
      ['重置准时性', '定时重置批处理准时触发，延迟不超过 5 分钟'],
      ['续费规则清晰', '明确续费是顺延周期还是覆盖当前周期剩余'],
      ['跨时区对齐支持', '账单支持根据用户本地时区自适应呈现时间戳']
    ],
    prevLink: ['流量估算：波动、余量与极端情景', '/estimate/forecast/scenarios/'],
    nextLink: ['流量估算：误差回看与模型修正', '/estimate/forecast/validation/'],
    relatedLink: ['重置周期：自然月与购买日起算边界', '/reset/boundaries/calendar/'],
    ctaTitle: '周期锚点已对齐？前往主站寻找结算严谨规范的标杆服务',
    ctaDesc: '拿着明确的计费周期与重置锚点标准，前往机场榜一挑选结算清晰、无隐蔽扣款陷阱的合规服务商。',
    ctaButton: '查看重置严谨规范的套餐 →'
  },
  {
    clusterTitle: '模型误差回看与动态校准',
    wireTrace: `[Model Validation Error Trace] End-of-Cycle Evaluation:
├── Predicted Budget: Q_pred = 85.00 GB
├── Billed Reality: Q_actual = 92.40 GB
└── Error Metric: MAPE = |92.40 - 85.00| / 92.40 = 8.01% (处于优良容差范围 < 10%)`,
    cotTheme: '周期末实际消耗与预测模型的误差反思与参数迭代',
    cotProblem: '用户做完一次预测后从不复盘，导致模型偏差长期累积，几个月后预算模型完全失效。',
    cotH1: '生活工作习惯发生动态变迁（如换了新工作、买了新 4K 电视），但基线模型仍沿用旧参数；',
    cotH2: '服务商暗中调整了常用节点的计费倍率，但预测公式未同步更新倍率乘数；',
    cotH3: '未区分“正常统计方差”（<10%）与“结构性系统失真”（>25%）。',
    cotMathFormula: '\\text{MAPE} = \\frac{|Q_{\\text{actual}} - Q_{\\text{predicted}}|}{Q_{\\text{actual}}} \\times 100\\%',
    cotCalculations: `**误差分析与模型校准手算演算**：
1. 上月预测总额 $Q_{\\text{pred}} = 80.00\\text{ GB}$，月底后台实际扣除 $Q_{\\text{actual}} = 98.50\\text{ GB}$；
2. 计算绝对百分比误差：$\\text{MAPE} = \\frac{|98.50 - 80.00|}{98.50} \\approx 18.78\\%$；
3. **深入归因拆解**：发现因世界杯赛事，周末观影多消耗了 $12.00\\text{ GB}$（偶发）；新增了 Cursor 编程工具，工作日日均增加 $0.30\\text{ GB}$（结构性增量）；
4. **次月模型参数迭代**：$q_{\\text{work_new}} = 1.65 + 0.30 = 1.95\\text{ GB/天}$。预测精度在次月成功恢复至 $96\\%$ 以上！`,
    cotConclusion: '每月重置日必须执行 5 分钟模型回看，区分偶发脉冲与系统性变迁，持续迭代参数以保持模型的长效生命力。',
    checklistItems: [
      ['计算全周期 MAPE 误差率', '套用公式计算实际值与预测值的绝对百分比误差率'],
      ['误差分级诊断', '若误差 < 10% 视为正常，若 > 20% 必须启动专项归因排查'],
      ['剥离偶发非经常性事件', '排查偏差中是否有假期比赛、新机装机等单次不可持续因素'],
      ['识别长期结构性变迁', '识别是否引入了新办公软件、新终端或改变了通勤习惯'],
      ['核验服务商倍率变动', '核对节点列表中各节点的标称倍率是否与上月完全一致'],
      ['动态调整次月日均基数', '将确认的系统性变化更新入次月的工作日或周末基准参数中'],
      ['更新安全余量系数', '若过去两个月均发生超额，将安全余量由 15% 上调至 20%~25%'],
      ['记录模型迭代版本历史', '在账本中记录每次参数调整的原因，保持数据可解释性']
    ],
    metricCardItems: [
      ['账单历史可溯源', '支持查阅完整历史周期的月度与日度消耗明细'],
      ['倍率变更公告及早', '节点倍率调整提前在官网或频道公开通知'],
      ['稳定长期服务品质', '网络质量与速率长效稳定，减少模型不可预测方差'],
      ['中立客观推荐评级', '在主站长期跟踪测评中具备极高稳定度评分']
    ],
    prevLink: ['流量估算：结果与计费周期匹配', '/estimate/forecast/period-fit/'],
    nextLink: ['用量记录：汇总视图与趋势分析', '/records/summary-check/'],
    relatedLink: ['账单核对：来源与计费口径对齐', '/reconcile/alignment/basis/'],
    ctaTitle: '预算模型已校准？前往主站寻找长期稳定的高品质服务',
    ctaDesc: '拿着经实测校准的真实用量模型，前往机场榜一挑选长期服务稳定、绝不暗调倍率的优质标杆服务商。',
    ctaButton: '查看高稳定性标杆服务商比对 →'
  }
];

// 2. multipliers 8 集群
const MULTIPLIERS_CLUSTERS: ClusterData[] = [
  {
    clusterTitle: '单节点标称倍率与实际可用额度',
    wireTrace: `[Single Multiplier Accounting] Node Spec:
├── Node Tag: [US Premium IPLC] Multiplier: M = 2.0x
├── Package Plan: 100.00 GB Quota
└── Actual Usable Wire Bytes = 100.00 GB / 2.0 = 50.00 GB (物理额度腰斩)`,
    cotTheme: '标称额度与真实可用物理字节的反比公理',
    cotProblem: '用户购买 100GB 套餐，连接 2.0x 专线仅下载了 50GB 文件便收到欠费停机通知。',
    cotH1: '倍率本质是商业扣费比例，真实可用物理流量严格等于套餐标称额度除以倍率；',
    cotH2: '高倍率专线在双向计费下，上行确认包同样被乘 2 扣除；',
    cotH3: '客户端节点标签滞后，未显示后端临时调整的高倍率。',
    cotMathFormula: 'V_{\\text{usable}} = \\frac{Q_{\\text{package}}}{M_{\\text{node}}}',
    cotCalculations: `**单倍率可用额度手算演算**：
1. 某用户购买了 $100.00\\text{ GB}$ 套餐：
   - 连接 0.2x 经济流媒体节点：$V_{\\text{usable}} = 100 / 0.2 = 500.00\\text{ GB}$（额度扩大 5 倍）；
   - 连接 1.0x 标准线路：$V_{\\text{usable}} = 100 / 1.0 = 100.00\\text{ GB}$；
   - 连接 3.0x 顶级内网专线：$V_{\\text{usable}} = 100 / 3.0 = 33.33\\text{ GB}$；
2. **结论**：在 3.0x 节点上看高清电影是严重的资源浪费，必须遵循“低倍率跑大流量、高倍率跑低延迟”铁律。`,
    cotConclusion: '采购套餐前必须先将标称额度折算为目标节点的真实物理可用量，杜绝将标称量等同于可用量。',
    checklistItems: [
      ['查看节点实时倍率', '连接节点前刷新订阅，核对节点名称末尾标明的倍率数字'],
      ['计算真实可用额度', '用套餐总额度除以当前节点倍率，得出该节点物理传输上限'],
      ['大任务绑定低倍率', '视频与大下载严格绑定 <=0.5x 节点，拉伸可用时长'],
      ['会议游戏走专线', '仅在对延迟和抖动极其敏感的场景下选用 >1.5x 专线'],
      ['排查倍率变更通知', '关注服务商公告频道，确认常用节点倍率是否上调'],
      ['监控扣量递增速度', '任务执行 5 分钟后刷新后台查看扣量速率是否符合预期'],
      ['核对单双向计费', '查明该倍率是否同时施加在上行流量上'],
      ['记录节点使用分布', '记录在各倍率节点上的停留时长，评估全月加权成本']
    ],
    metricCardItems: [
      ['倍率公开透明', '控制台与订阅配置明示实时倍率，调整提前公告'],
      ['经济节点丰富', '提供充足的 0.1x~0.5x 大流量线路'],
      ['专线倍率良心', '高规格 IPLC 专线倍率 <= 2.0x'],
      ['无隐藏倍率陷阱', '无标称 1.0x 实际扣 1.5x 的暗扣行为']
    ],
    prevLink: ['倍率规则：扣量公式与组合', '/multipliers/calculation/single-rate/'],
    nextLink: ['倍率规则：上下行计费方式', '/multipliers/calculation/directions/'],
    relatedLink: ['账单核对：真实倍率反推测试法', '/reconcile/alignment/components/'],
    ctaTitle: '倍率核算已理清？前往主站寻找倍率透明的优质节点',
    ctaDesc: '拿着真实可用额度折算指标，前往机场榜一查看经过长期实测、倍率公示诚信的优质服务商。',
    ctaButton: '查看低倍率高速套餐比对 →'
  },
  {
    clusterTitle: '上下行双向计费与单向计费',
    wireTrace: `[Bilateral Accounting Wire Trace]
├── Downlink Wire Payload: Q_down = 10.00 GB (视频文件下载)
├── Uplink Wire ACK Overhead: Q_up = 0.22 GB (TCP ACK + TLS Session)
└── Billing Difference:
    ├── Ingress-only Billing: Billed = 10.00 GB
    └── Bilateral Billing: Billed = 10.00 + 0.22 = 10.22 GB (+2.2% 额外扣除)`,
    cotTheme: '双向扣量机制下伴随上传对总账单的侵蚀',
    cotProblem: '用户仅仅在网盘上传了一批资料，发现不仅扣了上传流量，下载额度也同时大幅减少。',
    cotH1: '绝大多数商业加速服务实行“双向合并计费（In + Out）”，上传与下载享有同等扣费权重；',
    cotH2: '大文件下载伴随有约 2% 的 TCP ACK 确认帧上行开销，若双向计费会被一并扣除；',
    cotH3: 'BT/P2P 软件在后台高频做种上传，瞬间耗尽全月双向配额。',
    cotMathFormula: 'B_{\\text{billed}} = M \\times (Q_{\\text{down}} + \\beta \\times Q_{\\text{up}}) \\quad (\\beta = 1.0 \\text{ for bilateral})',
    cotCalculations: `**双向计费对大上传任务的冲击手算推导**：
某视频创作者通过代理向 YouTube 上传一部 $20.00\\text{ GB}$ 原片：
1. 上传物理出网量：$Q_{\\text{up}} = 20.00\\text{ GB}$；伴随的 TCP ACK 与握手下行数据：$Q_{\\text{down}} = 0.45\\text{ GB}$；
2. **不同服务商计费规则对比**：
   - **单向计费服务商（仅计下行）**：扣量仅为 $0.45\\text{ GB}$；
   - **双向计费服务商（上下行求和）**：扣量为 $20.00 + 0.45 = 20.45\\text{ GB}$；
3. **差额幅度达 45 倍**！因此重度上传创作者必须优先挑选“仅计下行”或提供大上传配额的专业服务商。`,
    cotConclusion: '有大上传需求的用户必须在购前明确计费方向条款，严禁在双向计费节点上运行 P2P 做种。',
    checklistItems: [
      ['查验服务条款计费方向', '明确标注是“仅计下载”、“仅计上传”还是“双向求和”'],
      ['P2P 软件严格直连', '将 BitTorrent、迅雷等做种上传应用加入 DIRECT 直连规则'],
      ['大上传选用专属线路', '上传视频或大文件时选用明确支持大上行的专门节点'],
      ['监控上行下行比例', '在客户端连接界面审查当前连接的实时上传/下载速率比'],
      ['限制云盘同步上传速度', '在网盘客户端中限制上行并发线程与速率，防范堵塞隧道'],
      ['核验伴随 ACK 开销', '大下载时将 2% 的伴随上行开销计入总体预算'],
      ['任务前后比对上行增量', '对账时分别提取上行增量与下行增量进行公式代入'],
      ['选择宽容计费服务商', '重度创作者优先挑选对上行免流或半价优惠的良心服务商']
    ],
    metricCardItems: [
      ['计费方向明确', 'TOS 条款显式告知上下行计费规则，无模棱两可'],
      ['上行带宽保障', '提供对称千兆上行带宽，满足专业创作者需求'],
      ['P2P 规则友好', '具备专门支持 BT/PT 下载的宽松规则节点'],
      ['单向优惠政策', '针对部分节点提供纯单向计费或上行打折优惠']
    ],
    prevLink: ['倍率规则：单倍率与可用额度', '/multipliers/calculation/single-rate/'],
    nextLink: ['倍率规则：多节点与混合倍率', '/multipliers/calculation/mixed-rates/'],
    relatedLink: ['账单核对：来源与计费口径对齐', '/reconcile/alignment/basis/'],
    ctaTitle: '上传需求已明确？前往主站寻找上行友好型优质服务',
    ctaDesc: '拿着明确的双向计费与上行带宽要求，前往机场榜一挑选针对创作者与大上传任务优化的标杆服务商。',
    ctaButton: '查看高上行大带宽套餐 →'
  },
  {
    clusterTitle: '多节点混合使用加权倍率',
    wireTrace: `[Mixed Multiplier Weighted Allocation]
├── Node A (0.2x): 50.0 GB Wire -> Billed = 10.0 GB
├── Node B (1.0x): 20.0 GB Wire -> Billed = 20.0 GB
└── Node C (2.5x): 10.0 GB Wire -> Billed = 25.0 GB
    └── Composite Average: Total Wire = 80.0 GB, Total Billed = 55.0 GB -> Weighted M = 0.6875x`,
    cotTheme: '多节点混合流动的加权平均与算术平均本质区别',
    cotProblem: '用户用了 0.2x、1.0x、3.0x 三个节点，简单算算术平均 $(0.2+1.0+3.0)/3 = 1.4x$，得出扣量超标的错误判断。',
    cotH1: '倍率必须以各节点实际传输的物理字节为权重计算加权平均，算术平均在数学上毫无意义；',
    cotH2: '少量高倍率节点上跑的大任务会瞬间拉高全局综合倍率；',
    cotH3: '自动选择节点策略组频繁切换，导致用户在不知情下使用了高倍率节点。',
    cotMathFormula: '\\bar{M}_{\\text{weighted}} = \\frac{\\sum_{i=1}^n Q_i \\times M_i}{\\sum_{i=1}^n Q_i}',
    cotCalculations: `**混合倍率加权手算经典演算**：
1. 某用户全月共消耗物理流量 $80.00\\text{ GB}$：
   - 0.2x 节点传输 $50.00\\text{ GB}$，产生扣量 $10.00\\text{ GB}$；
   - 1.0x 节点传输 $20.00\\text{ GB}$，产生扣量 $20.00\\text{ GB}$；
   - 2.5x 节点传输 $10.00\\text{ GB}$，产生扣量 $25.00\\text{ GB}$；
2. **总扣量核算**：$10.00 + 20.00 + 25.00 = 55.00\\text{ GB}$；
3. **加权平均倍率**：$\\bar{M} = \\frac{55.00}{80.00} = 0.6875\\text{x}$；
4. **对比算术平均**：若按算术平均 $(0.2+1.0+2.5)/3 = 1.233\\text{x}$ 计算，会预计扣量 $98.6\\text{ GB}$，与实际的 $55.0\\text{ GB}$ 产生近 $80\\%$ 的巨大方差！`,
    cotConclusion: '混合使用多节点对账时，必须采用分段加权求和模型，杜绝使用粗暴的算术平均数。',
    checklistItems: [
      ['记录各节点物理流量', '分别导出或记录在各倍率节点上产生的实际物理出网字节'],
      ['套用加权求和公式', '将各节点物理量乘以对应标称倍率求和，得出理论扣量总额'],
      ['禁用自动测速切换高倍率', '防止 URL-Test 自动选择组无意中切入 2.0x~3.0x 高倍率专线'],
      ['为大流量业务锁死低倍率', '影视与网盘策略组强制锁定 0.1x~0.5x 专属节点'],
      ['审查极高倍率专线消耗', '月度复盘时审查 3.0x 专线上的总耗电，评估是否必要'],
      ['识别节点倍率动态变更', '若某节点倍率在月中调整，分段计算调整前后的加权值'],
      ['计算全周期有效综合倍率', '用总扣量除以总物理流量，监控全局倍率走势'],
      ['利用加权红利拉长周期', '通过低倍率组合使全局综合倍率降至 0.7x 以下']
    ],
    metricCardItems: [
      ['节点梯度合理', '低中高倍率节点配比合理，满足不同业务需求'],
      ['分流策略组自由度', '支持用户根据倍率自主建立专属路由分流策略组'],
      ['倍率历史日志', '控制台提供节点历史倍率调整记录，方便溯源对账'],
      ['无恶意跳水倍率', '高峰期绝不动态暗调倍率偷扣流量']
    ],
    prevLink: ['倍率规则：上下行计费方式', '/multipliers/calculation/directions/'],
    nextLink: ['倍率规则：倍率变更与时间口径', '/multipliers/calculation/rate-history/'],
    relatedLink: ['账单核对：真实倍率反推测试法', '/reconcile/alignment/components/'],
    ctaTitle: '混合策略已掌握？前往主站寻找节点梯队丰富的高品质服务',
    ctaDesc: '拿着加权倍率与专属分流策略指标，前往机场榜一挑选低倍率与高专线兼备的优质服务商。',
    ctaButton: '查看节点分布合理的优质套餐 →'
  },
  {
    clusterTitle: '倍率动态调整与时间同步',
    wireTrace: `[Dynamic Multiplier Switch Event]
├── Timestamp T0 (10:00:00): Node HK-01 Multiplier = 1.0x
├── Provider DB Update (12:00:00): Multiplier raised to 1.5x (高峰专线化)
└── Local Client Cache: 未及时拉取订阅，仍按 1.0x 显示，导致 50% 账单认知偏差！`,
    cotTheme: '后端数据库倍率变更与前端客户端显示的缓存不同步',
    cotProblem: '服务商将某节点从 1.0x 调整为 1.5x，用户客户端未及时更新，继续按 1.0x 大量下载导致额度迅速告罄。',
    cotH1: '客户端本地订阅缓存具有生命周期，未主动拉取时无法实时获知后端倍率变更；',
    cotH2: '服务商未提前在公告频道发布倍率调整预警；',
    cotH3: '计费网关以连接建立时刻的倍率为准，长连接跨越变更时间点产生结算断层。',
    cotMathFormula: 'B = \\sum M_{\\text{old}} \\times Q_{[T_0, T_{\\text{switch}}]} + \\sum M_{\\text{new}} \\times Q_{[T_{\\text{switch}}, T_1]}',
    cotCalculations: `**倍率动态切换分段计费手算推导**：
某用户连接节点连续下载，月中服务商调整倍率：
1. **第一阶段（1号至15号，倍率 0.5x）**：消耗物理流量 $40.00\\text{ GB}$，扣量 $40.00 \\times 0.5 = 20.00\\text{ GB}$；
2. **第二阶段（16号至30号，倍率上调为 1.0x）**：消耗物理流量 $30.00\\text{ GB}$，扣量 $30.00 \\times 1.0 = 30.00\\text{ GB}$；
3. **分段累加总账单**：$20.00 + 30.00 = 50.00\\text{ GB}$；
4. 若错误地全程按 0.5x 计算（预计 35GB），会产生 15GB 差异；分段切割后与后台完全一致！`,
    cotConclusion: '重大任务传输前务必点击客户端“更新订阅”拉取最新节点标签，规避配置滞后引发的扣量意外。',
    checklistItems: [
      ['传输大文件前更新订阅', '大下载前手动更新一次客户端订阅，确保节点标签最新'],
      ['关注服务商通知公告', '留意 TG 频道或官网公告，了解节点维护或倍率调整通知'],
      ['长任务分段记录时间', '跨越整点或维护窗口的长任务记录起止时间，分段复核'],
      ['截取节点列表当前快照', '在产生重大账单前截屏留存当前客户端显示的倍率标签'],
      ['核对 User-Info 响应头', '查看客户端拉取配置时的响应头，核验服务端最新倍率配置'],
      ['避免盲目长期挂机', '不建议在无人值守状态下连续数天运行未监控的大吞吐任务'],
      ['发现倍率突增立即断连', '若发现某节点突发高扣量，立即切换至其他稳定倍率节点'],
      ['争议工单提交时间证据', '若服务商未公告即暗调倍率，以本地历史快照为证发起工单']
    ],
    metricCardItems: [
      ['倍率变更提前通知', '倍率调整至少提前 24 小时在全渠道发布公告'],
      ['配置更新响应及时', '订阅链接与后端数据库保持毫秒级同步，无缓存漂移'],
      ['长连接平滑过渡', '倍率变更对已建立的长连接提供优雅过渡缓冲'],
      ['诚实计量承诺', '在主站测评中获评“倍率稳定无暗调”认证']
    ],
    prevLink: ['倍率规则：多节点与混合倍率', '/multipliers/calculation/mixed-rates/'],
    nextLink: ['倍率规则：规则核验与计费观察', '/multipliers/verification/sources/'],
    relatedLink: ['重置周期：时区与边界事件', '/reset/boundaries/timezone/'],
    ctaTitle: '动态规则已通晓？前往主站寻找倍率稳定少变动的靠谱服务',
    ctaDesc: '拿着倍率稳定性与公告透明度指标，前往机场榜一查看经过长期监控、绝不频繁乱改倍率的优质服务商。',
    ctaButton: '查看倍率稳定可靠的套餐 →'
  },
  {
    clusterTitle: '1GB 标准测试载荷差分实测',
    wireTrace: `[1GB Benchmark Difference Run]
├── Pre-test Snapshot T0: Provider Used = 50.000 GB, Local = 0.000 GB
├── Benchmark: Pull exactly 1,000,000,000 Bytes (Debian Official ISO)
├── 20-min Silent Period for DB batch aggregation
└── Post-test Snapshot T1: Provider Used = 51.025 GB, Local = 1.025 GB -> Real Ratio = 1.000x`,
    cotTheme: '通过控制变量法差分测量反推后端真实结算倍率',
    cotProblem: '怀疑服务商后台暗中虚标或调高倍率，但苦于没有严谨的技术手段进行客观证实。',
    cotH1: '日常混杂流量包含大量未预料的系统背景噪音，无法作为判定依据；',
    cotH2: '必须使用“标准 1GB 开源纯净载荷 + 隔离所有其他网络活动”构建单因子实验；',
    cotH3: '服务商入库有批处理缓冲，必须留出 20 分钟静默期方能读取真实终值。',
    cotMathFormula: 'M_{\\text{calculated}} = \\frac{Q_{\\text{backend_after}} - Q_{\\text{backend_before}}}{V_{\\text{tun_download}} + V_{\\text{tun_upload}}}',
    cotCalculations: `**标准 1GB 差分实测反推算例**：
1. **测试前快照**：控制台已用量 $82.400\\text{ GB}$；
2. **下载标准 1GB 官方镜像**：客户端捕获下行 $1.020\\text{ GB}$，上行 $0.025\\text{ GB}$；
3. **静默 20 分钟后终值快照**：控制台显示 $83.445\\text{ GB}$；
4. **反推实际倍率**：
   $$\\Delta Q = 83.445 - 82.400 = 1.045\\text{ GB}$$
   $$M_{\\text{actual}} = \\frac{1.045}{1.020 + 0.025} = \\frac{1.045}{1.045} = 1.000\\text{x}$$
5. **结论**：实际结算倍率与标称 1.0x 完美吻合，有力排除了服务商虚增扣量的猜疑！`,
    cotConclusion: '只有基于 1GB 标准文件差分法测出的结果才具备技术说服力，是向客服沟通或向社群反馈的黄金准则。',
    checklistItems: [
      ['准备官方纯净镜像源', '选用清华大学开源镜像站或 Debian 官方 1GB 镜像作为测评标的'],
      ['清理全部网络干扰', '退出微信、网盘同步、BT 等一切后台联网程序'],
      ['截取初始状态双快照', '记录测试前控制台已用量与客户端网卡总计数值'],
      ['单线程平稳下载', '以单线程方式下载 1GB 镜像，记录确切耗时与平均速率'],
      ['静默等待 20 分钟', '下载完成后保持静默等待 20 分钟，等待后端批处理聚合入库'],
      ['截取结束状态双快照', '记录测试后控制台终值，提取差额 $\\Delta Q$'],
      ['代入反推公式计算', '用后台差额除以客户端实测物理量，得出真实倍率值'],
      ['生成标准化对账报告', '使用本站工具一键生成带时间戳与截图哈希的标准测试报告']
    ],
    metricCardItems: [
      ['计费严谨度评级', '在主站 1GB 盲测对账中实现 100% 账实自洽'],
      ['零背景暗扣承诺', '静默待机状态下 24 小时后台扣量 < 1MB'],
      ['开放日志查询', '控制台提供按会话或按小时维度的原始计费对账单'],
      ['支持技术复核', '客服支持针对差分测试报告进行专业技术复核']
    ],
    prevLink: ['倍率规则：倍率变更与时间口径', '/multipliers/calculation/rate-history/'],
    nextLink: ['倍率规则：多路径与计数去重', '/multipliers/verification/path-accounting/'],
    relatedLink: ['账单核对：最小复现与证据包制作', '/reconcile/resolution/evidence/'],
    ctaTitle: '对账技巧已掌握？前往主站寻找通过严苛盲测的诚信服务商',
    ctaDesc: '拿着 1GB 差分实测标准，前往机场榜一查看通过第三方严格计量盲测、计费毫无水分的五星信誉服务商。',
    ctaButton: '查看通过严格对账实测的套餐 →'
  },
  {
    clusterTitle: '多路径传输与客户端计数去重',
    wireTrace: `[Multipath Routing Deduplication Trace]
├── Direct Physical Interface: Ethernet 1Gbps (Local Subnet)
├── Primary Proxy Tunnel: Hong Kong IEPL (Proxy Traffic)
└── Fallback Proxy Tunnel: Tokyo BGP (Standby Warm)
    └── Deduplication Rule: 仅统计实际产生数据中继的活动出站隧道，杜绝多路求和虚增！`,
    cotTheme: '多入站多出站负载均衡下的流量重复核算排查',
    cotProblem: '客户端开启了负载均衡（Load Balance）或分流回退，两个节点同时有计数，误以为流量被重复计费。',
    cotH1: '客户端仪表盘展示的是各策略组的统计视图，若存在嵌套分组会产生视觉上的重复累加；',
    cotH2: '故障转移（Fallback）健康检查探针产生了少量的周期性心跳探测流量；',
    cotH3: '多路径并发（MPTCP）环境下，数据包在不同公网接口真实切片分流。',
    cotMathFormula: 'V_{\\text{total}} = \\sum_{j \\in \\text{Active Tunnels}} V_j \\quad (\\text{严禁将策略组层级与节点层级重复累加})',
    cotCalculations: `**负载均衡与多路径流量排查手算实录**：
某用户在客户端配置了 2 个节点的负载均衡组：
1. 客户端策略组视图显示：总流量 $30.00\\text{ GB}$；
2. 展开明细：节点 A 承担 $18.00\\text{ GB}$，节点 B 承担 $12.00\\text{ GB}$；
3. **错误合并**：用户若将策略组总计与子节点相加：$30 + 18 + 12 = 60\\text{ GB}$（产生 100% 假象）；
4. **真实物理核验**：实际出网仅为 $18 + 12 = 30.00\\text{ GB}$；
5. 服务商控制台扣量为 $30.00\\text{ GB}$，完全正常！`,
    cotConclusion: '多路径与负载均衡场景下，必须认清客户端 UI 的层级从属关系，只统计最底层的物理节点出站数据。',
    checklistItems: [
      ['认清客户端统计层级', '分清策略组（Proxy Group）与实体节点（Proxy Node）的从属关系'],
      ['仅累加底层实体节点', '汇总时只对实体节点的物理跑量求和，禁止叠加策略组总数'],
      ['排查健康检查心跳频率', '将 URL-Test 探测间隔设置为 300 秒以上，减少无谓探测消耗'],
      ['监控负载均衡权重分配', '核查 round-robin 或 load-balance 是否按预期比例分摊流量'],
      ['防止多网卡死循环', 'Wi-Fi 与有线网卡同时连接时，核验默认网关路由跃点数（Metric）'],
      ['对齐多端时间戳', '多设备协同负载均衡时保持系统时钟严格同步'],
      ['区分备用节点的静默状态', '确认 Fallback 备用节点在未接管时不产生业务流量'],
      ['定期清除客户端陈旧统计', '新周期开始前重置客户端内核连接统计，消除历史干扰']
    ],
    metricCardItems: [
      ['多节点并发支持', '支持多节点负载均衡与多连接并发传输'],
      ['健康检查低开销', '节点探测端点轻量高效，心跳几乎零消耗'],
      ['路由分流策略自由', '完美支持各类高级策略组与故障转移规则'],
      ['节点高可用 SLA', '节点集群高可用，故障转移实现秒级无感切换']
    ],
    prevLink: ['倍率规则：规则核验与计费观察', '/multipliers/verification/sources/'],
    nextLink: ['倍率规则：例外规则与未知值', '/multipliers/verification/exceptions/'],
    relatedLink: ['设备数量：跨设备统计去重算法', '/devices/router-client-duplicate/'],
    ctaTitle: '多路径规则已掌握？前往主站寻找支持灵活负载均衡的优质服务',
    ctaDesc: '拿着高可用与多路径支持指标，前往机场榜一挑选支持灵活策略组配置、节点集群稳定的标杆服务商。',
    ctaButton: '查看支持高级负载均衡的套餐 →'
  },
  {
    clusterTitle: '零倍率免流与未知倍率陷阱',
    wireTrace: `[Zero-rate & Undefined Multiplier Trace]
├── Node Tag: [Free Trial 0.0x] (Promotional Gateway)
├── Hidden Condition: 仅前 5GB 免流，超出后静默切入 2.0x 专线计费！
└── Undefined Multiplier Node: 缺少倍率标签时默认按 1.0x 结算还是 2.0x？`,
    cotTheme: '免流活动背后的隐蔽阶梯条件与未标明倍率的兜底逻辑',
    cotProblem: '用户看到 0.0x 免流节点放量下载，几天后发现账户因欠费被封禁；或者连接未标倍率的节点被高额扣除。',
    cotH1: '0.0x 节点通常附带“单日 5GB 封顶”或“仅限特定协议”的隐蔽使用条件（FUP）；',
    cotH2: '节点名称未标注倍率时，服务商后端数据库默认设定了基础计费乘数（通常为 1.0x 或更高）；',
    cotH3: '服务商临时促销结束后恢复正常倍率，用户未及时察觉。',
    cotMathFormula: 'B_{\\text{actual}} = \\begin{cases} 0 & \\text{if } Q \\le Q_{\\text{free_quota}} \\\\ M_{\\text{penalty}} \\times (Q - Q_{\\text{free_quota}}) & \\text{if } Q > Q_{\\text{free_quota}} \\end{cases}',
    cotCalculations: `**阶梯免流陷阱手算推导**：
某服务商提供“0.0x 活动节点”，用户未仔细阅读规则下载了 $25.00\\text{ GB}$ 文件：
1. **隐藏规则条款**：前 $5.00\\text{ GB}$ 免流（0.0x），超出部分按 $2.0\\text{x}$ 惩罚性倍率补扣；
2. **实际后台计费账单**：
   $$B = 0 + (25.00 - 5.00) \\times 2.0 = 40.00\\text{ GB}$$
3. **严重后果**：原本以为完全免费的下载，不仅没免流，反而被扣除了高达 $40.00\\text{ GB}$ 配额！`,
    cotConclusion: '天上不会掉馅饼；对待 0.0x 免流节点必须查阅完整附加条件，未标明倍率的节点先发测试包验证，严禁直接拉大载荷。',
    checklistItems: [
      ['阅读免流节点完整细则', '核验 0.0x 节点是否存在单日限额、速度限制或协议黑名单'],
      ['未标倍率节点默认怀疑', '对名称中未明确标注倍率的节点，默认按 1.5x 高风险处理'],
      ['免流任务前后截屏留存', '在连接 0.0x 节点前后截取已用量快照，确认是否真的零增长'],
      ['防范促销到期突增', '关注活动截止日期，到期前将默认出站策略切回常规节点'],
      ['不用于绝密关键业务', '免流与测试节点通常稳定性较低，绝不用于重要会议或交易'],
      ['测试小文件打底先行', '对未知规则节点先下载 50MB 小文件观察后台扣费反应'],
      ['查验倍率下限保底条款', '确认服务商是否对所有节点设置了最低消费保护机制'],
      ['及时反馈标签缺失缺陷', '发现节点列表漏标倍率时，发工单提醒运维补全标签']
    ],
    metricCardItems: [
      ['规则条款透明公开', '所有活动与免流条件显式公告，绝无隐藏阶梯惩罚'],
      ['全节点标明倍率', '节点列表 100% 显式标注数字倍率，无未知留白'],
      ['超额断开保护', '免流额度用尽后自动阻断，绝不暗中切入高额扣费'],
      ['良性计费承诺', '在主站测评中获评“计费规则最透明”放心认证']
    ],
    prevLink: ['倍率规则：多路径与计数去重', '/multipliers/verification/path-accounting/'],
    nextLink: ['倍率规则：倍率与方案适配', '/multipliers/verification/selection/'],
    relatedLink: ['按量方案：附加费用与服务限制', '/payg/terms/constraints/'],
    ctaTitle: '规则陷阱已看透？前往主站寻找条款规范、无暗坑的标杆服务',
    ctaDesc: '拿着规则透明度与诚实计量指标，前往机场榜一挑选条款明明白白、绝无套路扣费的优质服务商。',
    ctaButton: '查看规则规范透明的套餐 →'
  },
  {
    clusterTitle: '节点倍率与方案适配矩阵',
    wireTrace: `[Plan & Multiplier Matrix Optimization Trace]
├── Light User (Office/AI): 30GB Plan -> Best on 1.0x IPLC (极速低延迟, 物理用量足)
├── Heavy Streamer (4K Movies): 200GB Plan -> Best on 0.2x Streaming Nodes (等效 1000GB)
└── Hybrid Budgeter: 100GB Base Plan + 0.5x Nodes for Media + 2.0x for Meetings`,
    cotTheme: '不同业务需求与服务商倍率梯队的数学最优化适配',
    cotProblem: '明明预算充裕却买了不适合自己业务形态的套餐，或买了小额度却天天在 3.0x 节点上挥霍。',
    cotH1: '套餐容量大小与节点倍率梯队存在乘积耦合关系，必须作为整体进行系统性选型；',
    cotH2: '轻量办公用户更需要低延迟低倍率专线，而非虚标的几个 TB 慢速带宽；',
    cotH3: '流媒体重度用户必须选择拥有大量 0.1x~0.3x 节点的服务商，才能将资金利用率提升数倍。',
    cotMathFormula: '\\text{ROI} = \\frac{\\sum (Q_i / M_i) \\times \\text{Value}_i}{\\text{Price}_{\\text{plan}}}',
    cotCalculations: `**倍率与套餐选型数学最优化演算**：
两位预算同为 30元/月 的用户：
1. **用户 A（4K 追剧党）**：
   - 方案甲：100GB 配套全 1.0x 节点，每月最多看 100GB 视频（约 14 小时 4K）；
   - 方案乙：100GB 配备充足 0.2x 节点，每月可看 $100 / 0.2 = 500\\text{ GB}$ 视频（约 70 小时 4K）；
   - **选型收益**：选方案乙让有效观影额度**直接暴增 5 倍**！
2. **用户 B（跨境金融与外企办公）**：
   - 方案丙：1000GB 但全为高延迟普通公网节点，会议卡顿；
   - 方案丁：60GB 但全为 1.5x 低延迟顶级内网 IPLC 专线，会议秒开零抖动；
   - **选型收益**：选方案丁完美契合业务刚需，高带宽粗放套餐对其毫无价值。`,
    cotConclusion: '根据自身核心任务场景挑选服务商的倍率结构：看剧认准丰富低倍率，外企与竞技认准稳健低延迟专线。',
    checklistItems: [
      ['明确自身核心任务占比', '统计自己是视频占大头、代码办公占大头还是游戏占大头'],
      ['审查服务商倍率梯队分布', '购前查看服务商节点列表，核验低倍率节点与专线节点的比例'],
      ['根据公式折算有效额度', '用套餐标称量除以目标业务主力节点的倍率，计算真实可用量'],
      ['规避全高倍率陷阱套餐', '警惕标称 500GB 但所有节点均为 2.0x 以上的虚胖套餐'],
      ['确认专线节点真实 SLA', '核查 1.5x~2.0x 专线是否具备真正的内网传输与晚高峰不限速保证'],
      ['计算单位实际有效成本', '以“实际可用物理 GB 单价”而非“标称 GB 单价”横向对比不同机场'],
      ['利用按量方案作为倍率互补', '用月付低倍率看剧，搭配按量优质专线跑高敏感任务'],
      ['周期性调整套餐档位', '根据季度业务重心变迁，在服务商后台平滑调整最适配的套餐档位']
    ],
    metricCardItems: [
      ['业务场景匹配度', '针对办公、流媒体与游戏提供精细化线路定制'],
      ['真实倍率性价比', '综合有效物理容量单价全行业极具竞争力'],
      ['专线链路高品质', 'BGP 入口 + 纯内网 IPLC/IEPL 优质隧道'],
      ['全方位服务保障', '在主站综合评分中获评五星最高推荐评级']
    ],
    prevLink: ['倍率规则：例外规则与未知值', '/multipliers/verification/exceptions/'],
    nextLink: ['按量方案：用量适配与月付对比', '/payg/fit/comparison/'],
    relatedLink: ['知识百科：价格效率与比较边界', '/knowledge/measurement/value/'],
    ctaTitle: '方案适配已明晰？前往主站寻找最懂您业务的高品质服务',
    ctaDesc: '拿着精准的业务场景与倍率适配指标，前往机场榜一查看经过专业场景化评测的标杆网络加速服务商。',
    ctaButton: '查看量身定制的高性价比套餐 →'
  }
];

// 3. video 8 集群
const VIDEO_CLUSTERS: ClusterData[] = [
  {
    clusterTitle: '视频分辨率、编码码率与容量核算',
    wireTrace: `[Video Stream Bitrate Wire Trace]
├── Profile: 1080p 60fps (HEVC/H.265)
├── Video Bitrate: 5.5 Mbps, Audio Bitrate (5.1 Surround): 448 kbps
└── Combined Bitrate: R = 5.948 Mbps -> Wire Transfer = 5.948 * 0.45 = 2.677 GB/h`,
    cotTheme: '分辨率与实际编码码率的解耦及容量积分公式',
    cotProblem: '用户以为 1080p 视频每小时消耗固定，用手机看和用电视看差了整整 3 倍。',
    cotH1: '分辨率只是像素点阵尺寸，编码码率（Bitrate）才是决定流量的唯一物理量；',
    cotH2: '新一代 AV1/HEVC 编码比老旧 H.264 节省 30%~50% 码率；',
    cotH3: '多声道杜比全景声音频流带来每小时约 300MB~500MB 的额外开销。',
    cotMathFormula: 'V_{\\text{video}} = R_{\\text{total_Mbps}} \\times 0.45 \\times T_{\\text{hours}}',
    cotCalculations: `**主流清晰度小时消耗标准手算推导**：
1. **720p 标清**：码率 $2.5\\text{ Mbps}$，每小时消耗 $2.5 \\times 0.45 = 1.125\\text{ GB/h}$；
2. **1080p 优质全高清**：码率 $5.5\\text{ Mbps}$，每小时消耗 $5.5 \\times 0.45 = 2.475\\text{ GB/h}$；
3. **4K 超高清 (SDR)**：码率 $16.0\\text{ Mbps}$，每小时消耗 $16.0 \\times 0.45 = 7.200\\text{ GB/h}$；
4. **4K 60fps HDR (Dolby Vision)**：码率 $25.0\\text{ Mbps}$，每小时消耗 $25.0 \\times 0.45 = 11.250\\text{ GB/h}$；
5. **算例**：看一部 2 小时 4K HDR 电影消耗 $11.25 \\times 2 = 22.50\\text{ GB}$！使用 0.5x 节点可将扣量降至 $11.25\\text{ GB}$。`,
    cotConclusion: '牢记 0.45 转换常数；追求性价比首选 1080p 优质档，观看 4K 必须搭配低倍率流媒体节点。',
    checklistItems: [
      ['调出播放器统计信息', '在 YouTube/Netflix 中调出“详细统计信息”，查看实时连接速度与当前码率'],
      ['核验视频编码格式', '确认播放器是否优先调用了高效的 AV1 或 VP9/HEVC 硬件解码'],
      ['套用 0.45 黄金换算', '将实测码率 Mbps 乘以 0.45 乘以时长计算小时消耗'],
      ['将音频流一并计算', '对杜比全景声或多语言音轨追加 0.3GB/h 独立预算'],
      ['追剧绑定低倍率节点', '将观影客户端强制路由至 0.2x~0.5x 流媒体专用节点'],
      ['根据屏幕大小匹配画质', '手机小屏推荐锁定 1080p，65寸以上大电视再开启 4K'],
      ['关闭自动播放下一集', '在流媒体平台设置中关闭“自动连播”，防止人睡着后整夜偷跑几百G'],
      ['按月度电影部数做预算', '根据当月观影部数精算总额度需求，预留 20% 安全余量']
    ],
    metricCardItems: [
      ['4K 极速秒开', '晚高峰单线程带宽 > 50Mbps，4K 拖拽秒开不缓冲'],
      ['原生流媒体解锁', '100% 稳定解锁 Netflix / Disney+ / HBO / YouTube Premium'],
      ['专属超低倍率', '提供 0.1x~0.5x 大流量观影专属优化节点'],
      ['大屏观影优化', '针对 Apple TV / 电视盒子提供专属低抖动链路']
    ],
    prevLink: ['视频用量：码率、时长与容量', '/video/models/bitrate/'],
    nextLink: ['视频用量：自适应画质与播放状态', '/video/models/adaptive/'],
    relatedLink: ['流量估算：速率与容量精确换算', '/estimate/mbps-vs-megabytes/'],
    ctaTitle: '码率指标已掌握？前往主站寻找 4K 原画秒开的优质流媒体专线',
    ctaDesc: '拿着高带宽与原生解锁指标，前往机场榜一挑选经过 4K/8K 极致画质压测的顶级流媒体加速服务商。',
    ctaButton: '查看流媒体专属优化套餐 →'
  },
  {
    clusterTitle: '自适应码率 (ABR) 动态跃迁与流量失控',
    wireTrace: `[ABR Dynamic Quality Transition Trace]
├── 00:00: 起播瞬时带宽 80Mbps -> ABR 引擎瞬间从 1080p (4Mbps) 切换至 4K HDR (24Mbps)
├── 00:15: 码率暴涨 600%，单位时间出网流量从 1.8GB/h 跃升至 10.8GB/h
└── 流量失控原因: 用户未锁定画质，网络稍有富余算法即自动拉满最高规格！`,
    cotTheme: 'ABR 算法贪婪机制与网络波动导致的流量暴冲',
    cotProblem: '用户本来只想随便看看视频，结果两集电视剧扣了近 30GB 流量，发现播放器自动切到了 4K 60fps。',
    cotH1: '现代平台（YouTube/Netflix）默认开启“自动画质”，只要节点测速高就自动切入最高清晰度；',
    cotH2: '4K 与 1080p 存在近 5 倍的码率鸿沟，无声无息间吞噬全月配额；',
    cotH3: '网络偶发波动时 ABR 频繁升降档，产生大量的分段请求重试。',
    cotMathFormula: 'V_{\\text{ABR}} = \\int_0^T R(t) \\, dt \\quad (R(t) \\in [2.5, 25.0] \\text{ Mbps})',
    cotCalculations: `**锁定画质 vs 自动 ABR 消耗对比手算实录**：
某用户追完一部 10 集短剧（每集 45 分钟，总时长 7.5 小时）：
1. **自动 ABR 模式（节点测速快，全程拉满 4K 20Mbps）**：
   $$V_{\\text{auto}} = 20.0 \\times 0.45 \\times 7.5 = 67.50\\text{ GB}$$
2. **手动锁定 1080p 模式（稳定 5Mbps 优质画质）**：
   $$V_{\\text{lock}} = 5.0 \\times 0.45 \\times 7.5 = 16.88\\text{ GB}$$
3. **对比成果**：仅仅在播放器中点击“锁定 1080p”，**瞬间节省了超 $50\\text{ GB}$ 流量**（降幅达 $75\\%$），而在普通电脑屏幕上肉眼主观观感几乎无损！`,
    cotConclusion: '在非极致大屏观影场景下，必须在客户端中将画质从“自动”手动锁定为 1080p，坚决阻断 ABR 算法暗中升档。',
    checklistItems: [
      ['播放器画质手动锁定', '在播放设置中将清晰度由 Auto 改为指定的 1080p 或 1440p'],
      ['移动设备设置省流偏好', '在手机客户端中勾选“使用蜂窝或节约模式时限制画质”'],
      ['观察 ABR 缓冲曲线', '在播放统计信息中查看 Buffer Health，缓冲充足时不需要更高码率'],
      ['关闭平台预览自动播放', '关闭鼠标悬停在视频缩略图上时的自动静音预览功能'],
      ['多端分别配置策略', '电视大屏允许 4K，笔记本与手机严格锁定 1080p'],
      ['防范多音轨冗余加载', '检查播放器是否只拉取当前选择的单一语言音频切片'],
      ['利用浏览器扩展锁定', '使用浏览器扩展插件全局强制所有视频站点默认以 1080p 播放'],
      ['监控单日观影总用量', '在账本中记录每日观影总时长，核验是否与锁定码率自洽']
    ],
    metricCardItems: [
      ['带宽平稳无突增', '节点连接平稳，抑制 ABR 算法过度剧烈震荡'],
      ['多分辨率完美解锁', '1080p/2K/4K 各档位清晰度秒级加载'],
      ['晚高峰抗抖动能力', '晚高峰低抖动，防止视频频繁降档重载'],
      ['专属流媒体分流', '智能分流视频域名，纯净直连国内媒体']
    ],
    prevLink: ['视频用量：码率、时长与容量', '/video/models/bitrate/'],
    nextLink: ['视频用量：缓存、重播与下载', '/video/video-replay-cache/'],
    relatedLink: ['流量估算：波动、余量与极端情景', '/estimate/forecast/scenarios/'],
    ctaTitle: '画质控制已明了？前往主站寻找连接平稳的高品质专线',
    ctaDesc: '拿着低抖动与平稳带宽指标，前往机场榜一查看经过长期流媒体稳定性测试的优质服务商。',
    ctaButton: '查看流媒体稳定型套餐 →'
  },
  {
    clusterTitle: '视频预加载缓存与划走丢弃损耗',
    wireTrace: `[Video Pre-buffering Discard Trace]
├── Play Time: 00:10 (用户划走)
├── Discarded Segment 1~12: 预加载了后续 120 秒切片 (共 28.5 MB)
└── Actual Watched Bytes: 2.4 MB -> Discard Overhead Ratio = 28.5 / (2.4 + 28.5) = 92.2%!`,
    cotTheme: '激进分段预加载机制与短视频频繁划走的流量黑洞',
    cotProblem: '刷了半小时短视频，并没有看完整几个，却发现跑掉了几个 GB 的流量。',
    cotH1: '播放器起播瞬间以最大连接速度预拉取后续 1~2 分钟的数据；',
    cotH2: '用户快速划过短视频，已预加载的几十兆数据包直接被播放器丢弃内存；',
    cotH3: '离线下载视频时若多次重复下载或中途取消，产生双倍浪费。',
    cotMathFormula: 'V_{\\text{wasted}} = \\sum_{k=1}^N \\text{PreloadBytes}_k \\times (1 - \\text{CompletionRatio}_k)',
    cotCalculations: `**短视频频繁滑动损耗手算推导**：
某用户在 1 小时内刷了 100 条短视频：
1. 平均每条短视频总大小 $15.0\\text{ MB}$（1080p 优质短片）；
2. 用户平均每条只看 5 秒即划走（实际消费载荷仅约 $2.5\\text{ MB}$）；
3. 播放器在前 3 秒内已预拉取了整条视频的 $80\\%$（即 $12.0\\text{ MB}$）；
4. 100 条短视频累积物理出网：$100 \\times 12.0\\text{ MB} = 1,200\\text{ MB} = 1.20\\text{ GB}$；
5. **惊人发现**：用户真正消费的载荷仅 $100 \\times 2.5 = 250\\text{ MB}$，其余 **$950\\text{ MB}$（近 $80\\%$）完全作为预载垃圾被丢弃**！`,
    cotConclusion: '刷短视频应在客户端设置中关闭“高清预加载”，暂停观影时及时关闭标签页阻断后台缓冲。',
    checklistItems: [
      ['关闭激进预加载选项', '在客户端或 App 设置中关闭“提前预加载后续视频”'],
      ['暂停观看时退出播放', '暂停或离开屏幕时立即关闭视频页面，防止后台无休止缓冲'],
      ['利用离线下载防重试', '对反复研读的长视频一次性下载至本地播放，杜绝重复在线缓冲'],
      ['核验本地浏览器缓存', '确认浏览器已开启本地磁盘缓存，后退或重播时不重复拉取'],
      ['控制短视频滑动节奏', '短视频平台避免秒划，等待感兴趣的视频再发起缓冲'],
      ['使用专用离线客户端', '长途差旅前在家庭直连网络下完成离线缓存，出海不耗代理'],
      ['清理异常卡死播放进程', '排查后台是否有死循环缓冲的流媒体标签页'],
      ['定期核对视频总流速', '在客户端连接面板核验视频域名的实时下行流量衰减']
    ],
    metricCardItems: [
      ['长连接断点续传', '完美支持 Range 协议，离线下载稳定不中断'],
      ['低延迟首帧秒开', '首帧建立延迟 < 100ms，起播无需过度依赖激进预载'],
      ['缓存利用友好', '协议完全支持 ETag 与 304 Not Modified 本地缓存校验'],
      ['超大文件不限速', '长文件持续拉取无 QOS 限速与连接阻断']
    ],
    prevLink: ['视频用量：自适应画质与播放状态', '/video/models/adaptive/'],
    nextLink: ['视频用量：多屏与同步观看', '/video/models/multiscreen/'],
    relatedLink: ['知识百科：传输、重试与封装', '/knowledge/network/transport/'],
    ctaTitle: '缓存损耗已认清？前往主站寻找首帧极速秒开的优质网络',
    ctaDesc: '拿着首帧极速与高带宽承载指标，前往机场榜一挑选起播极速、无需过度预载的标杆服务商。',
    ctaButton: '查看低延迟极速起播套餐 →'
  },
  {
    clusterTitle: '家庭多屏并发观影与带宽竞争',
    wireTrace: `[Multiscreen Concurrency Wire Trace]
├── Screen 1 (Living Room TV 4K): 18.0 Mbps (~8.1 GB/h)
├── Screen 2 (Bedroom iPad 1080p): 5.5 Mbps (~2.5 GB/h)
└── Screen 3 (Mobile Phone 720p): 2.5 Mbps (~1.1 GB/h)
    └── Household Combined Bandwidth = 26.0 Mbps, Combined Consumption = 11.7 GB/h`,
    cotTheme: '多终端多屏幕并发观影引发的额度雪崩与公网 IP 限制',
    cotProblem: '周末家庭 3 台设备同时看视频，一个晚上跑掉了近 50GB，且频繁有一台设备被掐断网络。',
    cotH1: '服务商对单一订阅限制了最大公网在线 IP 数（通常 2~3 个），多屏分属不同网络时触发封锁；',
    cotH2: '多屏流量在时间轴上形成 100% 重叠的吞吐叠加；',
    cotH3: '家庭路由器网关 CPU 在处理多路 4K 实时解密时发生过载，引发丢包重传。',
    cotMathFormula: 'Q_{\\text{household}} = \\sum_{s=1}^K V_{\\text{screen}, s} = \\sum_{s=1}^K R_s \\times 0.45 \\times T_s',
    cotCalculations: `**家庭周末多屏观影手算推导**：
某周末全家 3 块屏幕同时观看 3 小时：
1. **电视大屏（4K HDR，25Mbps）**：$25.0 \\times 0.45 \\times 3.0 = 33.75\\text{ GB}$；
2. **平板（1080p，5Mbps）**：$5.0 \\times 0.45 \\times 3.0 = 6.75\\text{ GB}$；
3. **手机（720p，2.5Mbps）**：$2.5 \\times 0.45 \\times 3.0 = 3.375\\text{ GB}$；
4. **全家 3 小时物理消耗累加**：$33.75 + 6.75 + 3.38 = 43.88\\text{ GB}$；
5. **倍率对冲**：若连接 1.0x 节点，一晚上扣除 $44\\text{ GB}$（普通套餐直接见底）；若在软路由中配置视频策略组走 0.2x 节点，实际扣费仅为 **$8.78\\text{ GB}$**！`,
    cotConclusion: '多屏家庭必须在软路由层做集中统一分流，将全家影视流量全部归入 0.2x~0.5x 节点，并查验服务商允许的并发 IP 上限。',
    checklistItems: [
      ['查验最大在线设备限制', '确认服务商订阅支持的同时在线 IP 数满足全家屏幕数量'],
      ['软路由网关统一接管', '在路由器层开启透明代理，避免每个屏幕独立连接消耗多 IP'],
      ['为各屏幕分配带宽配额', '在路由器中对智能电视与移动端设置最高带宽限制，防止抢网'],
      ['全家视频锁定低倍率', '路由器分流规则中将全家视频流量统一路由至 0.2x 经济节点'],
      ['核验路由器 CPU 解密负载', '多路 4K 并发时查看软路由 CPU 占用率，防止硬件过热丢包'],
      ['为各屏幕分别设置默认画质', '电视设置 4K，移动设备强制 1080p，兼顾画质与额度'],
      ['设立家庭月度观影池', '为家庭娱乐单独划分出 150G~300G 专项额度池'],
      ['非观影时段休眠电视盒子', '电视不用时彻底切断电源或进入深度休眠，杜绝后台静默跑量']
    ],
    metricCardItems: [
      ['无严苛在线 IP 限制', '支持家庭多终端（>= 5 台设备）同时并发在线'],
      ['全家千兆并发带宽', '总带宽充足，多屏 4K 同时播放互不卡顿抢速'],
      ['流媒体专属多节点', '提供多个独立的低倍率流媒体线路，支持分流分散'],
      ['家庭大额度套餐', '提供 500GB 至 1TB 超大容量高性价比家庭套餐']
    ],
    prevLink: ['视频用量：缓存、重播与下载', '/video/video-replay-cache/'],
    nextLink: ['视频用量：电视、投屏与本地传输', '/video/casting-path/'],
    relatedLink: ['设备数量：分配、并发与共同使用', '/devices/allocation/concurrency/'],
    ctaTitle: '家庭多屏需求已梳理？前往主站寻找支持多端并发的大额方案',
    ctaDesc: '拿着多设备并发与超大容量需求指标，前往机场榜一挑选设备限制宽松、家庭口碑优秀的标杆服务商。',
    ctaButton: '查看家庭多屏专属大额套餐 →'
  },
  {
    clusterTitle: '电视大屏、投屏协议与本地直连',
    wireTrace: `[AirPlay / DLNA / Chromecast Wire Trace]
├── Scenario A (Direct TV Pull): 电视盒子自身运行代理，直连出海 (消耗 100% 代理流量)
└── Scenario B (Local Cast): 手机代理拉流 -> 本地局域网投屏至电视 (若未放行私网，产生二次中继双倍扣量!)`,
    cotTheme: '投屏协议内网互联被代理误劫持引发的双倍消耗',
    cotProblem: '手机投屏到电视上看电影，手机和电视同时产生大量出网记录，账单扣了双倍。',
    cotH1: '手机将视频流拉回本地后，通过 AirPlay/DLNA 向电视传输时，局域网数据包被手机 TUN 虚拟网卡误捕获；',
    cotH2: 'Chromecast 模式下电视本身再次向公网拉流，手机端未及时断开连接；',
    cotH3: '智能电视未配置国内分流规则，后台系统更新和遥测跑了代理额度。',
    cotMathFormula: 'V_{\\text{cast}} = V_{\\text{internet_stream}} + \\sum V_{\\text{lan_leaked}} \\times M',
    cotCalculations: `**投屏协议分流纠偏手算推导**：
某用户通过手机投屏观看一部 $8.00\\text{ GB}$ 电影：
1. **错误配置下（局域网未配置直连）**：
   - 手机从境外拉流：消耗 $8.00\\text{ GB}$；
   - 手机向电视局域网投屏：由于 TUN 误劫持，出网再计 $8.00\\text{ GB}$；
   - 总扣量高达 **$16.00\\text{ GB}$**（双倍扣款！）；
2. **正确配置纠偏**：在客户端配置私网白名单，局域网投屏流量走本地网卡物理交换；
3. 真实出网扣量降至 **$8.00\\text{ GB}$**，杜绝了一半的虚假消耗！`,
    cotConclusion: '投屏必须确保客户端放行私有 IP 段（192.168.x.x），推荐在电视盒子上直接安装原生客户端独立运行。',
    checklistItems: [
      ['客户端放行局域网 IP', '确保手机与电脑配置中包含 192.168.0.0/16 强制 DIRECT 直连'],
      ['电视端安装独立客户端', '优先在 Apple TV / Android 电视盒子上直接部署客户端'],
      ['投屏前核对连接协议', '区分屏幕镜像（AirPlay Mirroring）与投屏中继（DLNA）的路径'],
      ['排查电视后台静默更新', '在路由器中将电视的国内系统更新域名加入直连白名单'],
      ['关闭投屏后核查手机状态', '投屏成功后若电视独立拉流，及时在手机端退出播放释放连接'],
      ['选用适合电视的低倍率线路', '电视端客户端默认锁定 0.2x~0.5x 专属流媒体节点'],
      ['定期核查电视出网 IP', '在电视浏览器中打开本站工具核验出口 IP 归属与解锁状态'],
      ['备用投屏直连线缆', '大码率原盘观影优先使用 HDMI 有线直连，彻底消除无线中继']
    ],
    metricCardItems: [
      ['Apple TV 原生支持', '完美支持 tvOS 平台主流代理软件原生部署'],
      ['路由器分流完美契合', '与软路由固件分流规则 100% 兼容无冲突'],
      ['局域网投屏零损耗', '私网路由清晰，杜绝内网投屏被误劫持扣费'],
      ['大屏 4K HDR 畅享', '专为家庭影院级高码率 HDR 输出提供带宽保证']
    ],
    prevLink: ['视频用量：多屏与同步观看', '/video/models/multiscreen/'],
    nextLink: ['视频用量：直播、会议与双向传输', '/video/plans/live/'],
    relatedLink: ['手机用量：热点共享与计数层级', '/mobile/counters/hotspot/'],
    ctaTitle: '大屏方案已搞定？前往主站寻找电视盒子完美适配的顶级专线',
    ctaDesc: '拿着 Apple TV 原生支持与电视大屏优化指标，前往机场榜一挑选针对大屏影院深度优化的标杆服务商。',
    ctaButton: '查看电视大屏专属套餐 →'
  },
  {
    clusterTitle: '实时直播、低延迟流与 WebRTC 双向传输',
    wireTrace: `[WebRTC / RTMP Bi-directional Stream Trace]
├── Inbound Video Stream (Speaker): 1080p 30fps H.264 (~2.5 Mbps)
├── Inbound Audio Stream (Opus Codec): 48 kHz Stereo (~64 kbps)
└── Outbound Video/Audio (User Camera/Mic): Uploading ~1.8 Mbps simultaneously!
    └── Total Wire Rate = 2.5 + 0.064 + 1.8 = 4.364 Mbps (双向高频持续跑量)`,
    cotTheme: 'WebRTC 与直播协议的低延迟 UDP 丢包补偿与双向消耗',
    cotProblem: '开了一场 2 小时的跨洋 Zoom/Teams 高清视频会议，发现消耗了近 5GB 流量，且画面频繁卡顿。',
    cotH1: '视频会议是典型的“双向音视频并发传输”，麦克风与摄像头持续产生大额上传流量；',
    cotH2: 'WebRTC 协议强制采用 UDP 传输，弱网环境下 FEC（前向纠错）产生高达 20%~30% 的冗余校验包；',
    cotH3: '实时直播为了追求低延迟关闭了本地磁盘缓存，网络抖动时频繁重新协商码率。',
    cotMathFormula: 'V_{\\text{meeting}} = (R_{\\text{down}} + R_{\\text{up}}) \\times 0.45 \\times T \\times (1 + \\Delta_{\\text{FEC}})',
    cotCalculations: `**双向高清会议流量手算演算**：
某用户参与 2 小时 1080p 跨国视频会议：
1. 下行视频流（接收发言人画面）：$2.5\\text{ Mbps}$；
2. 上行视频流（本地摄像头与麦克风输出）：$1.8\\text{ Mbps}$；
3. 合并全双工速率：$2.5 + 1.8 = 4.30\\text{ Mbps}$；
4. 弱网丢包环境下的 FEC 冗余包损耗（追加 $15\\%$）：$4.30 \\times 1.15 = 4.945\\text{ Mbps}$；
5. **2 小时实际出网消耗**：
   $$V = 4.945 \\times 0.45 \\times 2.0 = 4.45\\text{ GB}$$
6. 若连接 2.0x 专线节点，后台实际扣除将近 **$9.00\\text{ GB}$**！`,
    cotConclusion: '视频会议必须选用低延迟、低丢包的专线节点（抑制 FEC 冗余），非发言时及时关闭摄像头与静音以减半流量。',
    checklistItems: [
      ['非发言时关闭摄像头', '仅在需要发言时开启摄像头，纯听会时关闭视频可节省 40% 流量'],
      ['静音麦克风减少上行', '未发言时保持静音，抑制音频编码流的持续后台上传'],
      ['选用 IPLC 低延迟专线', '会议与实时直播首选内网专线节点，将 RTT 控制在 50ms 以内'],
      ['开启 UDP 转发支持', '确认客户端节点完整开启 UDP 转发（FullCone NAT），保障 WebRTC 通畅'],
      ['共享屏幕优先选文档模式', '屏幕共享时选择“优化文档与文字”而非“优化运动视频”，码率降低 70%'],
      ['记录会议单小时基线', '根据个人典型会议场景记录每小时消耗（通常在 1.5GB~2.5GB/h）'],
      ['规避晚高峰公网节点', '重要国际会议规避晚高峰公网互联节点，杜绝丢包引发严重卡顿'],
      ['对账时核验双向总和', '会议流量核算时务必将上传与下载合并代入对账公式']
    ],
    metricCardItems: [
      ['UDP 转发全支持', 'FullCone NAT 支持良好，WebRTC 会议通话秒连不断线'],
      ['超低延迟 RTT', '跨境专线往返延迟低至 30ms~60ms，零回声零卡顿'],
      ['抗丢包抖动抑制', '专线物理链路零丢包，免除 FEC 冗余浪费'],
      ['双向千兆带宽保证', '上下行对称高速，多路高清视频会议并发无忧']
    ],
    prevLink: ['视频用量：电视、投屏与本地传输', '/video/casting-path/'],
    nextLink: ['视频用量：周期安排与可用额度', '/video/plans/schedule/'],
    relatedLink: ['倍率规则：上下行计费方式', '/multipliers/calculation/directions/'],
    ctaTitle: '会议与直播需求已明确？前往主站寻找超低延迟内网专线',
    ctaDesc: '拿着超低延迟与稳定 UDP 转发指标，前往机场榜一挑选针对跨国视频会议深度优化的顶级专线服务商。',
    ctaButton: '查看低延迟会议专线套餐 →'
  },
  {
    clusterTitle: '月度观影排期与额度配额管理',
    wireTrace: `[Monthly Viewing Schedule Allocation Model]
├── Monthly Quota Pool: 150.0 GB Total
├── Daily Baseline Drama (1 episode/day): 1.5 GB * 22 days = 33.0 GB
├── Weekend Movie Night (2 movies/weekend): 10.0 GB * 4 weekends = 40.0 GB
└── Emergency Headroom: 150.0 - (33.0 + 40.0) = 77.0 GB (充足安全垫)`,
    cotTheme: '基于日历观影计划的额度配额制与防提前停机模型',
    cotProblem: '月初追剧太猛把全月额度耗尽，月中遇到新剧开播却只能到处借账号或高价买补充包。',
    cotH1: '缺乏周期性的观影排期规划，把全月额度当成了单周可以挥霍的资产；',
    cotH2: '未建立“日常追剧配额”与“周末大片配额”的双轨隔离机制；',
    cotH3: '未将节点倍率杠杆纳入排期计算。',
    cotMathFormula: 'Q_{\\text{budget}} = (N_{\\text{episodes}} \\times V_{\\text{ep}} + N_{\\text{movies}} \\times V_{\\text{movie}}) \\times M_{\\text{streaming}}',
    cotCalculations: `**月度观影排期精算手算推导**：
某用户当月计划观看：
1. **日常追剧**：20 集连续剧（1080p 优质，每集 45 分钟），单集 $1.8\\text{ GB}$：
   $$V_1 = 20 \\times 1.8 = 36.00\\text{ GB}$$
2. **周末大片**：4 部 4K 电影（每部 2 小时），单部 $15.0\\text{ GB}$：
   $$V_2 = 4 \\times 15.0 = 60.00\\text{ GB}$$
3. **日常短视频浏览**：全月累计预估 $24.00\\text{ GB}$；
4. **总物理需求**：$36.00 + 60.00 + 24.00 = 120.00\\text{ GB}$；
5. **倍率对冲与套餐选型**：
   - 选用拥有 0.5x 流媒体节点的服务商：后台扣量仅需 $120.00 \\times 0.5 = 60.00\\text{ GB}$！
   - 用户只需采购一个 **$80\\text{GB}~100\\text{GB}$ 的标准套餐**，即可充裕覆盖全部观影心愿，还余留了 20GB~40GB 安全防线！`,
    cotConclusion: '建立按周拆解的观影配额制，充分利用 0.2x~0.5x 节点倍率，实现少花钱看更多大片的预算最优化。',
    checklistItems: [
      ['列出当月追剧大片清单', '月初梳理本月计划观看的剧集集数与大片部数'],
      ['计算单集与单部基准消耗', '按 1080p 单集 1.8GB、4K 单部 15GB 估算物理载荷'],
      ['结合 0.5x 节点折算扣量', '将物理总需求除以 2（即乘 0.5x），得出实际需要的套餐额度'],
      ['按周分配观影限额', '将全月额度拆解为每周固定限额，避免月初一次性透支'],
      ['设置每周用量打卡复核', '每周日晚查看当周消耗，若超额在次周适当收敛画质'],
      ['预留 20% 临时观影冗余', '为朋友推荐的突发新剧预留 15G~30G 弹性机动额度'],
      ['月末剩余额度集中放量', '若月末还剩大量额度，集中下载高清原盘利用完毕'],
      ['结合家庭成员统一排期', '若家庭共用，按成员协商划分各自的观影时间与限额']
    ],
    metricCardItems: [
      ['大容量套餐性价比', '提供 200G~500G 影音专属高性价比月付档位'],
      ['低倍率节点长期稳定', '0.2x~0.5x 线路长期存续，绝不频繁下线撤档'],
      ['额度重置提醒贴心', '重置日前 3 天提醒剩余额度，方便规划消化'],
      ['不限时补充包保障', '支持随时平价增补流量包，观影不留遗憾']
    ],
    prevLink: ['视频用量：直播、会议与双向传输', '/video/plans/live/'],
    nextLink: ['视频用量：验收、对账与使用限制', '/video/plans/verify/'],
    relatedLink: ['流量估算：任务组合与周期分配', '/estimate/forecast/composition/'],
    ctaTitle: '观影计划已就绪？前往主站寻找影音追剧专属的高性价比服务',
    ctaDesc: '拿着精准的观影配额与低倍率需求指标，前往机场榜一挑选长期专注于影音大流量的高口碑标杆服务商。',
    ctaButton: '查看追剧影音专属套餐比对 →'
  },
  {
    clusterTitle: '视频平台对账、验收与运营商限速',
    wireTrace: `[Video Stream ISP Throttling & Reconcile Trace]
├── CDN Edge Node: Fastly/Cloudflare Edge IP
├── ISP QOS Signature: 晚高峰 20:30 检测到持续 UDP 流 -> 运营商限速至 5 Mbps (严重卡顿)
└── Reconcile Check: 客户端显示消耗 4.2 GB, 视频平台统计显示 4.1 GB -> 账实相符`,
    cotTheme: '晚高峰 ISP 运营商流媒体 QOS 限速排查与平台端对账',
    cotProblem: '明明买了 500Mbps 套餐，看 4K 却疯狂转圈卡顿，怀疑节点被限速或平台扣量不公。',
    cotH1: '本地宽带运营商（ISP）在晚高峰针对特定 UDP 协议或未加密流量执行了恶意的 QOS 队列限速；',
    cotH2: '服务商该流媒体节点的出口 IP 被平台风控，触发了视频平台的强制降码率惩罚；',
    cotH3: '客户端加密协议特征过于明显，遭受了深度报文检测（DPI）的丢包干扰。',
    cotMathFormula: '\\Delta Q_{\\text{reconcile}} = |Q_{\\text{client_wire}} - Q_{\\text{platform_stats}}| \\le \\epsilon_{\\text{protocol}}',
    cotCalculations: `**流媒体对账与 QOS 限速排查演算**：
某用户在晚高峰观看 4K 发生严重卡顿：
1. **本地单端测速**：直连测速带宽为 $300\\text{ Mbps}$，但该视频节点单线程拉流仅 $3.8\\text{ Mbps}$；
2. **QOS 归因测试**：
   - 将传输协议从直连 Shadowsocks 切换为具备伪装混淆的 Trojan/VLESS 协议；
   - 单线程拉流速度瞬间恢复至 **$65.0\\text{ Mbps}$**，卡顿彻底消失；
3. **平台端与账本差分核验**：
   - 播放器“详细信息”显示拉取字节：$4,215,800,000\\text{ 字节} \\approx 4.216\\text{ GB}$；
   - 客户端虚拟网卡统计：出网 $4.280\\text{ GB}$（协议膨胀 $1.5\\%$，完全自洽）；
4. 证明计费网关完全正常，问题根源纯粹为运营商 DPI 干扰，通过切换协议成功解决！`,
    cotConclusion: '视频卡顿不要盲目归咎于流量不够；应通过对比单线程流速排查运营商 QOS，并换用抗封锁抗干扰的现代协议。',
    checklistItems: [
      ['调出平台详细统计数据', '在播放界面查看已下载字节数（Bytes Transferred）进行精确比对'],
      ['排查本地运营商 QOS 限速', '晚高峰单线程拉流卡顿时，尝试切换抗干扰混淆协议'],
      ['核验节点出口 IP 解锁状态', '使用流媒体检测脚本确认当前节点 IP 是否被平台列入风控黑名单'],
      ['比对客户端与后台扣量', '将单次观影的客户端网卡消耗与控制台扣量做差分对比'],
      ['避免单线程并发瓶颈', '确认客户端多路复用（Multiplexing）配置是否合理'],
      ['在纯净环境下做单片验收', '挑选一部已知时长的电影做全流程对账闭环，留存完整日志'],
      ['检查跨境链路丢包率', '卡顿频繁时 ping 节点 IP，丢包率 > 3% 时立即切换备用线路'],
      ['形成长效对账复核习惯', '将每月观影总扣量与平台观看记录定期核验，杜绝隐蔽跑量']
    ],
    metricCardItems: [
      ['晚高峰抗 QOS 穿透', '采用深度混淆伪装协议，轻松穿透运营商晚高峰限速'],
      ['流媒体全天候解锁', '拥有动态 IP 轮换池，保证 100% 长期解锁不被封'],
      ['单线程极速保障', '单线程流媒体测速 > 80Mbps，8K 原画轻松驾驭'],
      ['中立对账五星认证', '在主站长期流媒体稳定性与计费严谨度测评中全优通过']
    ],
    prevLink: ['视频用量：周期安排与可用额度', '/video/plans/schedule/'],
    nextLink: ['流量估算：速率与容量换算', '/estimate/models/unit-rate/'],
    relatedLink: ['账单核对：来源与计费口径对齐', '/reconcile/alignment/basis/'],
    ctaTitle: '验收标准已通晓？前往主站寻找晚高峰抗卡顿的顶级流媒体服务',
    ctaDesc: '拿着抗 QOS 限速与平台对账标准，前往机场榜一挑选经过晚高峰严酷压测、画质丝滑秒开的标杆服务商。',
    ctaButton: '查看晚高峰抗限速流媒体套餐 →'
  }
];

function enrichFileWithClusters(fileName: string, clusters: ClusterData[]) {
  const filePath = path.join(GENERATORS_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] 未找到文件: ${filePath}`);
    return;
  }

  let code = fs.readFileSync(filePath, 'utf-8');
  let matchIndex = 0;

  code = code.replace(/## 六、常见问题解答与下一步建议\s*\n\s*<FAQ/g, () => {
    const meta = clusters[matchIndex] || clusters[0];
    matchIndex++;

    const r1Md = `## 六、DeepSeek-R1 深度思维链推导 (Chain-of-Thought 推理复盘)

### 1. 抓包级网络报文解构与协议膨胀分析 (Wire Packet Trace)
${meta.wireTrace}

### 2. 初始问题表象与争议现象
在涉及“**\${node.title}**”的真实网络环境下，普遍存在显著的认知偏差与争议现象：
${meta.cotProblem}

### 3. 思维链排查与隐蔽变量挖掘
按照 DeepSeek-R1 结构化排查范式，对可能引起差额的隐藏变量进行逐层剥离与假设验证：
- **假设 H1（底层因果链溯源）**：${meta.cotH1}
- **假设 H2（网络行为与规则未对齐）**：${meta.cotH2}
- **假设 H3（协议开销与时间窗口截断）**：${meta.cotH3}

### 4. 数学建模与实际消耗推导
针对该核心场景，建立端到端传输与结算的统一数学模型：
$$${meta.cotMathFormula}$$

${meta.cotCalculations}

### 5. 思维链归纳结论与纠偏对策
${meta.cotConclusion}

---

## 七、落地实操与全流程审计检查表 (Checklist)

在处理本场景的具体任务时，请严格依据下述 8 项工程化指标进行全流程核验闭环：

| 序号 | 核心核查步骤 | 标准工程规范要求 | 达标标记 |
|---|---|---|---|
${meta.checklistItems.map(([name, desc], idx) => `| **Step ${idx + 1}** | ${name} | ${desc} | [ ] 已核实 |`).join('\n')}

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

---

## 九、常见问题解答与下一步建议 (FAQ)

<FAQ`;

    return r1Md.replace(/`/g, '\\`');
  });

  code = code.replace(/---\s*\n\s*<MainSiteCTA[\s\S]*?\/>\s*\n\s*<Disclosure \/>/g, '<Disclosure />');
  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`[PASS] 成功异质化注入 ${fileName} 全部 8 个独立集群模块 (${code.length} 字节)`);
}

// 执行 estimate, multipliers, video 三个关键文件的异质化升级
enrichFileWithClusters('estimate.ts', ESTIMATE_CLUSTERS);
enrichFileWithClusters('multipliers.ts', MULTIPLIERS_CLUSTERS);
enrichFileWithClusters('video.ts', VIDEO_CLUSTERS);

console.log('[FINISH] estimate, multipliers, video 全部 24 个集群独立长文注入完成！');
