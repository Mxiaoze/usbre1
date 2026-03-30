import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import zh from './locales/zh.json'

export type MessageLanguages = keyof typeof en
export type MessageSchema = typeof en

export const SUPPORT_LOCALES = ['zh', 'en']

export function setupI18n(options: { locale?: string } = {}) {
  const i18n = createI18n<[MessageSchema], 'zh' | 'en'>({
    legacy: false,
    locale: options.locale === 'en' ? 'en' : 'zh',
    fallbackLocale: 'en',
    messages: {
      zh,
      en,
    },
  })
  return i18n
}
