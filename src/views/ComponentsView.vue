<script setup>
import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import useConfirm from '../hooks/useConfirm'
import useMessage from '../hooks/useMessage'

const message = useMessage()
const confirm = useConfirm()

const showSuccess = () => {
  message.success('保存成功，界面状态已更新。')
}

const showWarning = () => {
  message.warning('这是一条警告提示，可用于配置风险提醒。')
}

const showConfirm = async () => {
  const ok = await confirm.confirm({
    title: '确认操作',
    message: '这里是模板内置的确认交互，适合删除、重置、覆盖等操作。',
    type: 'info',
    confirmButtonText: '继续',
    cancelButtonText: '取消',
  })

  if (ok) {
    message.info('你点击了继续。')
  }
}
</script>

<template>
  <section class="space-y-6 p-6">
    <div>
      <p class="text-sm uppercase tracking-[0.28em] text-secondary">UI Kit</p>
      <h2 class="mt-2 text-3xl font-semibold text-main">组件示例</h2>
      <p class="mt-2 text-sm text-secondary">这里展示模板内置的基础组件和卡片布局。</p>
    </div>

    <div class="grid gap-4 xl:grid-cols-2">
      <AppCard title="操作按钮" description="适合保存、提交、风险确认等典型动作。">
        <div class="flex flex-wrap gap-3">
          <AppButton @click="showSuccess">主按钮</AppButton>
          <AppButton variant="secondary" @click="showWarning">次按钮</AppButton>
          <AppButton variant="danger" @click="showConfirm">确认框</AppButton>
        </div>
      </AppCard>

      <AppCard title="信息卡片" description="适合做设置块、状态块和首页统计块。">
        <div class="rounded-2xl border border-dashed border-border/70 bg-bg-secondary p-4 text-sm text-secondary">
          这里是卡片内容槽位。
        </div>
      </AppCard>
    </div>
  </section>
</template>
