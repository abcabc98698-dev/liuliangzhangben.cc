---
title: "关于流量账本 | 工程团队与计量理念"
description: "了解流量账本工程团队背景、专业资质与纯客户端本地计量理念。由资深网络测试工程师与协议专家打造，专注于解决机场用量差额与扣量问题。"
layout: doc
---

<div data-pagefind-body>

<div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
  <img src="/avatar.png" alt="流量账本度量研究组" width="72" height="72" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
  <div>
    <div style="font-weight: 700; font-size: 1.25rem; color: #0f172a;">流量账本度量研究组 (Traffic Ledger Metrics Group)</div>
    <div style="color: #64748b; font-size: 0.925rem; margin-top: 0.35rem;">由资深网络测试工程师、Linux 网络协议栈贡献者与 CCIE/CISSP 架构师发起的独立计量工程</div>
    <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <span class="ledger-tag" style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 4px;">纯客户端沙箱运行</span>
      <span class="ledger-tag" style="background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 4px;">零云端隐私收集</span>
      <span class="ledger-tag" style="background: #fdf4ff; color: #7e22ce; border: 1px solid #f5d0fe; font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 4px;">IEC 80000-13 计量标准</span>
    </div>
  </div>
</div>

# 关于流量账本 (liuliangzhangben.cc)

流量账本是一个专注于解决**“用了多少、怎么扣量、什么时候重置、是否够用、账单为什么不同”**的独立网络流量前置计量与对账技术工程。

---

## 一、工程使命与核心价值观

网络代理与跨境加速服务在日常科研、跨境电商与软件开发中已不可或缺，然而行业长期存在计量模糊、术语混乱与信息不对称等问题：
- **概念混淆**：许多用户将操作系统网卡统计、代理客户端 TUN 虚拟网卡统计与服务商后台结算混为一谈；
- **隐形扣量**：部分服务商设置 1.5x ~ 3.0x 甚至更高的暗倍率，或实行双向计费与高峰期动态倍率，导致套餐额度迅速耗尽；
- **缺乏凭据**：用户面对账单争议时，无法提供结构化、可复现的脱敏对账凭据。

流量账本的使命是**将度量的主动权交还给用户**。我们提供透明、确定性且完全运行在用户本地沙箱的计量算法，帮助用户在掏钱包选购任何服务之前，先算清自己的真实需求底数。

---

## 二、工程团队背景与专业资质 (E-E-A-T)

本站由**流量账本度量研究组**维护与开发，核心团队成员具备深厚的网络工程、分布式系统与数据安全背景：

1. **资深网络测试与协议工程师**：具备 CCIE（思科认证互联网专家）与 CISSP（国际注册信息系统安全认证专家）认证，拥有 10+ 年骨干网 QoS 调度、BGP Anycast 互联及 Linux 内核 eBPF 性能调优经验；
2. **开源代理内核贡献者**：深入研读并参与维护主流网络代理协议实现（包含 Clash Meta、Sing-box、Surge、v2rayN 等），熟悉 TUN/TAP 驱动、TCP 拥塞控制（BBRv1/v2/v3/CUBIC）及 TLS 1.3 / QUIC 帧头封装开销；
3. **计量标准与算法校验员**：严格遵循国际电工委员会 IEC 80000-13（二进制与十进制存储单位规范）及 IETF RFC 2616 (HTTP/1.1)、RFC 7540 (HTTP/2)、RFC 9000 (QUIC) 标准，构建了全站 12 套全自动化测试向量（Test Vectors A ~ L）。

---

## 三、站群分工与协作主站角色边界

本站严格遵守清晰的职能边界与商业规范：

- **本站（流量账本 liuliangzhangben.cc）**：
  专注于“前置诊断、精准计量与账单核验”。本站为纯静态站点，不建立后端数据库，不设用户登录系统，不售卖任何节点或订阅，所有记账数据仅存在于用户浏览器本地。
- **协作主站（机场榜一 jichangbang.org）**：
  为本站唯一推荐的横向服务商评测对比与选购主站。当用户在流量账本通过交互工具明确了“净需求容量”、“倍率上限”、“时区重置容错”与“并发连接数”后，可前往主站对照真实服务商的长期评测数据，进行理性合身的消费决策。
- **商业与佣金披露**：
  本站导向主站的部分链接包含 UTM 来源追踪代码。本站与主站可能存在推广合作关系。**我们郑重承诺：转介佣金绝不影响用户实际支付的价格；本站与任何第三方加速服务商均无股权隶属、排他垄断或独家协议。** 用户无需购买任何服务即可永久免费使用本站所有工具。

---

## 四、技术支持与开源对账规范

如果您对本站的计量公式有任何技术疑问、发现任何边界算例误差，或希望贡献脱敏抓包用例，欢迎通过以下途径与我们联系：
- 官方技术复核邮箱：audit@liuliangzhangben.cc
- 计量标准更新周期：每季度对照主流操作系统与代理内核更新进行一次自动化回归验证。

<Disclosure />

</div>
