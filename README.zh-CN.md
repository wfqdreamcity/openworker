# OpenWorker

**[openworker.com](https://openworker.com)** · [下载](#下载) · [Issues](https://github.com/andrewyng/openworker/issues) · [English](./README.md)

<a href="https://trendshift.io/repositories/91434?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-91434" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/91434/daily?language=Python" alt="andrewyng%2Fopenworker | Trendshift" width="250" height="55"/></a>

> **Beta** — OpenWorker 正处于公开测试阶段：已经可以日常使用，会自动更新，我们也在持续打磨体验。[Issues](https://github.com/andrewyng/openworker/issues) 欢迎反馈。

**真正能把日常工作做完的 AI。** OpenWorker 是开源桌面 AI 同事：交付**成品**，而不只是聊天——打磨好的文档、带数据的 Slack 回复、更新后的日历、整理过的收件箱。

它跑在你自己的电脑上，不绑定任何模型：可用 OpenAI、Anthropic、Google 或开源权重服务商的 API Key，也可通过 Ollama 完全本地运行。数据只会通过**你选择**的模型与集成离开本机。

**支持中文**：可用中文下达任务、进行对话与审批；模型会按你的语言回复并产出中文文档、邮件与消息等内容。

[![OpenWorker 工作方式](docs/assets/how-it-works.png)](https://openworker.com)

## 下载

[**⬇ macOS（Apple Silicon）**](https://download.openworker.com/mac)
<sub>macOS 12+ · 已签名与公证 · 自动更新</sub>

[**⬇ Windows 10/11（x64）**](https://download.openworker.com/windows)
<sub>构建尚未代码签名，SmartScreen 可能提示；签名进行中</sub>

打开应用，填入模型密钥（或指向 Ollama），然后直接交代一件真实要做的事。

## 工作方式

1. 告诉 OpenWorker 你要的结果——例如「准备客户简报」「理清我的日历」「起草一份报告」「对照 Jira 和 GitHub 看看发版进度」。
2. 它会把任务拆成步骤，并在桌面、本地文件与已连接的应用之间协作完成。
3. 在真正有影响的操作之前——发消息、改日历、执行命令——会先征求你的同意，你可以批准或改道。
4. 你拿到的是成品，而不是一张待办清单。

底层结构：

```text
┌────────────────────────────────────────────────┐
│              OpenWorker 桌面应用               │  原生壳 + GUI
├────────────────────────────────────────────────┤
│           本地 Agent 服务（Python）            │  引擎 · 工具 · 连接器 — 基于 aisuite
├───────────────┬────────────────┬───────────────┤
│  你的文件     │   你的工具     │  你的模型     │  一切用你的密钥，
│  与终端       │ 25+ 连接器     │ 任意服务商    │  跑在你的机器上
└───────────────┴────────────────┴───────────────┘
```

## 能做什么

- **产出真实交付物** — 文档、表格、报告、网页会落到可打开、可分享的文件。
- **从 Slack 发起工作** — 在频道里 `@OpenWorker`；桌面会打开会话，用你的工具完成工作，结果以线程回复发回。
- **使用日常工具** — 25+ 集成，包括 GitHub、Slack、Jira、Notion、Linear、HubSpot、Outlook、monday.com、Gmail、Google Calendar，以及**终端与本地文件**。任何可通过 [MCP](https://modelcontextprotocol.io/) 访问的工具也可接入，并支持按工具细粒度控制。
- **按计划自动跑** — 自动化处理周期性工作：晨报、周报、盯着某个频道。运行记录会进入应用，并带完整 transcript。
- **行动前先问你** — 写入、发送、Shell 命令都需审批。无人值守任务会把请求放进 Inbox，而不是自行执行。

## 自带模型（BYOM）

模型访问权归你：选服务商、粘贴密钥、随时切换。开箱支持：

**OpenAI · Anthropic · Google Gemini · Inkling (Thinking Machines) · GLM（智谱 Z.ai）· DeepSeek · Kimi（月之暗面）· Qwen · MiniMax · Mistral · Grok（xAI）** — 另可通过 **Together**、**Fireworks** 使用开源权重模型，或通过 **Ollama** 完全本地运行。

精选模型列表会标注我们已验证适合工具调用的型号。手动填写任意模型字符串也可，风险自负。

## 隐私

OpenWorker 是本地优先：Agent 循环、对话、连接器令牌、模型密钥都在本机，存放在应用本地密钥库。唯一的云端组件是一个小型服务，用于为连接器中转 OAuth 握手。你可以不登录就使用应用——通过手动创建的凭证 / API Key 使用连接器。

## 从源码运行

前置条件：Python 3.10+、Node 20+，以及（桌面壳）通过 [rustup](https://rustup.rs/) 安装的 Rust 工具链。

```shell
git clone https://github.com/andrewyng/openworker
cd openworker

# 1. 一次性初始化 — 在 .venv 创建 Python 虚拟环境
#    （Windows 请在 Git Bash 或 WSL 中运行）
bash packaging/setup_dev_env.sh

# 2. 启动本地 Agent 服务
.venv/bin/openworker-server --cwd ~/some/project --port 8765
#    （Windows: .venv\Scripts\openworker-server.exe）

# 3. 另开一个终端，启动 UI
cd surfaces/gui
npm install
npm run dev        # 浏览器 UI，走 Vite 开发端口
```

独立启动的服务会在 `<state-dir>/sidecar-8765.token` 写入本次启动令牌；Vite 启动时读取该仅当前用户可读的文件。直接调用 API 时，请在 `X-OpenWorker-Token` 请求头中带上该值。桌面应用使用内存中的启动令牌，不会写到磁盘。

若要跑完整桌面应用而非浏览器 UI，将第 3 步换成在 `surfaces/gui/` 下执行 `npm run tauri dev`——Tauri 壳会打开窗口并自行拉起、监管服务进程。

测试：`.venv/bin/pytest`（服务端），在 `surfaces/gui` 中执行 `npm test` 与 `npm run e2e`（GUI 单元测试 + 封闭端到端）。桌面安装包由 `packaging/build_dmg.sh` / `packaging/build_windows.ps1` 构建。

## 仓库结构

| 目录 | 内容 |
|---|---|
| `coworker/` | Python 后端 — Agent 引擎、模型 Provider、连接器、MCP 客户端、记忆、自动化 |
| `surfaces/gui/` | 桌面应用 — React UI + 监管服务进程的 Tauri 壳 |
| `stt/` | 语音转写 sidecar（Rust），用于语音输入 |
| `packaging/` | 安装包构建（macOS DMG、Windows）、自动更新清单、开发环境初始化 |
| `docs/` | 设计说明与决策记录 |
| `tests/` | 后端测试套件 |

## 基于 aisuite

OpenWorker 的引擎构建在 [**aisuite**](https://github.com/andrewyng/aisuite) 之上——一个轻量 Python 库，提供跨 LLM 服务商的统一 chat-completions API，以及带工具、工具包与 MCP 支持的 Agent 层。若你想自建 Agent 运行时而不是使用本应用，可以从那里开始；本仓库也是 aisuite 能力的可运行参考实现。

OpenWorker 最初在 aisuite 仓库内开发，之后独立到本仓库；感谢 aisuite 贡献者奠定的基础。

## 贡献

欢迎贡献与缺陷报告——请提交 [issue](https://github.com/andrewyng/openworker/issues) 或 pull request。应用会自动更新，修复能较快到达用户。
提交 PR 时，请附上「之前坏了什么、现在如何修好」的截图。我们很快会开放更多可贡献的功能方向。
请注意：我们正按内部优先级与目标积极开发，因此可能不会合并已在开发中的功能，或偏离产品愿景的 PR。

## 许可证

MIT — 见 [LICENSE](LICENSE)。
