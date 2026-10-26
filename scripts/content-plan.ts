import fs from 'node:fs';
import path from 'node:path';
import { CATEGORIES_DEF, SUBCATEGORIES_DEF, ContentNode, ContentGraphEdge } from './content-meta';
import { ARTICLES_DATA } from './articles-data';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const nodes: ContentNode[] = [];
const edges: ContentGraphEdge[] = [];

// 1. 首页
const homeNode: ContentNode = {
  id: 'home',
  type: 'home',
  title: '流量账本：机场用量记录、倍率计算与套餐核对',
  url: '/',
  parentId: null,
  category: '',
  intent: '全站用量记账、周期估算、倍率复核入口与十三大专题索引',
  primaryKeyword: '流量账本',
  evidenceRequirement: '独立客户端计算与可核查假设演算',
  status: 'published',
  targetWordCount: 12000,
  ctaType: 'recommend',
  publishedAt: '2026-10-26T00:00:00+08:00',
  modifiedAt: '2026-10-26T00:00:00+08:00',
  sourceCheckedAt: '2026-10-26T00:00:00+08:00',
};
nodes.push(homeNode);

// 2. 13 个一级栏目
for (const cat of CATEGORIES_DEF) {
  const catNode: ContentNode = {
    id: `cat:${cat.slug}`,
    type: 'category',
    title: `${cat.title} - 流量账本专题`,
    url: `/${cat.slug}/`,
    parentId: 'home',
    category: cat.slug,
    intent: `系统性掌握${cat.title}的核心概念、计算规则与决策树`,
    primaryKeyword: cat.title,
    evidenceRequirement: '权威网络工程规范与服务协议条款',
    status: 'published',
    targetWordCount: 11000,
    ctaType: cat.slug === 'payg' ? 'pricing' : cat.slug === 'reconcile' ? 'compare' : 'recommend',
    publishedAt: '2026-10-26T00:00:00+08:00',
    modifiedAt: '2026-10-26T00:00:00+08:00',
    sourceCheckedAt: '2026-10-26T00:00:00+08:00',
  };
  nodes.push(catNode);
  edges.push({
    fromId: 'home',
    toId: catNode.id,
    relation: 'parent-child',
    reason: '首页索引全站一级分类',
  });

  // 3. 26 个二级专题
  const subcats = SUBCATEGORIES_DEF[cat.slug] || [];
  for (const sub of subcats) {
    const subNode: ContentNode = {
      id: `sub:${cat.slug}:${sub.slug}`,
      type: 'subcategory',
      title: `${sub.title} - ${cat.title}子专题`,
      url: `/${cat.slug}/${sub.slug}/`,
      parentId: catNode.id,
      category: cat.slug,
      subcategory: sub.slug,
      intent: `聚焦${sub.title}的操作方法、数据表与边界验证`,
      primaryKeyword: sub.title,
      evidenceRequirement: '实测数据对照与脱敏日志',
      status: 'published',
      targetWordCount: 10500,
      ctaType: 'recommend',
      publishedAt: '2026-10-26T00:00:00+08:00',
      modifiedAt: '2026-10-26T00:00:00+08:00',
      sourceCheckedAt: '2026-10-26T00:00:00+08:00',
    };
    nodes.push(subNode);
    edges.push({
      fromId: catNode.id,
      toId: subNode.id,
      relation: 'parent-child',
      reason: '一级专题拆分为二级纵深',
    });

    // 4. 104 个三级集群
    for (const cl of sub.clusters) {
      const clusterNode: ContentNode = {
        id: `cluster:${cat.slug}:${sub.slug}:${cl.slug}`,
        type: 'cluster',
        title: `${cl.title} - 集群综述与对照`,
        url: `/${cat.slug}/${sub.slug}/${cl.slug}/`,
        parentId: subNode.id,
        category: cat.slug,
        subcategory: sub.slug,
        cluster: cl.slug,
        intent: `${cl.title}的集群聚合、决策流程与下级四篇文章索引`,
        primaryKeyword: cl.title,
        evidenceRequirement: '技术参数对照与情景推导',
        status: 'published',
        targetWordCount: 10200,
        ctaType: 'compare',
        publishedAt: '2026-10-26T00:00:00+08:00',
        modifiedAt: '2026-10-26T00:00:00+08:00',
        sourceCheckedAt: '2026-10-26T00:00:00+08:00',
      };
      nodes.push(clusterNode);
      edges.push({
        fromId: subNode.id,
        toId: clusterNode.id,
        relation: 'parent-child',
        reason: '二级专题拆分为三级集群',
      });
    }
  }
}

// 5. 416 篇独立文章
for (const art of ARTICLES_DATA) {
  const clusterParentId = `cluster:${art.category}:${art.subcategory}:${art.cluster}`;
  const artNode: ContentNode = {
    id: art.id,
    type: 'article',
    title: art.title,
    url: art.url,
    parentId: clusterParentId,
    category: art.category,
    subcategory: art.subcategory,
    cluster: art.cluster,
    intent: `解答问题：“${art.title}”的完整推导、证据与操作指南`,
    primaryKeyword: art.title.replace(/[？：，]/g, ' ').split(' ')[0],
    evidenceRequirement: '单项测试数据、协议报文层级说明与脱敏快照',
    status: 'published',
    targetWordCount: 10000,
    ctaType: art.category === 'payg' ? 'pricing' : art.category === 'reconcile' ? 'compare' : 'recommend',
    publishedAt: '2026-10-26T00:00:00+08:00',
    modifiedAt: '2026-10-26T00:00:00+08:00',
    sourceCheckedAt: '2026-10-26T00:00:00+08:00',
  };
  nodes.push(artNode);
  edges.push({
    fromId: clusterParentId,
    toId: artNode.id,
    relation: 'parent-child',
    reason: '集群归属单篇文章',
  });
}

// 写入 CONTENT_REGISTRY.json
const registryPath = path.join(DATA_DIR, 'CONTENT_REGISTRY.json');
fs.writeFileSync(registryPath, JSON.stringify(nodes, null, 2), 'utf-8');

// 写入 CONTENT_GRAPH.json
const graphPath = path.join(DATA_DIR, 'CONTENT_GRAPH.json');
fs.writeFileSync(graphPath, JSON.stringify(edges, null, 2), 'utf-8');

// 生成 KEYWORD_OWNERSHIP.md
let keywordMd = `# 关键词与页面权属归属登记 (KEYWORD_OWNERSHIP.md)\n\n`;
keywordMd += `本文件登记全站 560 个规划节点的主关键词、核心意图、规范 URL 与权属边界，严格防止站内竞争与语义重复。\n\n`;
keywordMd += `| 节点ID | 类型 | 规范 URL | 主关键词 | 独立意图与边界 |\n`;
keywordMd += `|---|---|---|---|---|\n`;

for (const n of nodes) {
  keywordMd += `| \`${n.id}\` | ${n.type} | \`${n.url}\` | ${n.primaryKeyword} | ${n.intent.replace(/\|/g, '/')} |\n`;
}

const keywordPath = path.resolve(process.cwd(), 'KEYWORD_OWNERSHIP.md');
fs.writeFileSync(keywordPath, keywordMd, 'utf-8');

console.log(`[PASS] 成功生成 CONTENT_REGISTRY.json (总节点数: ${nodes.length})`);
console.log(`[PASS] 成功生成 CONTENT_GRAPH.json (总关系数: ${edges.length})`);
console.log(`[PASS] 成功生成 KEYWORD_OWNERSHIP.md`);
