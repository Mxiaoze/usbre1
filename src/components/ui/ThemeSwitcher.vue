<template>
  <div class="relative flex items-center justify-center">
    <button
        class="flex cursor-pointer items-center gap-2 rounded-md border border-border-secondary/60 bg-bg-secondary px-3 py-2 text-sm text-secondary transition-all duration-fast ease-standard hover:bg-accent/20 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        :title="t('settings.theme.toggle')"
        @click="toggleTheme"
    >
      <component :is="currentThemeOption.icon" :size="18" class="shrink-0" />
      <span class="font-medium">{{ currentThemeOption.label }}</span>
    </button>
  </div>

</template>

<script setup lang="ts">
import { Monitor, Moon, Sun } from 'lucide-vue-next'
import { computed } from 'vue'

import { useTranslation } from '../../composables/useI18n'
import { useAppStore } from '../../stores/app'

const appStore = useAppStore()
const { t } = useTranslation()

// 当前主题
const currentTheme = computed(() => appStore.settings.app.theme || 'light')

// 主题配置（国际化）
const themeOptions = computed(() => [
  {
    value: 'light',
    label: t('settings.theme.light'),
    icon: Sun,
  },
  {
    value: 'dark',
    label: t('settings.theme.dark'),
    icon: Moon,
  },
  // {
  //   value: 'auto',
  //   label: t('settings.theme.auto'),
  //   icon: Monitor,
  // },
])

// 当前选中的主题
const currentThemeOption = computed(
    () => themeOptions.value.find(option => option.value === currentTheme.value) || themeOptions.value[0]
)

// 循环切换主题：light → dark → auto → light...
const toggleTheme = () => {
  const themes = ['light', 'dark']
  const currentIndex = themes.indexOf(currentTheme.value)
  const nextTheme = themes[(currentIndex + 1) % themes.length]

  // 直接调用 store 切换
  appStore.setTheme(nextTheme)
}
</script>