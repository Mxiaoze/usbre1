# AI 开发文档

## 1. 项目定位

本项目不是具体业务软件，而是一个可复用的 `Tauri + Vue 3` 桌面应用模板。

当前模板已经内置这些能力：

- 系统托盘
- 单实例运行
- 关闭主窗口后隐藏到托盘
- 重启应用
- 原生配置持久化
- 自定义标题栏
- 窗口最小化 / 最大化 / 关闭
- 主题切换
- 中英文切换

后续如果基于这个仓库继续做项目，应该把它当成“桌面应用底座”，而不是把业务逻辑继续堆进模板壳子里。

---

## 2. 技术栈

- 前端：`Vue 3`
- 状态管理：`Pinia`
- 路由：`Vue Router`
- 国际化：`Vue I18n`
- 样式：`Tailwind CSS 4`
- 桌面壳：`Tauri 2`
- 原生进程能力：`@tauri-apps/plugin-process`

---

## 3. 目录结构

### 前端目录

```text
src/
  api/                 # 前端到 Tauri 原生命令的桥接层
  assets/              # 样式、图片、静态资源
  components/          # 组件
    ui/                # 基础 UI 组件
  composables/         # 组合式逻辑
  hooks/               # UI 服务类 hooks（toast / confirm）
  i18n/                # 国际化
  router/              # 路由
  stores/              # Pinia 全局状态
  utils/               # 工具函数 / 常量
  views/               # 页面
  App.vue              # 应用总入口壳子
  main.js              # 前端启动入口
```

### 原生目录

```text
src-tauri/
  capabilities/        # Tauri 权限配置
  src/
    lib.rs             # Tauri 原生入口
  tauri.conf.json      # Tauri 主配置
```

---

## 4. 核心文件说明

### 4.1 `src/main.js`

前端启动入口，负责挂载：

- Vue App
- Pinia
- Router
- I18n

这个文件尽量保持干净，不要把业务逻辑塞进来。

### 4.2 `src/App.vue`

应用总壳子，负责：

- 启动加载动画
- 初始化模板设置
- 应用主题
- 应用语言
- 渲染标题栏、左侧菜单、主内容区
- 挂载 UI 服务容器

这个文件属于“模板骨架”，不建议直接写业务逻辑。

### 4.3 `src/stores/app.js`

这是模板级全局状态，不是业务状态。

当前负责：

- 加载设置
- 保存设置
- 重置设置
- 应用主题
- 切换语言
- 控制“启动时是否显示主窗口”
- 重启应用

后续如果新增业务功能：

- 不要优先往 `app.js` 里继续塞
- 应该新建业务 store

### 4.4 `src/api/tauri.js`

这是前端和 Rust 原生命令的统一桥接层。

当前暴露的能力：

- `TauriAPI.settings.load()`
- `TauriAPI.settings.save(settings)`
- `TauriAPI.settings.reset()`
- `TauriAPI.app.relaunch()`

任何新的原生能力，都应该先在这里统一封装，再给页面或 store 调用。

### 4.5 `src-tauri/src/lib.rs`

这是 Tauri 原生入口，当前负责：

- 创建托盘
- 托盘菜单点击行为
- 单实例检测
- 关闭主窗口隐藏到托盘
- 读写本地设置文件
- 根据设置决定启动时是否显示主窗口

这是整个模板最核心的原生壳子文件之一，修改时要谨慎。

---

## 5. 当前页面结构

路由定义在：

- `src/router/index.js`

当前页面有：

- `HomeView.vue`
- `ComponentsView.vue`
- `SettingsView.vue`
- `AboutView.vue`

建议理解为：

- `HomeView.vue`：未来项目首页占位
- `ComponentsView.vue`：组件示例页
- `SettingsView.vue`：模板设置页
- `AboutView.vue`：模板说明页

如果后续接入业务，通常优先替换的是这些页面，而不是模板底层文件。

---

## 6. 设置持久化规则

### 6.1 设置存储位置

当前设置不是存在 `localStorage`，而是由 Rust 原生层写入本地配置文件。

配置文件名：

- `desktop-template-settings.json`

Rust 侧逻辑在：

- `src-tauri/src/lib.rs`

### 6.2 当前设置结构

```json
{
  "app": {
    "theme": "light",
    "language": "zh",
    "showWindowOnStartup": true
  }
}
```

### 6.3 默认值来源

默认值定义在：

- `src/utils/constant.ts`

示例：

```ts
export const DEFAULT_SETTINGS = {
  app: {
    theme: 'light',
    language: 'zh',
    showWindowOnStartup: true,
  },
}
```

中文注释示例：

```ts
export const DEFAULT_SETTINGS = {
  app: {
    theme: 'light', // 默认主题：浅色
    language: 'zh', // 默认语言：中文
    showWindowOnStartup: true, // 默认启动时显示主窗口
  },
}
```

### 6.4 重要约束

- 不要把这类“重启后仍需生效”的设置改回 `localStorage`
- 新增模板级设置时，要同时改：
  - `src/utils/constant.ts`
  - `src/api/tauri.js`
  - `src/stores/app.js`
  - `src-tauri/src/lib.rs`

---

## 7. 托盘与窗口行为约定

当前行为是模板设计的一部分，不建议随意改。

### 7.1 当前行为

- 主窗口默认 `visible: false`
- Rust 启动阶段根据设置决定是否显示主窗口
- 点击关闭不是退出，而是隐藏到托盘
- 托盘菜单包含：
  - 显示主窗口
  - 重启应用
  - 退出应用
- 第二次启动应用时，不会开新实例，而是拉起已有主窗口

### 7.2 关键文件

- `src-tauri/tauri.conf.json`
- `src-tauri/src/lib.rs`

### 7.3 多窗口扩展约定

如果未来要加新窗口：

- `main` 主窗口继续保持“关闭隐藏到托盘”
- 其他子窗口通常应当正常关闭
- Rust 侧应通过窗口 `label` 区分行为，不要把所有窗口都拦截成隐藏

---

## 8. 主题与语言机制

### 8.1 主题

主题逻辑主要在：

- `src/stores/app.js`
- `src/components/ui/ThemeSwitcher.vue`

当前支持：

- `light`
- `dark`
- `auto`

当主题为 `auto` 时，会跟随系统深浅色切换。

### 8.2 语言

语言逻辑主要在：

- `src/stores/app.js`
- `src/composables/useI18n.js`
- `src/components/ui/LanguageSwitcher.vue`
- `src/i18n/`

当前支持：

- `zh`
- `en`

### 8.3 修改规则

- 主题和语言都属于模板级能力
- 保存失败时应支持状态回滚
- 不要只改 UI 显示，不落原生设置

---

## 9. AI 修改代码时的硬规则

后续 AI 如果要继续开发，建议强制遵守这些规则：

1. 不要把业务状态继续堆进 `src/stores/app.js`
2. 不要跳过 `src/api/tauri.js` 直接在页面里散落调用原生命令
3. 不要把需要持久化的设置放回 `localStorage`
4. 不要删除当前托盘、多开、关闭到托盘、重启应用这些模板基础能力
5. 不要把新业务名称写死进模板底层文件
6. 不要引入“前端有接口、Rust 没实现”的空壳桥接
7. 所有用户可见中文都必须保持 UTF-8 正常，避免再次出现乱码

---

## 10. 推荐开发顺序

如果要基于本模板开发一个新桌面工具，建议按下面顺序做：

### 第一步：替换项目标识

优先修改：

- `package.json`
- `src-tauri/Cargo.toml`
- `src-tauri/tauri.conf.json`

比如：

- 项目名
- 包标识
- 窗口标题

### 第二步：替换页面

优先替换：

- `src/views/HomeView.vue`
- `src/views/ComponentsView.vue`
- `src/views/AboutView.vue`

### 第三步：新增业务 store

如果有业务状态，不要继续往 `app.js` 塞，应该：

- 在 `src/stores/` 下新建业务 store

### 第四步：新增原生命令

推荐顺序：

1. 在 `src-tauri/src/lib.rs` 增加命令
2. 注册到 `generate_handler!`
3. 在 `src/api/tauri.js` 增加桥接方法
4. 在业务 store 或页面里接入

---

## 11. 代码示例与中文注释规范

后续 AI 写代码时，建议在关键逻辑前加简短中文注释，但不要泛滥。

### 推荐写法

```ts
async function setShowWindowOnStartup(value) {
  const previousValue = settings.value.app.showWindowOnStartup
  settings.value.app.showWindowOnStartup = value

  try {
    await saveSettings()
  } catch (error) {
    // 保存失败时回滚，避免界面状态和本地配置不一致
    settings.value.app.showWindowOnStartup = previousValue
    throw error
  }
}
```

### 不推荐写法

```ts
// 设置值
settings.value.app.showWindowOnStartup = value
```

说明：

- 注释要解释“为什么”或者“关键行为”
- 不要写废话注释

---

## 12. 哪些文件可以大胆替换

这些文件通常可以直接按新项目需求改：

- `src/views/HomeView.vue`
- `src/views/ComponentsView.vue`
- `src/views/AboutView.vue`
- `src/router/index.js`
- `src/components/NavigationPage.vue`

---

## 13. 哪些文件要谨慎修改

这些文件属于模板底层能力，改动前要先理解：

- `src/App.vue`
- `src/stores/app.js`
- `src/api/tauri.js`
- `src/components/ui/TitleBar.vue`
- `src/components/ui/WindowControls.vue`
- `src-tauri/src/lib.rs`
- `src-tauri/tauri.conf.json`
- `src-tauri/capabilities/default.json`

---

## 14. 每次改动后的验证方式

前端构建验证：

```powershell
pnpm.cmd -C D:\code\辅助工具\usb自动连接工具\tauri-app build
```

Rust 侧验证：

```powershell
cargo check
```

`cargo check` 执行目录：

```text
D:\code\辅助工具\usb自动连接工具\tauri-app\src-tauri
```

如果改动涉及这些能力，还要手动验证：

- 启动时是否显示主窗口
- 点击关闭是否隐藏到托盘
- 托盘菜单是否可用
- 重启应用是否正常
- 第二次启动是否能拉起已有窗口
- 主题切换是否正常
- 语言切换是否正常

---

## 15. 推荐给后续 AI 的工作方式

如果后续 AI 接手这个项目，推荐按下面方式执行任务：

### 新增业务页面

1. 在 `src/views/` 新建页面
2. 在 `src/router/index.js` 注册
3. 在 `src/components/NavigationPage.vue` 增加菜单项

### 新增业务配置

1. 先判断是不是模板级配置
2. 如果只是业务配置，不要进 `app.js`
3. 应新建业务 store

### 新增桌面原生能力

1. Rust 实现
2. 前端桥接
3. 页面或 store 接入
4. 构建验证

---

## 16. 当前模板状态总结

目前这个模板已经具备作为新桌面项目起点的基础能力。

适合继续做：

- 工具类桌面应用
- 本地辅助软件
- 带托盘的后台工具
- 需要自定义标题栏的桌面壳程序

当前不建议直接做的事：

- 把复杂业务全部继续堆进模板页
- 把所有逻辑继续塞进 `app.js`
- 让前端和 Rust 接口长期失配

---

## 17. 给后续 AI 的一句话总结

如果你是后续接手这个仓库的 AI，请默认这样理解：

> 这是一个已经具备托盘、多开控制、原生设置持久化、主题和语言能力的桌面模板。  
> 业务功能应当在模板壳子之外扩展，不要破坏现有桌面基础能力。
