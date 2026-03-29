<template>
  <div
    class="fixed top-0 right-0 left-0 z-1000 h-8 border-b border-b-border/40 bg-bg-secondary drag-region"
    data-tauri-drag-region
    @dblclick="handleDoubleClick"
  >
    <div data-tauri-drag-region class="flex h-full items-center justify-end px-4 py-0">
      <!-- 这里 @dblclick.stop 完全正常 -->
      <div class="flex-none" @dblclick.stop>
        <WindowControls
          @minimize="handleMinimize"
          @maximize="handleMaximize"
          @close="handleClose"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentWindow } from '@tauri-apps/api/window'
import { onMounted, onUnmounted, ref } from 'vue'
import WindowControls from './WindowControls.vue'

const isMaximized = ref(false)
let appWindow = null
let unlistenResize = null

// 最小化
const handleMinimize = async () => {
  try {
    const window = getCurrentWindow()
    await window.minimize()
  } catch (error) {
    console.error('Error minimizing window:', error)
  }
}

// 最大化/还原
const handleMaximize = async () => {
  try {
    const window = getCurrentWindow()
    const currentMaximized = await window.isMaximized()

    if (currentMaximized) {
      await window.unmaximize()
    } else {
      await window.maximize()
    }

    isMaximized.value = await window.isMaximized()
  } catch (error) {
    console.error('Error toggling window maximize:', error)
  }
}

// 关闭
const handleClose = async () => {
  try {
    const window = getCurrentWindow()
    await window.close()
  } catch (error) {
    console.error('Error closing window:', error)
  }
}

// 双击标题栏最大化
const handleDoubleClick = async () => {
  await handleMaximize()
}

onMounted(async () => {
  appWindow = getCurrentWindow()

  try {
    unlistenResize = await appWindow.listen('tauri://resize', async () => {
      isMaximized.value = await appWindow.isMaximized()
    })

    isMaximized.value = await appWindow.isMaximized()
  } catch (error) {
    console.error('Error setting up window listeners:', error)
  }
})

onUnmounted(() => {
  if (unlistenResize) {
    unlistenResize()
  }
})
</script>