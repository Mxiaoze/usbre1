<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import LanguageSwitcher from '../components/ui/LanguageSwitcher.vue'
import ThemeSwitcher from '../components/ui/ThemeSwitcher.vue'
import useConfirm from '../hooks/useConfirm'
import useMessage from '../hooks/useMessage'
import { useTranslation } from '../composables/useI18n'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
const { settings } = storeToRefs(appStore)
const message = useMessage()
const confirm = useConfirm()
const { switchLanguage } = useTranslation()

const startupLabel = computed(() => (settings.value.app.showWindowOnStartup ? '已开启' : '已关闭'))

const toggleStartup = async () => {
  try {
    await appStore.setShowWindowOnStartup(!settings.value.app.showWindowOnStartup)
    message.success('启动显示主窗口配置已保存。')
  } catch {
    message.error('保存启动显示主窗口配置失败。')
  }
}

const handleReset = async () => {
  const ok = await confirm.confirm({
    title: '重置模板设置',
    message: '这会把主题、语言和窗口显示配置恢复为默认值。',
    type: 'warning',
    confirmButtonText: '重置',
    cancelButtonText: '取消',
  })

  if (!ok) return

  const nextSettings = await appStore.resetSettings()
  switchLanguage(nextSettings.app.language || 'zh')
  message.success('模板设置已恢复默认值。')
}

const handleRestart = async () => {
  try {
    await appStore.restartApp()
  } catch {
    message.error('重启应用失败，请确认当前运行在 Tauri 桌面环境。')
  }
}
</script>

<template>
  <section class="space-y-6 p-6">
    <div>
      <p class="text-sm uppercase tracking-[0.28em] text-secondary">Settings</p>
      <h2 class="mt-2 text-3xl font-semibold text-main">模板设置</h2>
      <p class="mt-2 text-sm text-secondary">这里保留模板级别的通用设置，不再混入业务配置。</p>
    </div>

    <div class="grid gap-4 xl:grid-cols-2">
      <AppCard title="界面外观" description="主题和语言是模板默认保留的两套全局能力。">
        <div class="flex flex-wrap gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </AppCard>

      <AppCard title="应用行为" description="这些是桌面工具模板里最常见的基础行为配置。">
        <div class="space-y-4">
          <div class="flex items-center justify-between rounded-2xl bg-bg-secondary px-4 py-3">
            <div>
              <p class="font-medium text-main">启动时显示主窗口</p>
              <p class="text-sm text-secondary">当前状态：{{ startupLabel }}</p>
            </div>
            <AppButton variant="secondary" @click="toggleStartup">切换</AppButton>
          </div>

          <div class="flex flex-wrap gap-3">
            <AppButton @click="handleRestart">重启应用</AppButton>
            <AppButton variant="danger" @click="handleReset">恢复默认</AppButton>
          </div>
        </div>
      </AppCard>
    </div>
  </section>
</template>
