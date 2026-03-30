<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
})

const variantClassMap = {
  primary: 'bg-[linear-gradient(135deg,var(--color-accent),var(--color-primary))] text-white shadow-sm hover:opacity-95',
  secondary: 'border border-border/70 bg-bg-secondary text-main hover:bg-surface-elevated',
  danger: 'bg-[linear-gradient(135deg,var(--color-danger),#b91c1c)] text-white shadow-sm hover:opacity-95',
}
</script>

<template>
  <button
    class="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-fast ease-standard hover:-translate-y-[1px]"
    :class="variantClassMap[props.variant] || variantClassMap.primary"
  >
    <slot />
  </button>
</template>
