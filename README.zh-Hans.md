# Motion Prompt

[English](README.md) | [日本語](README.ja.md) | **简体中文**

与 AI 沟通的创意术语库，包含 120 个效果，每个都有动态示例、中文说明、提问示例、效果规格和 Canvas 2D 参考代码。

打开[简体中文示例库](https://motion-prompt.knothhe.com/?lang=zh-Hans)，按名称、编号或标签搜索，选择需要的效果，再复制提示词或发送给 AI。页面支持简体中文、英语和日语，会记住语言选择。

| 编号 | 素材包 | 中文列表 |
|---|---|---|
| 001–024 | 动态图形动作 | [motion](packs/motion/README.zh-Hans.md) |
| 025–048 | 镜头运动与转场 | [camera](packs/camera/README.zh-Hans.md) |
| 049–072 | UI 组件 | [ui](packs/ui/README.zh-Hans.md) |
| 073–096 | 落地页与网页动效 | [lp](packs/lp/README.zh-Hans.md) |
| 097–120 | 摄影风格与光线 | [photo](packs/photo/README.zh-Hans.md) |

## 使用 skill

```sh
npx skills add knothhe/motion-prompt
```

安装后告诉 AI：“打开 motion-prompt 素材库”。选择效果并点击“发送给 AI”，再说明如何使用。也可直接给出编号，如“使用 #012 和 #045”。

skill 的命令支持 `--lang zh-Hans`，中文搜索会自动选择简体中文：

```sh
node skills/motion-prompt/scripts/motion-prompt.mjs search 弹性入场
node skills/motion-prompt/scripts/motion-prompt.mjs get 001 --lang zh-Hans
node skills/motion-prompt/scripts/motion-prompt.mjs prompt 120 --lang zh-Hans
node skills/motion-prompt/scripts/motion-prompt.mjs pick --lang zh-Hans
```

静态 API 位于 `https://motion-prompt.knothhe.com/api/v1/`，中文索引为 `zh-Hans/catalog.tsv`，规格代码为 `zh-Hans/e/<id>.txt`，提示词为 `zh-Hans/p/<id>.txt`。

## 构建与部署

```sh
pnpm install
pnpm check
pnpm build
pnpm test
pnpm deploy
```

编辑 `packs/<pack>/meta.json` 中的语言内容，再运行构建。`api/v1/`、`assets/catalog.js` 和素材包列表由构建生成。部署包位于忽略的 `dist/`，只包含公开站点资源。

站点使用 [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)，在 [wrangler.jsonc](wrangler.jsonc) 中配置 Worker 和[自定义域名](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)。发布前需通过 `pnpm exec wrangler login` 登录拥有该域名的 Cloudflare 账户。

## 上游与许可证

本项目基于 [Shohei Ohtaki 的 Motion Prompt](https://github.com/showheyohtaki/motion-prompt)，添加简体中文与独立部署配置。

完整保留上游 [MIT License](LICENSE)、作者版权声明和参考代码署名。第三方案例内容及权利归各自作者所有，详见 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。
