import { invoke } from '@tauri-apps/api/core'
import { relaunch } from '@tauri-apps/plugin-process'

import { DEFAULT_SETTINGS } from '../utils/constant'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function mergeSettings(value) {
  return {
    ...clone(DEFAULT_SETTINGS),
    ...(value || {}),
    app: {
      ...clone(DEFAULT_SETTINGS).app,
      ...(value?.app || {}),
    },
  }
}

export const TauriAPI = {
  settings: {
    load: async () => {
      const settings = await invoke('load_settings')
      return mergeSettings(settings)
    },
    save: async settings => {
      const saved = await invoke('save_settings', { settings: mergeSettings(settings) })
      return mergeSettings(saved)
    },
    reset: async () => {
      const settings = await invoke('reset_settings')
      return mergeSettings(settings)
    },
  },
  app: {
    relaunch: async () => {
      await relaunch()
    },
  },
}
