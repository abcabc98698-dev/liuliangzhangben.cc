/**
 * 数据安全、CSV防注入与 UTM 链接白名单模块
 * 遵循项目红线：严禁泄露用量明细，CSV 严格转义公式前缀
 */

export const ALLOWED_UTM_CAMPAIGNS = [
  'usage_selection',
  'quota_rules',
  'payg_fit',
  'reconcile_handoff',
  'general_reference',
] as const;

export type UtmCampaign = typeof ALLOWED_UTM_CAMPAIGNS[number];

/**
 * CSV 单元格防公式注入转义
 * 防御 Excel/Calc 将 = + - @ \t \r 解析为可执行公式
 */
export function sanitizeCsvCell(value: string | number | bigint | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value).trim();

  // 检查危险公式前缀
  const formulaChars = ['=', '+', '-', '@', '\t', '\r'];
  if (formulaChars.some(char => str.startsWith(char))) {
    // 加单引号前缀使电子表格将其视为纯文本
    str = `'${str}`;
  }

  // 双引号转义并包裹
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * 校验并构造指向唯一主站 jichangbang.org 的中性转介链接
 * 严格限制参数，禁止携带任何私密用量数据
 */
export function buildSafeMainSiteUrl(
  path: string,
  campaign: UtmCampaign,
  contentSlug: string
): string {
  const allowedOrigin = 'https://jichangbang.org';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // 规范化路径白名单校验
  const validPrefixes = ['/pricing/', '/compare/', '/recommend/', '/ai-streaming/', '/reviews/'];
  const isValidPath = validPrefixes.some(prefix => cleanPath.startsWith(prefix)) || cleanPath === '/';

  if (!isValidPath) {
    throw new Error(`非授权的主站承接路径: ${cleanPath}`);
  }

  const url = new URL(cleanPath, allowedOrigin);
  url.searchParams.set('utm_source', 'liuliangzhangben.cc');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', campaign);
  url.searchParams.set('utm_content', `${contentSlug}_btn`);

  return url.toString();
}

/**
 * 防御原型污染检查
 */
export function isSafeObjectKey(key: string): boolean {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}
