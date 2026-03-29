export const useTray = () => {
  const updateTrayMenu = async (serviceRunning) => {
    try {
      // 空方法，不执行任何操作
    } catch (error) {
      console.error('Failed to update tray menu:', error)
    }
  }

  return {
    updateTrayMenu,
  }
}