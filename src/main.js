const { app, BrowserWindow, ipcMain } = require("electron");
const { join } = require("path");
const fs = require("fs/promises");
const { format } = require("url");
const yaml = require("js-yaml");
const { scanNotes } = require("./notes.js");

let mainWindow;

// An array to store parsed metadata and file paths
let notesData;

app.on("ready", async () => {
  notesData = await scanNotes();
  console.log(notesData);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  const indexPath = format({
    pathname: join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true,
  });

  mainWindow.loadURL(indexPath);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

ipcMain.handdle("test", () => {
  console.log("test");
});

ipcMain.handle("get-notes", () => {
  return notesData;
});

ipcMain.handle("read-config", async () => {
  try {
    const configFile = await fsPromises.readFile(
      join(__dirname, "config.yaml"),
      "utf-8"
    );
    const config = yaml.load(configFile);
    return config;
  } catch (error) {
    console.error("Error reading config file:", error);
    return null;
  }
});

ipcMain.on("login-success", () => {
  // Handle successful login, e.g., show main app content
  mainWindow.webContents.send("show-main-content");
});

ipcMain.handle("read-notes-data", () => {
  return notesData;
});

ipcMain.handle("read-directory", async (_, directoryPath) => {
  try {
    const files = await fs.readdir(directoryPath);
    return files;
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
});

ipcMain.handle("read-file", async (_, filePath) => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
});
