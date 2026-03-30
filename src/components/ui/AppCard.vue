<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <article class="rounded-3xl border border-border/60 bg-surface p-5 shadow-sm backdrop-blur-sm">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-main">{{ title }}</h3>
      <p v-if="description" class="mt-1 text-sm text-secondary">{{ description }}</p>
    </div>
    <slot />
  </article>
</template>
