import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import { windowManager } from "node-window-manager";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let usageInterval = null;
let currentApp = "";
let usageData = {};
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  setInterval(() => {
    const active = windowManager.getActiveWindow();
    const title = active == null ? void 0 : active.getTitle();
    console.log("💡 Debug (always): Active window:", title);
  }, 5e3);
});
ipcMain.on("start-tracking", () => {
  console.log("✅ IPC Received: start-tracking");
  usageData = {};
  currentApp = "";
  usageInterval = setInterval(() => {
    try {
      const active = windowManager.getActiveWindow();
      const title = active == null ? void 0 : active.getTitle();
      console.log("⏱ Active window:", title);
      if (title) {
        currentApp = title;
        usageData[title] = (usageData[title] || 0) + 1;
        win == null ? void 0 : win.webContents.send("app-usage-update", { ...usageData });
      }
    } catch (err) {
      console.error("❌ Error getting active window:", err);
    }
  }, 1e3);
});
ipcMain.on("pause-tracking", () => {
  console.log("⏸️ IPC Received: pause-tracking");
  if (usageInterval) clearInterval(usageInterval);
});
ipcMain.on("resume-tracking", () => {
  console.log("▶️ IPC Received: resume-tracking");
  ipcMain.emit("start-tracking");
});
ipcMain.on("stop-tracking", () => {
  console.log("⛔ IPC Received: stop-tracking");
  if (usageInterval) clearInterval(usageInterval);
  usageInterval = null;
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
