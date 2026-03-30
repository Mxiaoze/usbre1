# 文档索引

这个文件用于说明当前仓库内各类文档的用途，方便后续开发者或 AI 快速进入上下文。

---

## 1. 文档列表

### [README.md](D:/code/辅助工具/usb自动连接工具/tauri-app/README.md)

适合阅读对象：

- 人类开发者
- 新接手项目的人

主要内容：

- 项目是什么
- 技术栈
- 如何启动
- 如何构建
- 当前模板提供哪些能力
- 基本目录结构

适合场景：

- 第一次打开仓库
- 想快速知道怎么跑起来

---

### [AI_DEVELOPMENT_GUIDE.md](D:/code/辅助工具/usb自动连接工具/tauri-app/AI_DEVELOPMENT_GUIDE.md)

适合阅读对象：

- 后续接手项目的 AI
- 需要理解模板结构的开发者

主要内容：

- 项目定位
- 核心架构
- 设置持久化规则
- 托盘与窗口行为约定
- 哪些文件可以大胆改
- 哪些文件必须谨慎改
- 推荐开发顺序
- 验证方式

适合场景：

- 开始改代码前建立上下文
- 准备新增页面、store、原生命令

---

### [AI_TASK_TEMPLATE.md](D:/code/辅助工具/usb自动连接工具/tauri-app/AI_TASK_TEMPLATE.md)

适合阅读对象：

- 给后续 AI 下发任务的人
- 需要快速组织 AI 提示词的人

主要内容：

- AI 修改项目时应遵守的规则
- AI 执行步骤模板
- AI 回复格式建议
- 可直接复制的任务提示词模板

适合场景：

- 让 AI 接手开发
- 给 AI 下发具体改造任务

---

## 2. 推荐阅读顺序

### 对人类开发者

建议顺序：

1. 先看 `README.md`
2. 再看 `AI_DEVELOPMENT_GUIDE.md`

### 对后续 AI

建议顺序：

1. 先看 `AI_DEVELOPMENT_GUIDE.md`
2. 再结合 `AI_TASK_TEMPLATE.md` 执行任务

### 对项目管理或协作者

建议顺序：

1. 先看 `README.md`
2. 再看 `AI_TASK_TEMPLATE.md`

---

## 3. 文档使用建议

### 当你要启动项目时

看：

- `README.md`

### 当你要改页面或加功能时

看：

- `AI_DEVELOPMENT_GUIDE.md`

### 当你要让 AI 接手改代码时

看：

- `AI_TASK_TEMPLATE.md`

---

## 4. 当前文档分工总结

- `README.md`
  面向人类，解决“这是什么、怎么跑”

- `AI_DEVELOPMENT_GUIDE.md`
  面向 AI 和开发者，解决“这个模板该怎么改”

- `AI_TASK_TEMPLATE.md`
  面向任务下发者，解决“怎么让 AI 正确接手”

---

## 5. 建议维护方式

后续如果模板结构发生变化，建议同步更新：

- 页面结构变了：更新 `README.md` 和 `AI_DEVELOPMENT_GUIDE.md`
- 模板底层能力变了：优先更新 `AI_DEVELOPMENT_GUIDE.md`
- AI 任务约束变了：更新 `AI_TASK_TEMPLATE.md`

---

## 6. 一句话总结

如果你刚进入这个仓库，不知道先看什么：

- 想跑项目，看 `README.md`
- 想改项目，看 `AI_DEVELOPMENT_GUIDE.md`
- 想让 AI 改项目，看 `AI_TASK_TEMPLATE.md`
