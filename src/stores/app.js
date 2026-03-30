import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { TauriAPI } from '../api/tauri'
import { DEFAULT_SETTINGS } from '../utils/constant'

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
let mediaQueryListener = null

export const useAppStore = defineStore('app', () => {
  const settings = ref(structuredClone(DEFAULT_SETTINGS))
  const error = ref('')

  const currentTheme = computed(() => settings.value.app.theme || 'light')
  const currentLanguage = computed(() => settings.value.app.language || 'zh')

  async function loadSettings() {
    const loaded = await TauriAPI.settings.load()
    settings.value = {
      ...structuredClone(DEFAULT_SETTINGS),
      ...loaded,
      app: {
        ...structuredClone(DEFAULT_SETTINGS).app,
        ...(loaded?.app || {}),
      },
    }
    applyTheme(settings.value.app.theme)
  }

  async function saveSettings() {
    await TauriAPI.settings.save(settings.value)
  }

  async function resetSettings() {
    const nextSettings = await TauriAPI.settings.reset()
    settings.value = nextSettings
    applyTheme(settings.value.app.theme)
    return nextSettings
  }

  function applyTheme(theme) {
    const root = document.documentElement
    root.classList.remove('light', 'dark', 'auto')
    if (mediaQueryListener) {
      mediaQuery.removeEventListener('change', mediaQueryListener)
      mediaQueryListener = null
    }

    if (theme === 'auto') {
      const isDark = mediaQuery.matches
      root.classList.add('auto', isDark ? 'dark' : 'light')
      root.setAttribute('data-theme', isDark ? 'dark' : 'light')
      mediaQueryListener = event => {
        if (settings.value.app.theme === 'auto') {
          root.classList.remove('light', 'dark')
          root.classList.add(event.matches ? 'dark' : 'light')
          root.setAttribute('data-theme', event.matches ? 'dark' : 'light')
        }
      }
      mediaQuery.addEventListener('change', mediaQueryListener)
      return
    }

    root.classList.add(theme)
    root.setAttribute('data-theme', theme)
  }

  async function setTheme(theme) {
    const previousTheme = settings.value.app.theme
    settings.value.app.theme = theme
    applyTheme(theme)
    try {
      await saveSettings()
    } catch (error) {
      settings.value.app.theme = previousTheme
      applyTheme(previousTheme)
      throw error
    }
  }

  async function toggleTheme() {
    const themes = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    await setTheme(nextTheme)
  }

  async function setLanguage(language) {
    const previousLanguage = settings.value.app.language
    settings.value.app.language = language
    try {
      await saveSettings()
    } catch (error) {
      settings.value.app.language = previousLanguage
      throw error
    }
  }

  async function setShowWindowOnStartup(value) {
    const previousValue = settings.value.app.showWindowOnStartup
    settings.value.app.showWindowOnStartup = value
    try {
      await saveSettings()
    } catch (error) {
      settings.value.app.showWindowOnStartup = previousValue
      throw error
    }
  }

  async function restartApp() {
    try {
      await TauriAPI.app.relaunch()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to restart app'
      throw err
    }
  }

  function clearError() {
    error.value = ''
  }

  async function init() {
    await loadSettings()
  }

  return {
    settings,
    error,
    currentTheme,
    currentLanguage,
    init,
    loadSettings,
    saveSettings,
    resetSettings,
    setTheme,
    toggleTheme,
    setLanguage,
    setShowWindowOnStartup,
    restartApp,
    clearError,
    applyTheme,
  }
})
