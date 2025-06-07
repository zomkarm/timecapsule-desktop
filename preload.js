const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  setupUser: (data) => ipcRenderer.invoke('setup-user', data),
  loginUser: (data) => ipcRenderer.invoke('login-user', data),
  loadDiaryEntry: (date) => ipcRenderer.invoke('load-diary-entry', date),
  saveDiaryEntry: (date, content) => ipcRenderer.invoke('save-diary-entry', { date, content }),
  updateUserSettings: (data) => ipcRenderer.invoke('update-user-settings', data),
});
