# 桌面模板

这是一个基于 `Tauri 2 + Vue 3` 的桌面应用模板，适合后续继续开发工具类桌面项目。

当前模板已经具备这些基础能力：

- 系统托盘
- 单实例运行
- 关闭主窗口隐藏到托盘
- 重启应用
- 自定义标题栏
- 窗口最小化 / 最大化 / 关闭
- 原生设置持久化
- 深浅色主题切换
- 中英文切换

## 技术栈

- Vue 3
- Pinia
- Vue Router
- Vue I18n
- Tailwind CSS 4
- Tauri 2

## 启动开发

安装依赖：

```powershell
pnpm install
```

启动前端开发：

```powershell
pnpm dev
```

启动 Tauri 桌面开发：

```powershell
pnpm tauri dev
```

## 构建

前端构建：

```powershell
pnpm build
```

桌面端检查：

```powershell
cargo check
```

说明：

- `cargo check` 需要在 `src-tauri` 目录下执行
- 或者你也可以用 IDE / 终端切到 `src-tauri` 再执行

## 项目结构

```text
src/
  api/                 # 前端桥接层
  components/          # 组件
  components/ui/       # 基础 UI 组件
  composables/         # 组合式逻辑
  hooks/               # UI 服务 hooks
  i18n/                # 国际化
  router/              # 路由
  stores/              # 全局状态
  utils/               # 工具和常量
  views/               # 页面

src-tauri/
  capabilities/        # 权限配置
  src/lib.rs           # Rust 原生入口
  tauri.conf.json      # Tauri 配置
```

## 当前页面

- `首页`
- `组件示例`
- `设置`
- `关于`

这些页面主要用于模板演示，后续项目可以按需替换。

## 模板约定

- 模板级设置走原生持久化，不走 `localStorage`
- 业务状态不要继续堆进 `src/stores/app.js`
- 新的原生命令先写 Rust，再写前端桥接
- 主窗口关闭后默认隐藏到托盘
- 第二次启动应用时，聚焦现有窗口而不是再开一个实例

## 重要文件

- [App.vue](D:/code/辅助工具/usb自动连接工具/tauri-app/src/App.vue)
- [app.js](D:/code/辅助工具/usb自动连接工具/tauri-app/src/stores/app.js)
- [tauri.js](D:/code/辅助工具/usb自动连接工具/tauri-app/src/api/tauri.js)
- [lib.rs](D:/code/辅助工具/usb自动连接工具/tauri-app/src-tauri/src/lib.rs)
- [tauri.conf.json](D:/code/辅助工具/usb自动连接工具/tauri-app/src-tauri/tauri.conf.json)
- [AI_DEVELOPMENT_GUIDE.md](D:/code/辅助工具/usb自动连接工具/tauri-app/AI_DEVELOPMENT_GUIDE.md)

## 给后续开发的建议

如果你要基于这个模板做新项目，建议优先做这几步：

1. 修改项目名、窗口标题、包标识
2. 替换首页和菜单
3. 新建业务 store，而不是污染模板 store
4. 新增业务原生命令时，统一从 `src/api/tauri.js` 进入

## 给 AI 的说明

如果后续要让 AI 接手开发，请先读：

- [AI_DEVELOPMENT_GUIDE.md](D:/code/辅助工具/usb自动连接工具/tauri-app/AI_DEVELOPMENT_GUIDE.md)
- [AI_TASK_TEMPLATE.md](D:/code/辅助工具/usb自动连接工具/tauri-app/AI_TASK_TEMPLATE.md)
