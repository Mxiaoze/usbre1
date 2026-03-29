<template>
  <div>
    <MessageToast ref="messageRef" />

    <ConfirmMessageBox
      :is-open="confirmVisible"
      :title="confirmOptions.title"
      :message="confirmOptions.message"
      :type="confirmOptions.type"
      :confirm-button-text="confirmOptions.confirmButtonText"
      :cancel-button-text="confirmOptions.cancelButtonText"
      :show-close="confirmOptions.showClose"
      :center="confirmOptions.center"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, useTemplateRef } from 'vue'

// 移除类型导入，只保留逻辑导入
import useConfirm from '@/hooks/useConfirm'
import useMessage from '@/hooks/useMessage'

import ConfirmMessageBox from './ConfirmMessageBox.vue'
import MessageToast from './MessageToast.vue'

const messageRef = useTemplateRef('messageRef')
const confirmVisible = ref(false)

// 移除 <ConfirmOptions> 类型约束
const confirmOptions = reactive({
  message: '',
  title: 'Confirm',
  type: 'info',
  confirmButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
  showClose: true,
  center: false,
})

// 移除类型标注
let confirmResolve = null

const handleConfirm = () => {
  confirmVisible.value = false
  if (confirmResolve) {
    confirmResolve(true)
    confirmResolve = null
  }
}

const handleCancel = () => {
  confirmVisible.value = false
  if (confirmResolve) {
    confirmResolve(false)
    confirmResolve = null
  }
}

// 移除参数和返回值的类型定义
const showConfirm = (options) => {
  return new Promise(resolve => {
    Object.assign(confirmOptions, {
      title: 'Confirm',
      type: 'info',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      showClose: true,
      center: false,
      ...options,
    })
    confirmResolve = resolve
    confirmVisible.value = true
  })
}

onMounted(() => {
  const { setMessageService } = useMessage()
  if (messageRef.value) {
    setMessageService({
      success: messageRef.value.success,
      error: messageRef.value.error,
      warning: messageRef.value.warning,
      info: messageRef.value.info,
    })
  }

  // Initialize confirm service
  const { setConfirmService } = useConfirm()
  setConfirmService({
    confirm: showConfirm,
  })
})
</script>

<script>
export default {
  name: 'UIServiceProvider',
}
</script>