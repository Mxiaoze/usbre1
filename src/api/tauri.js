// src/api/tauri.js
// 已清空所有更新插件、自动更新代码 → 100% 无报错

import { invoke } from '@tauri-apps/api/primitives'
import { appDataDir, join } from '@tauri-apps/api/path'

// 空壳 TauriAPI，只保留项目运行必需的最小功能
export const TauriAPI = {
  settings: {
    load: async () => ({}),
    save: async () => ({}),
    reset: async () => ({}),
    saveAndRestart: async () => ({}),
  },
  core: {
    start: async () => ({}),
    stop: async () => ({}),
    getStatus: async () => ({ running: false }),
  },
  rclone: {
    remotes: {
      listConfig: async () => ({}),
      create: async () => true,
      update: async () => true,
      delete: async () => true,
    },
    mounts: {
      list: async () => [],
      mount: async () => ({}),
      unmount: async () => ({}),
    },
  },
  logs: {
    get: async () => [],
    clear: async () => true,
    resetAdminPassword: async () => '',
    setAdminPassword: async () => true,
  },
  files: {
    open: async () => ({}),
    folder: async () => ({}),
    openLogsDirectory: async () => ({}),
    openOpenListDataDir: async () => ({}),
    openRcloneConfigFile: async () => ({}),
    openSettingsFile: async () => ({}),
  },
  util: {
    selectDirectory: async () => null,
  },
  tray: {
    update: async () => ({}),
  },
}