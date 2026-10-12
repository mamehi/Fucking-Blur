# Fucking Blur

Fucking Blur 是一个 Firefox WebExtension，用于移除普通网页中的 CSS、HTML 和 JavaScript 干扰限制，同时不触碰 DRM 和受保护媒体。

## 安全设计

扩展不会发起网络请求，不加载远程代码，不保存数据，不使用 Cookie 或分析工具，也不请求 WebExtension API 权限。清单中的 `data_collection_permissions.required` 明确声明为 `none`。

页面上下文中只保留一个范围很小的钩子：`Event.prototype.preventDefault`。它只在非编辑区域中忽略常见复制保护事件以及 Ctrl/Cmd+C、X、V 的取消操作。它不会修改 CSSOM、`setAttribute`、`returnValue`、键盘监听器、定时器、存储、fetch、XHR 或其他页面 API。CSS 和 DOM 修改在隔离的扩展脚本环境中执行。

## 功能

扩展会将 CSS `filter` 和 `backdrop-filter` 强制设为 `none`，恢复 `user-select: text`，绕过网页用 JavaScript 取消右键、选择、拖拽、复制、剪切和粘贴的常见方式。当元素的 `title` 属性完全等于 `서드 파티 광고 콘텐츠` 时，会从 DOM 中删除该元素及其全部后代。动态插入或修改的元素也会被处理。

输入框、文本区域、选择框和 `contenteditable` 编辑区域不会启用复制保护绕过，以免破坏代码文档和网页编辑器。即使页面根元素意外带有目标标题，扩展也不会删除 `html` 或 `body`。

## 明确不会绕过的内容

本扩展不会尝试绕过 DRM、加密媒体、访问控制、登录权限、Firefox 内部页面，也不会恢复已经烘焙到图片、视频、Canvas 或 WebGL 像素中的模糊效果。它只处理客户端 CSS 和普通 JavaScript 事件限制。

## AMO 签名后的 macOS 安装

macOS 不需要单独的 Apple 开发者证书来安装 Mozilla 签名的扩展。将 ZIP 上传到 AMO Developer Hub，选择 **On your own** 进行自分发，等待 Mozilla 签名后下载 `.xpi`。在 Firefox 中打开 `about:addons`，点击齿轮菜单，选择 **Install Add-on From File…**，然后选择已签名的 `.xpi` 文件。

不要修改已签名的 `.xpi`。任何修改都会使签名失效；修改后必须上传新版本并重新签名。如果 Firefox 提示扩展未签名，请使用已签名的 `.xpi`，不要直接使用开发 ZIP。
