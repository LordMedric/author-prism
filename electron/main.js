const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const http = require("http");

let mainWindow;
let serverInstance;

async function startServer() {
  if (app.isPackaged || process.env.NODE_ENV === "production") {
    try {
      const next = require("next");
      const nextApp = next({ dev: false, dir: app.getAppPath() });
      const handle = nextApp.getRequestHandler();
      await nextApp.prepare();

      serverInstance = http.createServer((req, res) => {
        handle(req, res);
      });

      return new Promise((resolve) => {
        serverInstance.listen(0, "127.0.0.1", () => {
          const port = serverInstance.address().port;
          resolve(`http://127.0.0.1:${port}`);
        });
      });
    } catch (err) {
      console.error("Failed to start embedded Next.js server:", err);
      return "http://localhost:3000";
    }
  }
  return process.env.ELECTRON_START_URL || "http://localhost:3000";
}

async function createWindow() {
  const url = await startServer();

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    title: "Author Prism",
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(url);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (serverInstance) {
    serverInstance.close();
  }
  if (process.platform !== "darwin") app.quit();
});
