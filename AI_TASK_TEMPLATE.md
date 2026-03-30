# AI 任务模板

这份文件是给后续 AI 使用的任务约束模板。

使用方式：

- 把下面内容复制给后续 AI
- 再补充你自己的具体需求

---

## 通用任务前置说明

你正在修改一个 `Tauri 2 + Vue 3` 的桌面模板项目。

请先遵守这些规则：

1. 先阅读项目内的 `AI_DEVELOPMENT_GUIDE.md`
2. 把这个仓库当成“桌面模板底座”，不是普通业务项目
3. 不要随意破坏以下基础能力：
   - 系统托盘
   - 单实例运行
   - 关闭主窗口隐藏到托盘
   - 重启应用
   - 原生设置持久化
   - 自定义标题栏
4. 不要把业务状态继续堆进 `src/stores/app.js`
5. 不要把需要持久化的设置改回 `localStorage`
6. 新增原生命令时，必须按下面顺序实现：
   - Rust 命令
   - `src/api/tauri.js`
   - store / 页面接入
7. 所有用户可见中文必须保持 UTF-8 正常，不允许出现乱码
8. 完成改动后必须做构建验证

---

## AI 执行步骤模板

### 第一步：理解上下文

先阅读这些文件：

- `AI_DEVELOPMENT_GUIDE.md`
- `src/App.vue`
- `src/stores/app.js`
- `src/api/tauri.js`
- `src-tauri/src/lib.rs`
- `src/router/index.js`

然后总结：

- 当前功能入口在哪里
- 这次需求应该改哪些文件
- 哪些模板基础能力不能被破坏

### 第二步：只改必要文件

请优先做最小改动，不要无意义重构。

### 第三步：如果新增能力，按层次实现

#### 新增前端页面

- 在 `src/views/` 新建页面
- 在 `src/router/index.js` 注册
- 在 `src/components/NavigationPage.vue` 增加菜单项

#### 新增业务 store

- 在 `src/stores/` 新建业务 store
- 不要把业务状态堆进 `src/stores/app.js`

#### 新增原生命令

- 在 `src-tauri/src/lib.rs` 中实现
- 注册到 `generate_handler!`
- 在 `src/api/tauri.js` 增加桥接
- 再由页面或 store 调用

### 第四步：写清楚验证结果

至少说明：

- 改了哪些核心点
- 是否执行了 `pnpm build`
- 是否执行了 `cargo check`
- 有没有未解决风险

---

## AI 回复格式建议

建议后续 AI 最终回复时包含这几部分：

### 1. 改动说明

简要说明改了什么，不要写成长流水账。

### 2. 关键文件

列出核心改动文件。

### 3. 验证结果

例如：

- `pnpm build` 通过
- `cargo check` 通过

### 4. 风险或后续建议

如果还有未做的项，要明确说出来。

---

## 可直接复制的任务提示词

### 模板安全修改版

```text
你正在修改一个 Tauri 2 + Vue 3 的桌面模板项目。

先阅读 AI_DEVELOPMENT_GUIDE.md，再开始修改。

要求：
1. 保留系统托盘、单实例、关闭到托盘、重启应用、原生设置持久化这些模板能力
2. 不要把业务状态继续堆进 src/stores/app.js
3. 不要把持久化设置改回 localStorage
4. 只做完成需求所需的最小改动
5. 如果新增原生命令，必须同步修改 Rust、src/api/tauri.js、以及调用层
6. 所有中文保持 UTF-8 正常
7. 完成后执行 pnpm build 和 cargo check，并汇报结果
```

### 新增页面版

```text
请基于当前桌面模板新增一个业务页面。

要求：
1. 页面放在 src/views/
2. 路由注册到 src/router/index.js
3. 菜单注册到 src/components/NavigationPage.vue
4. 不要破坏现有托盘、标题栏、设置、主题和语言逻辑
5. 改动后执行 pnpm build
```

### 新增原生命令版

```text
请为当前桌面模板新增一个 Tauri 原生命令。

要求：
1. 在 src-tauri/src/lib.rs 实现命令并注册
2. 在 src/api/tauri.js 增加桥接方法
3. 由 store 或页面调用，不要直接在多个页面里散乱 invoke
4. 如果有用户设置，必须接入原生持久化链路
5. 最后执行 cargo check 和前端构建验证
```

---

## 最后说明

后续 AI 如果不确定某个改动是否属于“模板级能力”还是“业务级能力”，优先采用保守策略：

- 模板底层少动
- 业务代码新建模块
- 原生桥接统一收口
