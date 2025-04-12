import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'
import { windowManager } from 'node-window-manager'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let usageInterval: NodeJS.Timeout | null = null
let currentApp = ''
let usageData: Record<string, number> = {}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow()

  // Debug active window log
  setInterval(() => {
    const active = windowManager.getActiveWindow()
    const title = active?.getTitle()
    console.log("💡 Debug (always): Active window:", title)
  }, 5000)
})

// ========= Reusable Tracking Function =========
function startTracking(reset = true) {
  if (usageInterval) clearInterval(usageInterval)

  if (reset) {
    usageData = {}
    currentApp = ''
  }

  usageInterval = setInterval(() => {
    try {
      const active = windowManager.getActiveWindow()
      const title = active?.getTitle()

      console.log("Active window:", title)

      if (title) {
        currentApp = title
        usageData[title] = (usageData[title] || 0) + 1

        win?.webContents.send('app-usage-update', { ...usageData })
      }
    } catch (err) {
      console.error("Error getting active window:", err)
    }
  }, 1000)
}



ipcMain.on('start-tracking', () => {
  console.log("IPC Received: start-tracking")
  startTracking(true)  
})

ipcMain.on('pause-tracking', () => {
  console.log("IPC Received: pause-tracking")
  if (usageInterval) clearInterval(usageInterval)
})

ipcMain.on('resume-tracking', () => {
  console.log("IPC Received: resume-tracking")
  startTracking(false) 
})

ipcMain.on('stop-tracking', () => {
  console.log("IPC Received: stop-tracking")
  if (usageInterval) clearInterval(usageInterval)
  usageInterval = null
})
