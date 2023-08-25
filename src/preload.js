const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs/promises");
const path = require("path");
const yaml = require("js-yaml");

contextBridge.exposeInMainWorld("electron", {
  fs,
  path,
  yaml,
  readDirectory: async (directoryPath) => {
    return await ipcRenderer.invoke("read-directory", directoryPath);
  },
  readFile: async (filePath) => {
    return await ipcRenderer.invoke("read-file", filePath);
  },
  readNotesData: async () => {
    return await ipcRenderer.invoke("read-notes-data");
  },
});
