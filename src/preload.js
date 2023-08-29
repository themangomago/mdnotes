const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs/promises");
const path = require("path");
const yaml = require("js-yaml");
const ejs = require("ejs");

contextBridge.exposeInMainWorld("electron", {
  fs,
  path,
  yaml,
  ejs,
  ipcRenderer, // Not sure if needed
  readDirectory: async (directoryPath) => {
    return await ipcRenderer.invoke("read-directory", directoryPath);
  },
  readFile: async (filePath) => {
    return await ipcRenderer.invoke("read-file", filePath);
  },
  readNotesData: async () => {
    return await ipcRenderer.invoke("read-notes-data");
  },
  bridge: async (channel, data) => {
    return await ipcRenderer.invoke(channel, data);
  },
});

ipcRenderer.on("display-note-content", (content) => {
  console.log("display-note-content called");
  console.log(window.showNoteContent);

  window.showNoteContent(content);
});
