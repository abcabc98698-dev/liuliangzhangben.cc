import fs from 'node:fs';
import path from 'node:path';

export interface ContentNode {
  id: string;
  type: 'home' | 'category' | 'subcategory' | 'cluster' | 'article' | 'support';
  title: string;
  url: string;
  parentId: string | null;
  category: string;
  subcategory?: string;
  cluster?: string;
  intent: string;
  primaryKeyword: string;
  evidenceRequirement: string;
  status: 'draft' | 'research' | 'reviewed' | 'published';
  targetWordCount: number;
  actualWordCount?: number;
  ctaType: 'pricing' | 'compare' | 'recommend' | 'ai-streaming' | 'reviews' | 'none';
  publishedAt?: string;
  modifiedAt?: string;
  sourceCheckedAt?: string;
}

export interface ContentGraphEdge {
  fromId: string;
  toId: string;
  relation: 'parent-child' | 'prerequisite' | 'evidence' | 'compare' | 'nextStep' | 'commercialHandoff';
  reason: string;
}

// 13 大一级栏目
export const CATEGORIES_DEF = [
  { slug: 'records', title: '用量记录', desc: '记录来源、账本管理与证据分层' },
  { slug: 'estimate', title: '流量估算', desc: '任务模型、基线采样与周期预测' },
  { slug: 'multipliers', title: '倍率规则', desc: '扣量公式、上下行加权与规则核验' },
  { slug: 'reset', title: '重置周期', desc: '自然月、约定日与额度边界' },
  { slug: 'payg', title: '按量方案', desc: '整包购买、有效条件与成本复盘' },
  { slug: 'high-data', title: '大流量专题', desc: '重度任务拆分、持续吞吐与容量计划' },
  { slug: 'occasional', title: '低频使用', desc: '活跃日模型、间歇备用与轻量账本' },
  { slug: 'video', title: '视频用量', desc: '码率时长、自适应缓冲与多屏观看' },
  { slug: 'ai', title: 'AI用量', desc: 'Token与字节边界、文档流式与开发依赖' },
  { slug: 'mobile', title: '手机用量', desc: '系统统计、热点中继与网络切换' },
  { slug: 'devices', title: '设备数量', desc: '并发连接、跨设备去重与额度池映射' },
  { slug: 'reconcile', title: '账单核对', desc: '口径对齐、更新延迟与差异闭环' },
  { slug: 'knowledge', title: '知识百科', desc: '计量单位、传输封装与可信边界' },
];

// 26 个二级专题定义
export const SUBCATEGORIES_DEF: Record<string, { slug: string; title: string; clusters: { slug: string; title: string }[] }[]> = {
  records: [
    {
      slug: 'baseline',
      title: '记录来源与基线',
      clusters: [
        { slug: 'sources', title: '统计来源与观察范围' },
        { slug: 'fields', title: '字段、单位与时间戳' },
        { slug: 'sampling', title: '连续观察与采样' },
        { slug: 'evidence-labels', title: '实测、估算与证据标签' },
      ],
    },
    {
      slug: 'management',
      title: '账本管理与复盘',
      clusters: [
        { slug: 'local-storage', title: '本地保存与恢复' },
        { slug: 'file-import', title: '导入、导出与重复控制' },
        { slug: 'summaries', title: '汇总视图与趋势解释' },
        { slug: 'audit-trail', title: '更正、历史与协作' },
      ],
    },
  ],
  estimate: [
    {
      slug: 'models',
      title: '单任务模型与基线',
      clusters: [
        { slug: 'baseline-sample', title: '样本选择与代表性' },
        { slug: 'task-size', title: '时长、次数与文件量' },
        { slug: 'unit-rate', title: '速率与容量换算' },
        { slug: 'traffic-scope', title: '接管范围与额外传输' },
      ],
    },
    {
      slug: 'forecast',
      title: '周期预测与结果验证',
      clusters: [
        { slug: 'composition', title: '任务组合与周期分配' },
        { slug: 'scenarios', title: '波动、余量与极端情景' },
        { slug: 'period-fit', title: '结果与计费周期匹配' },
        { slug: 'validation', title: '误差回看与模型修正' },
      ],
    },
  ],
  multipliers: [
    {
      slug: 'calculation',
      title: '扣量公式与组合',
      clusters: [
        { slug: 'single-rate', title: '单倍率与可用额度' },
        { slug: 'directions', title: '上下行计费方式' },
        { slug: 'mixed-rates', title: '多节点与混合倍率' },
        { slug: 'rate-history', title: '倍率变更与时间口径' },
      ],
    },
    {
      slug: 'verification',
      title: '规则核验与使用取舍',
      clusters: [
        { slug: 'sources', title: '规则来源与计费观察' },
        { slug: 'path-accounting', title: '多路径与计数去重' },
        { slug: 'exceptions', title: '例外规则与未知值' },
        { slug: 'selection', title: '倍率与方案适配' },
      ],
    },
  ],
  reset: [
    {
      slug: 'boundaries',
      title: '周期边界与时间',
      clusters: [
        { slug: 'calendar', title: '自然月与固定日重置' },
        { slug: 'rolling', title: '购买日起算与固定天数' },
        { slug: 'timezone', title: '时区与边界事件' },
        { slug: 'remaining', title: '剩余额度与到期判断' },
      ],
    },
    {
      slug: 'balances',
      title: '额度变化与周期结算',
      clusters: [
        { slug: 'rollover', title: '结转、清零与额度池' },
        { slug: 'renew-upgrade', title: '续费与升级对周期的影响' },
        { slug: 'topups', title: '补充包与手动重置' },
        { slug: 'closeout', title: '周期结算与复核' },
      ],
    },
  ],
  payg: [
    {
      slug: 'terms',
      title: '方案条款与费用口径',
      clusters: [
        { slug: 'definitions', title: '按量、不限时与有效条件' },
        { slug: 'purchase-units', title: '购买单位与实际消耗' },
        { slug: 'constraints', title: '附加费用与服务限制' },
        { slug: 'exit', title: '规则变化与退出' },
      ],
    },
    {
      slug: 'fit',
      title: '用量适配与方案比较',
      clusters: [
        { slug: 'frequency', title: '使用频率与额度安排' },
        { slug: 'pack-sizing', title: '包大小与补购时点' },
        { slug: 'comparison', title: '与月付及混合方案比较' },
        { slug: 'verification', title: '买前验证与买后复盘' },
      ],
    },
  ],
  'high-data': [
    {
      slug: 'demand',
      title: '高用量来源与任务条件',
      clusters: [
        { slug: 'task-inventory', title: '重度任务拆分' },
        { slug: 'capacity', title: '持续速度与完成时间' },
        { slug: 'bursts', title: '高峰日与集中使用' },
        { slug: 'retries', title: '任务重试与完整性' },
      ],
    },
    {
      slug: 'plans',
      title: '额度方案与使用复盘',
      clusters: [
        { slug: 'quota-selection', title: '容量与套餐条件' },
        { slug: 'allocation', title: '补充和组合额度' },
        { slug: 'acceptance', title: '真实验收与样本限制' },
        { slug: 'efficiency', title: '减少非必要传输' },
      ],
    },
  ],
  occasional: [
    {
      slug: 'patterns',
      title: '间歇使用的需求模式',
      clusters: [
        { slug: 'active-days', title: '活跃日与空闲日' },
        { slug: 'temporary', title: '临时任务与短期安排' },
        { slug: 'backup', title: '备用任务与切换要求' },
        { slug: 'seasonal', title: '季节、周末与阶段需求' },
      ],
    },
    {
      slug: 'maintenance',
      title: '低频维护与购买复盘',
      clusters: [
        { slug: 'account-check', title: '余额、有效期与账户复查' },
        { slug: 'lightweight-logging', title: '最少记录与轻量验证' },
        { slug: 'purchase-timing', title: '低频预算与购买时点' },
        { slug: 'review', title: '使用后的证据与交接' },
      ],
    },
  ],
  video: [
    {
      slug: 'models',
      title: '视频传输模型与输入',
      clusters: [
        { slug: 'bitrate', title: '码率、时长与容量' },
        { slug: 'adaptive', title: '自适应画质与播放状态' },
        { slug: 'cache', title: '缓存、重播与下载' },
        { slug: 'multiscreen', title: '多屏与同步观看' },
      ],
    },
    {
      slug: 'plans',
      title: '设备场景与观看计划',
      clusters: [
        { slug: 'tv-casting', title: '电视、投屏与本地传输' },
        { slug: 'live', title: '直播、会议与双向音视频' },
        { slug: 'schedule', title: '周期安排与可用额度' },
        { slug: 'verify', title: '验收、对账与使用限制' },
      ],
    },
  ],
  ai: [
    {
      slug: 'workloads',
      title: 'AI任务的网络构成',
      clusters: [
        { slug: 'text', title: '文本对话与页面请求' },
        { slug: 'files', title: '文档上传与处理阶段' },
        { slug: 'multimodal', title: '图像、音频与视频任务' },
        { slug: 'coding', title: 'AI编程与开发依赖' },
      ],
    },
    {
      slug: 'accounting',
      title: 'AI计量边界与额度计划',
      clusters: [
        { slug: 'tokens', title: 'Token、费用与字节边界' },
        { slug: 'retries', title: '重试、中断与重复任务' },
        { slug: 'scope', title: '请求范围与隐私证据' },
        { slug: 'planning', title: '周期预算与购买边界' },
      ],
    },
  ],
  mobile: [
    {
      slug: 'counters',
      title: '手机统计与网络范围',
      clusters: [
        { slug: 'android', title: 'Android统计读取' },
        { slug: 'ios', title: 'iPhone与iPad统计读取' },
        { slug: 'network-types', title: 'Wi-Fi、蜂窝与切换' },
        { slug: 'hotspot', title: '热点共享与计数层级' },
      ],
    },
    {
      slug: 'management',
      title: '手机用量管理与复盘',
      clusters: [
        { slug: 'background', title: '后台、同步与更新' },
        { slug: 'app-scope', title: '应用接管与任务观察' },
        { slug: 'cycle-management', title: '周期提醒与记录方法' },
        { slug: 'migration', title: '换机、备份与恢复' },
      ],
    },
  ],
  devices: [
    {
      slug: 'aggregation',
      title: '设备身份与合计规则',
      clusters: [
        { slug: 'identity', title: '设备、连接与账户关系' },
        { slug: 'deduplication', title: '跨设备统计去重' },
        { slug: 'pools', title: '额度池与账户映射' },
        { slug: 'time-scope', title: '时区、周期与跨端记录' },
      ],
    },
    {
      slug: 'allocation',
      title: '分配、并发与共同使用',
      clusters: [
        { slug: 'task-sharing', title: '家庭与小团队任务分配' },
        { slug: 'concurrency', title: '并发与性能约束' },
        { slug: 'allocation-rules', title: '使用归属与成本分摊' },
        { slug: 'lifecycle', title: '设备迁移与周期复盘' },
      ],
    },
  ],
  reconcile: [
    {
      slug: 'alignment',
      title: '对账前提与差异拆解',
      clusters: [
        { slug: 'basis', title: '来源与计费口径对齐' },
        { slug: 'timing', title: '累计数、时间与更新延迟' },
        { slug: 'components', title: '倍率、重传与额外请求' },
        { slug: 'uncertainty', title: '显示精度与无法解释项' },
      ],
    },
    {
      slug: 'resolution',
      title: '记录取证与处理闭环',
      clusters: [
        { slug: 'evidence', title: '最小复现与证据包' },
        { slug: 'communication', title: '客服沟通与规则澄清' },
        { slug: 'adjustments', title: '更正、补偿与余额变动' },
        { slug: 'reporting', title: '报告与购买决策边界' },
      ],
    },
  ],
  knowledge: [
    {
      slug: 'measurement',
      title: '计量概念与使用规则',
      clusters: [
        { slug: 'units', title: '数据单位与数量性质' },
        { slug: 'entitlements', title: '付款、期限与额度关系' },
        { slug: 'statistics', title: '统计指标与样本解释' },
        { slug: 'value', title: '价格效率与比较边界' },
      ],
    },
    {
      slug: 'network',
      title: '网络机制与可信边界',
      clusters: [
        { slug: 'roles', title: '服务、软件与请求路径' },
        { slug: 'transport', title: '传输、重试与封装' },
        { slug: 'routing', title: '解析、分流与设备环境' },
        { slug: 'trust', title: '事实、隐私与责任说明' },
      ],
    },
  ],
};
