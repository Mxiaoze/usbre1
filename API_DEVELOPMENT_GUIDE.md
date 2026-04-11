# API 开发文档

## 1. 这份文档是干什么的

这份文档专门说明：

- 后续如何在当前项目里新增 API
- 前端和 Rust 之间应该怎么对接
- 什么代码该写在哪一层

适用范围：

- 新增 Tauri 原生命令
- 新增前端桥接 API
- 新增配置读写能力
- 新增业务调用入口

---

## 2. 先说结论

如果你后续要新增一个“前端调用 Rust”的能力，标准做法是：

1. 在 `src-tauri/src/lib.rs` 里实现 Rust 命令
2. 在 `src/api/tauri.js` 里增加桥接方法
3. 在 `store` 或页面里调用桥接方法

不要直接在页面里到处写：

```js
invoke('xxx')
```

当前项目已经把：

- `src/api/tauri.js`

约定为前端统一桥接层。

---

## 3. 当前 API 结构

当前桥接文件：

- [tauri.js](/D:/code/辅助工具/usb自动连接工具/tauri-app/src/api/tauri.js)

当前已经存在的分组：

- `TauriAPI.settings`
- `TauriAPI.app`

示例结构：

```js
export const TauriAPI = {
  settings: {
    load: async () => {},
    save: async settings => {},
    reset: async () => {},
  },
  app: {
    relaunch: async () => {},
  },
}
```

建议后续继续按“模块分组”扩展，不要把所有方法平铺。

---

## 4. 各层职责

### 4.1 Rust 层

文件：

- `src-tauri/src/lib.rs`

职责：

- 实现原生命令
- 做文件读写
- 做系统能力调用
- 做托盘、窗口、原生设置等能力

### 4.2 前端桥接层

文件：

- `src/api/tauri.js`

职责：

- 统一封装 `invoke(...)`
- 做前端默认值合并
- 统一返回值格式
- 给 store / 页面提供稳定调用入口

### 4.3 Store 层

文件示例：

- `src/stores/app.js`

职责：

- 管理页面状态
- 调桥接 API
- 做回滚、异常处理、状态同步

### 4.4 页面层

文件示例：

- `src/views/SettingsView.vue`

职责：

- 负责交互
- 负责按钮点击、表单输入、提示信息
- 不直接乱写底层 `invoke(...)`

---

## 5. 新增 API 的标准流程

### 第一步：在 Rust 里实现命令

示例：

```rust
#[tauri::command]
fn get_app_version() -> String {
    // 返回版本号
    "1.0.0".to_string()
}
```

如果命令需要参数：

```rust
#[tauri::command]
fn echo_text(text: String) -> String {
    // 直接返回传入内容
    text
}
```

如果命令可能失败，建议返回 `Result`：

```rust
#[tauri::command]
fn read_local_file() -> Result<String, String> {
    // 这里用 Result 表达成功或失败
    std::fs::read_to_string("test.txt").map_err(|err| err.to_string())
}
```

### 第二步：注册到 `generate_handler!`

在 `src-tauri/src/lib.rs` 里找到：

```rust
.invoke_handler(tauri::generate_handler![
    load_settings,
    save_settings,
    reset_settings
])
```

新增后：

```rust
.invoke_handler(tauri::generate_handler![
    load_settings,
    save_settings,
    reset_settings,
    get_app_version,
    echo_text,
    read_local_file
])
```

### 第三步：在前端桥接层增加方法

在：

- `src/api/tauri.js`

中增加：

```js
import { invoke } from '@tauri-apps/api/core'

export const TauriAPI = {
  settings: {
    load: async () => {},
    save: async settings => {},
    reset: async () => {},
  },
  app: {
    relaunch: async () => {},

    // 获取应用版本
    getVersion: async () => {
      return await invoke('get_app_version')
    },

    // 向 Rust 传入字符串并返回结果
    echoText: async text => {
      return await invoke('echo_text', { text })
    },
  },
  file: {
    // 读取本地文件
    readLocalFile: async () => {
      return await invoke('read_local_file')
    },
  },
}
```

### 第四步：在 store 或页面中调用

推荐优先放在 store：

```js
import { TauriAPI } from '../api/tauri'

async function loadVersion() {
  const version = await TauriAPI.app.getVersion()
  return version
}
```

页面里再用 store 或桥接结果渲染。

---

## 6. 推荐的 API 分组方式

后续建议按功能模块分组：

```js
export const TauriAPI = {
  app: {},
  settings: {},
  file: {},
  window: {},
  system: {},
  task: {},
}
```

例如：

- `app`
  应用级能力，比如重启、版本、信息
- `settings`
  配置读写
- `file`
  文件操作
- `window`
  窗口相关能力
- `system`
  系统信息、环境信息
- `task`
  后台任务、业务命令

不要把几十个方法都直接塞到 `TauriAPI` 第一层。

---

## 7. 参数传递规则

### Rust

```rust
#[tauri::command]
fn create_task(name: String, enabled: bool) -> String {
    format!("{}-{}", name, enabled)
}
```

### 前端

```js
createTask: async (name, enabled) => {
  return await invoke('create_task', { name, enabled })
}
```

规则：

- Rust 参数名和前端传参对象字段名要一致
- 不要前端一个名字、Rust 一个名字，除非你明确做了转换

---

## 8. 返回值规则

### 简单值

可以直接返回：

- `String`
- `bool`
- `number`

### 对象

建议返回结构化对象，而不是拼字符串。

Rust 示例：

```rust
use serde::Serialize;

#[derive(Serialize)]
struct VersionInfo {
    version: String,
    channel: String,
}

#[tauri::command]
fn get_version_info() -> VersionInfo {
    VersionInfo {
        version: "1.0.0".into(),
        channel: "stable".into(),
    }
}
```

前端示例：

```js
getVersionInfo: async () => {
  return await invoke('get_version_info')
}
```

---

## 9. 错误处理规则

### Rust 层

如果可能失败，优先返回：

```rust
Result<T, String>
```

例如：

```rust
#[tauri::command]
fn read_config_text() -> Result<String, String> {
    std::fs::read_to_string("config.json").map_err(|err| err.to_string())
}
```

### 前端桥接层

桥接层通常保持薄封装，不一定每次都在这里吞错。

```js
readConfigText: async () => {
  return await invoke('read_config_text')
}
```

### Store / 页面层

建议在 store 或页面中处理错误提示：

```js
try {
  const result = await TauriAPI.file.readConfigText()
} catch (error) {
  // 这里做页面提示或状态回滚
}
```

---

## 10. 设置类 API 的特殊规则

当前项目的设置属于模板级能力，必须遵守以下规则：

1. 默认值放在 `src/utils/constant.ts`
2. Rust 侧负责真实持久化
3. 前端桥接层负责统一读写入口
4. Store 层负责状态回滚

不要只改其中一层。

比如新增设置字段：

- `autoLaunch`

你至少要同步修改：

- `src/utils/constant.ts`
- `src/api/tauri.js`
- `src/stores/app.js`
- `src-tauri/src/lib.rs`

---

## 11. 推荐代码模板

### Rust 命令模板

```rust
#[tauri::command]
fn command_name(param: String) -> Result<String, String> {
    // 这里写核心逻辑
    Ok(param)
}
```

### 前端桥接模板

```js
commandName: async param => {
  // 统一从这里调用 Rust 命令
  return await invoke('command_name', { param })
}
```

### Store 模板

```js
async function runCommand(param) {
  try {
    return await TauriAPI.module.commandName(param)
  } catch (error) {
    // 这里负责状态处理或错误提示
    throw error
  }
}
```

---

## 12. 不推荐的写法

### 不推荐 1：页面里散落直接调用 `invoke`

```js
const result = await invoke('command_name')
```

问题：

- 后续不好统一维护
- 参数和返回值容易失控
- 不利于后续 AI 统一理解

### 不推荐 2：桥接层和 Rust 层接口不一致

例如：

- Rust 叫 `get_app_version`
- 前端传参却写成别的字段结构

这种很容易出隐蔽 bug。

### 不推荐 3：设置只改前端，不落原生存储

这样重启应用后一定出问题。

---

## 13. 后续新增 API 的推荐顺序

最稳妥的顺序是：

1. 先定数据结构
2. 先写 Rust 命令
3. 再写 `src/api/tauri.js`
4. 再写 store
5. 最后接页面
6. 执行构建验证

---

## 14. 每次新增 API 后要做的验证

### 前端构建

```powershell
pnpm.cmd -C D:\code\辅助工具\usb自动连接工具\tauri-app build
```

### Rust 检查

```powershell
cargo check
```

执行目录：

```text
D:\code\辅助工具\usb自动连接工具\tauri-app\src-tauri
```

如果 API 影响窗口、托盘、设置、重启能力，还要手动验证交互。

---

## 15. 一句话总结

后续新增 API，默认按这个顺序做：

> Rust 命令实现 -> `src/api/tauri.js` 桥接 -> store / 页面调用

这样结构最稳，后续也最适合继续交给 AI 维护。
