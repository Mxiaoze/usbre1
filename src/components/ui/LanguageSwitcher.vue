<script setup lang="ts">
import { Languages } from 'lucide-vue-next'
import { computed } from 'vue'

import { useTranslation } from '../../composables/useI18n'
import { useAppStore } from '../../stores/app'

const appStore = useAppStore()
const { currentLocale, switchLanguage } = useTranslation()

const languages = [
  { code: 'zh', name: 'ZH' },
  { code: 'en', name: 'English' },
]

const currentLanguage = computed(() => languages.find(item => item.code === currentLocale.value) || languages[0])

const cycleLanguage = async () => {
  const index = languages.findIndex(item => item.code === currentLocale.value)
  const next = languages[(index + 1) % languages.length]
  await appStore.setLanguage(next.code)
  switchLanguage(next.code)
}
</script>

<template>
  <button
    class="flex cursor-pointer items-center gap-2 rounded-md border border-border-secondary bg-bg-secondary px-3 py-1.5 text-sm text-secondary transition-all duration-fast ease-standard hover:bg-accent/30 hover:text-white"
    @click="cycleLanguage"
  >
    <Languages :size="18" />
    <span class="font-medium">{{ currentLanguage.name }}</span>
  </button>
</template>
