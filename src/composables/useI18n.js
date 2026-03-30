import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useTranslation() {
  const { t, locale, availableLocales } = useI18n()

  const currentLocale = computed(() => locale.value)

  const switchLanguage = lang => {
    locale.value = lang
  }

  const isChineseLocale = computed(() => locale.value === 'zh')
  const isEnglishLocale = computed(() => locale.value === 'en')

  return {
    t,
    currentLocale,
    availableLocales,
    switchLanguage,
    isChineseLocale,
    isEnglishLocale,
  }
}
