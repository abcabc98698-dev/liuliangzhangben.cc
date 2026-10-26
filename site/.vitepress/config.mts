import { defineConfig } from 'vitepress';
import path from 'node:path';

export default defineConfig({
  title: '流量账本',
  description: '机场用量记录、倍率计算与套餐核对 - 专注于解决用了多少、怎么扣量、什么时候重置与账单差异',
  lang: 'zh-CN',
  base: '/',
  srcDir: './generated',
  outDir: './.vitepress/dist',
  cleanUrls: false, // 保持目录 index.html 规范尾斜杠
  sitemap: {
    hostname: 'https://liuliangzhangben.cc',
    transformItems(items) {
      // 过滤掉 404 页面
      return items.filter(item => !item.url.includes('404'));
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#1e293b' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
  ],
  transformPageData(pageData) {
    // 动态注入规范 canonical 与 JSON-LD
    const siteUrl = 'https://liuliangzhangben.cc';
    const canonicalUrl = `${siteUrl}/${pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '')}`;
    
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push([
      'link',
      { rel: 'canonical', href: canonicalUrl }
    ]);
  },
  vite: {
    publicDir: path.resolve(process.cwd(), 'site', 'public'),
    resolve: {
      alias: {
        '@lib': path.resolve(process.cwd(), 'lib'),
      }
    }
  },
  themeConfig: {
    siteTitle: '流量账本',
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '用量记录', link: '/records/' },
      { text: '流量估算', link: '/estimate/' },
      { text: '倍率规则', link: '/multipliers/' },
      { text: '重置周期', link: '/reset/' },
      { text: '按量方案', link: '/payg/' },
      {
        text: '更多专题',
        items: [
          { text: '大流量专题', link: '/high-data/' },
          { text: '低频使用', link: '/occasional/' },
          { text: '视频用量', link: '/video/' },
          { text: 'AI用量', link: '/ai/' },
          { text: '手机用量', link: '/mobile/' },
          { text: '设备数量', link: '/devices/' },
          { text: '账单核对', link: '/reconcile/' },
          { text: '知识百科', link: '/knowledge/' },
        ]
      },
      { text: '选机场·主站↗', link: 'https://jichangbang.org?utm_source=liuliangzhangben.cc&utm_medium=referral&utm_campaign=nav_external' }
    ],
    sidebar: {
      '/records/': [
        {
          text: '用量记录',
          items: [
            { text: '记录总览与账本入口', link: '/records/' },
            { text: '记录来源与基线', link: '/records/baseline/' },
            { text: '账本管理与复盘', link: '/records/management/' },
          ]
        }
      ],
      '/estimate/': [
        {
          text: '流量估算',
          items: [
            { text: '估算总览与模型入口', link: '/estimate/' },
            { text: '单任务模型与基线', link: '/estimate/models/' },
            { text: '周期预测与结果验证', link: '/estimate/forecast/' },
          ]
        }
      ],
      '/multipliers/': [
        {
          text: '倍率规则',
          items: [
            { text: '倍率总览与扣量器', link: '/multipliers/' },
            { text: '扣量公式与组合', link: '/multipliers/calculation/' },
            { text: '规则核验与使用取舍', link: '/multipliers/verification/' },
          ]
        }
      ],
      '/reset/': [
        {
          text: '重置周期',
          items: [
            { text: '周期总览与时间线', link: '/reset/' },
            { text: '周期边界与时间', link: '/reset/boundaries/' },
            { text: '额度变化与周期结算', link: '/reset/balances/' },
          ]
        }
      ],
      '/payg/': [
        {
          text: '按量方案',
          items: [
            { text: '按量总览与比较器', link: '/payg/' },
            { text: '方案条款与费用口径', link: '/payg/terms/' },
            { text: '用量适配与方案比较', link: '/payg/fit/' },
          ]
        }
      ],
      '/high-data/': [
        {
          text: '大流量专题',
          items: [
            { text: '大流量总览', link: '/high-data/' },
            { text: '高用量来源与任务条件', link: '/high-data/demand/' },
            { text: '额度方案与使用复盘', link: '/high-data/plans/' },
          ]
        }
      ],
      '/occasional/': [
        {
          text: '低频使用',
          items: [
            { text: '低频总览', link: '/occasional/' },
            { text: '间歇使用的需求模式', link: '/occasional/patterns/' },
            { text: '低频维护与购买复盘', link: '/occasional/maintenance/' },
          ]
        }
      ],
      '/video/': [
        {
          text: '视频用量',
          items: [
            { text: '视频总览与速率估算', link: '/video/' },
            { text: '视频传输模型与输入', link: '/video/models/' },
            { text: '设备场景与观看计划', link: '/video/plans/' },
          ]
        }
      ],
      '/ai/': [
        {
          text: 'AI用量',
          items: [
            { text: 'AI用量总览', link: '/ai/' },
            { text: 'AI任务的网络构成', link: '/ai/workloads/' },
            { text: 'AI计量边界与额度计划', link: '/ai/accounting/' },
          ]
        }
      ],
      '/mobile/': [
        {
          text: '手机用量',
          items: [
            { text: '手机用量总览', link: '/mobile/' },
            { text: '手机统计与网络范围', link: '/mobile/counters/' },
            { text: '手机用量管理与复盘', link: '/mobile/management/' },
          ]
        }
      ],
      '/devices/': [
        {
          text: '设备数量',
          items: [
            { text: '多设备总览与去重器', link: '/devices/' },
            { text: '设备身份与合计规则', link: '/devices/aggregation/' },
            { text: '分配、并发与共同使用', link: '/devices/allocation/' },
          ]
        }
      ],
      '/reconcile/': [
        {
          text: '账单核对',
          items: [
            { text: '对账总览与诊断面板', link: '/reconcile/' },
            { text: '对账前提与差异拆解', link: '/reconcile/alignment/' },
            { text: '记录取证与处理闭环', link: '/reconcile/resolution/' },
          ]
        }
      ],
      '/knowledge/': [
        {
          text: '知识百科',
          items: [
            { text: '百科总览与概念索引', link: '/knowledge/' },
            { text: '计量概念与使用规则', link: '/knowledge/measurement/' },
            { text: '网络机制与可信边界', link: '/knowledge/network/' },
          ]
        }
      ],
    },
    footer: {
      message: '本站提供独立客户端计量、用量核对与规则科普，所有账本保存在浏览器本地，不收集个人网络数据。选购真实服务请前往主站。',
      copyright: 'Copyright © 2026 流量账本 (liuliangzhangben.cc) | 协作主站：机场榜一 (jichangbang.org)'
    }
  }
});
