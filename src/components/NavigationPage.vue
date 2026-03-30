<script setup>
import { Boxes, House, Info, Settings } from 'lucide-vue-next'

import ThemeSwitcher from './ui/ThemeSwitcher.vue'

const navItems = [
  { to: '/', label: '概览', icon: House },
  { to: '/components', label: '组件', icon: Boxes },
  { to: '/settings', label: '设置', icon: Settings },
  { to: '/about', label: '关于', icon: Info },
]
</script>

<template>
  <nav
    class="group no-scrollbar flex h-screen w-37.5 flex-col gap-2 overflow-hidden border-r border-r-border-secondary/50 bg-bg-secondary transition-all duration-medium ease-apple"
  >
    <div class="relative mt-5 flex items-center justify-center bg-bg-secondary px-4">
      <div class="flex flex-col items-center gap-1">
        <span class="font-bold tracking-tight text-main">桌面模板</span>
      </div>
    </div>

    <div class="flex items-center justify-center py-1">
      <ThemeSwitcher />
    </div>

    <div class="min-h-9 flex-1 overflow-y-auto py-2 no-scrollbar">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex cursor-pointer items-center justify-center gap-3 px-4 py-3 text-sm font-medium no-underline transition-all duration-fast ease-apple hover:bg-surface hover:text-accent [.router-link-active]:border-r-4 [.router-link-active]:border-accent [.router-link-active]:bg-surface [.router-link-active]:text-accent"
      >
        <component :is="item.icon" :size="18" />
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>
