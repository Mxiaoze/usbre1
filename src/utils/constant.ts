export const DEFAULT_SETTINGS = {
  app: {
    theme: 'light',
    language: 'zh',
    showWindowOnStartup: true,
  },
}

export const isMacOs = typeof OS_PLATFORM !== 'undefined' && OS_PLATFORM === 'darwin'
