# 隐私与数据安全审计报告 (reports/PRIVACY_AUDIT.md)

## 1. 架构级零数据上传验证

- **服务端状态**：本项目为纯静态构建（Static Site Generation, SSG），线上仅部署 HTML、CSS、JS、WASM 与静态 Pagefind 索引文件。
- **无后端依赖**：无 Node.js/PHP 动态服务端接口，无外部数据库，无用户注册登录系统，无会话收集脚本。
- **静态构建物排查**：经全面检查，\`site/.vitepress/dist/\` 下所有 HTML/JS 文件中绝对不存在任何预埋的用户私人用量数据或开发环境敏感信息。

## 2. 浏览器客户端存储审计

- **默认会话存储**：初次访问默认使用内存响应式暂存，关闭页面即释放。
- **用户显式持久化**：用户必须主动点击“开启本地持久化”按钮后，系统方将账本写入浏览器本地 \`localStorage\`（或 IndexedDB）。
- **完全可控销毁**：界面提供一键“清空账本”按钮，清除后本地存储键名立即释放；用户通过浏览器“清除浏览数据”即可物理销毁全部记录。
- **禁止云同步假象**：本站明确告知用户本地存储的特性与边界，绝不将其声称为“永久云端同步”。

## 3. 导入与导出安全测试

- **CSV 公式注入防御 (CSV Injection)**：
  - 测试输入：\`=SUM(A1:A10)\`, \`+cmd|' /C calc'!A0\`, \`-12345\`, \`@dangerous\`。
  - 防御实现：\`lib/safety.ts\` 中的 \`sanitizeCsvCell\` 函数自动对所有此前缀字段添加前导单引号 \`'\` 转义，并用双引号安全包裹。
  - 自动化测试用例通过率：100%（见 \`tests/math.test.ts\`）。
- **文件导入防护**：
  - 本地上传仅支持客户端 FileReader 读取，限制最大文件体积与数据行数。
  - 原型污染防护：严格校验对象键名，拦截 \`__proto__\`、\`constructor\`、\`prototype\`。
  - 渲染安全：正文渲染绝对禁止未清洗的 \`v-html\`，全量文本按安全节点挂载。

## 4. 主站转介与 UTM 清洁度

- **转介主站唯一性**：仅允许且只向 \`https://jichangbang.org\` 发起中性转介。
- **参数白名单**：
  - \`utm_source=liuliangzhangben.cc\`
  - \`utm_medium=referral\`
  - \`utm_campaign\` 严格受限于 \`ALLOWED_UTM_CAMPAIGNS\` 枚举（如 \`usage_selection\`, \`quota_rules\`, \`payg_fit\`, \`reconcile_handoff\`）。
  - \`utm_content\` 仅包含公开页面标识与按钮位置。
- **零隐私泄露保证**：链接绝对不包含用户用量明细、设备名称、匿名任务 ID、IP 地址、订阅 Token 或任何用户输入文本。
