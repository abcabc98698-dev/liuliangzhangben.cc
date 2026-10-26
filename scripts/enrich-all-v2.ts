import fs from 'node:fs';
import path from 'node:path';

const GENERATORS_DIR = path.resolve(process.cwd(), 'scripts', 'generators');

interface CategoryMeta {
  file: string;
  category: string;
  domainName: string;
  wireProtocolTrace: string;
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

const CATEGORIES_ENRICHMENT: CategoryMeta[] = [
  {
    file: 'estimate.ts',
    category: 'estimate',
    domainName: '流量需求估算与任务模型',
    wireProtocolTrace: `\`\`\`text
[Ethernet II Frame] Src: Realtek_xx:xx:xx, Dst: Router_xx:xx:xx, Length: 1514 Bytes
└── [IPv4 Header] 192.168.1.100 -> 104.244.42.1 (TTL: 64, Protocol: TCP 6, Total Length: 1500)
    └── [TCP Header] SrcPort: 54321, DstPort: 443, Seq: 1048576, Ack: 2097152, Flags: [ACK], Win: 65535
        └── [TLS 1.3 Record Layer] Content Type: Application Data (23), Version: TLS 1.2 (0x0303), Length: 1440
            └── Encrypted Application Data: 1424 Bytes (包含 16 Bytes AEAD Poly1305 Tag)
\`\`\`
- **协议开销解构**：每个 1514 字节的以太网帧中，有效业务载荷仅 1424 字节。协议封装损耗率 $\\Delta_{\\text{proto}} = (1514 - 1424) / 1424 \\approx 6.32\\%$。
- **突发重传补偿**：公网跨境弱网丢包率按 $p = 2.4\\%$ 测算，TCP 拥塞窗口（cwnd）退避并重传丢包数据帧，实际出网物理流量比业务层净载荷扩大至：
  $$S_{\\text{wire}} = S_{\\text{payload}} \\times (1 + \\Delta_{\\text{proto}}) / (1 - p) \\approx 1.089 \\times S_{\\text{payload}}$$`,
    cotTheme: '非典型突发脉冲与多任务复合预算推导',
    cotProblem: '用户根据新机配置当天的出网量（28.4GB）进行简单线性外推，得出月度需要 850GB+ 巨额套餐的错误结论，产生巨大的预算焦虑。',
    cotH1: '冷启动装机、系统大版本OTA更新属于低频单次脉冲事件，不可与日常平稳办公流混同计算；',
    cotH2: '日常平稳办公流与周末高码率视频流存在显著的双峰分布，简单算术平均数会严重掩盖结构性方差；',
    cotH3: '网络环境存在 6.3% 的协议封装损耗与丢包重传放大，实际出网量必然大于应用层净文件体积。',
    cotMathFormula: 'Q_{\\text{month}} = \\left( \\sum_{i=1}^5 q_{\\text{work}} + \\sum_{j=1}^2 q_{\\text{weekend}} \\right) \\times 4.33 + \\sum Q_{\\text{outlier}} \\times (1 + \\Delta_{\\text{proto}})',
    cotCalculations: `**经典场景手算演算推导（30天标准月度模型）**：
1. **工作日平稳办公日均基线**：$q_{\\text{work}} = 1.65\\text{ GB/天}$（涵盖网页协作、Git 提交与即时通讯）；
2. **周末娱乐流媒体日均基线**：$q_{\\text{weekend}} = 4.80\\text{ GB/天}$（涵盖 1080p 视频与长音频播放）；
3. **稳态月度平稳出网总量**：
   $$V_{\\text{steady}} = (5 \\times 1.65 + 2 \\times 4.80) \\times 4.33 = (8.25 + 9.60) \\times 4.33 = 17.85 \\times 4.33 \\approx 77.29\\text{ GB}$$
4. **偶发脉冲大任务单列准备金**：剥离首日装机 $28.4\\text{ GB}$ 脉冲，按每两个月发生一次分配月均准备金 $14.20\\text{ GB}$；
5. **协议封装与丢包重传放大**（乘数 1.089）：
   $$Q_{\\text{final}} = (77.29 + 14.20) \\times 1.089 \\approx 91.49 \\times 1.089 \\approx 99.63\\text{ GB}$$
6. **最终预算结论**：经过稳态与脉冲分离计算，用户科学套餐容量仅需 **$100\\text{ GB}$ 档位**（含 20% 安全余量），比盲目按首日线性推导的 $850\\text{ GB}$ 节省近 $88\\%$ 的采购支出！`,
    cotConclusion: '必须严格执行“稳态中位数求和＋特异脉冲准备金单列＋协议膨胀系数放大”三步估算法，杜绝用极端峰值决定常年月付套餐容量。',
    checklistItems: [
      ['采样周期覆盖', '基线采样周期覆盖完整的连续 7 至 14 天，必须包含 5 个工作日与 2 个周末'],
      ['剥离单次突发', '剔除新装机、大版本系统补丁等孤立突发事件，单列为应急额度准备金'],
      ['分离双峰场景', '工作日办公与周末娱乐分别计算日均基数，避免算术平均掩盖波动'],
      ['协议封装补偿', '对所有离散文件和纯净数据载荷统一乘以 1.06~1.09 的物理封装损耗乘数'],
      ['预留安全余量', '为月度计划外突发事件（临时开会、紧急下载）预留 15%~25% 的安全弹性余量'],
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
    file: 'multipliers.ts',
    category: 'multipliers',
    domainName: '节点倍率核算与可用额度',
    wireProtocolTrace: `\`\`\`text
[Clash/Sing-box TUN Core] Proxy Node Outbound Flow:
├── Node A: [Hong Kong 01] Multiplier: 1.0x (Direct Egress)
│   └── WireBytes = 1,000,000,000 Bytes -> BilledUsage = 1.00 GB
├── Node B: [Tokyo IPLC 01] Multiplier: 3.0x (Dedicated Transit)
│   └── WireBytes = 1,000,000,000 Bytes -> BilledUsage = 3.00 GB (300% 消耗放大)
└── Node C: [Singapore CDN 01] Multiplier: 0.2x (Off-peak Streaming)
    └── WireBytes = 1,000,000,000 Bytes -> BilledUsage = 0.20 GB (仅扣 200MB)
\`\`\`
- **计费倍率物理本质**：标称倍率 $M$ 是商业结算杠杆。用户实际可用物理额度与倍率成严格反比：
  $$V_{\\text{usable}} = \\frac{Q_{\\text{package}}}{M}$$
- **双向计费叠加效应**：多数服务商对上行与下行合并扣量，大文件下载时伴随的 TCP ACK 与加密协议握手上行流量同样被乘以倍率 $M$：
  $$B_{\\text{billed}} = M \\times (Q_{\\text{down}} + Q_{\\text{up}})$$`,
    cotTheme: '多节点混合倍率加权与真实扣量反推',
    cotProblem: '用户在 3.0x 专线节点上下载大文件，导致 100GB 套餐两周内迅速扣光；或者在 0.5x 节点使用时发现后台扣量与直觉不符。',
    cotH1: '标称额度除以节点倍率才是该节点实际可传输的物理字节总上限；',
    cotH2: '服务商采用双向计费规则，大文件下载伴随的 TCP ACK 上行同样会被乘以高倍率扣除；',
    cotH3: '服务商后台更新了节点倍率但客户端配置未同步刷新，导致显示倍率与后端扣费规则脱节。',
    cotMathFormula: '\\bar{M}_{\\text{weighted}} = \\frac{\\sum_{i=1}^n (Q_{\\text{down}, i} + Q_{\\text{up}, i}) \\times M_i}{\\sum_{i=1}^n (Q_{\\text{down}, i} + Q_{\\text{up}, i})}',
    cotCalculations: `**混合倍率加权手算推导算例**：
某用户当月在三个不同倍率的节点上进行了传输任务：
1. **节点 A（0.2x 经济流媒体）**：下载高清视频，出网物理流量 $Q_1 = 50.00\\text{ GB}$，上行 $0.80\\text{ GB}$，总计 $50.80\\text{ GB}$。
   $$\\text{扣量 } B_1 = 50.80 \\times 0.2 = 10.16\\text{ GB}$$
2. **节点 B（1.0x 标准 BGP 线路）**：日常网页办公，出网物理流量 $Q_2 = 18.00\\text{ GB}$，上行 $2.20\\text{ GB}$，总计 $20.20\\text{ GB}$。
   $$\\text{扣量 } B_2 = 20.20 \\times 1.0 = 20.20\\text{ GB}$$
3. **节点 C（2.5x 顶级内网 IPLC 专线）**：跨国低延迟游戏与视频会议，物理出网 $Q_3 = 8.00\\text{ GB}$，上行 $3.50\\text{ GB}$，总计 $11.50\\text{ GB}$。
   $$\\text{扣量 } B_3 = 11.50 \\times 2.5 = 28.75\\text{ GB}$$
4. **全周期综合指标核算**：
   - 实际传输物理数据总和：$Q_{\\text{total}} = 50.80 + 20.20 + 11.50 = 82.50\\text{ GB}$
   - 服务后台总计扣除额度：$B_{\\text{total}} = 10.16 + 20.20 + 28.75 = 59.11\\text{ GB}$
   - 综合实际加权平均倍率：
     $$\\bar{M} = \\frac{59.11}{82.50} \\approx 0.716\\text{x}$$
5. **算例启示**：通过将 60% 以上的高吞吐视频流量精准路由至 0.2x 经济节点，用户实际享受了 82.5GB 的真实数据吞吐，后台仅扣量 59.11GB，有效加权倍率降至 0.72x！`,
    cotConclusion: '大文件下载与影视观看应严格绑定 <=0.5x 低倍率节点，仅将高价值低延迟的会议与游戏路由至专线节点，方能实现额度利用率最大化。',
    checklistItems: [
      ['节点倍率标签取证', '执行重要下载任务前刷新客户端订阅，核验当前节点标称倍率标签'],
      ['大流量分流隔离', '视频流媒体与大文件下载严格绑定 <=0.5x 经济节点，杜绝走高倍率专线'],
      ['专线按需调用', '极度敏感低延迟业务（会议、外汇交易、实时竞技）选用 1.5x~3.0x 专线节点'],
      ['计费方向条款核实', '查验服务商用户条款（TOS），明确是“仅计下载”还是“上下行双向扣量”'],
      ['加权反推综合倍率', '混合使用多节点时采用加权平均公式，严禁使用简单算术平均反推账单'],
      ['任务前后截取快照', '单次超大传输前后截取控制台已用量快照，计算差额 $\\Delta Q$ 验证扣量准确度'],
      ['防范零倍率风险', '警惕 0.0x 免流节点突然被服务商调整为正常计费而产生的扣量激增风险'],
      ['异常差额取证提交', '实测扣量比例与标称倍率偏差超过 10% 时，打包本地日志向客服发起工单核查']
    ],
    metricCardItems: [
      ['节点倍率透明度', '控制台显式披露实时倍率，调整前公告通知'],
      ['经济节点丰富度', '提供充足 0.1x~0.5x 大流量节点供流媒体使用'],
      ['专线倍率合理性', 'IPLC/IEPL 优质专线标称倍率 <= 2.0x'],
      ['计费方向明示', '明确标明单向计费或双向计费规则']
    ],
    prevLink: ['倍率规则：单倍率与可用额度计算', '/multipliers/calculation/single-rate/'],
    nextLink: ['倍率规则：多节点加权平均倍率公式', '/multipliers/calculation/mixed-rates/'],
    relatedLink: ['账单核对：真实倍率反推测试法', '/reconcile/alignment/components/'],
    ctaTitle: '倍率规则已摸透？前往主站挑选倍率透明的优质节点',
    ctaDesc: '拿着明确的倍率接受度与专线需求，前往机场榜一查看经过长期实测、绝无暗扣倍率的标杆服务商。',
    ctaButton: '查看低倍率大额度套餐 →'
  },
  {
    file: 'reset.ts',
    category: 'reset',
    domainName: '重置周期与时间边界',
    wireProtocolTrace: `\`\`\`text
[Cron Accounting Scheduler] Boundary Time Check:
├── Local Device Time: 2026-10-31 23:55:00 UTC+8 (北京时间)
├── Service Gateway Time: 2026-10-31 15:55:00 UTC+0 (标准 UTC 时区)
└── Next Reset Boundary Event: 2026-11-01 00:00:00 UTC+0 (对应本地 08:00:00 UTC+8)
    └── 8 小时时间相位差：本地已进入下月，服务端仍在统计上月剩余额度！
\`\`\`
- **重置边界半开区间公理**：严格的计费周期必须遵循 $[T_{\\text{start}}, T_{\\text{end}})$ 半开半闭区间。
- **批量入库延迟竞争**：服务端统计守护进程（Daemon）在整点存在 5~15 分钟的日志聚合缓冲延迟，重置瞬间高并发易引发状态竞争。`,
    cotTheme: '跨时区重置跳跃与未用额度结转边界',
    cotProblem: '用户以为北京时间 1 号 00:00 额度会自动重置，在 00:15 放心下载大文件却直接把上月未清零的额度耗尽导致停机；或者发现当月额度提前一天归零。',
    cotH1: '服务商服务器部署于境外（如新加坡 UTC+8、法兰克福 UTC+1、硅谷 UTC-7），清零任务严格依据服务端所在系统时区触发；',
    cotH2: '套餐为“滚动天数周期（如购买日起每30天）”而非“自然月周期（每月1号）”；',
    cotH3: '服务端后台 RADIUS 批量入库存在时间延迟，定时任务队列积压导致清零操作异步滞后。',
    cotMathFormula: '\\Delta T_{\\text{remaining}} = T_{\\text{reset_utc}} - (T_{\\text{local_timestamp}} - \\text{TimezoneOffset})',
    cotCalculations: `**时区相位差与重置清零手算推导**：
1. **服务商设定**：自然月每月 1 日 00:00:00 (UTC 零时区) 执行清零重置；
2. **本地用户位置**：中国大陆（UTC+8），本地时间比服务端快 8 个小时；
3. **本地清零触发时刻换算**：
   $$T_{\\text{local_reset}} = \\text{2026-11-01 00:00:00 UTC} + 8\\text{h} = \\text{2026-11-01 08:00:00 UTC+8}$$
4. **差错因果链**：用户若在 11 月 1 日凌晨 02:00（UTC+8）开始大下载，服务端时间仅为 10 月 31 日 18:00（UTC），仍在扣除 10 月份旧额度！
5. **纠偏行动指南**：
   - 跨月重置前后 8 小时设为“防越界静默期”；
   - 在控制台查验 User-Info Header 中的 \`reset_day\` 精确 Unix 时间戳。`,
    cotConclusion: '重置核对必须以服务端 Unix Epoch 时间戳为准，严禁凭本地自然日直觉跨越计费边界。',
    checklistItems: [
      ['时区标准对齐', '在服务商控制台核验服务器所在时区（UTC/UTC+8/美西），计算本地相位差'],
      ['重置机制分类', '分清当前套餐是“自然月 1 日重置”还是“购买日起算每 30 天滚动重置”'],
      ['未用额度结转核验', '查阅服务条款明确未用额度是“次月清零”还是“可结转至额度池”'],
      ['重置静默窗口', '在预计重置时刻前后各保留 30 分钟静默期，防范定时任务批处理延迟'],
      ['临期余额监控', '在周期到期前 48 小时审查剩余可用额度，规划是否需要平价叠加临时补充包'],
      ['续费时间锚点确认', '续费升级时明确是“立即覆盖剩余额度并重置日期”还是“顺延至下周期生效”'],
      ['断点基线记录', '周期重置完成瞬间在本地账本插入一条清零断点记录，防止统计图表呈现负增量'],
      ['到期自动扣款检查', '若绑定了自动续费，核验扣款日与额度清零日是否完全匹配']
    ],
    metricCardItems: [
      ['重置日透明度', '控制台显式提供到期与重置的精确 Unix 秒级时间戳'],
      ['结算延迟容差', '重置批处理队列延迟不超过 15 分钟'],
      ['未用结转政策', '支持未用额度按比例结转至下月使用'],
      ['平价叠加支持', '支持到期前随时平价购买增量重置包']
    ],
    prevLink: ['重置周期：自然月与购买日重置边界', '/reset/boundaries/calendar/'],
    nextLink: ['重置周期：跨时区与重置时间转换', '/reset/boundaries/timezone/'],
    relatedLink: ['按量方案：购买单位与有效条件', '/payg/terms/definitions/'],
    ctaTitle: '周期边界已明确？前往主站寻找结算严谨的放心服务',
    ctaDesc: '拿着明确的时区与结转需求指标，前往机场榜一查看经过长期跟踪测评、重置逻辑清晰无坑的优质服务商。',
    ctaButton: '查看重置规则规范的套餐 →'
  },
  {
    file: 'payg.ts',
    category: 'payg',
    domainName: '按量方案与无期限套餐',
    wireProtocolTrace: `\`\`\`text
[PAYG Ledger Accounting] Micro-charging Balance Ledger:
├── Purchase Balance: 500.00 GB (No Expiration / 不限时)
├── Minimum Deduct Block: 1.00 MB Rounding (不满 1MB 按 1MB 扣除)
├── Inactivity Expiration Clause: 180 Days No-traffic Trigger (账户冻结规则)
└── Effective Cost Frontier:
    └── If Monthly Usage < 15 GB -> PAYG 综合成本显著低于固定月付订阅！
\`\`\`
- **最小扣量计费粒度（Billing Block）**：按量计费系统通常设置 1MB 向上取整边界。短时间内频繁断开重连会导致微小连接被反复按 1MB 截断扣费。
- **保活与沉没成本权衡**：无到期日套餐通常包含“连续 N 天无任何连接自动冻结”的休眠条款。`,
    cotTheme: '长周期低频调用的计费粒度与防沉没成本核算',
    cotProblem: '用户买了 500G 不限时按量套餐作为备用，半年后打开发现额度被清零；或者发现每次只查一次资料，余额扣减速度远快于预期。',
    cotH1: '服务条款隐藏了“连续 180 天未活动注销账户”的休眠维护条款；',
    cotH2: '服务商计费网关采用了 1MB 向上取整的计费块（Billing Block），高频短连接放大了结算损耗；',
    cotH3: '按量方案默认调用了高倍率专线节点，加速了额度资产的折损。',
    cotMathFormula: 'C_{\\text{eff}} = \\frac{P_{\\text{package}}}{Q_{\\text{total}}} + \\frac{N_{\\text{sessions}} \\times \\delta_{\\text{rounding}}}{Q_{\\text{total}}}',
    cotCalculations: `**按量 vs 月付经济性平衡点手算推导**：
设某按量方案为：$100\\text{ 元} / 500\\text{ GB}$（折合单价 $0.20\\text{ 元/GB}$，不限时）；
常规月付套餐为：$15\\text{ 元/月}$（每月 $80\\text{ GB}$，月底清零）。
1. **极低频轻度用户场景（月均 8 GB）**：
   - 月付方案支出：一年 12 个月固定支出 $15 \\times 12 = 180\\text{ 元}$，累计消耗仅 $96\\text{ GB}$，实际单位成本高达 $1.875\\text{ 元/GB}$！
   - 按量方案支出：消耗 $96\\text{ GB}$ 仅扣除资产价值 $96 \\times 0.20 = 19.20\\text{ 元}$。
   - **经济效益**：按量方案**节省开支近 90%**！
2. **中高频用户场景（月均 50 GB）**：
   - 月付方案支出：一年 12 个月仍为 $180\\text{ 元}$；
   - 按量方案支出：消耗 $600\\text{ GB}$ 需要支付 $120\\text{ 元}$。
3. **经济学分水岭临界点**：
   $$Q_{\\text{crossover}} = \\frac{15\\text{ 元}}{0.20\\text{ 元/GB}} = 75\\text{ GB/月}$$
   月均用量在 $75\\text{ GB}$ 以下时，按量方案在数学上具有不可替代的压倒性性价比优势。`,
    cotConclusion: '低频与备用场景首选大容量按量方案；但必须每季度设置一次周期轻量连接打点，阻断休眠清零机制。',
    checklistItems: [
      ['查验无到期日真实性', '查验服务商 TOS，确认是否具备“账户长期不活动自动注销”的隐藏条款'],
      ['计费扣除最小粒度', '明确服务商最小计费块大小（1KB、100KB 还是 1MB 向上截断）'],
      ['备用唤醒定期打点', '在日历中设立每季度一次的自动化或手动轻量连接打点，防范账户休眠'],
      ['严控节点出站倍率', '按量套餐账户中尽量禁用 >1.5x 高倍率专线，避免资产被隐蔽加速扣除'],
      ['单位成本临界点核算', '根据月均消耗测算是否处于按量方案的经济优势区间（通常 <50GB/月）'],
      ['余额警戒通知设立', '在控制台配置余额低于 20% 时的邮件提醒，防止突发任务断网'],
      ['退出与退款条款查验', '购买前阅读条款，明确未使用额度是否支持按比例退款或账户转让'],
      ['多端公用并发约束', '查验按量方案是否限制同时在线连接 IP 数']
    ],
    metricCardItems: [
      ['额度有效期承诺', '真正无到期日限制，无强制月度最低消费'],
      ['单价透明度', '标称 GB 单价透明，无额外账户月租维护费'],
      ['节点权限完整性', '按量用户享有与月付用户完全一致的优质节点接入权'],
      ['计费粒度精细度', '计费块 <= 100KB，杜绝粗暴 1MB 截断损耗']
    ],
    prevLink: ['按量方案：购买单位与有效条件', '/payg/terms/definitions/'],
    nextLink: ['按量方案：用量适配与月付对比', '/payg/fit/comparison/'],
    relatedLink: ['低频使用：余额、有效期与账户复查', '/occasional/maintenance/account-check/'],
    ctaTitle: '按量逻辑已摸透？前往主站挑选真正无到期的可靠方案',
    ctaDesc: '拿着明确的单价与有效期容差指标，前往机场榜一查看经过长期存续性验证、不限时按量方案口碑优秀的优质服务商。',
    ctaButton: '查看高性价比按量套餐 →'
  },
  {
    file: 'high-data.ts',
    category: 'high-data',
    domainName: '大流量高吞吐重度任务',
    wireProtocolTrace: `\`\`\`text
[High Throughput Wire Session] 10 Gbps Edge Gateway Snapshot:
├── Socket Buffer: SO_SNDBUF = 4194304 Bytes (4MB TCP Window)
├── Congestion Control: BBRv2 (Max Bandwidth: 850 Mbps, Min RTT: 32ms)
├── Loss Rate: p = 3.2% (跨洋公网抖动)
└── Retransmission Wire Inflation:
    └── Retransmit Frame Overhead = 3.2% / (1 - 0.032) ≈ +3.31% 额外出网流量
\`\`\`
- **TCP 窗口缩放与重传放大**：在高带宽时延积（BDP）链路中，丢包引发的快速重传（Fast Retransmit）会导致物理网卡出网量显著高于实际文件载荷。
- **多线程并发吞吐损耗**：Aria2/多线程下载会建立几十条并发 TLS 隧道，多路握手带来额外的标头与拥塞窗口竞争开销。`,
    cotTheme: '重度高吞吐任务的丢包膨胀与额度耗尽模型',
    cotProblem: '用户使用多线程工具下载 100GB 开源数据集，客户端统计实际拉取 103GB，服务后台却扣除了 125GB 额度，质疑后台扣量严重超标。',
    cotH1: '公网跨境链路拥塞导致高达 5% 的 TCP 丢包重传，物理层出网数据被真实放大；',
    cotH2: '用户并发开启了 64 个多线程下载，高频 TLS 握手与连接建立产生了近 3GB 的协议控制帧；',
    cotH3: '服务商节点在晚高峰执行了动态 QoS 限速，导致客户端持续触发重传与重试请求。',
    cotMathFormula: 'S_{\\text{billed}} = M \\times \\left( \\frac{S_{\\text{file}} \\times (1 + \\Delta_{\\text{chunk}})}{1 - p} + N_{\\text{threads}} \\times H_{\\text{TLS}} \\right)',
    cotCalculations: `**大流量重度下载真实扣量手算推导**：
某用户下载 $S_{\\text{file}} = 100.00\\text{ GB}$ 训练集：
1. **多线程切片损耗**：采用 32 线程切片拉取，分块 Range 请求与 TLS 记录标头损耗 $\\Delta_{\\text{chunk}} = 1.2\\%$；
2. **跨境链路丢包率**：晚高峰公网丢包率实测 $p = 4.0\\%$；
3. **物理层出网总流量推算**：
   $$S_{\\text{wire}} = \\frac{100.00 \\times (1 + 0.012)}{1 - 0.04} = \\frac{101.20}{0.96} \\approx 105.42\\text{ GB}$$
4. **服务商计费规则**：服务商节点标称倍率 $M = 1.0\\text{x}$，但执行双向计费（大文件下载时 TCP ACK 上行比例为 $2.1\\%$）：
   $$Q_{\\text{up}} = 105.42 \\times 0.021 \\approx 2.21\\text{ GB}$$
5. **后台最终计费总量**：
   $$B_{\\text{billed}} = 1.0 \\times (105.42 + 2.21) = 107.63\\text{ GB}$$
6. **推导结论**：原本 100GB 的文件在真实网络下必然产生 $107.63\\text{ GB}$ 的合理扣量（超出部分为协议损耗、丢包重传与双向上行）。若后台扣除 125GB，则证明存在约 $17.4\\text{ GB}$ 的异常偏差，具备提交技术工单的坚实证据支撑。`,
    cotConclusion: '重度下载必须控制单任务并发线程数（推荐 <=8），规避高峰期拥塞丢包，并优选支持 BBR 拥塞控制的专属大容量节点。',
    checklistItems: [
      ['下载并发线程收敛', '将多线程下载工具并发数控制在 4~8 线程，避免过多 TLS 握手开销'],
      ['错峰执行超大传输', '将 50GB 以上的超大任务安排在深夜或清晨执行，规避晚高峰跨境公网丢包'],
      ['优先连接低倍率线路', '大流量持续传输严格绑定 0.2x~0.5x 专有下载节点，成倍拉伸可用容量'],
      ['开启 BBR 拥塞控制', '确保客户端系统与软路由开启 BBR 算法，降低丢包引发的恶性重传'],
      ['严格设置单任务限额', '在下载器中设立速度与总额度熔断阈值，防止死循环异常耗尽整月配额'],
      ['排除局域网互传流量', '核验内网 NAS 备份与局域网设备互传未被代理 TUN 网卡误劫持'],
      ['单任务前后截屏留存', '大任务执行前后截取控制台面板快照，计算准确增量 $\\Delta Q$'],
      ['关注服务商 FUP 政策', '查验服务商是否存在“单日跑满 100GB 触发临时限速”的公平使用限制']
    ],
    metricCardItems: [
      ['峰值持续吞吐', '保障持续跑满 500Mbps~1000Mbps 不断流'],
      ['月度大额度支持', '提供 500GB 至 2TB 以上超大容量套餐'],
      ['晚高峰抗丢包率', '晚高峰跨境丢包率 < 1.5% (专线或优质优化链路)'],
      ['无严苛 FUP 限制', '无恶意单日限额截断，支持合法合规持续高吞吐']
    ],
    prevLink: ['大流量专题：重度任务拆分与测算', '/high-data/demand/task-inventory/'],
    nextLink: ['大流量专题：持续速度与完成时间换算', '/high-data/demand/capacity/'],
    relatedLink: ['倍率规则：单倍率与可用额度计算', '/multipliers/calculation/single-rate/'],
    ctaTitle: '大流量需求已明确？前往主站寻找带宽充裕的标杆服务',
    ctaDesc: '拿着持续高吞吐与低丢包率需求指标，前往机场榜一查看经过严苛压测、大容量大带宽口碑卓越的优质服务商。',
    ctaButton: '查看大流量专属高速套餐 →'
  },
  {
    file: 'occasional.ts',
    category: 'occasional',
    domainName: '低频使用与间歇需求',
    wireProtocolTrace: `\`\`\`text
[Idle Standby Session Trace] Low-frequency Background Activity:
├── App Keepalive: TCP Keepalive Probe (Interval: 45s, 0 Bytes Payload)
├── Push Notifications: APNs/FCM TLS 1.3 Heartbeat (~120 Bytes/min)
└── Idle Standby Daily Overhead = (120 Bytes * 60 * 24) ≈ 172.8 KB/Day (极低)
\`\`\`
- **待机心跳物理基线**：纯待机状态下，代理客户端维持的长连接每天仅消耗不到 1MB 流量。
- **唤醒即失风险**：数周不使用时，若订阅凭据被服务端重置或节点域名遭受污染，会在需要紧急使用时出现无法解析的故障。`,
    cotTheme: '长静默期后的瞬时可用性与最低沉没成本维护',
    cotProblem: '用户偶尔出差或周末查阅一次资料，平时数周不用，却每月全额缴纳 30 元月租，且每次紧急使用时频繁遇到订阅过期或节点失效。',
    cotH1: '间歇性需求具有极高的离散特征，按月订购模式导致 80% 以上的购买额度在月末被强制清零沉没；',
    cotH2: '长期不连接导致客户端本地配置的节点 IP 严重老化失效，缺乏自动化订阅静默更新；',
    cotH3: '系统后台静默自动更新（如 Windows Update、云盘同步）在用户偶然联网的瞬间突发跑量，瞬间消耗宝贵额度。',
    cotMathFormula: 'R_{\\text{loss}} = \\frac{Q_{\\text{package}} - Q_{\\text{actual}}}{Q_{\\text{package}}} \\times 100\\%',
    cotCalculations: `**低频用户年化浪费成本手算推导**：
某间歇使用用户每月实际仅需出海查阅文献或收发邮件 2 次，每次消耗约 $1.5\\text{ GB}$（月均实际需求仅 $3.0\\text{ GB}$）：
1. **采用常规轻量月付套餐（20元/月，60GB/月）**：
   - 年化现金支出：$20 \\times 12 = 240\\text{ 元/年}$；
   - 年化实际消耗物理流量：$3.0 \\times 12 = 36.0\\text{ GB/年}$；
   - 额度有效利用率：
     $$U = \\frac{36.0}{720.0} = 5.0\\% \\quad (\\text{高达 } 95\\% \\text{ 的已付额度被白白清零浪费！})$$
   - 真实单位使用成本：$\\frac{240\\text{ 元}}{36\\text{ GB}} \\approx 6.67\\text{ 元/GB}$！
2. **改用高性价比按量不限时方案（100元/500GB，折合 0.20元/GB）**：
   - 支撑整整两年的消耗仅需支出：$36.0 \\times 2 \\times 0.20 = 14.40\\text{ 元}$；
   - 每年实际节省开销超 **$220\\text{ 元}$**（降幅超 $90\\%$）！`,
    cotConclusion: '低频间歇用户必须果断放弃常规固定月付，转向“优质按量方案＋长效备用订阅”组合，消除月末额度清零损失。',
    checklistItems: [
      ['评估月均活跃天数', '若每月实际使用天数 <= 5 天，强制判定为低频用户，规避月付'],
      ['采购按量无期限套餐', '优先选购无硬性到期时间的按量套餐，使资金转化为长效额度资产'],
      ['配置多源备用订阅', '配置两个不同主体的轻量服务订阅，防范关键时刻单一服务商故障'],
      ['关闭客户端开机自启', '非工作日关闭代理软件自启动，杜绝后台静默进程暗中偷跑流量'],
      ['连接前一键刷新配置', '久未开启后使用前，先在客户端点击“更新订阅”拉取最新节点'],
      ['禁用蜂窝云相册同步', '在移动设备上设置“仅在家庭 Wi-Fi 下同步相册”，防止突发外网消耗'],
      ['记录轻量基线账本', '每次使用完毕后在本地账本记录起始差额，监控长周期损耗速度'],
      ['妥善离线保存凭据', '将订阅链接与关键配置以脱敏形式保存在本地密码库中']
    ],
    metricCardItems: [
      ['按量无强制月租', '支持纯按量扣费，账户无隐藏月度保底消费'],
      ['多地容灾可用性', '节点长效在线，静默数月后依然秒级连通'],
      ['平价轻量小套餐', '提供年付极低门槛的应急轻量保活档位'],
      ['订阅节点动态维稳', '后端自动解析优化，节点 IP 长期有效']
    ],
    prevLink: ['低频使用：活跃日与空闲日需求模式', '/occasional/patterns/active-days/'],
    nextLink: ['低频使用：备用节点与切换要求', '/occasional/patterns/backup/'],
    relatedLink: ['按量方案：用量适配与月付对比', '/payg/fit/comparison/'],
    ctaTitle: '低频策略已理顺？前往主站寻找长效保活的高性价比服务',
    ctaDesc: '拿着零月租与高稳定性指标，前往机场榜一查看针对低频轻度与应急备用场景专项评测的优质服务商。',
    ctaButton: '查看适合低频备用的长效套餐 →'
  },
  {
    file: 'video.ts',
    category: 'video',
    domainName: '流媒体与视频传输用量',
    wireProtocolTrace: `\`\`\`text
[HLS/DASH Streaming Session Trace] 4K Video Segment Fetch:
├── HTTP/2 GET /video/segment_0042.m4s (Range: bytes=0-2097151)
├── Content-Type: video/iso.segment (HEVC/H.265 Main 10 Profile)
├── Segment Duration: 2.000s, Segment Size: 2,097,152 Bytes (2MB)
└── Real-time Bitrate: (2MB * 8) / 2s = 8.388 Mbps
    └── Pre-buffering Queue: 客户端在起播 10 秒内连续预拉取 15 个分片 (~30MB)
\`\`\`
- **流媒体切片预加载（Pre-buffering）机制**：现代播放器为了杜绝卡顿，在起播瞬间会以全速拉取后续数十秒的切片。如果用户看了 30 秒就划走，已预载的几十兆数据将彻底废弃。
- **自适应码率（ABR）瞬态跃迁**：检测到带宽充足时，算法自动从 1080p (4Mbps) 切换至 4K (20Mbps)，单位时间消耗瞬间暴增 5 倍。`,
    cotTheme: '自适应码率跳跃与预加载丢弃损耗模型',
    cotProblem: '用户看视频只看了 15 分钟就关闭，但客户端显示消耗了数个 GB；或者 4K 播放频繁由于画质切换导致额度暴增。',
    cotH1: '现代流媒体播放器（如 YouTube、Netflix）采用激进的 DASH/HLS 分段预加载策略，前 30 秒即拉取数分钟缓冲；',
    cotH2: '自适应码率算法（ABR）在检测到网络突发高带宽时自动切入 4K 60fps（码率瞬间由 5Mbps 飙升至 25Mbps）；',
    cotH3: '投屏（AirPlay/Chromecast）过程中，由于分流规则未正确设置，导致电视端与手机端产生双倍重复拉流。',
    cotMathFormula: 'V_{\\text{video}} = R_{\\text{Mbps}} \\times 0.45 \\times T_{\\text{hours}} + \\sum N_{\\text{skip}} \\times \\text{Buffer}_{\\text{discard}}',
    cotCalculations: `**视频播放真实流量手算推导（标准电影 vs 短视频刷屏）**：
1. **完整观看一部 2 小时 1080p 优质电影**：
   - 平台实测综合视频码率：$5.5\\text{ Mbps}$，音频码率 $448\\text{ kbps}$，合计 $R = 5.948\\text{ Mbps}$；
   - 实际物理传输消耗计算：
     $$V = 5.948 \\times 0.45 \\times 2.0 = 5.353\\text{ GB}$$
   - 连接 0.5x 专属流媒体节点：后台实际扣费仅 $5.353 \\times 0.5 = 2.677\\text{ GB}$。
2. **刷短视频 1 小时（频繁快速划走）**：
   - 每条短视频平均时长 30 秒，实际观看 8 秒即划走，划走时播放器已预拉取 30 秒完整载荷（每条约 15MB）；
   - 1 小时内划过 120 条短视频：
     $$V_{\\text{short}} = 120 \\times 15\\text{ MB} = 1,800\\text{ MB} = 1.80\\text{ GB}$$
   - 其中用户真正看到的画面仅约 $0.48\\text{ GB}$，近 $73\\%$ 的流量作为预加载切片被丢弃！`,
    cotConclusion: '长视频观影应在播放器中锁定画质以抑制 ABR 骤增，短视频浏览应控制滑动节奏，并务必利用 0.2x~0.5x 低倍率节点看剧。',
    checklistItems: [
      ['播放器画质手动锁定', '在客户端中将画质由“自动”锁定为 1080p 或 4K，防止 ABR 算法暗中跃迁'],
      ['投屏路由规则核验', '排查智能电视与投屏设备是否命中了正确的代理分流，杜绝多端重复拉流'],
      ['退出播放及时关闭', '暂停或中止观看时及时关闭播放器标签，防止后台无休止预加载'],
      ['套用 0.45 黄金换算法则', '根据每小时码率公式（4K约 7~11GB/h）精确规划当月观影预算'],
      ['追剧优选低倍率节点', '高码率追剧优先选用 0.2x~0.5x 低倍率专属流媒体节点，额度延长 2~5 倍'],
      ['查验硬件解码支持', '检查设备显卡是否支持 AV1/HEVC 硬解码，同等画质下降低 30% 码率需求'],
      ['家庭多屏配额管控', '家庭多设备并用时为智能电视分配独立的并发带宽与月度配额'],
      ['月底适时切入省流档', '月底额度紧张时将播放画质降至 720p，每小时仅消耗约 1.1GB']
    ],
    metricCardItems: [
      ['流媒体原生解锁', '100% 稳定解锁 Netflix / Disney+ / YouTube Premium'],
      ['专属低倍率线路', '提供 0.1x~0.5x 流媒体大流量高速节点'],
      ['晚高峰吞吐保证', '晚高峰 20:00 4K 拖拽秒开不转圈 (单线程带宽 > 50Mbps)'],
      ['多端大屏并发', '支持电视盒子与移动端多设备同时在线观看']
    ],
    prevLink: ['视频用量：码率、时长与容量精确换算', '/video/models/bitrate/'],
    nextLink: ['视频用量：自适应画质与缓冲损耗', '/video/models/adaptive/'],
    relatedLink: ['倍率规则：多节点加权平均倍率公式', '/multipliers/calculation/mixed-rates/'],
    ctaTitle: '流媒体需求已明确？前往主站寻找 4K 秒开的观影专线',
    ctaDesc: '拿着原生解锁与低倍率节点指标，前往机场榜一查看经过 4K/8K 极致画质压测、流媒体解锁稳定的顶级服务商。',
    ctaButton: '查看流媒体专属优化套餐 →'
  },
  {
    file: 'ai.ts',
    category: 'ai',
    domainName: 'AI 交互与大模型任务',
    wireProtocolTrace: `\`\`\`text
[HTTP/2 SSE Streaming Frame Trace] OpenAI / Anthropic Chat Session:
├── HEADERS frame: stream_id=1, :status=200, content-type: text/event-stream
├── DATA frame: stream_id=1, flags=0, length=48 (data: {"delta":{"content":"思考"}})
├── DATA frame: stream_id=1, flags=0, length=52 (data: {"delta":{"content":"过程"}})
└── HTTP/2 PING frame: keepalive every 15s (8 Bytes Payload)
    └── 协议开销分析：单次纯文本对话 50 轮输出，有效文字载荷仅 15KB，但在 HTTP/2 分块与 TLS 封装下出网约 85KB。
\`\`\`
- **Token 费用与网络字节解耦公理**：Token 是大模型内部的语义分词单位（计费按每百万 Token 美元计），网络账本记录的是纯物理传输字节（按 GB 计）。
- **长上下文（Context Window）代码上传黑洞**：使用 Cursor/Copilot 编程时，插件会将工程全部代码文件打包为上下文在后台持续发送，几分钟即可产生数百兆出网流量。`,
    cotTheme: 'Token 语义计费与 HTTP/2 SSE 物理传输的脱节解构',
    cotProblem: '开发者困惑为什么在 ChatGPT/Claude 中消耗了 100 万 Token，但在代理账本中只记录了几十 MB；或者使用 AI 编程插件时用量异常激增。',
    cotH1: 'Token 是大模型内部的语义分词单位，而网络账本记录的是经 HTTP 压缩后的纯物理报文字节；',
    cotH2: '流式响应（Server-Sent Events）频繁推送微小文本块，导致每个小包均包含独立的 HTTP/2 标头与 TLS 帧开销；',
    cotH3: 'AI 编程插件（如 Cursor、Copilot）在后台静默将整个代码工程文件作为 Context 上下文反复上传。',
    cotMathFormula: 'V_{\\text{network}} = N_{\\text{req}} \\times \\left( \\text{Payload}_{\\text{text}} + \\Delta_{\\text{context}} + H_{\\text{HTTP2}} + H_{\\text{TLS}} \\right)',
    cotCalculations: `**纯文本 AI 对话 vs 编程插件工程上传物理消耗推导**：
1. **重度纯文本对话（全天 100 轮交互）**：
   - 用户提问平均 200 字，AI 详细回答平均 1000 字；
   - 经 gzip/br 压缩后，单轮交互净数据载荷仅约 $1.8\\text{ KB}$；
   - 附加前端静态资源（JS/CSS）与心跳底座：每日全天出网仅约 **$45.0\\text{ MB}$**；
   - **全月 30 天累计**：$45.0 \\times 30 = 1,350\\text{ MB} \\approx 1.35\\text{ GB}$！
2. **AI 编程插件（Cursor 全自动索引工程）**：
   - 某中型前端项目包含 1,200 个源码文件，工程打包体积 $45.0\\text{ MB}$；
   - 每次长提问或代码重构，插件在后台重新扫描索引并向远程 API 推送工程上下文；
   - 一天进行 15 次重构问答：
     $$V_{\\text{coding}} = 15 \\times 45.0\\text{ MB} = 675.0\\text{ MB/天}$$
   - 全月 22 个工作日累计出网高达 **$14.85\\text{ GB}$**（是纯网页对话的 11 倍）！`,
    cotConclusion: '纯文本 AI 交互无需大容量套餐；真正的流量黑洞在于“长上下文代码工程上传”与“AI 生成多模态高分辨率图像/视频下载”。',
    checklistItems: [
      ['分清计量双重标准', '分清 API 费用（按 Token 收取美元）与机场流量（按字节扣除 GB）的区别'],
      ['审查 IDE 插件上传', '审查 Cursor/Copilot 等插件的工程自动索引与上下文上传范围，配置 .cursorignore'],
      ['匹配超低延迟节点', '在客户端中将 AI API 域名匹配至超低延迟原生节点（RTT <= 50ms），保障秒出首字'],
      ['高频对话保持连接', '高频长连接对话避免频繁断开重连以减少 TLS 握手与 Cloudflare 验证探针'],
      ['多模态素材本地预剪', '大文件（PDF/高分辨率图片）喂给 AI 前在本地做适当裁剪与压缩'],
      ['区分流式与全量损耗', '理解流式传输（SSE）微小分块带来的轻微协议膨胀，属于正常物理开销'],
      ['定期开启新 Session', '为长对话定期开启新会话，避免历史对话上下文越滚越大产生无谓传输'],
      ['排查插件死循环调用', '定期排查后台 AI 扩展是否有自动化轮询或死循环调用异常']
    ],
    metricCardItems: [
      ['原生 IP 纯净度', '100% 解锁 OpenAI / Claude / Gemini / Midjourney'],
      ['低延迟 RTT 响应', 'API 端点往返延迟 <= 50ms (极速流式打字输出)'],
      ['流式长连接保持', '支持长时间 WebSocket 与 SSE 连接稳定不掉线'],
      ['风控秒级穿透', '原生机房 IP 纯净，秒过 Cloudflare Turnstile 验证码']
    ],
    prevLink: ['AI用量：文本对话与网络字节边界', '/ai/tokens-not-gb/'],
    nextLink: ['AI用量：上下文载荷与多模态上传', '/ai/context-payload/'],
    relatedLink: ['用量记录：字段、单位与时间戳规范', '/records/source-unit/'],
    ctaTitle: 'AI 交互指标已明确？前往主站寻找原生解锁标杆节点',
    ctaDesc: '拿着低时延与原生 IP 纯净度指标，前往机场榜一查看经过大模型接口严密连通性评测的专业网络服务。',
    ctaButton: '查看 AI 专用原生节点套餐 →'
  },
  {
    file: 'mobile.ts',
    category: 'mobile',
    domainName: '手机用量与移动系统特性',
    wireProtocolTrace: `\`\`\`text
[Mobile OS VpnService Socket Routing] Android/iOS Layer:
├── Physical Interface: rmnet_data0 (蜂窝网络) / wlan0 (Wi-Fi)
├── Virtual Interface: tun0 (Clash / Sing-box / Loon / Surge)
└── Duplicate Attribution Trap:
    └── 系统流量统计将数据包计入 App A，同时计入 VpnService 宿主 App，产生 200% 统计假象！
\`\`\`
- **移动端 VpnService 虚拟回环重复计量陷阱**：移动操作系统将所有通过虚拟网卡的数据包同时记录在“发起请求的 App”和“代理软件本身”两个条目中。若盲目将各 App 消耗相加，数字将直接翻倍。
- **iOS Wi-Fi 助理（Wi-Fi Assist）静默偷跑**：在 Wi-Fi 信号衰减时，系统在无通知状态下静默启动蜂窝数据出网。`,
    cotTheme: '移动端系统虚拟网卡双重计数与热点中继去重',
    cotProblem: '手机开启热点给电脑上网，发现手机流量统计和电脑统计加在一起远超实际消耗；或者手机锁屏待机时流量持续暗中偷跑。',
    cotH1: '手机系统内部的 VpnService 机制会导致流量在物理网卡与虚拟网卡之间产生重复计算；',
    cotH2: 'iOS 的“无线局域网助理（Wi-Fi Assist）”在 Wi-Fi 信号微弱时静默切换为蜂窝网络出网；',
    cotH3: '手机开热点时，手机自身充当软网关，同一笔流量在热点进站和蜂窝出站时极易被三方软件计入两次。',
    cotMathFormula: 'V_{\\text{real}} = V_{\\text{tethering_host}} = V_{\\text{client_observed}} \\quad (\\text{严禁将二者求和})',
    cotCalculations: `**移动热点共享与系统双重计算清洗推导**：
某用户使用 iPhone 开启热点为 MacBook 提供网络支持，在电脑上下载了 $5.00\\text{ GB}$ 资料：
1. **各端数据采集快照**：
   - 电脑端代理客户端统计：下行 $5.12\\text{ GB}$；
   - 手机系统“个人热点”统计：消耗 $5.15\\text{ GB}$；
   - 手机内部代理客户端（如 Loon/Shadowrocket）统计：出网 $5.18\\text{ GB}$；
2. **错误合并统计**：
   若将手机端与电脑端简单求和：
   $$V_{\\text{err}} = 5.12 + 5.15 + 5.18 = 15.45\\text{ GB} \\quad (\\text{产生 300% 虚假膨胀！})$$
3. **因果链真实还原**：
   - 手机只是数据传输的透明物理管道；
   - 真实出网流量仅为 **$5.18\\text{ GB}$**（以手机代理内核出网物理报文为唯一基准）；
4. **锁屏偷跑排查**：关闭手机系统“iCloud 云备份”在蜂窝网络下的权限，待机 8 小时流量从 $180\\text{ MB}$ 瞬间降至 $1.2\\text{ MB}$！`,
    cotConclusion: '手机热点场景严禁双端求和；移动端必须在客户端中配置严格的国内直连分流，并在锁屏前关闭蜂窝云备份。',
    checklistItems: [
      ['关闭 iOS 无线局域网助理', '在手机设置中关闭 iOS“无线局域网助理”，防范弱信号下静默偷跑蜂窝'],
      ['热点共享唯一基准', '手机热点共享时仅以手机端出口统计为准，电脑端记录不作叠加'],
      ['限制云相册备份网络', '将系统云相册备份限制为“仅在直连 Wi-Fi 下进行”，禁用蜂窝备份'],
      ['排查国内直连分流', '排查移动客户端分流规则，确保微信、高德等国内 App 严格走 DIRECT'],
      ['运营商与机场对齐', '对齐手机运营商计费日（通常每月1日）与机场服务商重置日时间戳'],
      ['定期核查 App 排行榜', '定期在系统“蜂窝网络”设置中核验各 App 消耗排行，揪出异常后台消耗'],
      ['跨国漫游关闭大更新', '跨国漫游或限流卡状态下关闭系统的 App 自动大更新开关'],
      ['换机无损导出备份', '新机换机时通过本站纯本地导出功能实现账本无损迁移']
    ],
    metricCardItems: [
      ['移动端保活能力', '后台长驻稳定，切换 Wi-Fi/蜂窝瞬间秒级重连不断流'],
      ['轻量低功耗协议', '支持高效轻量协议，降低手机发热与电池消耗'],
      ['国内分流精准度', '国内应用 100% 精确分流直连，不浪费一分代理额度'],
      ['多端连接池支持', '支持手机、平板与笔记本共用单一订阅凭据']
    ],
    prevLink: ['手机用量：Android 与 iOS 统计读取', '/mobile/counters/android/'],
    nextLink: ['手机用量：热点共享与计数层级去重', '/mobile/counters/hotspot/'],
    relatedLink: ['设备数量：跨设备统计去重算法', '/devices/router-client-duplicate/'],
    ctaTitle: '移动需求已梳理？前往主站寻找省电低延迟移动套餐',
    ctaDesc: '拿着精准分流与低功耗需求指标，前往机场榜一查看针对移动端深度优化、待机稳定省电的优质服务商。',
    ctaButton: '查看适合手机移动端的套餐 →'
  },
  {
    file: 'devices.ts',
    category: 'devices',
    domainName: '多设备并用与额度池分配',
    wireProtocolTrace: `\`\`\`text
[Router Gateway NAT Conntrack Table] Multi-Device Routing:
├── Dev 1: 192.168.1.101 (iPhone) -> NatPort: 41001 -> Proj Proxy Out
├── Dev 2: 192.168.1.102 (MacBook) -> NatPort: 41002 -> Proj Proxy Out
├── Dev 3: 192.168.1.103 (Apple TV) -> NatPort: 41003 -> Proj Proxy Out
└── Provider Concurrency Check: Max Allowed IPs = 3 (当前状态：饱和临界)
    └── 嵌套代理陷阱：若路由器运行 Clash，下挂 MacBook 亦运行 Clash，产生二次封装与双倍扣量！
\`\`\`
- **公网 IP 并发限制（Concurrent IP Limit）**：服务商服务端按外部连接源 IP（而非局域网内网 IP）判断并发。同一家庭路由器下的所有设备对外呈现为单一公网 IP，但多设备跨网络（如手机用蜂窝、电脑用宽带）会立即触发 2 个公网 IP 计数。
- **软路由与客户端嵌套代理（Nested Proxying）**：网关层接管了流量，客户端又开了一层加密隧道，引发两倍流量消耗与加倍握手延迟。`,
    cotTheme: '跨终端并发连接数约束与网关级重复核算',
    cotProblem: '家庭或小团队 5 台设备共用一个机场套餐，频繁遭遇“连接数超限被断网”，且月末总账单比各设备记录之和多出几十个 GB。',
    cotH1: '服务商对单一订阅限制了最大公网并发 IP 数（通常为 2~5 个），超出后自动掐断新连接；',
    cotH2: '软路由（Gateway）模式下，路由器与下挂终端若均安装了代理软件，会导致流量被连续代理并扣除两次；',
    cotH3: '多设备时钟存在漂移，跨终端记录汇总量在时间轴上产生相位交错。',
    cotMathFormula: 'Q_{\\text{pool_total}} = \\sum_{k=1}^M Q_{\\text{device}, k} - \\sum Q_{\\text{internal_interconnect}}',
    cotCalculations: `**家庭多设备额度池分配与去重手算推导**：
某家庭拥有 4 台设备共用一个 $200\\text{ GB}$ 月度套餐：
1. **各端独立测算月度需求**：
   - 智能电视（4K 追剧）：$80.00\\text{ GB}$；
   - 主人笔记本（远程办公与代码）：$45.00\\text{ GB}$；
   - 主人手机（移动社交与短视频）：$25.00\\text{ GB}$；
   - 家人平板（在线网课与流媒体）：$30.00\\text{ GB}$；
   - 四端直接累加基线：$80 + 45 + 25 + 30 = 180.00\\text{ GB}$；
2. **剔除嵌套代理与重复拉流**：
   - 发现主人笔记本通过投屏将电影发送给智能电视，在软路由层产生了 $8.50\\text{ GB}$ 的局域网内转外重复捕获；
   - 剔除重复量后真实需求为 $171.50\\text{ GB}$；
3. **并发安全冗余配置**：
   - 留存 $28.50\\text{ GB}$ 作为共享缓冲池（Buffer Pool）；
   - 为各设备设定月度软警报线（电视 $90\\text{G}$、电脑 $50\\text{G}$、手机 $30\\text{G}$、平板 $35\\text{G}$），杜绝单端异常跑光全家额度。`,
    cotConclusion: '多端共用必须在网关层做集中统一接管，严格查验服务商允许的同时在线 IP 上限，并建立家庭成员用量分配预算制。',
    checklistItems: [
      ['公网并发 IP 上限查验', '查验服务商条款，明确“同时在线客户端/公网 IP 数限制”（如 2~5 端）'],
      ['杜绝嵌套代理双重扣费', '路由器开启网关代理时，下挂设备必须关闭自身客户端代理，防止双重扣量'],
      ['静态局域网 IP 划分', '为各成员设备在路由器中分配固定 IP，便于按设备归集统计报表'],
      ['全端 NTP 时间同步', '定期同步各终端系统时钟至标准 NTP 服务器，消除跨端记录时间相位差'],
      ['多端合并导入去重', '使用本站设备聚合工具统一导入各端 CSV 并执行去重清洗'],
      ['设定共享池警戒红线', '设立家庭/团队共享额度池的 80% 警戒通知阈值，防范月末全员断网'],
      ['闲置设备后台监控', '排查智能电视、NAS 等闲置设备的静默后台跑量，非观影时休眠连接'],
      ['离队设备即时重置凭据', '设备转让、出借或淘汰前，立即在控制台重置订阅凭据防范外泄']
    ],
    metricCardItems: [
      ['最大在线设备数', '支持 >= 5 台设备跨网络同时在线并发'],
      ['单端连接并发量', '单设备并发 TCP 连接数 >= 1000 (满足多任务)'],
      ['多端速率不互锁', '多设备并发传输不锁单端速度，带宽动态均衡分配'],
      ['子账户凭据隔离', '支持多订阅凭据独立管理，方便按成员重置']
    ],
    prevLink: ['设备数量：设备、连接与账户关系', '/devices/devices-vs-connections/'],
    nextLink: ['设备数量：跨设备统计去重算法', '/devices/router-client-duplicate/'],
    relatedLink: ['账单核对：来源与计费口径对齐', '/reconcile/alignment/basis/'],
    ctaTitle: '多端架构已理顺？前往主站寻找支持多设备的大额方案',
    ctaDesc: '拿着并发设备数与去重核算指标，前往机场榜一查看经过多终端并发压力实测、连接限制宽松的标杆服务商。',
    ctaButton: '查看支持多设备的优质套餐 →'
  },
  {
    file: 'reconcile.ts',
    category: 'reconcile',
    domainName: '账单核对与争议取证闭环',
    wireProtocolTrace: `\`\`\`text
[Standard Reconciliation Benchmark Session] Pure 1GB Payload Test:
├── Baseline Snapshot T0: Provider Used: 42.150 GB, Local TUN: 104,857,600 Bytes
├── Benchmark Run: Download 1,000,000,000 Bytes (Official Kernel ISO)
├── Silent Cooldown Window: 20 Minutes (RADIUS Aggregation Wait)
└── Benchmark Snapshot T1: Provider Used: 43.195 GB, Local TUN: 1,104,857,600 Bytes
    └── Differential Math: Delta Provider = 1.045 GB, Delta Local = 1.000 GB -> M_actual = 1.045x
\`\`\`
- **RADIUS 会话审计属性（RFC 2866）**：服务端按 \`Acct-Input-Octets\` 与 \`Acct-Output-Octets\` 记录字节流。该数据由接入点定时（通常每 15 分钟）向中心计费数据库批量推送。
- **证据链闭环法则**：向客服主张计量不符时，单次截屏毫无说服力。必须提供“测试前快照＋标准载荷传输日志＋测试后快照＋静默缓冲期”的四位一体 Level 1 证据闭环。`,
    cotTheme: '最小可复现证据包与技术工单沟通闭环',
    cotProblem: '用户怀疑服务商暗扣流量，提交工单投诉却因证据不足被客服驳回；或者服务商排查发现是用户自身配置失误引发的误会。',
    cotH1: '情绪化主张（如“你们偷跑流量”）缺乏客观因果链，客服按常规流程无法采取技术行动；',
    cotH2: '必须使用“标准 1GB 开源镜像载荷 + 前后控制台静默快照”构建无可辩驳的 Level 1 证据闭环；',
    cotH3: '服务后台日志聚合存在时间滞后，必须在测试前后预留足够长的批处理窗口。',
    cotMathFormula: '\\Delta Q_{\\text{billed}} = Q_{\\text{after}} - Q_{\\text{before}} = M_{\\text{actual}} \\times V_{\\text{wire}}',
    cotCalculations: `**标准 1GB 纯净测试与倍率反推手算实录**：
1. **测试前置准备（T0: 14:00）**：
   - 关闭所有后台无关网页与云同步；
   - 截取服务商控制台已用量：$Q_0 = 85.200\\text{ GB}$；
   - 客户端虚拟网卡总计数清零或记录初始值：$L_0 = 0.000\\text{ GB}$。
2. **执行标准载荷（14:05~14:10）**：
   - 通过 1.0x 节点从知名开源镜像站（如清华源/中科大源）下载标准 $1.000\\text{ GB}$ 镜像文件；
   - 客户端实测出网物理流量：下行 $1.018\\text{ GB}$，上行 $0.022\\text{ GB}$，总计 $L_1 = 1.040\\text{ GB}$。
3. **静默等待与后置快照（T1: 14:30）**：
   - 静默等待 20 分钟待服务端批处理聚合入库；
   - 截取控制台终值：$Q_1 = 86.242\\text{ GB}$。
4. **反推核算实际扣量倍率**：
   $$\\Delta Q_{\\text{billed}} = 86.242 - 85.200 = 1.042\\text{ GB}$$
   实际扣量倍率反推：
   $$M_{\\text{actual}} = \\frac{1.042\\text{ GB}}{1.040\\text{ GB}} \\approx 1.0019\\text{x}$$
5. **结论归纳**：实测扣量与标称 1.0x 倍率误差仅 $0.19\\%$，完美自洽！证明服务商计费网关完全合规，不存在暗扣行为。`,
    cotConclusion: '通过控制变量法纯净实测，计算出实际倍率 $M_{\\text{actual}}$，并以中立、专业、脱敏的技术报告提交客服，方能高效促成核查纠偏与额度补偿。',
    checklistItems: [
      ['测试前隔离无关流量', '关闭所有后台无关下载、局域网备份与系统静默更新'],
      ['截取初始时间戳快照', '截取测试前服务商后台快照（标明时间戳、已用量与剩余量）'],
      ['选用权威标准载荷', '使用知名官方开源镜像站下载标准 1.00GB 纯净测试文件'],
      ['记录客户端原生字节', '记录客户端 TUN 网卡出网字节数原值，区分上传与下载'],
      ['预留 20 分钟静默窗口', '测试结束后静默等待 20 分钟待服务端 RADIUS 日志批处理聚合完成'],
      ['截取最终终值快照', '截取测试后服务商后台终值快照，提取增量 $\\Delta Q$'],
      ['套用公式反推倍率', '套用差分公式反推实际扣量倍率与单双向计费规则'],
      ['生成标准化技术工单', '依据本站模板生成客观、中立、脱敏的技术证据报告提交客服']
    ],
    metricCardItems: [
      ['工单技术响应力', '具备专业网络工程师核查后台 RADIUS 原始日志'],
      ['规则偏差补偿制', '对确认的服务端配置或倍率失误提供全额额度补偿'],
      ['历史明细可追溯', '控制台支持查询按日或按连接聚合的历史计量日志'],
      ['长期信誉评级', '在主站对账测评中获评五星最高透明度评级']
    ],
    prevLink: ['账单核对：来源与计费口径对齐', '/reconcile/alignment/basis/'],
    nextLink: ['账单核对：最小复现与证据包制作', '/reconcile/resolution/evidence/'],
    relatedLink: ['倍率规则：规则核验与计费观察', '/multipliers/verification/sources/'],
    ctaTitle: '对账方法已掌握？前往主站寻找信誉透明的放心服务',
    ctaDesc: '拿着严谨的证据链与对账标准，前往机场榜一查看经过严苛对账审计、计费数据公认严谨透明的标杆服务商。',
    ctaButton: '查看高信誉透明计费服务 →'
  },
  {
    file: 'knowledge.ts',
    category: 'knowledge',
    domainName: '网络计量百科与可信边界',
    wireProtocolTrace: `\`\`\`text
[OSI & TCP/IP Protocol Encapsulation Stack] L1 to L7 Byte Breakdown:
├── L7 Application: HTTP Payload (1420 Bytes)
├── L6/L5 Security: TLS 1.3 Record Header (5B) + AEAD Auth Tag (16B)
├── L4 Transport: TCP Header (20B + 12B Options) = 32 Bytes
├── L3 Network: IPv4 Header (20 Bytes) -> IP Packet Total: 1493 Bytes
└── L2 Data Link: Ethernet Header (14B) + Frame Check Sequence FCS (4B) = 1511 Bytes
    └── Wire Overhead Rate: (1511 - 1420) / 1420 = +6.41% (每一字节都受物理定律约束)
\`\`\`
- **协议栈逐层封装公理**：每一层网络协议为了寻址、防篡改、重排序和拥塞控制，都必须附加独立的协议头。
- **浏览器沙箱与隐私边界**：合法的网页账本绝无法突破浏览器安全沙箱去窥探用户整机的底层网卡或嗅探未授权数据。坚持纯客户端手工录入与脱敏导入是唯一合规可信的路径。`,
    cotTheme: '网络协议分层封装与加密通信物理开销公理',
    cotProblem: '用户误以为“网络传输是多少字节就应该扣多少字节”，不理解为何真实出网量永远大于文件标称体积，产生普遍认知偏差。',
    cotH1: '现代互联网基于 OSI 七层模型与 TCP/IP 协议栈构建，每一层封装均产生必要的物理标头；',
    cotH2: 'TLS 1.3 强加密提供了网络安全性，但附带了证书握手、AEAD 认证标签与记录填充开销；',
    cotH3: '浏览器沙箱安全机制决定了普通网页绝无法突破沙箱去直接窃听系统底层网卡，合法合规的账本必然坚持纯客户端本地运算。',
    cotMathFormula: '\\text{Overhead Rate} = \\frac{\\text{Headers}_{\\text{Ethernet}} + \\text{Headers}_{\\text{IP}} + \\text{Headers}_{\\text{TCP}} + \\text{Headers}_{\\text{TLS}} + \\text{Headers}_{\\text{Proxy}}}{\\text{Payload}_{\\text{data}}}',
    cotCalculations: `**协议逐层封包与物理开销精准手算**：
当用户在应用层下载一个标称体积为 $100.00\\text{ MB}$ ($104,857,600\\text{ 字节}$) 的文件：
1. **TCP 分段（MTU 1500, MSS 1460）**：
   $$N_{\\text{segments}} = \\left\\lceil \\frac{104,857,600}{1460} \\right\\rceil = 71,821\\text{ 个数据包}$$
2. **各层标头累加消耗**：
   - TCP/IP 报头（40 字节/包）：$71,821 \\times 40 = 2,872,840\\text{ 字节} \\approx 2.74\\text{ MB}$；
   - 以太网链路帧头（18 字节/包）：$71,821 \\times 18 = 1,292,778\\text{ 字节} \\approx 1.23\\text{ MB}$；
   - TLS 1.3 记录与 AEAD 标签（21 字节/记录，每 16KB 一条）：约 $134,144\\text{ 字节} \\approx 0.13\\text{ MB}$；
   - 代理协议私有标头（Shadowsocks/Trojan，约 32 字节/包）：约 $2.30\\text{ MB}$；
3. **物理出网真实总量**：
   $$V_{\\text{wire}} = 100.00 + 2.74 + 1.23 + 0.13 + 2.30 = 106.40\\text{ MB}$$
4. **公理结论**：在 0 丢包的理想环境下，**物理出网量也比应用层净载荷高出整整 $6.40\\%$**！这是保证寻址、路由与加密安全的必要物理代价，绝非服务商偷跑流量。`,
    cotConclusion: '网络协议开销是保障数据安全、防丢包纠错与寻址路由的物理基石；理解物理损耗与商业规则的边界，是做出理性选型的前提。',
    checklistItems: [
      ['建立科学物理开销认知', '建立“物理流量 != 应用层纯净文件载荷”的科学认知，接受 5%~10% 的协议开销'],
      ['区分两种进制单位', '严格区分十进制 GB（10^9 字节）与二进制 GiB（2^30 字节），相差 7.37%'],
      ['理解 TCP 重传补偿', '明确丢包环境下的 TCP 重传属于网络物理层自动补偿机制'],
      ['坚守浏览器沙箱底线', '理解浏览器沙箱是保护个人系统隐私的核心机制，拒绝安装流氓驱动监控'],
      ['严拒未授权证书网页', '坚决拒绝要求在操作系统中安装未受信任根证书的所谓“全自动记账”网页'],
      ['掌握主流代理协议特性', '了解 Shadowsocks、Trojan、VLESS 各自的头部开销与抗封锁特性'],
      ['定期核验自身额度账本', '定期使用本站工具复核自身网络习惯与额度配置，优化套餐匹配'],
      ['主站中立测评辅助选型', '在机场榜一中立客观评测体系的指导下做出科学理性的采购决策']
    ],
    metricCardItems: [
      ['网络标准严谨性', '严格遵循 RFC 与 IETF 国际网络工程标准协议规范'],
      ['隐私安全零妥协', '严格执行零日志无痕策略，绝不窃取或上传用户数据'],
      ['协议透明度披露', '详尽公开各节点采用的加密协议格式与底层拓扑说明'],
      ['中立客观测评认证', '在主站长期性能与计费可靠性跟踪中表现优异']
    ],
    prevLink: ['知识百科：数据单位与数量性质', '/knowledge/measurement/units/'],
    nextLink: ['知识百科：传输、重试与协议封装', '/knowledge/network/transport/'],
    relatedLink: ['用量记录：统计来源与观察范围拆解', '/records/choose-counter/'],
    ctaTitle: '底层机制已通透？前往主站寻找技术过硬的标杆服务',
    ctaDesc: '拿着全面的网络协议与计量标准认知，前往机场榜一查看经过硬核技术拆解、指标真实的顶级网络服务商。',
    ctaButton: '查看通过硬核技术认证的套餐 →'
  }
];

console.log('[ENRICHER-V2] 读取到 12 个专题全维度元数据，开始批量深度升级（排除已单独处理的 3 个专题）...');

for (const meta of CATEGORIES_ENRICHMENT) {
  if (['estimate.ts', 'multipliers.ts', 'video.ts'].includes(meta.file)) {
    console.log(`[SKIP] ${meta.file} 已由 enrich-clusters-v3 独立深度处理，跳过`);
    continue;
  }
  const filePath = path.join(GENERATORS_DIR, meta.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] 文件未找到: ${filePath}`);
    continue;
  }

  let code = fs.readFileSync(filePath, 'utf-8');

  // 构建统一的 DeepSeek-R1 + Checklist + MetricCard Markdown 片段
  const r1SectionMd = `## 六、DeepSeek-R1 深度思维链推导 (Chain-of-Thought 推理复盘)

### 1. 抓包级网络报文解构与协议膨胀分析 (Wire Packet Trace)
${meta.wireProtocolTrace}

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

  // 1. 在插入 code 之前，将 r1SectionMd 中的所有 ` 转换为 \`，防止在目标 .ts 文件的模板字符串中提前截断
  const escapedR1Md = r1SectionMd.replace(/`/g, '\\`');
  code = code.replace(/## 六、常见问题解答与下一步建议\s*\n\s*<FAQ/g, escapedR1Md);

  // 2. 移除原文件末尾重复的通用 MainSiteCTA（因为在 Section 八中已放置专属精准 CTA）
  code = code.replace(/---\s*\n\s*<MainSiteCTA[\s\S]*?\/>\s*\n\s*<Disclosure \/>/g, '<Disclosure />');

  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`[PASS] 成功升级 ${meta.file} (${code.length} 字节)`);
}

console.log('[FINISH] 全站 12 大专题全量 R1 抓包长文、检查表、指标卡与高转化内链环注入完毕！');
