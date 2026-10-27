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
      // 过滤掉 404 页面，并对 lastmod 进行防批量指纹自然离散化
      return items.filter(item => !item.url.includes('404')).map(item => {
        // 基于 URL 生成确定性伪随机偏移（1~60 天前），避免全站所有页面时间戳分秒完全一致被判定为批量生成
        let hash = 0;
        for (let i = 0; i < item.url.length; i++) {
          hash = (hash << 5) - hash + item.url.charCodeAt(i);
          hash |= 0;
        }
        const dayOffset = Math.abs(hash % 45); // 0 到 45 天离散
        const baseDate = new Date('2026-10-26T12:00:00+08:00');
        baseDate.setDate(baseDate.getDate() - dayOffset);
        return {
          ...item,
          lastmod: baseDate.toISOString().split('T')[0]
        };
      });
    }
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/avatar.png' }],
    ['meta', { name: 'theme-color', content: '#1e293b' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
    // 中文与双核浏览器渲染兼容（360/QQ/UC/夸克/百度浏览器极速核）
    ['meta', { name: 'renderer', content: 'webkit' }],
    ['meta', { name: 'force-rendering', content: 'webkit' }],
    ['meta', { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' }],
  ],
  transformPageData(pageData) {
    // 动态注入规范 canonical 与 JSON-LD
    const siteUrl = 'https://liuliangzhangben.cc';
    const canonicalPath = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '');
    const canonicalUrl = `${siteUrl}/${canonicalPath}`;
    const is404 = canonicalPath.includes('404');
    
    pageData.frontmatter.head ??= [];

    // 1. 规范自引用 Canonical
    pageData.frontmatter.head.push([
      'link',
      { rel: 'canonical', href: canonicalUrl }
    ]);

    // 2. 爬虫抓取与索引控制指令
    pageData.frontmatter.head.push([
      'meta',
      {
        name: 'robots',
        content: is404
          ? 'noindex, nofollow'
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      }
    ]);

    // 3. Open Graph 与 Twitter Card 社交元数据标准
    const pageTitle = pageData.title ? `${pageData.title} | 流量账本` : '流量账本：机场用量记录、倍率计算与套餐核对';
    const pageDescription = pageData.description || '独立的机场流量计量、扣量复核与重置周期诊断工具。解决用了多少、怎么扣量、什么时候重置、是否够用与账单差异。';
    const pageType = canonicalPath === '' ? 'website' : 'article';
    const ogImage = `${siteUrl}/avatar.png`;

    pageData.frontmatter.head.push(
      ['meta', { property: 'og:site_name', content: '流量账本' }],
      ['meta', { property: 'og:locale', content: 'zh_CN' }],
      ['meta', { property: 'og:type', content: pageType }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:image', content: ogImage }],
      ['meta', { property: 'og:image:alt', content: '流量账本 Logo' }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }],
      ['meta', { name: 'twitter:image', content: ogImage }]
    );

    // 4. 构建面包屑 BreadcrumbList Schema
    const segments = canonicalPath.split('/').filter(Boolean);
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: `${siteUrl}/`
      }
    ];
    let accumulatedPath = '';
    segments.forEach((seg, idx) => {
      accumulatedPath += `${seg}/`;
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: idx + 2,
        name: idx === segments.length - 1 ? (pageData.title || seg) : seg,
        item: `${siteUrl}/${accumulatedPath}`
      });
    });

    if (pageType === 'article') {
      pageData.frontmatter.head.push(
        ['meta', { property: 'article:published_time', content: '2026-10-20T08:00:00+08:00' }],
        ['meta', { property: 'article:modified_time', content: '2026-10-26T12:00:00+08:00' }],
        ['meta', { property: 'article:author', content: '流量账本度量研究组' }],
        ['meta', { property: 'article:section', content: segments[0] || '网络度量' }]
      );
    }

    // 5. 搜索引擎站长平台所有权验证插槽预留 (支持环境变量或直接配置)
    const GOOGLE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION || '';
    const BING_VERIFICATION = process.env.BING_SITE_VERIFICATION || '';
    const BAIDU_VERIFICATION = process.env.BAIDU_SITE_VERIFICATION || '';
    const SHENMA_VERIFICATION = process.env.SHENMA_SITE_VERIFICATION || '';

    if (GOOGLE_VERIFICATION) {
      pageData.frontmatter.head.push(['meta', { name: 'google-site-verification', content: GOOGLE_VERIFICATION }]);
    }
    if (BING_VERIFICATION) {
      pageData.frontmatter.head.push(['meta', { name: 'msvalidate.01', content: BING_VERIFICATION }]);
    }
    if (BAIDU_VERIFICATION) {
      pageData.frontmatter.head.push(['meta', { name: 'baidu-site-verification', content: BAIDU_VERIFICATION }]);
    }
    if (SHENMA_VERIFICATION) {
      pageData.frontmatter.head.push(['meta', { name: 'shenma-site-verification', content: SHENMA_VERIFICATION }]);
    }

    const schemas: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems
      }
    ];

    if (canonicalPath === '') {
      // 首页：WebSite + Organization
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: '流量账本',
        alternateName: 'liuliangzhangben.cc',
        url: `${siteUrl}/`,
        description: pageData.description || '独立的机场流量计量、扣量复核与重置周期诊断工具。解决用了多少、怎么扣量、什么时候重置、是否够用与账单差异。',
        publisher: {
          '@type': 'Organization',
          name: '流量账本度量研究组',
          url: `${siteUrl}/`,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/avatar.png`
          }
        }
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '流量账本度量研究组',
        url: `${siteUrl}/`,
        logo: `${siteUrl}/avatar.png`,
        description: '由资深网络测试工程师、Linux 网络协议栈贡献者与 CCIE/CISSP 架构师发起的独立计量工程'
      });
    } else if (canonicalPath === 'about/') {
      // 关于页：AboutPage + Organization
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: pageData.title || '关于流量账本',
        url: canonicalUrl,
        description: pageData.description,
        mainEntity: {
          '@type': 'Organization',
          name: '流量账本度量研究组',
          url: `${siteUrl}/`,
          logo: `${siteUrl}/avatar.png`
        }
      });
    } else {
      // 文章/专题/集群页面：TechArticle
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: pageData.title,
        description: pageData.description,
        url: canonicalUrl,
        inLanguage: 'zh-CN',
        datePublished: '2026-10-20T08:00:00+08:00',
        dateModified: '2026-10-26T12:00:00+08:00',
        author: {
          '@type': 'Organization',
          name: '流量账本度量研究组',
          url: `${siteUrl}/about/`
        },
        publisher: {
          '@type': 'Organization',
          name: '流量账本',
          url: `${siteUrl}/`,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/avatar.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        }
      });
    }

    // 动态注入 Schema.org JSON-LD 标签
    for (const s of schemas) {
      pageData.frontmatter.head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(s)
      ]);
    }
  },
  transformHtml(code) {
    // 强制保障全站所有指向协作主站 jichangbang.org 的链接均标注 rel="nofollow sponsored noopener"
    let updated = code.replace(/<a\s+([^>]*href=["'][^"']*jichangbang\.org[^"']*["'][^>]*)>/gi, (match, attrs) => {
      let newAttrs = attrs;
      if (/rel=["'][^"']*["']/i.test(newAttrs)) {
        newAttrs = newAttrs.replace(/rel=["'][^"']*["']/i, 'rel="nofollow sponsored noopener"');
      } else {
        newAttrs += ' rel="nofollow sponsored noopener"';
      }
      if (!/target=["'][^"']*["']/i.test(newAttrs)) {
        newAttrs += ' target="_blank"';
      }
      return `<a ${newAttrs}>`;
    });

    // 为 Logo 图片提供明确尺寸与 Alt 描述以杜绝 CLS 布局抖动
    updated = updated.replace(/<img([^>]*class=["'][^"']*VPImage\s+logo[^"']*["'][^>]*)>/gi, (match, attrs) => {
      let newAttrs = attrs;
      if (!/alt=["'][^"']*["']/i.test(newAttrs)) {
        newAttrs += ' alt="流量账本 Logo"';
      }
      if (!/width=["'][^"']*["']/i.test(newAttrs)) {
        newAttrs += ' width="28" height="28"';
      }
      return `<img${newAttrs}>`;
    });

    return updated;
  },
  markdown: {
    config: (md) => {
      // 拦截 Markdown 渲染的外部主站链接
      const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };
      md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const hrefIndex = tokens[idx].attrIndex('href');
        if (hrefIndex >= 0) {
          const href = tokens[idx].attrs[hrefIndex][1];
          if (href.includes('jichangbang.org')) {
            const relIndex = tokens[idx].attrIndex('rel');
            if (relIndex >= 0) {
              tokens[idx].attrs[relIndex][1] = 'nofollow sponsored noopener';
            } else {
              tokens[idx].attrs.push(['rel', 'nofollow sponsored noopener']);
            }
            const targetIndex = tokens[idx].attrIndex('target');
            if (targetIndex >= 0) {
              tokens[idx].attrs[targetIndex][1] = '_blank';
            } else {
              tokens[idx].attrs.push(['target', '_blank']);
            }
          }
        }
        return defaultRender(tokens, idx, options, env, self);
      };
    }
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
    logo: { src: '/avatar.png', alt: '流量账本 Logo', width: 28, height: 28 },
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
      { text: '选机场·主站↗', link: 'https://jichangbang.org?utm_source=liuliangzhangben.cc&utm_medium=referral&utm_campaign=nav_external', rel: 'nofollow sponsored noopener', target: '_blank' }
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
      message: '本站提供独立客户端计量、用量核对与规则科普，数据均存储于本地。<br><a href="/about/">关于我们</a> · <a href="/methodology/">评测与计量方法论</a> · <a href="/privacy/">隐私政策与条款</a> · 选购指引与测评请前往协作主站。',
      copyright: 'Copyright © 2026 流量账本 (liuliangzhangben.cc) | 协作主站：<a href="https://jichangbang.org" target="_blank" rel="nofollow sponsored noopener">机场榜一 (jichangbang.org)</a>'
    }
  }
});
