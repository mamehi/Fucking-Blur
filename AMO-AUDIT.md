# AMO 提交前严格审计结果

审计对象是 `Fucking Blur` Firefox WebExtension 1.6.0。

## 结果

本地 `web-ext lint --self-hosted` 应显示 errors 0、notices 0、warnings 0。同时执行 manifest JSON 检查、JavaScript 语法检查和 ZIP 完整性检查。

## 安全加固

页面上下文钩子只处理复制保护事件以及非编辑区域中 Ctrl/Cmd+C、X、V 的取消操作。已移除 CSSOM、`setAttribute`、`returnValue`、键盘监听器、定时器、storage、fetch、XHR 等全局 API 的修改。CSS 和 DOM 修改在隔离的 content script 中执行。

扩展不使用远程代码、网络请求、分析代码、Cookie、存储、后台脚本或 API 权限。`data_collection_permissions.required` 为 `none`。Firefox Desktop 最低版本为 140，Android 最低版本为 142。

## 仍需注意的人工审查风险

自动 lint 通过不等于 Mozilla 人工审查一定通过。扩展会对普通网页应用 CSS 和 DOM 修改，并绕过部分页面事件取消操作。因此提交说明和 Reviewer Notes 必须如实说明功能范围以及使用 `MAIN` world 的原因，也必须说明会删除 `title="서드 파티 광고 콘텐츠"` 元素本身及其后代。

## 官方依据

- [Mozilla：提交附加组件](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/)
- [Mozilla：附加组件政策](https://extensionworkshop.com/documentation/publish/add-on-policies/)
- [Mozilla：Firefox 内置数据收集同意机制](https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/)
- [Mozilla：构建安全的扩展](https://extensionworkshop.com/documentation/develop/build-a-secure-extension/)
- [MDN：`browser_specific_settings`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings)
- [MDN：`content_scripts` 与执行环境](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/content_scripts)
