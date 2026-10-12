# Firefox 附加组件验证

请在安装了 Node.js 和 npm 的环境中运行：

```sh
npx --yes web-ext lint --source-dir . --self-hosted
```

当前 Fucking Blur 源代码包的预期结果是：`errors 0`、`notices 0`、`warnings 0`。

还应运行以下本地检查：

```sh
python3 -m json.tool manifest.json
node --check content.js
node --check page-hook.js
```

本项目不包含远程 URL、类似 eval 的代码、第三方库、后台脚本或 API 权限。提交到 AMO 时，应使用未压缩的源代码 ZIP，并如实填写不收集数据的声明。
