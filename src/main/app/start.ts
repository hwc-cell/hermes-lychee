import {
  app,
  BrowserWindow,
  Menu,
  nativeImage,
  session,
  shell,
  Tray,
} from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../../resources/icon.png?asset";
import { getPublicConnectionConfig } from "../config";
import { stopHealthPolling } from "../hermes";
import { stopAllDashboards } from "../dashboard";
import { cleanupTempMediaFiles } from "../media";
import { closeDbConnection } from "../db";
import { stopSshTunnel } from "../ssh-tunnel";
import {
  hardenAttachedWebContents,
  hardenWebviewPreferences,
  isAllowedAppNavigationUrl,
  isAllowedExternalUrl,
  isAllowedWebviewUrl,
} from "../security";
import { registerIpcHandlers } from "../ipc/register";
import { setGatewayPromptParent } from "../gatewayPrompt";
import { showChatContextMenu } from "./context-menu";
import { buildMenu } from "./menu";

const APP_NAME = process.env.HERMES_DESKTOP_APP_NAME?.trim() || "Hermes Lychee";
const OPEN_DEVTOOLS_ON_START =
  process.env.HERMES_OPEN_DEVTOOLS === "1" ||
  process.env.HERMES_DESKTOP_OPEN_DEVTOOLS === "1";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
const activeRuns = new Map<string, () => void>();

export function startMainProcess(): void {
  process.on("uncaughtException", (err) => {
    console.error("[MAIN UNCAUGHT]", err);
  });

  process.on("unhandledRejection", (reason) => {
    console.error("[MAIN UNHANDLED REJECTION]", reason);
  });

  registerIpcHandlers({
    activeRuns,
    getMainWindow: () => mainWindow,
    notifyConnectionConfigChanged,
    notifyModelLibraryChanged,
    openExternalUrl,
  });

  // Auto-update disabled — this is a custom fork (Hermes Lychee)
  // setupUpdater({ getMainWindow: () => mainWindow });

  app.whenReady().then(() => {
    electronApp.setAppUserModelId("com.nousresearch.hermes");

    app.on("browser-window-created", (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    app.on("web-contents-created", (_event, contents) => {
      if (contents.getType() === "webview") {
        // The web preview webview is the only one allowed to load remote HTTPS.
        // Identify it reliably by its session: a <webview partition="web-preview">
        // shares the singleton in-memory session returned by fromPartition().
        // The partition session is the only dependable signal available in
        // web-contents-created — without it, post-attach redirects/navigations
        // (e.g. google.com -> www.google.com) are wrongly blocked.
        const isWebPreview =
          contents.session === session.fromPartition("web-preview");
        hardenAttachedWebContents(contents, isWebPreview);
      }
    });

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [
            "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: blob: file: https:; " +
              "media-src 'self' data: blob: file: https:; " +
              "connect-src 'self' blob: http://127.0.0.1:* ws://127.0.0.1:* http://localhost:* ws://localhost:* https: wss:; " +
              "font-src 'self' data:; " +
              "frame-src 'self' https: http://127.0.0.1:* http://localhost:*; " +
              "object-src 'none'; " +
              "base-uri 'self';",
          ],
        },
      });
    });

    createWindow();
    buildMenu({ getMainWindow: () => mainWindow, openExternalUrl });

    // macOS: create a tray icon so closing the window minimizes to tray
    // instead of quitting (issue #683).
    if (process.platform === "darwin") {
      const trayIcon = nativeImage
        .createFromPath(icon)
        .resize({ width: 16, height: 16 });
      trayIcon.setTemplateImage(true);
      tray = new Tray(trayIcon);
      tray.setToolTip(APP_NAME);
      tray.on("click", () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      });
      const contextMenu = Menu.buildFromTemplate([
        {
          label: `显示 ${APP_NAME}`,
          click: () => {
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
            }
          },
        },
        { type: "separator" },
        {
          label: "退出",
          click: () => {
            tray?.destroy();
            tray = null;
            app.quit();
          },
        },
      ]);
      tray.setContextMenu(contextMenu);
    }

    app.on("activate", () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      } else if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("before-quit", () => {
    stopHealthPolling();
    for (const abort of activeRuns.values()) abort();
    activeRuns.clear();
    cleanupTempMediaFiles();
    stopAllDashboards();
    stopSshTunnel();
    closeDbConnection();
    if (tray) {
      tray.destroy();
      tray = null;
    }
  });
}

function notifyConnectionConfigChanged(): void {
  mainWindow?.webContents.send(
    "connection-config-changed",
    getPublicConnectionConfig(),
  );
}

function notifyModelLibraryChanged(): void {
  mainWindow?.webContents.send("model-library-changed");
}

function openExternalUrl(rawUrl: unknown): void {
  if (!isAllowedExternalUrl(rawUrl)) {
    console.warn("[SECURITY] Blocked unsafe external URL");
    return;
  }
  shell.openExternal(rawUrl).catch((err) => {
    console.error("[SECURITY] Failed to open external URL:", err);
  });
}

function createWindow(): void {
  const rendererHtmlPath = join(__dirname, "../renderer/index.html");
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 900,
    title: APP_NAME,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : undefined,
    ...(process.platform === "darwin"
      ? {
          trafficLightPosition: { x: 16, y: 16 },
          vibrancy: "under-window",
          visualEffectState: "active",
        }
      : {}),
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: true,
    },
  });

  mainWindow.on("ready-to-show", () => mainWindow?.show());

  // macOS: close → hide to tray instead of quitting (issue #683)
  if (process.platform === "darwin") {
    mainWindow.on("close", (e) => {
      if (!tray) return; // tray destroyed → actually quitting
      e.preventDefault();
      mainWindow?.hide();
    });
  }
  mainWindow.webContents.once("did-finish-load", () => {
    if (OPEN_DEVTOOLS_ON_START) {
      mainWindow?.webContents.openDevTools({ mode: "detach" });
    }
  });

  // Let mid-turn gateway sudo/secret prompts parent their modal to this window.
  setGatewayPromptParent(() => mainWindow);

  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    console.error("[CRASH] Renderer process gone:", details.reason, details.exitCode);
  });
  mainWindow.webContents.on("console-message", (details) => {
    // Electron ≥35 passes a single event object (level is now a string);
    // the old positional `(event, level, message, line, sourceId)` signature
    // is deprecated.
    if (details.level === "error") {
      console.error(
        `[RENDERER ERROR] ${details.message} (${details.sourceId}:${details.lineNumber})`,
      );
    }
  });
  mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription) => {
    console.error("[LOAD FAIL]", errorCode, errorDescription);
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    openExternalUrl(details.url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (isAllowedAppNavigationUrl(url, rendererHtmlPath, is.dev ? process.env["ELECTRON_RENDERER_URL"] : undefined)) return;
    event.preventDefault();
    openExternalUrl(url);
  });
  mainWindow.webContents.on("will-attach-webview", (event, webPreferences, params) => {
    const isWebPreview = params.partition === "web-preview";
    if (!isAllowedWebviewUrl(params.src, isWebPreview)) {
      event.preventDefault();
      console.warn("[SECURITY] Blocked webview attachment for untrusted URL");
      return;
    }
    hardenWebviewPreferences(webPreferences);
  });
  mainWindow.webContents.on("context-menu", (_event, params) => {
    showChatContextMenu(mainWindow, params);
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(rendererHtmlPath);
  }
}
