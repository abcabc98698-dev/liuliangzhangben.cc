export interface ArticleMeta {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  cluster: string;
  url: string;
}

export const ARTICLES_DATA: ArticleMeta[] = [
  // 01 用量记录 /records/
  // records / baseline / sources
  { id: 'records:choose-counter', title: '机场流量从哪里记录：设备、客户端与服务后台各能说明什么？', slug: 'choose-counter', category: 'records', subcategory: 'baseline', cluster: 'sources', url: '/records/choose-counter/' },
  { id: 'records:observation-layer', title: '同一段传输为什么会出现在多个计数器里：建立用量记录前先分层', slug: 'observation-layer', category: 'records', subcategory: 'baseline', cluster: 'sources', url: '/records/observation-layer/' },
  { id: 'records:account-anchor', title: '服务后台只显示已用与剩余时，怎样建立可核对的初始账本？', slug: 'account-anchor', category: 'records', subcategory: 'baseline', cluster: 'sources', url: '/records/account-anchor/' },
  { id: 'records:no-device-monitor', title: '网页流量账本能记录什么：为什么不能把它当成整台电脑的自动监控器？', slug: 'no-device-monitor', category: 'records', subcategory: 'baseline', cluster: 'sources', url: '/records/no-device-monitor/' },

  // records / baseline / fields
  { id: 'records:minimum-ledger', title: '第一份机场流量账本怎么建：日期、方向、单位和来源字段清单', slug: 'minimum-ledger', category: 'records', subcategory: 'baseline', cluster: 'fields', url: '/records/minimum-ledger/' },
  { id: 'records:source-unit', title: '来源只写GB没有说明进制，记录时怎样保留原值并标注不确定性？', slug: 'source-unit', category: 'records', subcategory: 'baseline', cluster: 'fields', url: '/records/source-unit/' },
  { id: 'records:timestamp-zone', title: '同一条用量记录要保存哪个时间：本地时间、服务时间与观察时间', slug: 'timestamp-zone', category: 'records', subcategory: 'baseline', cluster: 'fields', url: '/records/timestamp-zone/' },
  { id: 'records:counter-restart', title: '客户端重启后累计数字变小，流量账本应该怎样分段而不是记成负数？', slug: 'counter-restart', category: 'records', subcategory: 'baseline', cluster: 'fields', url: '/records/counter-restart/' },

  // records / baseline / sampling
  { id: 'records:increment-cumulative', title: '按每次增量记录还是抄累计数：两种流量记账方式怎样转换？', slug: 'increment-cumulative', category: 'records', subcategory: 'baseline', cluster: 'sampling', url: '/records/increment-cumulative/' },
  { id: 'records:observation-interval', title: '每天只记录一次流量够不够：怎样选择不会误导结论的采样间隔？', slug: 'observation-interval', category: 'records', subcategory: 'baseline', cluster: 'sampling', url: '/records/observation-interval/' },
  { id: 'records:background-baseline', title: '没有主动下载仍然产生流量，怎样单独记录后台基线？', slug: 'background-baseline', category: 'records', subcategory: 'baseline', cluster: 'sampling', url: '/records/background-baseline/' },
  { id: 'records:missing-interval', title: '中间漏记了两天，怎样标注缺口而不是把平均数当成实际用量？', slug: 'missing-interval', category: 'records', subcategory: 'baseline', cluster: 'sampling', url: '/records/missing-interval/' },

  // records / baseline / evidence-labels
  { id: 'records:measured-vs-modeled', title: '实测流量和估算流量能放在一张表吗：如何标记并分别汇总？', slug: 'measured-vs-modeled', category: 'records', subcategory: 'baseline', cluster: 'evidence-labels', url: '/records/measured-vs-modeled/' },
  { id: 'records:zero-vs-unknown', title: '流量为零、尚未读取与读取失败有什么区别：账本状态怎样设计？', slug: 'zero-vs-unknown', category: 'records', subcategory: 'baseline', cluster: 'evidence-labels', url: '/records/zero-vs-unknown/' },
  { id: 'records:redacted-evidence', title: '截图作为用量证据时应保留什么：隐藏账号、订阅和无关个人信息', slug: 'redacted-evidence', category: 'records', subcategory: 'baseline', cluster: 'evidence-labels', url: '/records/redacted-evidence/' },
  { id: 'records:uncertain-reading', title: '流量显示只有一位小数，怎样记录精度而不制造虚假的精确值？', slug: 'uncertain-reading', category: 'records', subcategory: 'baseline', cluster: 'evidence-labels', url: '/records/uncertain-reading/' },

  // records / management / local-storage
  { id: 'records:session-or-save', title: '临时记账和本地保存怎么选：离开网页后哪些数据应当保留？', slug: 'session-or-save', category: 'records', subcategory: 'management', cluster: 'local-storage', url: '/records/session-or-save/' },
  { id: 'records:browser-storage-loss', title: '浏览器清理缓存后账本不见了，怎样设计可恢复的本地备份习惯？', slug: 'browser-storage-loss', category: 'records', subcategory: 'management', cluster: 'local-storage', url: '/records/browser-storage-loss/' },
  { id: 'records:restore-version', title: '旧版本账本导回新工具前，应该核对哪些字段和计算版本？', slug: 'restore-version', category: 'records', subcategory: 'management', cluster: 'local-storage', url: '/records/restore-version/' },
  { id: 'records:clear-private-ledger', title: '共享电脑上用过流量账本，怎样清除记录并验证没有残留？', slug: 'clear-private-ledger', category: 'records', subcategory: 'management', cluster: 'local-storage', url: '/records/clear-private-ledger/' },

  // records / management / file-import
  { id: 'records:map-csv-columns', title: '把已有表格导入流量账本时，怎样映射日期、单位与上下行列？', slug: 'map-csv-columns', category: 'records', subcategory: 'management', cluster: 'file-import', url: '/records/map-csv-columns/' },
  { id: 'records:repeat-import', title: '同一文件导入两次会不会翻倍：用量记录去重应该依据什么？', slug: 'repeat-import', category: 'records', subcategory: 'management', cluster: 'file-import', url: '/records/repeat-import/' },
  { id: 'records:invalid-import', title: '表格里有空行、负值和错误日期，怎样预览问题再决定是否导入？', slug: 'invalid-import', category: 'records', subcategory: 'management', cluster: 'file-import', url: '/records/invalid-import/' },
  { id: 'records:safe-export', title: '导出流量账本时怎样同时保留口径说明并避免把文本当成公式执行？', slug: 'safe-export', category: 'records', subcategory: 'management', cluster: 'file-import', url: '/records/safe-export/' },

  // records / management / summaries
  { id: 'records:daily-weekly-period', title: '日表、周表和服务周期表怎样保持一致：先统一分组边界', slug: 'daily-weekly-period', category: 'records', subcategory: 'management', cluster: 'summaries', url: '/records/daily-weekly-period/' },
  { id: 'records:share-of-usage', title: '按任务看用量占比时，怎样处理未分类流量和无法归属的部分？', slug: 'share-of-usage', category: 'records', subcategory: 'management', cluster: 'summaries', url: '/records/share-of-usage/' },
  { id: 'records:partial-period-chart', title: '本周期只记录了一半，趋势图怎样避免让人误以为是完整月份？', slug: 'partial-period-chart', category: 'records', subcategory: 'management', cluster: 'summaries', url: '/records/partial-period-chart/' },
  { id: 'records:summary-check', title: '账本汇总比原始记录多了一截，怎样逐层复核筛选、分组和计数？', slug: 'summary-check', category: 'records', subcategory: 'management', cluster: 'summaries', url: '/records/summary-check/' },

  // records / management / audit-trail
  { id: 'records:correct-entry', title: '抄错一条流量记录后应该直接覆盖吗：保留更正原因和原始值的方法', slug: 'correct-entry', category: 'records', subcategory: 'management', cluster: 'audit-trail', url: '/records/correct-entry/' },
  { id: 'records:classification-change', title: '重新给任务分类时，怎样保留历史报表的可解释性？', slug: 'classification-change', category: 'records', subcategory: 'management', cluster: 'audit-trail', url: '/records/classification-change/' },
  { id: 'records:shared-summary', title: '把用量报告发给客服或家人前，怎样生成不带敏感信息的摘要？', slug: 'shared-summary', category: 'records', subcategory: 'management', cluster: 'audit-trail', url: '/records/shared-summary/' },
  { id: 'records:ledger-review-checklist', title: '完成一个服务周期后，怎样用固定检查表审查账本是否可信？', slug: 'ledger-review-checklist', category: 'records', subcategory: 'management', cluster: 'audit-trail', url: '/records/ledger-review-checklist/' },

  // 02 流量估算 /estimate/
  // estimate / models / baseline-sample
  { id: 'estimate:select-sample-days', title: '估算下月机场流量前，应该选哪些天作为观察样本？', slug: 'select-sample-days', category: 'estimate', subcategory: 'models', cluster: 'baseline-sample', url: '/estimate/select-sample-days/' },
  { id: 'estimate:short-trial-sample', title: '只有一天试用记录时能估算月用量吗：怎样表达证据不足？', slug: 'short-trial-sample', category: 'estimate', subcategory: 'models', cluster: 'baseline-sample', url: '/estimate/short-trial-sample/' },
  { id: 'estimate:active-day-baseline', title: '工作日和休息日用量不同，怎样分别建立基线再组合？', slug: 'active-day-baseline', category: 'estimate', subcategory: 'models', cluster: 'baseline-sample', url: '/estimate/active-day-baseline/' },
  { id: 'estimate:atypical-day', title: '样本期恰好下载了大型文件，怎样避免把一次性任务当成日常需求？', slug: 'atypical-day', category: 'estimate', subcategory: 'models', cluster: 'baseline-sample', url: '/estimate/atypical-day/' },

  // estimate / models / task-size
  { id: 'estimate:frequency-duration', title: '按使用时长还是任务次数估算流量：怎样选择合适的输入？', slug: 'frequency-duration', category: 'estimate', subcategory: 'models', cluster: 'task-size', url: '/estimate/frequency-duration/' },
  { id: 'estimate:file-count-size', title: '一批文件要传多少流量：文件数量、大小与重复上传分别怎样计算？', slug: 'file-count-size', category: 'estimate', subcategory: 'models', cluster: 'task-size', url: '/estimate/file-count-size/' },
  { id: 'estimate:partial-transfer', title: '任务中途取消后如何估算已传输部分：不能直接算零或整个文件', slug: 'partial-transfer', category: 'estimate', subcategory: 'models', cluster: 'task-size', url: '/estimate/partial-transfer/' },
  { id: 'estimate:session-overlap', title: '多个任务同时进行时，为什么不能把总在线时长重复用于每个任务？', slug: 'session-overlap', category: 'estimate', subcategory: 'models', cluster: 'task-size', url: '/estimate/session-overlap/' },

  // estimate / models / unit-rate
  { id: 'estimate:mbps-to-gb', title: 'Mbps如何换算成每小时GB：持续速率假设和单位步骤', slug: 'mbps-to-gb', category: 'estimate', subcategory: 'models', cluster: 'unit-rate', url: '/estimate/mbps-to-gb/' },
  { id: 'estimate:mbps-vs-megabytes', title: '下载器的MB/s和测速的Mbps怎么对照，估算时怎样避免八倍误差？', slug: 'mbps-vs-megabytes', category: 'estimate', subcategory: 'models', cluster: 'unit-rate', url: '/estimate/mbps-vs-megabytes/' },
  { id: 'estimate:variable-rate', title: '速率一直变化时怎样估算总流量：分段求和比峰值乘时长可靠在哪？', slug: 'variable-rate', category: 'estimate', subcategory: 'models', cluster: 'unit-rate', url: '/estimate/variable-rate/' },
  { id: 'estimate:unit-rounding', title: 'GB和GiB转换后为什么有小数：容量估算应该在哪一步舍入？', slug: 'unit-rounding', category: 'estimate', subcategory: 'models', cluster: 'unit-rate', url: '/estimate/unit-rounding/' },

  // estimate / models / traffic-scope
  { id: 'estimate:proxied-share', title: '并非所有应用都经过代理，怎样估算真正计入机场的那部分流量？', slug: 'proxied-share', category: 'estimate', subcategory: 'models', cluster: 'traffic-scope', url: '/estimate/proxied-share/' },
  { id: 'estimate:upload-download-budget', title: '需要同时上传和下载的任务，怎样在估算中分开处理两个方向？', slug: 'upload-download-budget', category: 'estimate', subcategory: 'models', cluster: 'traffic-scope', url: '/estimate/upload-download-budget/' },
  { id: 'estimate:overhead-unknown', title: '协议开销没有实际测量时，怎样提供假设范围而不是固定加百分比？', slug: 'overhead-unknown', category: 'estimate', subcategory: 'models', cluster: 'traffic-scope', url: '/estimate/overhead-unknown/' },
  { id: 'estimate:cache-in-estimate', title: '文件大小、解压大小和实际网络传输量不同，估算该用哪个数字？', slug: 'cache-in-estimate', category: 'estimate', subcategory: 'models', cluster: 'traffic-scope', url: '/estimate/cache-in-estimate/' },

  // estimate / forecast / composition
  { id: 'estimate:monthly-task-plan', title: '怎样把浏览、视频和文件任务合成一份月度流量计划？', slug: 'monthly-task-plan', category: 'estimate', subcategory: 'forecast', cluster: 'composition', url: '/estimate/monthly-task-plan/' },
  { id: 'estimate:weekday-weekend', title: '每周使用习惯不一样，如何按实际日历而不是统一乘30估算？', slug: 'weekday-weekend', category: 'estimate', subcategory: 'forecast', cluster: 'composition', url: '/estimate/weekday-weekend/' },
  { id: 'estimate:multi-phase-month', title: '上半月忙、下半月少用，怎样按阶段建立周期流量预测？', slug: 'multi-phase-month', category: 'estimate', subcategory: 'forecast', cluster: 'composition', url: '/estimate/multi-phase-month/' },
  { id: 'estimate:quota-vs-observation', title: '手里有设备统计和服务账单两组数据，预测时应该选哪个作基线？', slug: 'quota-vs-observation', category: 'estimate', subcategory: 'forecast', cluster: 'composition', url: '/estimate/quota-vs-observation/' },

  // estimate / forecast / scenarios
  { id: 'estimate:low-base-high', title: '怎样为下月用量设置低、中、高三种情景而不冒充概率预测？', slug: 'low-base-high', category: 'estimate', subcategory: 'forecast', cluster: 'scenarios', url: '/estimate/low-base-high/' },
  { id: 'estimate:reserve-budget', title: '流量安全余量应该怎样解释：基于任务变化而不是随意加固定比例', slug: 'reserve-budget', category: 'estimate', subcategory: 'forecast', cluster: 'scenarios', url: '/estimate/reserve-budget/' },
  { id: 'estimate:oneoff-reserve', title: '临时会议或大文件任务怎样单独预留额度，避免放大整个日均值？', slug: 'oneoff-reserve', category: 'estimate', subcategory: 'forecast', cluster: 'scenarios', url: '/estimate/oneoff-reserve/' },
  { id: 'estimate:heavy-tail', title: '少数几天消耗大部分流量时，平均数为什么不能单独决定套餐？', slug: 'heavy-tail', category: 'estimate', subcategory: 'forecast', cluster: 'scenarios', url: '/estimate/heavy-tail/' },

  // estimate / forecast / period-fit
  { id: 'estimate:fit-monthly-reset', title: '一个季度估算总量足够，为什么每月重置的套餐仍可能中途不够用？', slug: 'fit-monthly-reset', category: 'estimate', subcategory: 'forecast', cluster: 'period-fit', url: '/estimate/fit-monthly-reset/' },
  { id: 'estimate:remaining-days', title: '周期已经过了一部分，怎样估算剩余天数的需求而不重复算已用量？', slug: 'remaining-days', category: 'estimate', subcategory: 'forecast', cluster: 'period-fit', url: '/estimate/remaining-days/' },
  { id: 'estimate:new-plan-start', title: '新套餐不是月初开始，怎样把预测任务对齐实际生效与到期区间？', slug: 'new-plan-start', category: 'estimate', subcategory: 'forecast', cluster: 'period-fit', url: '/estimate/new-plan-start/' },
  { id: 'estimate:forecast-to-selection', title: '估算结果怎样变成选购条件：额度范围、倍率和重置规则一起交接', slug: 'forecast-to-selection', category: 'estimate', subcategory: 'forecast', cluster: 'period-fit', url: '/estimate/forecast-to-selection/' },

  // estimate / forecast / validation
  { id: 'estimate:forecast-error', title: '月底实际用量超过预测，怎样区分任务增加和模型口径错误？', slug: 'forecast-error', category: 'estimate', subcategory: 'forecast', cluster: 'validation', url: '/estimate/forecast-error/' },
  { id: 'estimate:backtest-forecast', title: '怎样用上一周期记录回测估算工具，而不是只检查公式能运行？', slug: 'backtest-forecast', category: 'estimate', subcategory: 'forecast', cluster: 'validation', url: '/estimate/backtest-forecast/' },
  { id: 'estimate:missing-confidence', title: '样本缺失很多时还能输出单一推荐额度吗：结果置信说明怎样写？', slug: 'missing-confidence', category: 'estimate', subcategory: 'forecast', cluster: 'validation', url: '/estimate/missing-confidence/' },
  { id: 'estimate:update-model', title: '修正估算方法后如何保留旧预测，让用户知道误差为什么变化？', slug: 'update-model', category: 'estimate', subcategory: 'forecast', cluster: 'validation', url: '/estimate/update-model/' },

  // 03 倍率规则 /multipliers/
  // multipliers / calculation / single-rate
  { id: 'multipliers:multiplier-meaning', title: '机场流量倍率怎么算：实际传输、计费量和套餐额度的关系', slug: 'multiplier-meaning', category: 'multipliers', subcategory: 'calculation', cluster: 'single-rate', url: '/multipliers/multiplier-meaning/' },
  { id: 'multipliers:remaining-at-rate', title: '剩余100GB遇到2倍节点还能传多少：统一倍率算例与前提', slug: 'remaining-at-rate', category: 'multipliers', subcategory: 'calculation', cluster: 'single-rate', url: '/multipliers/remaining-at-rate/' },
  { id: 'multipliers:fractional-rate', title: '0.5倍节点为什么可能少扣流量：先核对服务方怎样定义倍率', slug: 'fractional-rate', category: 'multipliers', subcategory: 'calculation', cluster: 'single-rate', url: '/multipliers/fractional-rate/' },
  { id: 'multipliers:rate-not-speed', title: '2倍倍率是否代表两倍速度：计费规则与性能指标为什么要分开？', slug: 'rate-not-speed', category: 'multipliers', subcategory: 'calculation', cluster: 'single-rate', url: '/multipliers/rate-not-speed/' },

  // multipliers / calculation / directions
  { id: 'multipliers:direction-weight', title: '上传10GB、下载30GB应该扣多少：按服务规则选择方向权重', slug: 'direction-weight', category: 'multipliers', subcategory: 'calculation', cluster: 'directions', url: '/multipliers/direction-weight/' },
  { id: 'multipliers:upload-not-free', title: '服务只写流量额度却没写上传是否计费，怎样记录未知并向客服核对？', slug: 'upload-not-free', category: 'multipliers', subcategory: 'calculation', cluster: 'directions', url: '/multipliers/upload-not-free/' },
  { id: 'multipliers:asymmetric-rates', title: '上下行倍率不同的套餐怎样计算：不能用一个平均倍率直接相乘', slug: 'asymmetric-rates', category: 'multipliers', subcategory: 'calculation', cluster: 'directions', url: '/multipliers/asymmetric-rates/' },
  { id: 'multipliers:observed-vs-billed', title: '客户端上下载总和与后台扣量不符，什么时候应先核对方向定义？', slug: 'observed-vs-billed', category: 'multipliers', subcategory: 'calculation', cluster: 'directions', url: '/multipliers/observed-vs-billed/' },

  // multipliers / calculation / mixed-rates
  { id: 'multipliers:weighted-multiplier', title: '混用0.5倍和2倍节点怎么记账：按实际传输量加权而不是平均标签', slug: 'weighted-multiplier', category: 'multipliers', subcategory: 'calculation', cluster: 'mixed-rates', url: '/multipliers/weighted-multiplier/' },
  { id: 'multipliers:rate-session-split', title: '同一任务中途换了节点，怎样把流量分段后重新计算扣量？', slug: 'rate-session-split', category: 'multipliers', subcategory: 'calculation', cluster: 'mixed-rates', url: '/multipliers/rate-session-split/' },
  { id: 'multipliers:missing-rate-segment', title: '混合使用记录缺少一段倍率时，怎样给出范围而不是假定1倍？', slug: 'missing-rate-segment', category: 'multipliers', subcategory: 'calculation', cluster: 'mixed-rates', url: '/multipliers/missing-rate-segment/' },
  { id: 'multipliers:quota-allocation', title: '不同任务分配给不同倍率节点时，怎样核对总额度是否足够？', slug: 'quota-allocation', category: 'multipliers', subcategory: 'calculation', cluster: 'mixed-rates', url: '/multipliers/quota-allocation/' },

  // multipliers / calculation / rate-history
  { id: 'multipliers:rate-effective-time', title: '节点倍率从什么时候变更，账本怎样保存生效时点与旧规则？', slug: 'rate-effective-time', category: 'multipliers', subcategory: 'calculation', cluster: 'rate-history', url: '/multipliers/rate-effective-time/' },
  { id: 'multipliers:cross-change-transfer', title: '一次下载跨过倍率调整时刻，缺少分段计数时怎样处理？', slug: 'cross-change-transfer', category: 'multipliers', subcategory: 'calculation', cluster: 'rate-history', url: '/multipliers/cross-change-transfer/' },
  { id: 'multipliers:label-cache', title: '客户端节点名仍写旧倍率，如何核对它与服务公告和实际扣量？', slug: 'label-cache', category: 'multipliers', subcategory: 'calculation', cluster: 'rate-history', url: '/multipliers/label-cache/' },
  { id: 'multipliers:record-announcement', title: '保存倍率公告时需要哪些字段，才能在以后复算历史账单？', slug: 'record-announcement', category: 'multipliers', subcategory: 'calculation', cluster: 'rate-history', url: '/multipliers/record-announcement/' },

  // multipliers / verification / sources
  { id: 'multipliers:verify-rate-claim', title: '怎样核验机场倍率说明：订单、面板、公告和客服回复如何对照？', slug: 'verify-rate-claim', category: 'multipliers', subcategory: 'verification', cluster: 'sources', url: '/multipliers/verify-rate-claim/' },
  { id: 'multipliers:controlled-rate-test', title: '用一段可控传输观察倍率时，怎样排除其他设备和后台任务干扰？', slug: 'controlled-rate-test', category: 'multipliers', subcategory: 'verification', cluster: 'sources', url: '/multipliers/controlled-rate-test/' },
  { id: 'multipliers:measurement-limit', title: '面板更新延迟与显示取整，会怎样影响倍率小样本核验？', slug: 'measurement-limit', category: 'multipliers', subcategory: 'verification', cluster: 'sources', url: '/multipliers/measurement-limit/' },
  { id: 'multipliers:unexplained-deduction', title: '观察到扣量异常能直接认定服务乱扣吗：先整理可验证的差异', slug: 'unexplained-deduction', category: 'multipliers', subcategory: 'verification', cluster: 'sources', url: '/multipliers/unexplained-deduction/' },

  // multipliers / verification / path-accounting
  { id: 'multipliers:parallel-proxy-paths', title: '两个代理出口并行使用时，怎样区分各自账户的计费流量？', slug: 'parallel-proxy-paths', category: 'multipliers', subcategory: 'verification', cluster: 'path-accounting', url: '/multipliers/parallel-proxy-paths/' },
  { id: 'multipliers:client-tun-duplicate', title: '系统代理与TUN同时显示统计，为什么不能直接把两份数相加？', slug: 'client-tun-duplicate', category: 'multipliers', subcategory: 'verification', cluster: 'path-accounting', url: '/multipliers/client-tun-duplicate/' },
  { id: 'multipliers:network-hop-count', title: '同一份数据经过多个网络环节，哪些计数是观察值而不是新增用量？', slug: 'network-hop-count', category: 'multipliers', subcategory: 'verification', cluster: 'path-accounting', url: '/multipliers/network-hop-count/' },
  { id: 'multipliers:provider-pool', title: '多个节点共享同一个套餐额度，汇总时怎样避免把余额重复计入？', slug: 'provider-pool', category: 'multipliers', subcategory: 'verification', cluster: 'path-accounting', url: '/multipliers/provider-pool/' },

  // multipliers / verification / exceptions
  { id: 'multipliers:zero-rate-condition', title: '零倍率或免扣量说明应该核对什么，为什么不能默认所有请求都免费？', slug: 'zero-rate-condition', category: 'multipliers', subcategory: 'verification', cluster: 'exceptions', url: '/multipliers/zero-rate-condition/' },
  { id: 'multipliers:protocol-billing', title: '同一节点不同接入方式是否同倍率，应当依据哪些资料判断？', slug: 'protocol-billing', category: 'multipliers', subcategory: 'verification', cluster: 'exceptions', url: '/multipliers/protocol-billing/' },
  { id: 'multipliers:rate-unknown-ui', title: '工具遇到未核验倍率时应该怎样显示，不把空值当成0或1', slug: 'rate-unknown-ui', category: 'multipliers', subcategory: 'verification', cluster: 'exceptions', url: '/multipliers/rate-unknown-ui/' },
  { id: 'multipliers:rule-conflict', title: '公告、套餐页和面板对倍率说法不同，怎样记录冲突并暂缓结论？', slug: 'rule-conflict', category: 'multipliers', subcategory: 'verification', cluster: 'exceptions', url: '/multipliers/rule-conflict/' },

  // multipliers / verification / selection
  { id: 'multipliers:compare-effective-quota', title: '比较两款套餐时，怎样把已知倍率换成同口径的可用传输量？', slug: 'compare-effective-quota', category: 'multipliers', subcategory: 'verification', cluster: 'selection', url: '/multipliers/compare-effective-quota/' },
  { id: 'multipliers:rate-cost-tradeoff', title: '低倍率节点一定更划算吗：可用性、任务和使用时段如何一起判断？', slug: 'rate-cost-tradeoff', category: 'multipliers', subcategory: 'verification', cluster: 'selection', url: '/multipliers/rate-cost-tradeoff/' },
  { id: 'multipliers:rate-budget-for-task', title: '准备传一次大文件前，怎样按节点倍率估算本次额度需求？', slug: 'rate-budget-for-task', category: 'multipliers', subcategory: 'verification', cluster: 'selection', url: '/multipliers/rate-budget-for-task/' },
  { id: 'multipliers:multiplier-handoff', title: '流量倍率算完以后，怎样向主站交接条件而不是只按最低倍率选服务？', slug: 'multiplier-handoff', category: 'multipliers', subcategory: 'verification', cluster: 'selection', url: '/multipliers/multiplier-handoff/' },

  // 04 重置周期 /reset/
  // reset / boundaries / calendar
  { id: 'reset:calendar-reset', title: '自然月流量重置怎样计算：月长不同为什么不能一律按30天？', slug: 'calendar-reset', category: 'reset', subcategory: 'boundaries', cluster: 'calendar', url: '/reset/calendar-reset/' },
  { id: 'reset:fixed-day-reset', title: '服务约定每月某日重置，账本应怎样生成每个周期的起止时间？', slug: 'fixed-day-reset', category: 'reset', subcategory: 'boundaries', cluster: 'calendar', url: '/reset/fixed-day-reset/' },
  { id: 'reset:month-end-rule', title: '购买日是29、30或31日时，周期怎么算必须先确认哪条规则？', slug: 'month-end-rule', category: 'reset', subcategory: 'boundaries', cluster: 'calendar', url: '/reset/month-end-rule/' },
  { id: 'reset:calendar-vs-expiry', title: '流量按月重置但服务按年到期，为什么需要两条独立时间线？', slug: 'calendar-vs-expiry', category: 'reset', subcategory: 'boundaries', cluster: 'calendar', url: '/reset/calendar-vs-expiry/' },

  // reset / boundaries / rolling
  { id: 'reset:anniversary-reset', title: '按购买日期重置与按自然月重置有什么区别：用跨月例子说明', slug: 'anniversary-reset', category: 'reset', subcategory: 'boundaries', cluster: 'rolling', url: '/reset/anniversary-reset/' },
  { id: 'reset:fixed-thirty-days', title: '每30天更新额度与每月更新额度何时产生日期差异？', slug: 'fixed-thirty-days', category: 'reset', subcategory: 'boundaries', cluster: 'rolling', url: '/reset/fixed-thirty-days/' },
  { id: 'reset:activation-trigger', title: '付款、激活和首次使用都可能出现，周期起点应该以哪个为准？', slug: 'activation-trigger', category: 'reset', subcategory: 'boundaries', cluster: 'rolling', url: '/reset/activation-trigger/' },
  { id: 'reset:period-unknown', title: '套餐没有说清楚重置周期时，工具应怎样保留待确认状态？', slug: 'period-unknown', category: 'reset', subcategory: 'boundaries', cluster: 'rolling', url: '/reset/period-unknown/' },

  // reset / boundaries / timezone
  { id: 'reset:service-timezone', title: '服务时区与电脑时区不同，怎样正确判断本次使用属于哪个周期？', slug: 'service-timezone', category: 'reset', subcategory: 'boundaries', cluster: 'timezone', url: '/reset/service-timezone/' },
  { id: 'reset:exact-reset-instant', title: '恰好在重置时刻发生的记录归哪边：半开区间如何避免重复归属？', slug: 'exact-reset-instant', category: 'reset', subcategory: 'boundaries', cluster: 'timezone', url: '/reset/exact-reset-instant/' },
  { id: 'reset:cross-boundary-task', title: '一个下载任务跨越重置时刻，只有总量时能否准确拆分扣量？', slug: 'cross-boundary-task', category: 'reset', subcategory: 'boundaries', cluster: 'timezone', url: '/reset/cross-boundary-task/' },
  { id: 'reset:clock-mismatch', title: '面板时间和设备时间对不上，怎样校准记录而不是改写历史？', slug: 'clock-mismatch', category: 'reset', subcategory: 'boundaries', cluster: 'timezone', url: '/reset/clock-mismatch/' },

  // reset / boundaries / remaining
  { id: 'reset:remaining-quota', title: '已用额度、剩余额度和可用天数怎样放在同一张周期表里？', slug: 'remaining-quota', category: 'reset', subcategory: 'boundaries', cluster: 'remaining', url: '/reset/remaining-quota/' },
  { id: 'reset:expiry-vs-zero', title: '额度还没用完但服务到期了，为什么不能把剩余流量当成仍可使用？', slug: 'expiry-vs-zero', category: 'reset', subcategory: 'boundaries', cluster: 'remaining', url: '/reset/expiry-vs-zero/' },
  { id: 'reset:partial-period', title: '中途加入账本时，怎样处理此前已用但没有明细的流量？', slug: 'partial-period', category: 'reset', subcategory: 'boundaries', cluster: 'remaining', url: '/reset/partial-period/' },
  { id: 'reset:remaining-forecast', title: '离重置还有七天，怎样用实际任务安排判断剩余额度是否够用？', slug: 'remaining-forecast', category: 'reset', subcategory: 'boundaries', cluster: 'remaining', url: '/reset/remaining-forecast/' },

  // reset / balances / rollover
  { id: 'reset:no-rollover', title: '每月100GB没有结转时，为什么一年不能随时使用1200GB？', slug: 'no-rollover', category: 'reset', subcategory: 'balances', cluster: 'rollover', url: '/reset/no-rollover/' },
  { id: 'reset:rollover-order', title: '服务允许结转时，需要确认旧额度有效期和扣除顺序的哪些细节？', slug: 'rollover-order', category: 'reset', subcategory: 'balances', cluster: 'rollover', url: '/reset/rollover-order/' },
  { id: 'reset:carry-cap', title: '结转有上限的方案怎样建账，过期与被截断的额度如何分别记录？', slug: 'carry-cap', category: 'reset', subcategory: 'balances', cluster: 'rollover', url: '/reset/carry-cap/' },
  { id: 'reset:pool-separation', title: '基础额度、赠送额度和结转额度怎样分池管理，避免重复算余额？', slug: 'pool-separation', category: 'reset', subcategory: 'balances', cluster: 'rollover', url: '/reset/pool-separation/' },

  // reset / balances / renew-upgrade
  { id: 'reset:renew-period-effect', title: '提前续费会立即重置流量吗：怎样按实际条款建模而不默认发生？', slug: 'renew-period-effect', category: 'reset', subcategory: 'balances', cluster: 'renew-upgrade', url: '/reset/renew-period-effect/' },
  { id: 'reset:upgrade-reset-effect', title: '升级套餐后额度和重置日怎样变化，需要保存哪些前后状态？', slug: 'upgrade-reset-effect', category: 'reset', subcategory: 'balances', cluster: 'renew-upgrade', url: '/reset/upgrade-reset-effect/' },
  { id: 'reset:renew-extend-only', title: '续费只延长时间不补充流量时，账本应怎样解释订单与余额？', slug: 'renew-extend-only', category: 'reset', subcategory: 'balances', cluster: 'renew-upgrade', url: '/reset/renew-extend-only/' },
  { id: 'reset:change-cycle-audit', title: '修改重置规则后，怎样保留旧周期报表并核对新周期？', slug: 'change-cycle-audit', category: 'reset', subcategory: 'balances', cluster: 'renew-upgrade', url: '/reset/change-cycle-audit/' },

  // reset / balances / topups
  { id: 'reset:topup-or-reset', title: '购买补充流量与手动重置套餐有什么不同，如何避免覆盖原余额？', slug: 'topup-or-reset', category: 'reset', subcategory: 'balances', cluster: 'topups', url: '/reset/topup-or-reset/' },
  { id: 'reset:topup-expiry', title: '补充包有单独到期日时，怎样安排使用和显示可用额度？', slug: 'topup-expiry', category: 'reset', subcategory: 'balances', cluster: 'topups', url: '/reset/topup-expiry/' },
  { id: 'reset:consume-order', title: '多个流量包的消耗顺序不明，为什么不能擅自采用最早到期优先？', slug: 'consume-order', category: 'reset', subcategory: 'balances', cluster: 'topups', url: '/reset/consume-order/' },
  { id: 'reset:manual-reset-log', title: '手动重置前后应该记录什么，才能解释当月支出与清零额度？', slug: 'manual-reset-log', category: 'reset', subcategory: 'balances', cluster: 'topups', url: '/reset/manual-reset-log/' },

  // reset / balances / closeout
  { id: 'reset:period-closeout', title: '一个计费周期结束后，怎样整理已用、结转、失效和缺失记录？', slug: 'period-closeout', category: 'reset', subcategory: 'balances', cluster: 'closeout', url: '/reset/period-closeout/' },
  { id: 'reset:aggregate-periods', title: '跨三个月比较用量时，如何避免把不同周期长度造成的变化当成趋势？', slug: 'aggregate-periods', category: 'reset', subcategory: 'balances', cluster: 'closeout', url: '/reset/aggregate-periods/' },
  { id: 'reset:reopen-period', title: '已经结算的周期收到迟到数据，怎样更正而不是重复记账？', slug: 'reopen-period', category: 'reset', subcategory: 'balances', cluster: 'closeout', url: '/reset/reopen-period/' },
  { id: 'reset:reset-boundary-test', title: '怎样验证周期计算器在月末、闰日和时区边界没有漏算或重算？', slug: 'reset-boundary-test', category: 'reset', subcategory: 'balances', cluster: 'closeout', url: '/reset/reset-boundary-test/' },

  // 05 按量方案 /payg/
  // payg / terms / definitions
  { id: 'payg:payg-definitions', title: '按量付费、流量包和不限时机场有什么区别：先看额度与有效条件', slug: 'payg-definitions', category: 'payg', subcategory: 'terms', cluster: 'definitions', url: '/payg/payg-definitions/' },
  { id: 'payg:no-expiry-not-forever', title: '不限时流量包等于永久可用吗：哪些服务条件仍需核对？', slug: 'no-expiry-not-forever', category: 'payg', subcategory: 'terms', cluster: 'definitions', url: '/payg/no-expiry-not-forever/' },
  { id: 'payg:fixed-pack-vs-metered', title: '预付固定流量包和按实际消耗结算有什么不同，账本如何分别记录？', slug: 'fixed-pack-vs-metered', category: 'payg', subcategory: 'terms', cluster: 'definitions', url: '/payg/fixed-pack-vs-metered/' },
  { id: 'payg:payg-maintenance-terms', title: '低频使用的流量包是否需要保持账户活跃，购买前应查看什么条款？', slug: 'payg-maintenance-terms', category: 'payg', subcategory: 'terms', cluster: 'definitions', url: '/payg/payg-maintenance-terms/' },

  // payg / terms / purchase-units
  { id: 'payg:whole-pack-purchase', title: '只缺少10GB却只能整包购买，怎样计算本次现金支出与剩余额度？', slug: 'whole-pack-purchase', category: 'payg', subcategory: 'terms', cluster: 'purchase-units', url: '/payg/whole-pack-purchase/' },
  { id: 'payg:pack-rate', title: '流量包标价除以额度能说明什么：倍率和有效期如何改变比较前提？', slug: 'pack-rate', category: 'payg', subcategory: 'terms', cluster: 'purchase-units', url: '/payg/pack-rate/' },
  { id: 'payg:purchased-vs-consumed', title: '已经买到的流量还没用完，为什么不能把全部购买成本重复记到每个月？', slug: 'purchased-vs-consumed', category: 'payg', subcategory: 'terms', cluster: 'purchase-units', url: '/payg/purchased-vs-consumed/' },
  { id: 'payg:pack-promotion', title: '买流量送流量时，怎样把实付、赠送条件和可用额度分开记录？', slug: 'pack-promotion', category: 'payg', subcategory: 'terms', cluster: 'purchase-units', url: '/payg/pack-promotion/' },

  // payg / terms / constraints
  { id: 'payg:payg-other-fees', title: '按量方案除了流量单价还需要确认哪些费用和使用限制？', slug: 'payg-other-fees', category: 'payg', subcategory: 'terms', cluster: 'constraints', url: '/payg/payg-other-fees/' },
  { id: 'payg:payg-device-rule', title: '流量包能不能多设备共用，应核对账户、并发与连接规则哪些字段？', slug: 'payg-device-rule', category: 'payg', subcategory: 'terms', cluster: 'constraints', url: '/payg/payg-device-rule/' },
  { id: 'payg:payg-performance', title: '按量套餐流量够用却任务完成不了，为什么还要核对带宽和功能条件？', slug: 'payg-performance', category: 'payg', subcategory: 'terms', cluster: 'constraints', url: '/payg/payg-performance/' },
  { id: 'payg:payg-payment-currency', title: '流量包采用不同币种定价时，怎样保存汇率日期与实际支付差异？', slug: 'payg-payment-currency', category: 'payg', subcategory: 'terms', cluster: 'constraints', url: '/payg/payg-payment-currency/' },

  // payg / terms / exit
  { id: 'payg:payg-terms-change', title: '不限时方案后来调整规则，怎样保存原订单与变更依据？', slug: 'payg-terms-change', category: 'payg', subcategory: 'terms', cluster: 'exit', url: '/payg/payg-terms-change/' },
  { id: 'payg:payg-refund', title: '流量包未用完能否退款，如何按真实规则而不是剩余比例推算？', slug: 'payg-refund', category: 'payg', subcategory: 'terms', cluster: 'exit', url: '/payg/payg-refund/' },
  { id: 'payg:payg-inactive-account', title: '长期不用后登录异常，怎样区分账号问题、服务变化和额度失效？', slug: 'payg-inactive-account', category: 'payg', subcategory: 'terms', cluster: 'exit', url: '/payg/payg-inactive-account/' },
  { id: 'payg:payg-end-record', title: '停止使用按量服务时，账本里的剩余额度和历史支出怎样处理？', slug: 'payg-end-record', category: 'payg', subcategory: 'terms', cluster: 'exit', url: '/payg/payg-end-record/' },

  // payg / fit / frequency
  { id: 'payg:payg-frequency-fit', title: '每月只用几天的人怎样判断按量方案是否适合自己的任务？', slug: 'payg-frequency-fit', category: 'payg', subcategory: 'fit', cluster: 'frequency', url: '/payg/payg-frequency-fit/' },
  { id: 'payg:payg-irregular-fit', title: '用量有时为零有时突增，比较按量和月付应使用多长的观察窗口？', slug: 'payg-irregular-fit', category: 'payg', subcategory: 'fit', cluster: 'frequency', url: '/payg/payg-irregular-fit/' },
  { id: 'payg:payg-spare-fit', title: '把流量包作为备用时，怎样按恢复任务而不是主力用量配置额度？', slug: 'payg-spare-fit', category: 'payg', subcategory: 'fit', cluster: 'frequency', url: '/payg/payg-spare-fit/' },
  { id: 'payg:payg-consumption-calendar', title: '怎样根据预计任务日历安排流量包，而不是默认平均每天消耗？', slug: 'payg-consumption-calendar', category: 'payg', subcategory: 'fit', cluster: 'frequency', url: '/payg/payg-consumption-calendar/' },

  // payg / fit / pack-sizing
  { id: 'payg:pack-size-choice', title: '小流量包与大流量包怎样选：闲置余额、付款门槛和补购便利性', slug: 'pack-size-choice', category: 'payg', subcategory: 'fit', cluster: 'pack-sizing', url: '/payg/pack-size-choice/' },
  { id: 'payg:pack-topup-time', title: '按量余额降到多少才补购，怎样按下一次任务而不是固定百分比判断？', slug: 'pack-topup-time', category: 'payg', subcategory: 'fit', cluster: 'pack-sizing', url: '/payg/pack-topup-time/' },
  { id: 'payg:pack-combination', title: '多次小包与一次大包怎样比较：实际付款、失效和余量一起看', slug: 'pack-combination', category: 'payg', subcategory: 'fit', cluster: 'pack-sizing', url: '/payg/pack-combination/' },
  { id: 'payg:pack-large-task', title: '临时传输大文件前，怎样估算整包数量并确认不足部分如何处理？', slug: 'pack-large-task', category: 'payg', subcategory: 'fit', cluster: 'pack-sizing', url: '/payg/pack-large-task/' },

  // payg / fit / comparison
  { id: 'payg:payg-monthly-sequence', title: '月付与按量比较怎样按连续月份计算，而不是只比较一个平均月？', slug: 'payg-monthly-sequence', category: 'payg', subcategory: 'fit', cluster: 'comparison', url: '/payg/payg-monthly-sequence/' },
  { id: 'payg:payg-with-main-plan', title: '主力月付加备用按量是否重复花钱，怎样明确各自承担的任务？', slug: 'payg-with-main-plan', category: 'payg', subcategory: 'fit', cluster: 'comparison', url: '/payg/payg-with-main-plan/' },
  { id: 'payg:payg-break-even', title: '两种付款方式的交点怎样计算：为什么整包购买会让成本阶梯式变化？', slug: 'payg-break-even', category: 'payg', subcategory: 'fit', cluster: 'comparison', url: '/payg/payg-break-even/' },
  { id: 'payg:payg-selection-table', title: '按量方案对照表应该展示哪些规则，才能让用户看懂而不只看每GB价格？', slug: 'payg-selection-table', category: 'payg', subcategory: 'fit', cluster: 'comparison', url: '/payg/payg-selection-table/' },

  // payg / fit / verification
  { id: 'payg:payg-first-purchase-check', title: '第一次买流量包后，应该核验额度到账、倍率和任务可用性的哪些项目？', slug: 'payg-first-purchase-check', category: 'payg', subcategory: 'fit', cluster: 'verification', url: '/payg/payg-first-purchase-check/' },
  { id: 'payg:payg-unused-balance', title: '流量包长期用不完，怎样复盘当初的任务预测和购买单位？', slug: 'payg-unused-balance', category: 'payg', subcategory: 'fit', cluster: 'verification', url: '/payg/payg-unused-balance/' },
  { id: 'payg:payg-unexpected-spend', title: '按量费用突然增加，怎样从任务量、倍率和补购记录定位原因？', slug: 'payg-unexpected-spend', category: 'payg', subcategory: 'fit', cluster: 'verification', url: '/payg/payg-unexpected-spend/' },
  { id: 'payg:payg-main-site-handoff', title: '如何把自己的按量需求整理成条件清单，再到主站比较真实套餐？', slug: 'payg-main-site-handoff', category: 'payg', subcategory: 'fit', cluster: 'verification', url: '/payg/payg-main-site-handoff/' },

  // 06 大流量专题 /high-data/
  // high-data / demand / task-inventory
  { id: 'high-data:heavy-task-inventory', title: '大流量用户怎样列任务清单：把持续视频、文件传输和更新分开', slug: 'heavy-task-inventory', category: 'high-data', subcategory: 'demand', cluster: 'task-inventory', url: '/high-data/heavy-task-inventory/' },
  { id: 'high-data:large-file-workflow', title: '经常同步大文件的人如何估算流量：首次同步与后续差量分别记录', slug: 'large-file-workflow', category: 'high-data', subcategory: 'demand', cluster: 'task-inventory', url: '/high-data/large-file-workflow/' },
  { id: 'high-data:build-artifacts', title: '开发工作反复下载依赖和构建产物时，怎样识别真正的大流量来源？', slug: 'build-artifacts', category: 'high-data', subcategory: 'demand', cluster: 'task-inventory', url: '/high-data/build-artifacts/' },
  { id: 'high-data:heavy-task-priority', title: '月底额度不足时，怎样按可延期和不可延期任务重新安排用量？', slug: 'heavy-task-priority', category: 'high-data', subcategory: 'demand', cluster: 'task-inventory', url: '/high-data/heavy-task-priority/' },

  // high-data / demand / capacity
  { id: 'high-data:quota-vs-throughput', title: '套餐流量很大为什么下载仍然慢：额度、吞吐与时段是不同条件', slug: 'quota-vs-throughput', category: 'high-data', subcategory: 'demand', cluster: 'capacity', url: '/high-data/quota-vs-throughput/' },
  { id: 'high-data:finish-time', title: '要在一晚完成大批文件传输，需要多少时间和流量分别怎样估算？', slug: 'finish-time', category: 'high-data', subcategory: 'demand', cluster: 'capacity', url: '/high-data/finish-time/' },
  { id: 'high-data:shared-bandwidth', title: '多个重任务同时运行时，怎样区分共享带宽瓶颈和总流量需求？', slug: 'shared-bandwidth', category: 'high-data', subcategory: 'demand', cluster: 'capacity', url: '/high-data/shared-bandwidth/' },
  { id: 'high-data:long-run-baseline', title: '长时间传输的速度记录怎样建立，为什么单次峰值不足以做任务计划？', slug: 'long-run-baseline', category: 'high-data', subcategory: 'demand', cluster: 'capacity', url: '/high-data/long-run-baseline/' },

  // high-data / demand / bursts
  { id: 'high-data:peak-day-budget', title: '月总额度看起来够用，但某几天集中消耗很大，怎样做峰值日计划？', slug: 'peak-day-budget', category: 'high-data', subcategory: 'demand', cluster: 'bursts', url: '/high-data/peak-day-budget/' },
  { id: 'high-data:batch-download', title: '集中下载和分散下载对额度有效期的影响怎样比较？', slug: 'batch-download', category: 'high-data', subcategory: 'demand', cluster: 'bursts', url: '/high-data/batch-download/' },
  { id: 'high-data:large-update-window', title: '系统或应用大更新将至，怎样从实测包大小而不是宣传大小预留流量？', slug: 'large-update-window', category: 'high-data', subcategory: 'demand', cluster: 'bursts', url: '/high-data/large-update-window/' },
  { id: 'high-data:heavy-period-overlap', title: '重任务跨过套餐到期或重置时间时，需要提前确认哪些条件？', slug: 'heavy-period-overlap', category: 'high-data', subcategory: 'demand', cluster: 'bursts', url: '/high-data/heavy-period-overlap/' },

  // high-data / demand / retries
  { id: 'high-data:large-retry-accounting', title: '大文件失败后重试会不会重复耗流量，怎样从实际传输记录判断？', slug: 'large-retry-accounting', category: 'high-data', subcategory: 'demand', cluster: 'retries', url: '/high-data/large-retry-accounting/' },
  { id: 'high-data:resume-download', title: '断点续传是否真的减少重新传输，应该核对哪些证据？', slug: 'resume-download', category: 'high-data', subcategory: 'demand', cluster: 'retries', url: '/high-data/resume-download/' },
  { id: 'high-data:file-integrity-vs-traffic', title: '文件校验通过能证明流量消耗准确吗：完整性和计费证据的区别', slug: 'file-integrity-vs-traffic', category: 'high-data', subcategory: 'demand', cluster: 'retries', url: '/high-data/file-integrity-vs-traffic/' },
  { id: 'high-data:recovery-reserve', title: '持续任务容易中断时，怎样单列恢复成本而不是凭空加倍额度？', slug: 'recovery-reserve', category: 'high-data', subcategory: 'demand', cluster: 'retries', url: '/high-data/recovery-reserve/' },

  // high-data / plans / quota-selection
  { id: 'high-data:large-plan-checks', title: '大流量机场套餐怎么比较：总额度之外还要检查哪些规则？', slug: 'large-plan-checks', category: 'high-data', subcategory: 'plans', cluster: 'quota-selection', url: '/high-data/large-plan-checks/' },
  { id: 'high-data:high-quota-multiplier', title: '标着超大流量但节点倍率高，怎样比较真实传输预算？', slug: 'high-quota-multiplier', category: 'high-data', subcategory: 'plans', cluster: 'quota-selection', url: '/high-data/high-quota-multiplier/' },
  { id: 'high-data:unlimited-claims', title: '不限流量宣传应该如何核对：速度、公平使用和账户条件分别看', slug: 'unlimited-claims', category: 'high-data', subcategory: 'plans', cluster: 'quota-selection', url: '/high-data/unlimited-claims/' },
  { id: 'high-data:high-data-device-fit', title: '需要多设备共同完成高用量任务，购买前怎样确认兼容与并发要求？', slug: 'high-data-device-fit', category: 'high-data', subcategory: 'plans', cluster: 'quota-selection', url: '/high-data/high-data-device-fit/' },

  // high-data / plans / allocation
  { id: 'high-data:heavy-topup-vs-upgrade', title: '重度使用时买补充包还是升级套餐，怎样按剩余周期比较？', slug: 'heavy-topup-vs-upgrade', category: 'high-data', subcategory: 'plans', cluster: 'allocation', url: '/high-data/heavy-topup-vs-upgrade/' },
  { id: 'high-data:multiple-pools', title: '多个额度池供同一组重任务使用，怎样制定不会重复计算的分配表？', slug: 'multiple-pools', category: 'high-data', subcategory: 'plans', cluster: 'allocation', url: '/high-data/multiple-pools/' },
  { id: 'high-data:long-term-high-data', title: '连续数月高用量与单月突增，为什么不应该选择同一套购买策略？', slug: 'long-term-high-data', category: 'high-data', subcategory: 'plans', cluster: 'allocation', url: '/high-data/long-term-high-data/' },
  { id: 'high-data:unused-large-quota', title: '大流量套餐月底剩很多，怎样计算利用率并检查是否选得过大？', slug: 'unused-large-quota', category: 'high-data', subcategory: 'plans', cluster: 'allocation', url: '/high-data/unused-large-quota/' },

  // high-data / plans / acceptance
  { id: 'high-data:heavy-trial-test', title: '试用额度很少时能验证大流量任务吗：哪些条件能测、哪些仍未知？', slug: 'heavy-trial-test', category: 'high-data', subcategory: 'plans', cluster: 'acceptance', url: '/high-data/heavy-trial-test/' },
  { id: 'high-data:heavy-use-success', title: '大流量任务验收应该记录什么：完成量、耗时、中断与计费分别列出', slug: 'heavy-use-success', category: 'high-data', subcategory: 'plans', cluster: 'acceptance', url: '/high-data/heavy-use-success/' },
  { id: 'high-data:peak-use-test', title: '计划主要在晚间传输时，怎样安排符合实际时段的验收？', slug: 'peak-use-test', category: 'high-data', subcategory: 'plans', cluster: 'acceptance', url: '/high-data/peak-use-test/' },
  { id: 'high-data:heavy-evidence-summary', title: '怎样把大任务实测整理成选型依据，而不把一次成功写成长期保证？', slug: 'heavy-evidence-summary', category: 'high-data', subcategory: 'plans', cluster: 'acceptance', url: '/high-data/heavy-evidence-summary/' },

  // high-data / plans / efficiency
  { id: 'high-data:heavy-duplicate-downloads', title: '怎样通过任务记录发现重复下载，而不是默认降低所有画质？', slug: 'heavy-duplicate-downloads', category: 'high-data', subcategory: 'plans', cluster: 'efficiency', url: '/high-data/heavy-duplicate-downloads/' },
  { id: 'high-data:sync-scope-control', title: '云同步目录反复变化导致流量增多，怎样核对同步范围和版本保留？', slug: 'sync-scope-control', category: 'high-data', subcategory: 'plans', cluster: 'efficiency', url: '/high-data/sync-scope-control/' },
  { id: 'high-data:cache-savings-proof', title: '启用缓存后节省了多少流量，怎样用前后对照而不是猜测证明？', slug: 'cache-savings-proof', category: 'high-data', subcategory: 'plans', cluster: 'efficiency', url: '/high-data/cache-savings-proof/' },
  { id: 'high-data:heavy-review-cycle', title: '重度用户每个周期应复盘哪些指标，才能调整下一期的额度计划？', slug: 'heavy-review-cycle', category: 'high-data', subcategory: 'plans', cluster: 'efficiency', url: '/high-data/heavy-review-cycle/' },

  // 07 低频使用 /occasional/
  // occasional / patterns / active-days
  { id: 'occasional:active-days-model', title: '一个月只在几天使用机场，怎样按活跃日而不是全月日均估算？', slug: 'active-days-model', category: 'occasional', subcategory: 'patterns', cluster: 'active-days', url: '/occasional/active-days-model/' },
  { id: 'occasional:zero-months', title: '连续几个月没有使用记录，怎样处理零需求月份而不是自动续购？', slug: 'zero-months', category: 'occasional', subcategory: 'patterns', cluster: 'active-days', url: '/occasional/zero-months/' },
  { id: 'occasional:irregular-schedule', title: '使用日期无法提前确定时，怎样给低频需求设置条件情景？', slug: 'irregular-schedule', category: 'occasional', subcategory: 'patterns', cluster: 'active-days', url: '/occasional/irregular-schedule/' },
  { id: 'occasional:short-session-overhead', title: '每次只用十几分钟，怎样区分任务流量和启动后的后台传输？', slug: 'short-session-overhead', category: 'occasional', subcategory: 'patterns', cluster: 'active-days', url: '/occasional/short-session-overhead/' },

  // occasional / patterns / temporary
  { id: 'occasional:short-project-data', title: '只为一个短期项目使用服务，怎样列清任务、时间窗口和额度需求？', slug: 'short-project-data', category: 'occasional', subcategory: 'patterns', cluster: 'temporary', url: '/occasional/short-project-data/' },
  { id: 'occasional:travel-checklist', title: '出行前准备临时网络服务，怎样核对设备、目的地条件与使用资料？', slug: 'travel-checklist', category: 'occasional', subcategory: 'patterns', cluster: 'temporary', url: '/occasional/travel-checklist/' },
  { id: 'occasional:oneoff-file-transfer', title: '只需要传一次文件时，怎样比较任务大小和最低购买门槛？', slug: 'oneoff-file-transfer', category: 'occasional', subcategory: 'patterns', cluster: 'temporary', url: '/occasional/oneoff-file-transfer/' },
  { id: 'occasional:short-term-expiry', title: '临时任务可能延期，怎样为有效期不足保留可行的后续方案？', slug: 'short-term-expiry', category: 'occasional', subcategory: 'patterns', cluster: 'temporary', url: '/occasional/short-term-expiry/' },

  // occasional / patterns / backup
  { id: 'occasional:backup-task-scope', title: '备用机场需要多少流量：先定义中断时必须完成的任务', slug: 'backup-task-scope', category: 'occasional', subcategory: 'patterns', cluster: 'backup', url: '/occasional/backup-task-scope/' },
  { id: 'occasional:backup-readiness', title: '备用服务长时间不用，怎样做少量验证而不消耗大量测试流量？', slug: 'backup-readiness', category: 'occasional', subcategory: 'patterns', cluster: 'backup', url: '/occasional/backup-readiness/' },
  { id: 'occasional:backup-not-duplicate', title: '主力和备用使用记录怎样分开，避免把同一任务预算算两次？', slug: 'backup-not-duplicate', category: 'occasional', subcategory: 'patterns', cluster: 'backup', url: '/occasional/backup-not-duplicate/' },
  { id: 'occasional:backup-failure-plan', title: '备用也连接失败时，怎样保留检查资料和恢复步骤而不盲目继续购买？', slug: 'backup-failure-plan', category: 'occasional', subcategory: 'patterns', cluster: 'backup', url: '/occasional/backup-failure-plan/' },

  // occasional / patterns / seasonal
  { id: 'occasional:weekend-pattern', title: '只在周末使用的人，怎样比较实际日历和套餐计费周期？', slug: 'weekend-pattern', category: 'occasional', subcategory: 'patterns', cluster: 'seasonal', url: '/occasional/weekend-pattern/' },
  { id: 'occasional:seasonal-use', title: '只有假期或特定阶段使用，怎样把旺季需求与空闲期分开记录？', slug: 'seasonal-use', category: 'occasional', subcategory: 'patterns', cluster: 'seasonal', url: '/occasional/seasonal-use/' },
  { id: 'occasional:intermittent-study', title: '间歇学习和查资料的流量怎样记录，避免把视频课程时长全部算成在线传输？', slug: 'intermittent-study', category: 'occasional', subcategory: 'patterns', cluster: 'seasonal', url: '/occasional/intermittent-study/' },
  { id: 'occasional:pattern-change', title: '低频使用突然变为每天使用，应从哪些记录判断原方案不再合适？', slug: 'pattern-change', category: 'occasional', subcategory: 'patterns', cluster: 'seasonal', url: '/occasional/pattern-change/' },

  // occasional / maintenance / account-check
  { id: 'occasional:idle-quota-check', title: '长期不用后再次开始前，应该核对余额、有效期和账户状态什么内容？', slug: 'idle-quota-check', category: 'occasional', subcategory: 'maintenance', cluster: 'account-check', url: '/occasional/idle-quota-check/' },
  { id: 'occasional:idle-rule-change', title: '低频用户怎样发现期间发生的规则变化，避免沿用旧价格和倍率？', slug: 'idle-rule-change', category: 'occasional', subcategory: 'maintenance', cluster: 'account-check', url: '/occasional/idle-rule-change/' },
  { id: 'occasional:reminder-boundary', title: '为流量包设置提醒时，应该提醒到期、余额还是下次任务？', slug: 'reminder-boundary', category: 'occasional', subcategory: 'maintenance', cluster: 'account-check', url: '/occasional/reminder-boundary/' },
  { id: 'occasional:idle-data-privacy', title: '低频使用的旧设备还保存配置，怎样清点并撤销不再需要的访问？', slug: 'idle-data-privacy', category: 'occasional', subcategory: 'maintenance', cluster: 'account-check', url: '/occasional/idle-data-privacy/' },

  // occasional / maintenance / lightweight-logging
  { id: 'occasional:lightweight-ledger', title: '低频用户不想每天记账，最少记录哪些节点仍能核对支出和用量？', slug: 'lightweight-ledger', category: 'occasional', subcategory: 'maintenance', cluster: 'lightweight-logging', url: '/occasional/lightweight-ledger/' },
  { id: 'occasional:small-verification', title: '一次备用连接检查需要记录什么，怎样避免把测试结果误当长期稳定性？', slug: 'small-verification', category: 'occasional', subcategory: 'maintenance', cluster: 'lightweight-logging', url: '/occasional/small-verification/' },
  { id: 'occasional:returning-session', title: '隔几个月再次使用时，怎样建立新的基线而不接续失真的累计数？', slug: 'returning-session', category: 'occasional', subcategory: 'maintenance', cluster: 'lightweight-logging', url: '/occasional/returning-session/' },
  { id: 'occasional:low-frequency-gaps', title: '只有零散账单没有每日记录，怎样复盘低频使用而不补造明细？', slug: 'low-frequency-gaps', category: 'occasional', subcategory: 'maintenance', cluster: 'lightweight-logging', url: '/occasional/low-frequency-gaps/' },

  // occasional / maintenance / purchase-timing
  { id: 'occasional:low-first-payment', title: '低频用户怎样平衡首次付款门槛和可能闲置的剩余额度？', slug: 'low-first-payment', category: 'occasional', subcategory: 'maintenance', cluster: 'purchase-timing', url: '/occasional/low-first-payment/' },
  { id: 'occasional:buy-before-task', title: '临时任务前什么时候购买更合适：激活规则与准备时间怎样一起考虑？', slug: 'buy-before-task', category: 'occasional', subcategory: 'maintenance', cluster: 'purchase-timing', url: '/occasional/buy-before-task/' },
  { id: 'occasional:low-cost-utilization', title: '便宜的大包长期不用是否划算：按实际使用量而不是额度评估成本', slug: 'low-cost-utilization', category: 'occasional', subcategory: 'maintenance', cluster: 'purchase-timing', url: '/occasional/low-cost-utilization/' },
  { id: 'occasional:idle-renew-decision', title: '到期时暂时没有新任务，怎样作出续费、暂停或退出的判断？', slug: 'idle-renew-decision', category: 'occasional', subcategory: 'maintenance', cluster: 'purchase-timing', url: '/occasional/idle-renew-decision/' },

  // occasional / maintenance / review
  { id: 'occasional:low-task-review', title: '一次临时使用结束后，怎样保存对下一次有用的任务与扣量记录？', slug: 'low-task-review', category: 'occasional', subcategory: 'maintenance', cluster: 'review', url: '/occasional/low-task-review/' },
  { id: 'occasional:spare-upgrade-trigger', title: '备用用量逐渐增加时，如何判断应该调整额度还是重新定义备用角色？', slug: 'spare-upgrade-trigger', category: 'occasional', subcategory: 'maintenance', cluster: 'review', url: '/occasional/spare-upgrade-trigger/' },
  { id: 'occasional:low-use-plan-brief', title: '怎样把低频需求整理给主站：任务日期、用量范围和必须条件', slug: 'low-use-plan-brief', category: 'occasional', subcategory: 'maintenance', cluster: 'review', url: '/occasional/low-use-plan-brief/' },
  { id: 'occasional:case-not-general-rule', title: '一个低频用户的省钱案例能说明什么，怎样写明不适用的人群？', slug: 'case-not-general-rule', category: 'occasional', subcategory: 'maintenance', cluster: 'review', url: '/occasional/case-not-general-rule/' },

  // 08 视频用量 /video/
  // video / models / bitrate
  { id: 'video:video-bitrate-formula', title: '视频码率和观看时长怎样换算流量：计算步骤与边界', slug: 'video-bitrate-formula', category: 'video', subcategory: 'models', cluster: 'bitrate', url: '/video/video-bitrate-formula/' },
  { id: 'video:resolution-not-bitrate', title: '同样是1080p为什么耗流量不同：分辨率不能代替实际码率', slug: 'resolution-not-bitrate', category: 'video', subcategory: 'models', cluster: 'bitrate', url: '/video/resolution-not-bitrate/' },
  { id: 'video:video-audio-total', title: '音轨、字幕和封装怎样进入视频用量估算，哪些值需要实测？', slug: 'video-audio-total', category: 'video', subcategory: 'models', cluster: 'bitrate', url: '/video/video-audio-total/' },
  { id: 'video:video-rate-example', title: '假设持续8Mbps观看两小时会传多少数据：完整演算与不确定项', slug: 'video-rate-example', category: 'video', subcategory: 'models', cluster: 'bitrate', url: '/video/video-rate-example/' },

  // video / models / adaptive
  { id: 'video:adaptive-segments', title: '播放器自动切换画质时，怎样分段记录而不是套固定每小时用量？', slug: 'adaptive-segments', category: 'video', subcategory: 'models', cluster: 'adaptive', url: '/video/adaptive-segments/' },
  { id: 'video:paused-buffering', title: '暂停播放后是否仍会传输数据，怎样观察预加载和缓冲？', slug: 'paused-buffering', category: 'video', subcategory: 'models', cluster: 'adaptive', url: '/video/paused-buffering/' },
  { id: 'video:seek-preview', title: '拖动进度和反复预览会怎样影响用量，如何设计可比较的小测试？', slug: 'seek-preview', category: 'video', subcategory: 'models', cluster: 'adaptive', url: '/video/seek-preview/' },
  { id: 'video:video-max-quality', title: '选择最高画质但实际未达到时，为什么不能按设置标签估算流量？', slug: 'video-max-quality', category: 'video', subcategory: 'models', cluster: 'adaptive', url: '/video/video-max-quality/' },

  // video / models / cache
  { id: 'video:video-replay-cache', title: '同一集看两遍是否一定耗两倍流量：怎样核对缓存是否被复用？', slug: 'video-replay-cache', category: 'video', subcategory: 'models', cluster: 'cache', url: '/video/video-replay-cache/' },
  { id: 'video:offline-vs-stream', title: '离线下载与在线反复观看怎样比较，不能只看保存文件大小', slug: 'offline-vs-stream', category: 'video', subcategory: 'models', cluster: 'cache', url: '/video/offline-vs-stream/' },
  { id: 'video:video-download-retry', title: '下载视频中断后再次开始，怎样核对续传和重复传输？', slug: 'video-download-retry', category: 'video', subcategory: 'models', cluster: 'cache', url: '/video/video-download-retry/' },
  { id: 'video:video-cache-boundary', title: '清除应用缓存后用量变化，怎样把缓存行为和账号观看权益分开？', slug: 'video-cache-boundary', category: 'video', subcategory: 'models', cluster: 'cache', url: '/video/video-cache-boundary/' },

  // video / models / multiscreen
  { id: 'video:multiscreen-usage', title: '两个屏幕同时看同一内容，流量是否只算一份：需要观察哪条路径？', slug: 'multiscreen-usage', category: 'video', subcategory: 'models', cluster: 'multiscreen', url: '/video/multiscreen-usage/' },
  { id: 'video:video-device-rate', title: '电视和手机播放相同节目时，怎样分别记录实际码率与用量？', slug: 'video-device-rate', category: 'video', subcategory: 'models', cluster: 'multiscreen', url: '/video/video-device-rate/' },
  { id: 'video:family-video-schedule', title: '家庭多屏观看怎样排每周用量表，避免把共享时段误当共享数据？', slug: 'family-video-schedule', category: 'video', subcategory: 'models', cluster: 'multiscreen', url: '/video/family-video-schedule/' },
  { id: 'video:watch-rights-vs-traffic', title: '平台允许几台设备观看与机场额度怎么分配，为什么是两类规则？', slug: 'watch-rights-vs-traffic', category: 'video', subcategory: 'models', cluster: 'multiscreen', url: '/video/watch-rights-vs-traffic/' },

  // video / plans / tv-casting
  { id: 'video:casting-path', title: '投屏时数据经过手机还是电视，怎样确认应记录哪个设备？', slug: 'casting-path', category: 'video', subcategory: 'plans', cluster: 'tv-casting', url: '/video/casting-path/' },
  { id: 'video:local-media', title: '播放局域网文件为什么不应直接算成机场流量，如何核对访问路径？', slug: 'local-media', category: 'video', subcategory: 'plans', cluster: 'tv-casting', url: '/video/local-media/' },
  { id: 'video:tv-background', title: '电视待机更新和应用预览产生的流量，怎样从观看记录中区分？', slug: 'tv-background', category: 'video', subcategory: 'plans', cluster: 'tv-casting', url: '/video/tv-background/' },
  { id: 'video:casting-proxy-scope', title: '手机已接入服务但电视未接入时，怎样分别验证而不是重复购买？', slug: 'casting-proxy-scope', category: 'video', subcategory: 'plans', cluster: 'tv-casting', url: '/video/casting-proxy-scope/' },

  // video / plans / live
  { id: 'video:live-stream-budget', title: '长时间观看直播怎样估算流量，为什么要关注实际码率变化？', slug: 'live-stream-budget', category: 'video', subcategory: 'plans', cluster: 'live', url: '/video/live-stream-budget/' },
  { id: 'video:video-call-directions', title: '视频会议上行和下行如何分别记录，套餐计费规则怎样影响额度？', slug: 'video-call-directions', category: 'video', subcategory: 'plans', cluster: 'live', url: '/video/video-call-directions/' },
  { id: 'video:audio-only-mode', title: '切成纯音频是否节省用量，怎样比较相同任务下的实际传输？', slug: 'audio-only-mode', category: 'video', subcategory: 'plans', cluster: 'live', url: '/video/audio-only-mode/' },
  { id: 'video:live-reconnect', title: '直播或会议断线重连后，怎样把失败尝试和恢复过程计入记录？', slug: 'live-reconnect', category: 'video', subcategory: 'plans', cluster: 'live', url: '/video/live-reconnect/' },

  // video / plans / schedule
  { id: 'video:video-month-plan', title: '每周追剧与周末长时间观看，怎样换算到真实套餐周期？', slug: 'video-month-plan', category: 'video', subcategory: 'plans', cluster: 'schedule', url: '/video/video-month-plan/' },
  { id: 'video:video-multiplier-budget', title: '观看节点倍率不同，怎样从实际视频量得到计费额度需求？', slug: 'video-multiplier-budget', category: 'video', subcategory: 'plans', cluster: 'schedule', url: '/video/video-multiplier-budget/' },
  { id: 'video:video-before-reset', title: '重置前后有集中观看安排，怎样按时间分配额度而不是只看总量？', slug: 'video-before-reset', category: 'video', subcategory: 'plans', cluster: 'schedule', url: '/video/video-before-reset/' },
  { id: 'video:video-low-quota', title: '剩余流量有限时，怎样用任务优先级和实际画质选择安排观看？', slug: 'video-low-quota', category: 'video', subcategory: 'plans', cluster: 'schedule', url: '/video/video-low-quota/' },

  // video / plans / verify
  { id: 'video:video-test-log', title: '一次视频用量测试需要记录哪些字段，才能供别人复查？', slug: 'video-test-log', category: 'video', subcategory: 'plans', cluster: 'verify', url: '/video/video-test-log/' },
  { id: 'video:video-panel-difference', title: '平台显示的下载大小与服务后台扣量不同，怎样定位差异？', slug: 'video-panel-difference', category: 'video', subcategory: 'plans', cluster: 'verify', url: '/video/video-panel-difference/' },
  { id: 'video:video-access-not-quota', title: '流量够但无法播放时，怎样区分平台权益、设备和连接问题？', slug: 'video-access-not-quota', category: 'video', subcategory: 'plans', cluster: 'verify', url: '/video/video-access-not-quota/' },
  { id: 'video:video-plan-handoff', title: '把观看需求转成选购条件时，应该提供哪些平台、设备和用量信息？', slug: 'video-plan-handoff', category: 'video', subcategory: 'plans', cluster: 'verify', url: '/video/video-plan-handoff/' },

  // 09 AI用量 /ai/
  // ai / workloads / text
  { id: 'ai:ai-text-traffic', title: 'AI文字对话的网络流量怎样记录：消息、页面资源和后台请求分别看', slug: 'ai-text-traffic', category: 'ai', subcategory: 'workloads', cluster: 'text', url: '/ai/ai-text-traffic/' },
  { id: 'ai:ai-streaming-output', title: '流式输出一直显示文字，怎样区分交互时长与实际传输量？', slug: 'ai-streaming-output', category: 'ai', subcategory: 'workloads', cluster: 'text', url: '/ai/ai-streaming-output/' },
  { id: 'ai:ai-history-loading', title: '反复打开历史对话是否重复下载数据，怎样用可观察记录核对？', slug: 'ai-history-loading', category: 'ai', subcategory: 'workloads', cluster: 'text', url: '/ai/ai-history-loading/' },
  { id: 'ai:ai-multiple-tabs', title: '多个AI网页同时开着时，怎样避免把全部浏览器流量归到一条对话？', slug: 'ai-multiple-tabs', category: 'ai', subcategory: 'workloads', cluster: 'text', url: '/ai/ai-multiple-tabs/' },

  // ai / workloads / files
  { id: 'ai:ai-document-upload', title: '向AI工具上传文件怎样估算用量：原文件、上传传输和处理结果分开', slug: 'ai-document-upload', category: 'ai', subcategory: 'workloads', cluster: 'files', url: '/ai/ai-document-upload/' },
  { id: 'ai:ai-reupload', title: '同一文件反复提交是否重复耗量，怎样记录每次实际上传？', slug: 'ai-reupload', category: 'ai', subcategory: 'workloads', cluster: 'files', url: '/ai/ai-reupload/' },
  { id: 'ai:ai-compression', title: '文件压缩后体积变小能省多少网络流量，哪些步骤仍需验证？', slug: 'ai-compression', category: 'ai', subcategory: 'workloads', cluster: 'files', url: '/ai/ai-compression/' },
  { id: 'ai:ai-processing-wait', title: '上传后等待很久代表一直耗大流量吗：怎样区分服务器处理与网络传输？', slug: 'ai-processing-wait', category: 'ai', subcategory: 'workloads', cluster: 'files', url: '/ai/ai-processing-wait/' },

  // ai / workloads / multimodal
  { id: 'ai:ai-image-result', title: '生成图片与下载结果怎样计入流量，为什么不能只按提示词长短估算？', slug: 'ai-image-result', category: 'ai', subcategory: 'workloads', cluster: 'multimodal', url: '/ai/ai-image-result/' },
  { id: 'ai:ai-audio-session', title: '语音AI会话的上下行用量怎样分别记录，时长模型有什么前提？', slug: 'ai-audio-session', category: 'ai', subcategory: 'workloads', cluster: 'multimodal', url: '/ai/ai-audio-session/' },
  { id: 'ai:ai-video-input', title: '提交视频给AI工具前，怎样核对文件、分段和重复上传需求？', slug: 'ai-video-input', category: 'ai', subcategory: 'workloads', cluster: 'multimodal', url: '/ai/ai-video-input/' },
  { id: 'ai:ai-media-downloads', title: '重复预览和保存AI媒体结果时，怎样区分缓存和新增下载？', slug: 'ai-media-downloads', category: 'ai', subcategory: 'workloads', cluster: 'multimodal', url: '/ai/ai-media-downloads/' },

  // ai / workloads / coding
  { id: 'ai:ai-code-model-vs-tools', title: 'AI编程耗流量来自哪里：模型请求、仓库和依赖下载怎样拆分？', slug: 'ai-code-model-vs-tools', category: 'ai', subcategory: 'workloads', cluster: 'coding', url: '/ai/ai-code-model-vs-tools/' },
  { id: 'ai:ai-build-retry', title: '自动修复反复构建时，怎样找出被重复下载的依赖与产物？', slug: 'ai-build-retry', category: 'ai', subcategory: 'workloads', cluster: 'coding', url: '/ai/ai-build-retry/' },
  { id: 'ai:ai-local-remote', title: '本地助手和远程开发环境分别从哪里联网，账本应该记录哪一端？', slug: 'ai-local-remote', category: 'ai', subcategory: 'workloads', cluster: 'coding', url: '/ai/ai-local-remote/' },
  { id: 'ai:ai-plugin-background', title: '编辑器插件在后台请求数据时，怎样设置可解释的观察范围？', slug: 'ai-plugin-background', category: 'ai', subcategory: 'workloads', cluster: 'coding', url: '/ai/ai-plugin-background/' },

  // ai / accounting / tokens
  { id: 'ai:tokens-not-gb', title: 'Token能直接换算成机场GB吗：模型计量与网络传输为什么不同？', slug: 'tokens-not-gb', category: 'ai', subcategory: 'accounting', cluster: 'tokens', url: '/ai/tokens-not-gb/' },
  { id: 'ai:api-budget-not-network', title: 'API费用增加是否一定代表网络流量增加，怎样分别建立账本？', slug: 'api-budget-not-network', category: 'ai', subcategory: 'accounting', cluster: 'tokens', url: '/ai/api-budget-not-network/' },
  { id: 'ai:context-payload', title: '上下文重复提交可能影响哪些计量项，怎样避免凭Token数猜测字节？', slug: 'context-payload', category: 'ai', subcategory: 'accounting', cluster: 'tokens', url: '/ai/context-payload/' },
  { id: 'ai:ai-cached-token', title: '缓存Token、浏览器缓存和文件复用是同一回事吗：计量边界解释', slug: 'ai-cached-token', category: 'ai', subcategory: 'accounting', cluster: 'tokens', url: '/ai/ai-cached-token/' },

  // ai / accounting / retries
  { id: 'ai:ai-retry-ledger', title: 'AI请求失败后重试的流量怎样记录，不能把所有失败都当成零消耗', slug: 'ai-retry-ledger', category: 'ai', subcategory: 'accounting', cluster: 'retries', url: '/ai/ai-retry-ledger/' },
  { id: 'ai:ai-timeout-stages', title: '遇到超时，怎样区分未发出、已上传和等待响应三个阶段？', slug: 'ai-timeout-stages', category: 'ai', subcategory: 'accounting', cluster: 'retries', url: '/ai/ai-timeout-stages/' },
  { id: 'ai:ai-automation-loop', title: '自动化任务反复重跑时，怎样统计去重后的任务数与实际重复传输？', slug: 'ai-automation-loop', category: 'ai', subcategory: 'accounting', cluster: 'retries', url: '/ai/ai-automation-loop/' },
  { id: 'ai:ai-cancel-task', title: '取消AI任务后哪些传输可能已经完成，账本应如何保留不确定信息？', slug: 'ai-cancel-task', category: 'ai', subcategory: 'accounting', cluster: 'retries', url: '/ai/ai-cancel-task/' },

  // ai / accounting / scope
  { id: 'ai:ai-browser-cli', title: '网页AI能用但命令行工具走不同路径，怎样分别记录网络范围？', slug: 'ai-browser-cli', category: 'ai', subcategory: 'accounting', cluster: 'scope', url: '/ai/ai-browser-cli/' },
  { id: 'ai:ai-api-logging', title: '核对API网络用量时该保留哪些元数据，怎样避免日志泄露Key和文件内容？', slug: 'ai-api-logging', category: 'ai', subcategory: 'accounting', cluster: 'scope', url: '/ai/ai-api-logging/' },
  { id: 'ai:ai-server-client', title: '请求由服务器代发时，用户设备的机场流量与服务端流量如何区分？', slug: 'ai-server-client', category: 'ai', subcategory: 'accounting', cluster: 'scope', url: '/ai/ai-server-client/' },
  { id: 'ai:ai-attribution-gap', title: '无法归因到具体AI应用的流量，怎样保留未分类项而不强行分摊？', slug: 'ai-attribution-gap', category: 'ai', subcategory: 'accounting', cluster: 'scope', url: '/ai/ai-attribution-gap/' },

  // ai / accounting / planning
  { id: 'ai:ai-use-month-plan', title: '日常问答与偶尔大文件怎样组合成AI使用流量计划？', slug: 'ai-use-month-plan', category: 'ai', subcategory: 'accounting', cluster: 'planning', url: '/ai/ai-use-month-plan/' },
  { id: 'ai:ai-reserve-scenario', title: '准备长时间AI工作时，怎样按真实文件任务预留流量而不夸大文本消耗？', slug: 'ai-reserve-scenario', category: 'ai', subcategory: 'accounting', cluster: 'planning', url: '/ai/ai-reserve-scenario/' },
  { id: 'ai:ai-rate-limit-vs-quota', title: 'AI限流或账户额度用完时，为什么增加机场流量包不一定有帮助？', slug: 'ai-rate-limit-vs-quota', category: 'ai', subcategory: 'accounting', cluster: 'planning', url: '/ai/ai-rate-limit-vs-quota/' },
  { id: 'ai:ai-plan-handoff', title: 'AI使用记录怎样交给主站作选型依据：功能、设备、用量与未知项', slug: 'ai-plan-handoff', category: 'ai', subcategory: 'accounting', cluster: 'planning', url: '/ai/ai-plan-handoff/' },

  // 10 手机用量 /mobile/
  // mobile / counters / android
  { id: 'mobile:android-counter-start', title: 'Android手机的应用流量统计怎样用于账本：先确认系统版本和统计范围', slug: 'android-counter-start', category: 'mobile', subcategory: 'counters', cluster: 'android', url: '/mobile/android-counter-start/' },
  { id: 'mobile:android-cycle-settings', title: 'Android流量统计周期与机场周期不同，怎样对齐而不直接比较总数？', slug: 'android-cycle-settings', category: 'mobile', subcategory: 'counters', cluster: 'android', url: '/mobile/android-cycle-settings/' },
  { id: 'mobile:android-vpn-attribution', title: '手机VPN应用显示大量流量时，怎样区分隧道统计与原应用统计？', slug: 'android-vpn-attribution', category: 'mobile', subcategory: 'counters', cluster: 'android', url: '/mobile/android-vpn-attribution/' },
  { id: 'mobile:android-permissions', title: '读取手机流量记录需要什么资料，为什么不能随便授予陌生应用额外权限？', slug: 'android-permissions', category: 'mobile', subcategory: 'counters', cluster: 'android', url: '/mobile/android-permissions/' },

  // mobile / counters / ios
  { id: 'mobile:ios-counter-scope', title: 'iPhone的蜂窝用量统计能代表机场流量吗：范围和累计起点怎样核对？', slug: 'ios-counter-scope', category: 'mobile', subcategory: 'counters', cluster: 'ios', url: '/mobile/ios-counter-scope/' },
  { id: 'mobile:ios-manual-baseline', title: 'iPhone统计没有对齐服务周期时，怎样建立手工基线和快照？', slug: 'ios-manual-baseline', category: 'mobile', subcategory: 'counters', cluster: 'ios', url: '/mobile/ios-manual-baseline/' },
  { id: 'mobile:ipad-mixed-network', title: 'iPad同时使用Wi-Fi和蜂窝时，用量账本如何区分数据来源？', slug: 'ipad-mixed-network', category: 'mobile', subcategory: 'counters', cluster: 'ios', url: '/mobile/ipad-mixed-network/' },
  { id: 'mobile:ios-system-services', title: '系统服务产生的用量应怎样记录，为什么不能全部归因于代理应用？', slug: 'ios-system-services', category: 'mobile', subcategory: 'counters', cluster: 'ios', url: '/mobile/ios-system-services/' },

  // mobile / counters / network-types
  { id: 'mobile:mobile-wifi-cellular', title: '同一手机在Wi-Fi和蜂窝间切换，机场用量与运营商用量怎样分别累计？', slug: 'mobile-wifi-cellular', category: 'mobile', subcategory: 'counters', cluster: 'network-types', url: '/mobile/mobile-wifi-cellular/' },
  { id: 'mobile:mobile-switch-task', title: '一个下载跨过网络切换时，怎样记录分段和无法分段的部分？', slug: 'mobile-switch-task', category: 'mobile', subcategory: 'counters', cluster: 'network-types', url: '/mobile/mobile-switch-task/' },
  { id: 'mobile:roaming-vs-proxy', title: '出行时的漫游费用与机场流量为什么要分开核对？', slug: 'roaming-vs-proxy', category: 'mobile', subcategory: 'counters', cluster: 'network-types', url: '/mobile/roaming-vs-proxy/' },
  { id: 'mobile:phone-counter-total', title: '手机显示的总网络量、蜂窝量和应用量怎样避免相互重复相加？', slug: 'phone-counter-total', category: 'mobile', subcategory: 'counters', cluster: 'network-types', url: '/mobile/phone-counter-total/' },

  // mobile / counters / hotspot
  { id: 'mobile:hotspot-double-count', title: '电脑连接手机热点时，两台设备都有统计，怎样只计一次对外传输？', slug: 'hotspot-double-count', category: 'mobile', subcategory: 'counters', cluster: 'hotspot', url: '/mobile/hotspot-double-count/' },
  { id: 'mobile:hotspot-proxy-scope', title: '手机开启代理是否意味着热点设备流量也经过代理，应如何验证？', slug: 'hotspot-proxy-scope', category: 'mobile', subcategory: 'counters', cluster: 'hotspot', url: '/mobile/hotspot-proxy-scope/' },
  { id: 'mobile:hotspot-device-breakdown', title: '多人共用一个热点时，怎样记录任务归属而不暴露个人访问内容？', slug: 'hotspot-device-breakdown', category: 'mobile', subcategory: 'counters', cluster: 'hotspot', url: '/mobile/hotspot-device-breakdown/' },
  { id: 'mobile:hotspot-carrier-bill', title: '热点用量与机场扣量对不上时，为什么要先分清运营商和服务方的计费范围？', slug: 'hotspot-carrier-bill', category: 'mobile', subcategory: 'counters', cluster: 'hotspot', url: '/mobile/hotspot-carrier-bill/' },

  // mobile / management / background
  { id: 'mobile:phone-background-data', title: '手机没有主动使用却消耗流量，怎样分辨同步、更新和应用后台任务？', slug: 'phone-background-data', category: 'mobile', subcategory: 'management', cluster: 'background', url: '/mobile/phone-background-data/' },
  { id: 'mobile:phone-media-backup', title: '照片视频自动备份怎样进入用量计划，首次上传和后续新增如何区分？', slug: 'phone-media-backup', category: 'mobile', subcategory: 'management', cluster: 'background', url: '/mobile/phone-media-backup/' },
  { id: 'mobile:phone-data-saving', title: '开启省流量模式后怎么验证效果，不能只看设置开关状态？', slug: 'phone-data-saving', category: 'mobile', subcategory: 'management', cluster: 'background', url: '/mobile/phone-data-saving/' },
  { id: 'mobile:phone-update-policy', title: '应用自动更新的网络条件怎样核对，避免在错误的流量池扣量？', slug: 'phone-update-policy', category: 'mobile', subcategory: 'management', cluster: 'background', url: '/mobile/phone-update-policy/' },

  // mobile / management / app-scope
  { id: 'mobile:phone-app-path', title: '浏览器和其他手机应用是否走同一路径，怎样用最少信息确认范围？', slug: 'phone-app-path', category: 'mobile', subcategory: 'management', cluster: 'app-scope', url: '/mobile/phone-app-path/' },
  { id: 'mobile:phone-video-ai-task', title: '手机的视频与AI任务怎样分别记账，而不是用屏幕使用时间代替流量？', slug: 'phone-video-ai-task', category: 'mobile', subcategory: 'management', cluster: 'app-scope', url: '/mobile/phone-video-ai-task/' },
  { id: 'mobile:phone-retry-battery', title: '手机耗电增加能证明代理流量增加吗：两个指标需要怎样分开观察？', slug: 'phone-retry-battery', category: 'mobile', subcategory: 'management', cluster: 'app-scope', url: '/mobile/phone-retry-battery/' },
  { id: 'mobile:phone-local-playback', title: '手机播放本地下载内容时，怎样确认后台联网部分而不是把视频总时长计入？', slug: 'phone-local-playback', category: 'mobile', subcategory: 'management', cluster: 'app-scope', url: '/mobile/phone-local-playback/' },

  // mobile / management / cycle-management
  { id: 'mobile:phone-reset-alignment', title: '手机统计重置与机场额度重置不同步时，怎样维持两条记录线？', slug: 'phone-reset-alignment', category: 'mobile', subcategory: 'management', cluster: 'cycle-management', url: '/mobile/phone-reset-alignment/' },
  { id: 'mobile:phone-quota-alert', title: '手机系统的流量提醒能否直接当作机场额度提醒，缺少哪些条件？', slug: 'phone-quota-alert', category: 'mobile', subcategory: 'management', cluster: 'cycle-management', url: '/mobile/phone-quota-alert/' },
  { id: 'mobile:phone-low-balance', title: '手机临近额度用尽时，怎样按接下来的任务调整使用而不误关关键服务？', slug: 'phone-low-balance', category: 'mobile', subcategory: 'management', cluster: 'cycle-management', url: '/mobile/phone-low-balance/' },
  { id: 'mobile:phone-log-frequency', title: '只用手机记账时，怎样用少量快照保持周期记录完整？', slug: 'phone-log-frequency', category: 'mobile', subcategory: 'management', cluster: 'cycle-management', url: '/mobile/phone-log-frequency/' },

  // mobile / management / migration
  { id: 'mobile:phone-migration-counters', title: '换手机后怎样接续流量账本，不把新设备的零计数当成服务额度清零？', slug: 'phone-migration-counters', category: 'mobile', subcategory: 'management', cluster: 'migration', url: '/mobile/phone-migration-counters/' },
  { id: 'mobile:phone-backup-double-use', title: '新旧手机同时恢复资料时，怎样识别重复同步造成的用量？', slug: 'phone-backup-double-use', category: 'mobile', subcategory: 'management', cluster: 'migration', url: '/mobile/phone-backup-double-use/' },
  { id: 'mobile:phone-ledger-export', title: '从手机导出账本到电脑，怎样检查单位、时区与字符编码没有变化？', slug: 'phone-ledger-export', category: 'mobile', subcategory: 'management', cluster: 'migration', url: '/mobile/phone-ledger-export/' },
  { id: 'mobile:phone-old-device-exit', title: '旧手机不再使用时，应怎样清理账本副本与订阅凭据？', slug: 'phone-old-device-exit', category: 'mobile', subcategory: 'management', cluster: 'migration', url: '/mobile/phone-old-device-exit/' },

  // 11 设备数量 /devices/
  // devices / aggregation / identity
  { id: 'devices:devices-vs-connections', title: '套餐限制的设备数、同时在线数和连接数有什么不同？', slug: 'devices-vs-connections', category: 'devices', subcategory: 'aggregation', cluster: 'identity', url: '/devices/devices-vs-connections/' },
  { id: 'devices:one-device-many-apps', title: '一台电脑开多个应用是否算多台设备，应按哪些规则确认？', slug: 'one-device-many-apps', category: 'devices', subcategory: 'aggregation', cluster: 'identity', url: '/devices/one-device-many-apps/' },
  { id: 'devices:shared-account-rules', title: '多人共享一个账户前需要核对哪些使用条件，不能只看总流量够不够？', slug: 'shared-account-rules', category: 'devices', subcategory: 'aggregation', cluster: 'identity', url: '/devices/shared-account-rules/' },
  { id: 'devices:device-aliases', title: '跨设备记账怎样使用匿名标识，既能区分设备又不泄露个人身份？', slug: 'device-aliases', category: 'devices', subcategory: 'aggregation', cluster: 'identity', url: '/devices/device-aliases/' },

  // devices / aggregation / deduplication
  { id: 'devices:device-sum-safe', title: '什么时候可以把多设备流量相加，必须满足哪些来源和范围条件？', slug: 'device-sum-safe', category: 'devices', subcategory: 'aggregation', cluster: 'deduplication', url: '/devices/device-sum-safe/' },
  { id: 'devices:router-client-duplicate', title: '路由器、电脑和客户端都记录同一传输，怎样建立去重层级？', slug: 'router-client-duplicate', category: 'devices', subcategory: 'aggregation', cluster: 'deduplication', url: '/devices/router-client-duplicate/' },
  { id: 'devices:shared-resource-observation', title: '同一文件在两台设备各下载一次与只在局域网复制一次，怎样分别计量？', slug: 'shared-resource-observation', category: 'devices', subcategory: 'aggregation', cluster: 'deduplication', url: '/devices/shared-resource-observation/' },
  { id: 'devices:duplicate-session-id', title: '导入不同设备记录时怎样判断是重复事件还是独立传输？', slug: 'duplicate-session-id', category: 'devices', subcategory: 'aggregation', cluster: 'deduplication', url: '/devices/duplicate-session-id/' },

  // devices / aggregation / pools
  { id: 'devices:account-pool-mapping', title: '多个设备共用套餐时，如何建立设备到账户及额度池的映射？', slug: 'account-pool-mapping', category: 'devices', subcategory: 'aggregation', cluster: 'pools', url: '/devices/account-pool-mapping/' },
  { id: 'devices:multiple-accounts', title: '同一设备切换不同机场账户，账本怎样避免把流量记到错误余额？', slug: 'multiple-accounts', category: 'devices', subcategory: 'aggregation', cluster: 'pools', url: '/devices/multiple-accounts/' },
  { id: 'devices:pool-transfer-unknown', title: '不同套餐之间的余额能不能转移，为什么不能默认合并成一个池？', slug: 'pool-transfer-unknown', category: 'devices', subcategory: 'aggregation', cluster: 'pools', url: '/devices/pool-transfer-unknown/' },
  { id: 'devices:route-change-ownership', title: '应用分流规则改变后，用量归属如何跟随实际路径更新？', slug: 'route-change-ownership', category: 'devices', subcategory: 'aggregation', cluster: 'pools', url: '/devices/route-change-ownership/' },

  // devices / aggregation / time-scope
  { id: 'devices:cross-device-timezone', title: '设备时区不同，怎样把记录归到同一个服务周期？', slug: 'cross-device-timezone', category: 'devices', subcategory: 'aggregation', cluster: 'time-scope', url: '/devices/cross-device-timezone/' },
  { id: 'devices:clock-drift-devices', title: '两台设备的时钟有误差时，怎样处理同时任务和重复判断？', slug: 'clock-drift-devices', category: 'devices', subcategory: 'aggregation', cluster: 'time-scope', url: '/devices/clock-drift-devices/' },
  { id: 'devices:partial-device-data', title: '只拿到部分设备记录，家庭汇总应怎样显示未覆盖的范围？', slug: 'partial-device-data', category: 'devices', subcategory: 'aggregation', cluster: 'time-scope', url: '/devices/partial-device-data/' },
  { id: 'devices:shared-period-reset', title: '同一账户设备计数器分别清零时，为什么不能当成套餐发生多次重置？', slug: 'shared-period-reset', category: 'devices', subcategory: 'aggregation', cluster: 'time-scope', url: '/devices/shared-period-reset/' },

  // devices / allocation / task-sharing
  { id: 'devices:family-quota-plan', title: '家庭共用流量怎样按任务分配，而不是平均分给每台设备？', slug: 'family-quota-plan', category: 'devices', subcategory: 'allocation', cluster: 'task-sharing', url: '/devices/family-quota-plan/' },
  { id: 'devices:work-personal-split', title: '工作和个人设备共用服务时，怎样保留可解释的使用分类？', slug: 'work-personal-split', category: 'devices', subcategory: 'allocation', cluster: 'task-sharing', url: '/devices/work-personal-split/' },
  { id: 'devices:team-data-consent', title: '小团队汇总用量应取得哪些同意，怎样避免记录访问内容？', slug: 'team-data-consent', category: 'devices', subcategory: 'allocation', cluster: 'task-sharing', url: '/devices/team-data-consent/' },
  { id: 'devices:shared-quota-reserve', title: '多设备计划中的公共备用额度怎样设置，避免各设备重复预留？', slug: 'shared-quota-reserve', category: 'devices', subcategory: 'allocation', cluster: 'task-sharing', url: '/devices/shared-quota-reserve/' },

  // devices / allocation / concurrency
  { id: 'devices:concurrent-not-volume', title: '设备一多就变慢能说明流量套餐不够吗：并发、带宽与容量分别检查', slug: 'concurrent-not-volume', category: 'devices', subcategory: 'allocation', cluster: 'concurrency', url: '/devices/concurrent-not-volume/' },
  { id: 'devices:simultaneous-test', title: '怎样安排多设备同时使用测试，记录成功任务而不是只看连接图标？', slug: 'simultaneous-test', category: 'devices', subcategory: 'allocation', cluster: 'concurrency', url: '/devices/simultaneous-test/' },
  { id: 'devices:background-concurrency', title: '后台同步占用连接资源时，怎样从任务时间线判断影响？', slug: 'background-concurrency', category: 'devices', subcategory: 'allocation', cluster: 'concurrency', url: '/devices/background-concurrency/' },
  { id: 'devices:device-limit-evidence', title: '遇到设备数限制提示，怎样保存信息并核对规则而不是反复尝试绕过？', slug: 'device-limit-evidence', category: 'devices', subcategory: 'allocation', cluster: 'concurrency', url: '/devices/device-limit-evidence/' },

  // devices / allocation / allocation-rules
  { id: 'devices:usage-allocation-method', title: '需要分摊费用时，按用量、固定比例和公共任务怎样选择规则？', slug: 'usage-allocation-method', category: 'devices', subcategory: 'allocation', cluster: 'allocation-rules', url: '/devices/usage-allocation-method/' },
  { id: 'devices:unknown-share', title: '仍有一部分用量无法归到设备，如何保留公共项而不强行平均？', slug: 'unknown-share', category: 'devices', subcategory: 'allocation', cluster: 'allocation-rules', url: '/devices/unknown-share/' },
  { id: 'devices:allocation-after-change', title: '设备加入或退出中途发生时，怎样解释本周期分摊变化？', slug: 'allocation-after-change', category: 'devices', subcategory: 'allocation', cluster: 'allocation-rules', url: '/devices/allocation-after-change/' },
  { id: 'devices:allocation-report', title: '向共同使用者分享用量与费用时，怎样提供可核对但不泄露隐私的报告？', slug: 'allocation-report', category: 'devices', subcategory: 'allocation', cluster: 'allocation-rules', url: '/devices/allocation-report/' },

  // devices / allocation / lifecycle
  { id: 'devices:new-device-checklist', title: '增加一台设备前，怎样检查剩余额度、格式、规则和同时使用限制？', slug: 'new-device-checklist', category: 'devices', subcategory: 'allocation', cluster: 'lifecycle', url: '/devices/new-device-checklist/' },
  { id: 'devices:retire-device', title: '旧设备停用后还出现用量，怎样逐项核对来源与授权？', slug: 'retire-device', category: 'devices', subcategory: 'allocation', cluster: 'lifecycle', url: '/devices/retire-device/' },
  { id: 'devices:device-pool-review', title: '每个周期怎样判断设备组合改变了真实需求，而不只看设备数量？', slug: 'device-pool-review', category: 'devices', subcategory: 'allocation', cluster: 'lifecycle', url: '/devices/device-pool-review/' },
  { id: 'devices:device-handoff', title: '多设备用户去主站选服务前，应整理哪些用途、额度和连接条件？', slug: 'device-handoff', category: 'devices', subcategory: 'allocation', cluster: 'lifecycle', url: '/devices/device-handoff/' },

  // 12 账单核对 /reconcile/
  // reconcile / alignment / basis
  { id: 'reconcile:reconcile-first-step', title: '机场后台扣量与本地统计不同，开始对账前应该先统一哪些条件？', slug: 'reconcile-first-step', category: 'reconcile', subcategory: 'alignment', cluster: 'basis', url: '/reconcile/reconcile-first-step/' },
  { id: 'reconcile:reconcile-layer', title: '应用、系统、隧道和服务端分别计了什么，如何选择可比较的一组？', slug: 'reconcile-layer', category: 'reconcile', subcategory: 'alignment', cluster: 'basis', url: '/reconcile/reconcile-layer/' },
  { id: 'reconcile:reconcile-direction', title: '只计下载的本地记录如何与双向计费账单比较，缺失上传量怎么办？', slug: 'reconcile-direction', category: 'reconcile', subcategory: 'alignment', cluster: 'basis', url: '/reconcile/reconcile-direction/' },
  { id: 'reconcile:reconcile-unit', title: '账单GB与设备GiB不一致，怎样用原始字节重新核对？', slug: 'reconcile-unit', category: 'reconcile', subcategory: 'alignment', cluster: 'basis', url: '/reconcile/reconcile-unit/' },

  // reconcile / alignment / timing
  { id: 'reconcile:reconcile-cumulative', title: '账单累计值怎样转换成区间用量：先识别重置、清零和补录', slug: 'reconcile-cumulative', category: 'reconcile', subcategory: 'alignment', cluster: 'timing', url: '/reconcile/reconcile-cumulative/' },
  { id: 'reconcile:reconcile-lag', title: '任务结束后后台还在变化，怎样设置合理观察窗口而不立刻下结论？', slug: 'reconcile-lag', category: 'reconcile', subcategory: 'alignment', cluster: 'timing', url: '/reconcile/reconcile-lag/' },
  { id: 'reconcile:reconcile-cutoff', title: '本地记录截止时刻和账单截点不同，怎样对齐而不重复补算？', slug: 'reconcile-cutoff', category: 'reconcile', subcategory: 'alignment', cluster: 'timing', url: '/reconcile/reconcile-cutoff/' },
  { id: 'reconcile:reconcile-late-data', title: '服务后补计的流量应该记在哪个周期，如何保留来源说明？', slug: 'reconcile-late-data', category: 'reconcile', subcategory: 'alignment', cluster: 'timing', url: '/reconcile/reconcile-late-data/' },

  // reconcile / alignment / components
  { id: 'reconcile:reconcile-multiplier', title: '差额可能来自倍率时，怎样用逐段记录复算，而不是用全月平均倍率？', slug: 'reconcile-multiplier', category: 'reconcile', subcategory: 'alignment', cluster: 'components', url: '/reconcile/reconcile-multiplier/' },
  { id: 'reconcile:reconcile-retries', title: '任务显示失败但账单增加了，怎样核对已经传输的请求和重试？', slug: 'reconcile-retries', category: 'reconcile', subcategory: 'alignment', cluster: 'components', url: '/reconcile/reconcile-retries/' },
  { id: 'reconcile:reconcile-overhead', title: '封装与计量层级可能导致多大差异，为什么不能无证据套固定容差？', slug: 'reconcile-overhead', category: 'reconcile', subcategory: 'alignment', cluster: 'components', url: '/reconcile/reconcile-overhead/' },
  { id: 'reconcile:reconcile-background', title: '用户没有操作却产生扣量，怎样用设备与后台任务记录缩小范围？', slug: 'reconcile-background', category: 'reconcile', subcategory: 'alignment', cluster: 'components', url: '/reconcile/reconcile-background/' },

  // reconcile / alignment / uncertainty
  { id: 'reconcile:reconcile-rounding', title: '显示取整会怎样影响小用量核对，什么时候应扩大观察区间？', slug: 'reconcile-rounding', category: 'reconcile', subcategory: 'alignment', cluster: 'uncertainty', url: '/reconcile/reconcile-rounding/' },
  { id: 'reconcile:reconcile-unknown', title: '信息不足无法复算的差额怎样呈现，避免写成已确认多扣？', slug: 'reconcile-unknown', category: 'reconcile', subcategory: 'alignment', cluster: 'uncertainty', url: '/reconcile/reconcile-unknown/' },
  { id: 'reconcile:reconcile-duplicate', title: '重复导入、重复统计和服务多扣怎样区分，先检查自己的账本', slug: 'reconcile-duplicate', category: 'reconcile', subcategory: 'alignment', cluster: 'uncertainty', url: '/reconcile/reconcile-duplicate/' },
  { id: 'reconcile:reconcile-range', title: '对账中只有部分参数可确定时，怎样给出有依据的差额范围？', slug: 'reconcile-range', category: 'reconcile', subcategory: 'alignment', cluster: 'uncertainty', url: '/reconcile/reconcile-range/' },

  // reconcile / resolution / evidence
  { id: 'reconcile:reconcile-small-test', title: '怎样设计低消耗、可复查的流量核对测试，而不是大量跑测速？', slug: 'reconcile-small-test', category: 'reconcile', subcategory: 'resolution', cluster: 'evidence', url: '/reconcile/reconcile-small-test/' },
  { id: 'reconcile:reconcile-evidence-pack', title: '向服务方反馈计费疑问，需要哪些截图、时间和脱敏记录？', slug: 'reconcile-evidence-pack', category: 'reconcile', subcategory: 'resolution', cluster: 'evidence', url: '/reconcile/reconcile-evidence-pack/' },
  { id: 'reconcile:reconcile-control-devices', title: '做核对测试前怎样控制其他设备和任务，避免错误归因？', slug: 'reconcile-control-devices', category: 'reconcile', subcategory: 'resolution', cluster: 'evidence', url: '/reconcile/reconcile-control-devices/' },
  { id: 'reconcile:reconcile-snapshot-chain', title: '前后快照怎样保存，才能证明比较的是同一个账户与规则版本？', slug: 'reconcile-snapshot-chain', category: 'reconcile', subcategory: 'resolution', cluster: 'evidence', url: '/reconcile/reconcile-snapshot-chain/' },

  // reconcile / resolution / communication
  { id: 'reconcile:reconcile-support-question', title: '怎样把“流量扣得快”写成可回答的核对问题，而不是模糊投诉？', slug: 'reconcile-support-question', category: 'reconcile', subcategory: 'resolution', cluster: 'communication', url: '/reconcile/reconcile-support-question/' },
  { id: 'reconcile:reconcile-support-answer', title: '客服解释了计费规则后，账本和计算器应更新哪些字段？', slug: 'reconcile-support-answer', category: 'reconcile', subcategory: 'resolution', cluster: 'communication', url: '/reconcile/reconcile-support-answer/' },
  { id: 'reconcile:reconcile-conflicting-answer', title: '不同支持渠道给出不一致答复，怎样保存原文并标注仍待确认？', slug: 'reconcile-conflicting-answer', category: 'reconcile', subcategory: 'resolution', cluster: 'communication', url: '/reconcile/reconcile-conflicting-answer/' },
  { id: 'reconcile:reconcile-no-response', title: '暂时得不到计费说明时，怎样表达结论边界并决定是否继续使用？', slug: 'reconcile-no-response', category: 'reconcile', subcategory: 'resolution', cluster: 'communication', url: '/reconcile/reconcile-no-response/' },

  // reconcile / resolution / adjustments
  { id: 'reconcile:reconcile-adjustment', title: '服务方补回流量后，怎样记录更正而不把它当成新的购买额度？', slug: 'reconcile-adjustment', category: 'reconcile', subcategory: 'resolution', cluster: 'adjustments', url: '/reconcile/reconcile-adjustment/' },
  { id: 'reconcile:reconcile-refund-entry', title: '退款、余额抵扣与补偿流量怎样分别记账，不能互相替代？', slug: 'reconcile-refund-entry', category: 'reconcile', subcategory: 'resolution', cluster: 'adjustments', url: '/reconcile/reconcile-refund-entry/' },
  { id: 'reconcile:reconcile-reopen-report', title: '已经发布的对账结论被新证据推翻，怎样更新并保留更正历史？', slug: 'reconcile-reopen-report', category: 'reconcile', subcategory: 'resolution', cluster: 'adjustments', url: '/reconcile/reconcile-reopen-report/' },
  { id: 'reconcile:reconcile-reset-compensation', title: '补偿同时改变到期或重置日时，怎样重建后续周期而不改乱旧账？', slug: 'reconcile-reset-compensation', category: 'reconcile', subcategory: 'resolution', cluster: 'adjustments', url: '/reconcile/reconcile-reset-compensation/' },

  // reconcile / resolution / reporting
  { id: 'reconcile:reconcile-final-report', title: '一份可信的流量对账报告应如何组织：已知、未知、计算和结论分开', slug: 'reconcile-final-report', category: 'reconcile', subcategory: 'resolution', cluster: 'reporting', url: '/reconcile/reconcile-final-report/' },
  { id: 'reconcile:reconcile-not-fraud-proof', title: '观察到差额能证明恶意计费吗：证据等级与措辞边界', slug: 'reconcile-not-fraud-proof', category: 'reconcile', subcategory: 'resolution', cluster: 'reporting', url: '/reconcile/reconcile-not-fraud-proof/' },
  { id: 'reconcile:reconcile-repeat-check', title: '问题看似解决后，怎样做小规模复核而不无限反复测试？', slug: 'reconcile-repeat-check', category: 'reconcile', subcategory: 'resolution', cluster: 'reporting', url: '/reconcile/reconcile-repeat-check/' },
  { id: 'reconcile:reconcile-choice-handoff', title: '对账后的规则不符合需求时，怎样带着明确条件去比较其他服务？', slug: 'reconcile-choice-handoff', category: 'reconcile', subcategory: 'resolution', cluster: 'reporting', url: '/reconcile/reconcile-choice-handoff/' },

  // 13 知识百科 /knowledge/
  // knowledge / measurement / units
  { id: 'knowledge:kb-kib-glossary', title: 'KB、KiB、MB、MiB、GB和GiB是什么：读懂流量记录中的单位体系', slug: 'kb-kib-glossary', category: 'knowledge', subcategory: 'measurement', cluster: 'units', url: '/knowledge/kb-kib-glossary/' },
  { id: 'knowledge:rate-volume-distinction', title: '网速、流量和文件大小有什么关系：为什么它们不是同一个量？', slug: 'rate-volume-distinction', category: 'knowledge', subcategory: 'measurement', cluster: 'units', url: '/knowledge/rate-volume-distinction/' },
  { id: 'knowledge:raw-vs-display', title: '原始计数、单位显示和四舍五入是什么关系：如何保留可复算性？', slug: 'raw-vs-display', category: 'knowledge', subcategory: 'measurement', cluster: 'units', url: '/knowledge/raw-vs-display/' },
  { id: 'knowledge:counter-vs-quota', title: '设备计数器与服务额度余额有什么区别：一个观察使用，一个描述权利', slug: 'counter-vs-quota', category: 'knowledge', subcategory: 'measurement', cluster: 'units', url: '/knowledge/counter-vs-quota/' },

  // knowledge / measurement / entitlements
  { id: 'knowledge:billing-service-quota', title: '付款周期、服务有效期和流量重置周期为什么必须分别记录？', slug: 'billing-service-quota', category: 'knowledge', subcategory: 'measurement', cluster: 'entitlements', url: '/knowledge/billing-service-quota/' },
  { id: 'knowledge:monthly-payg-terms', title: '月付、不限时和按量这些词本身能说明什么，哪些条件仍需查看条款？', slug: 'monthly-payg-terms', category: 'knowledge', subcategory: 'measurement', cluster: 'entitlements', url: '/knowledge/monthly-payg-terms/' },
  { id: 'knowledge:bonus-entitlement', title: '赠送流量与购买额度是否拥有相同使用权，应该从哪些字段判断？', slug: 'bonus-entitlement', category: 'knowledge', subcategory: 'measurement', cluster: 'entitlements', url: '/knowledge/bonus-entitlement/' },
  { id: 'knowledge:unused-not-savings', title: '未使用额度和节省费用有什么区别，为什么“剩得多”不一定更划算？', slug: 'unused-not-savings', category: 'knowledge', subcategory: 'measurement', cluster: 'entitlements', url: '/knowledge/unused-not-savings/' },

  // knowledge / measurement / statistics
  { id: 'knowledge:mean-median-usage', title: '平均日用量、中位数和高用量日各说明什么，怎样避免只看一个数字？', slug: 'mean-median-usage', category: 'knowledge', subcategory: 'measurement', cluster: 'statistics', url: '/knowledge/mean-median-usage/' },
  { id: 'knowledge:observed-window', title: '观察窗口、样本数量和覆盖范围是什么，为什么决定结论能用到哪里？', slug: 'observed-window', category: 'knowledge', subcategory: 'measurement', cluster: 'statistics', url: '/knowledge/observed-window/' },
  { id: 'knowledge:scenario-not-probability', title: '条件情景与概率预测有什么区别：流量估算为什么应说明假设？', slug: 'scenario-not-probability', category: 'knowledge', subcategory: 'measurement', cluster: 'statistics', url: '/knowledge/scenario-not-probability/' },
  { id: 'knowledge:coverage-and-missing', title: '记录完整度怎样表达，为什么缺失值不能自动当成零？', slug: 'coverage-and-missing', category: 'knowledge', subcategory: 'measurement', cluster: 'statistics', url: '/knowledge/coverage-and-missing/' },

  // knowledge / measurement / value
  { id: 'knowledge:quota-utilization', title: '流量利用率怎样定义，为什么需要同时注明额度池和统计周期？', slug: 'quota-utilization', category: 'knowledge', subcategory: 'measurement', cluster: 'value', url: '/knowledge/quota-utilization/' },
  { id: 'knowledge:unit-cost-definition', title: '每GB价格到底除以哪个量：购买额度、可传输量与实际使用量', slug: 'unit-cost-definition', category: 'knowledge', subcategory: 'measurement', cluster: 'value', url: '/knowledge/unit-cost-definition/' },
  { id: 'knowledge:cash-vs-allocation', title: '现金支出与分摊成本有什么不同，为什么不能在同一列混用？', slug: 'cash-vs-allocation', category: 'knowledge', subcategory: 'measurement', cluster: 'value', url: '/knowledge/cash-vs-allocation/' },
  { id: 'knowledge:cheapest-not-fit', title: '每GB最便宜的方案为什么未必最适合任务：条件比较的基本方法', slug: 'cheapest-not-fit', category: 'knowledge', subcategory: 'measurement', cluster: 'value', url: '/knowledge/cheapest-not-fit/' },

  // knowledge / network / roles
  { id: 'knowledge:client-core-service', title: '机场服务、代理客户端和内核分别做什么，对流量观察有什么影响？', slug: 'client-core-service', category: 'knowledge', subcategory: 'network', cluster: 'roles', url: '/knowledge/client-core-service/' },
  { id: 'knowledge:proxy-scope-basics', title: '应用代理、系统代理和TUN分别可能接管哪些流量，如何理解范围？', slug: 'proxy-scope-basics', category: 'knowledge', subcategory: 'network', cluster: 'roles', url: '/knowledge/proxy-scope-basics/' },
  { id: 'knowledge:local-vs-wan', title: '局域网传输与公网出口有什么区别，为什么家中复制文件不等于机场消耗？', slug: 'local-vs-wan', category: 'knowledge', subcategory: 'network', cluster: 'roles', url: '/knowledge/local-vs-wan/' },
  { id: 'knowledge:shared-exit', title: '多设备共用出口IP能否证明共用同一个流量额度池？', slug: 'shared-exit', category: 'knowledge', subcategory: 'network', cluster: 'roles', url: '/knowledge/shared-exit/' },

  // knowledge / network / transport
  { id: 'knowledge:tcp-retry-measurement', title: 'TCP重传与应用重试有什么区别，对不同层级计数可能有什么影响？', slug: 'tcp-retry-measurement', category: 'knowledge', subcategory: 'network', cluster: 'transport', url: '/knowledge/tcp-retry-measurement/' },
  { id: 'knowledge:udp-quic-boundaries', title: 'UDP与QUIC任务的传输量应该如何理解，为什么不能只凭协议名预测开销？', slug: 'udp-quic-boundaries', category: 'knowledge', subcategory: 'network', cluster: 'transport', url: '/knowledge/udp-quic-boundaries/' },
  { id: 'knowledge:tls-payload', title: '加密后的传输量与原始文件大小为什么可能不同，哪些信息不能直接观察？', slug: 'tls-payload', category: 'knowledge', subcategory: 'network', cluster: 'transport', url: '/knowledge/tls-payload/' },
  { id: 'knowledge:compression-boundary', title: '压缩、分块、缓存与去重各发生在哪里，怎样避免把存储节省当网络节省？', slug: 'compression-boundary', category: 'knowledge', subcategory: 'network', cluster: 'transport', url: '/knowledge/compression-boundary/' },

  // knowledge / network / routing
  { id: 'knowledge:dns-not-entire-traffic', title: 'DNS查询流量与应用数据流量有什么区别，DNS检测不能证明哪些事情？', slug: 'dns-not-entire-traffic', category: 'knowledge', subcategory: 'network', cluster: 'routing', url: '/knowledge/dns-not-entire-traffic/' },
  { id: 'knowledge:ipv4-ipv6-accounting', title: 'IPv4与IPv6并存时，怎样理解流量路径与账本覆盖范围？', slug: 'ipv4-ipv6-accounting', category: 'knowledge', subcategory: 'network', cluster: 'routing', url: '/knowledge/ipv4-ipv6-accounting/' },
  { id: 'knowledge:rule-coverage', title: '分流规则改变了哪些请求进入代理，为什么可能影响机场用量？', slug: 'rule-coverage', category: 'knowledge', subcategory: 'network', cluster: 'routing', url: '/knowledge/rule-coverage/' },
  { id: 'knowledge:network-diagnosis-not-volume', title: '延迟、丢包、卡顿和流量增长之间能否直接画等号？', slug: 'network-diagnosis-not-volume', category: 'knowledge', subcategory: 'network', cluster: 'routing', url: '/knowledge/network-diagnosis-not-volume/' },

  // knowledge / network / trust
  { id: 'knowledge:claim-evidence-level', title: '服务声明、工具计算和独立实测的证据等级怎样区分？', slug: 'claim-evidence-level', category: 'knowledge', subcategory: 'network', cluster: 'trust', url: '/knowledge/claim-evidence-level/' },
  { id: 'knowledge:private-ledger-data', title: '流量记录可能包含哪些敏感线索，分享和保存前应该怎样处理？', slug: 'private-ledger-data', category: 'knowledge', subcategory: 'network', cluster: 'trust', url: '/knowledge/private-ledger-data/' },
  { id: 'knowledge:local-storage-not-guarantee', title: '账本保存在本地就绝对安全吗：浏览器、共享设备和备份的边界', slug: 'local-storage-not-guarantee', category: 'knowledge', subcategory: 'network', cluster: 'trust', url: '/knowledge/local-storage-not-guarantee/' },
  { id: 'knowledge:source-update-rules', title: '资料来源、计算版本和更新时间如何记录，才能让读者复查结论？', slug: 'source-update-rules', category: 'knowledge', subcategory: 'network', cluster: 'trust', url: '/knowledge/source-update-rules/' },
];
