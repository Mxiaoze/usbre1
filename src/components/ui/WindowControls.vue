<template>
  <div class="flex gap-1">
    <button class="control-btn minimize" title="最小化" @click="emit('minimize')">
      <Minimize2 :size="12" />
    </button>
    <button class="control-btn maximize" title="最大化" @click="emit('maximize')">
      <Maximize2 :size="12" />
    </button>
    <button class="control-btn close" title="关闭" @click="emit('close')">
      <XIcon :size="16" />
    </button>
  </div>
</template>

<script setup>
import { Maximize2, Minimize2, XIcon } from 'lucide-vue-next'
const emit = defineEmits(['minimize', 'maximize', 'close'])
</script>

<style scoped>
/* 纯 CSS 版本，完全不依赖 Tailwind，不会报任何错 */
.flex {
  display: flex;
}
.gap-1 {
  gap: 4px;
}

.control-btn {
  height: 20px;
  width: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #ccc;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #333;
  color: #fff;
}

.control-btn.minimize:hover {
  background: #3b82f6;
  color: white;
}

.control-btn.maximize:hover {
  background: #10b981;
  color: white;
}

.control-btn.close:hover {
  background: #ef4444;
  color: white;
}
</style>