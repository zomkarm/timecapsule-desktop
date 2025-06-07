require('electron-reload')(__dirname, {
    // Optional: specify files/extensions to watch or ignore
    electron: require(`${__dirname}/node_modules/electron`)
  });
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const bcrypt = require('bcrypt');
const { getEntryByDate, saveEntry } = require('./src/database');

console.log(__dirname);
const store = new Store({ name: 'user',cwd: path.join(__dirname, 'config') });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Check if user exists in config store
  const userExists = store.get('username') && store.get('passwordHash');

  if (userExists) {
    mainWindow.loadFile('renderer/login.html');
  } else {
    mainWindow.loadFile('renderer/setup.html');
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});


// IPC Handlers for Setup and Login

ipcMain.handle('setup-user', async (event, { username, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  store.set('username', username);
  store.set('passwordHash', passwordHash);
  return { success: true };
});

ipcMain.handle('login-user', async (event, { username, password }) => {
  const storedUser = store.get('username');
  const storedHash = store.get('passwordHash');

  if (username !== storedUser) {
    return { success: false, message: 'Invalid username' };
  }

  const passwordMatch = await bcrypt.compare(password, storedHash);

  if (passwordMatch) {
    return { success: true };
  } else {
    return { success: false, message: 'Incorrect password' };
  }
});

ipcMain.handle('load-diary-entry', (event, date) => {
    const entry = getEntryByDate(date);
    return entry ? entry.content : '';
});
  
ipcMain.handle('save-diary-entry', (event, { date, content }) => {
    saveEntry(date, content);
    return { success: true };
});

ipcMain.handle('update-user-settings', async (event, { username, password }) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      store.set('username', username);
      store.set('passwordHash', passwordHash);
      return { success: true };
    } catch (err) {
      console.error('Error updating settings:', err);
      return { success: false };
    }
  });
  