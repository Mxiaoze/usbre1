import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

export const createNewWindow = async (url: string, id: string, title: string) => {
  const webview = new WebviewWindow(id, {
    url,
    title,
    width: 1200,
    height: 800,
    resizable: true,
  })

  webview.once('tauri://created', () => {
    console.log('Window created successfully:', id)
  })

  webview.once('tauri://error', error => {
    console.error('Failed to create window:', error)
  })
}
