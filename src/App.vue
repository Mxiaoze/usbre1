<template>
  <div id="app" class="relative h-full min-h-screen w-full select-none bg-transparent">
    <div class="relative flex h-screen overflow-hidden bg-bg pt-8">

      <TitleBar />

      <div class="pointer-events-none absolute inset-0 -z-1 bg-cover bg-fixed bg-center bg-no-repeat opacity-50 blur-sm" />

      <Navigation />

      <main class="relative z-1 no-scrollbar h-full flex-1 overflow-scroll bg-bg-secondary">
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Navigation from './components/NavigationPage.vue' // 注意这里改为你的文件名
import TitleBar from './components/ui/TitleBar.vue'   // 注意这里改为你的文件名
import { useTranslation } from './composables/useI18n'
import { useAppStore } from './stores/app'

const appStore = useAppStore()
const { t } = useTranslation()
const isLoading = ref(true)

onMounted(async () => {
  try {
    // 1. 初始化 Store
    // 注意：如果你的 store 还没写 init 方法，先注释掉
    // await appStore.init()

    // 2. 应用主题
    const theme = appStore.settings?.app?.theme || 'light'
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }

    // 3. 检查更新逻辑 (如果你还没装更新插件，先注释掉)
    /*
    window.__TAURI__.updater.onUpdaterEvent((event) => {
      console.log('更新事件:', event)
    })
    */
  } finally {
    isLoading.value = false
  }
})
</script>

<style>
/* 简单的页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>