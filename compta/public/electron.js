const { app, BrowserWindow } = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const windowContainer = { ref: null };

// In Electron >=14, enableRemoteModule is replace by following to access remote
require("@electron/remote/main").initialize();

const createWindow = (container) => {
    // Create the browser window.
    browserWindow = new BrowserWindow({
        show: false,
        icon:__dirname + '/icon.png',
        webPreferences: {
            nodeIntegration: true, // used to access require()
            contextIsolation: false, // used to access require()
            nodeIntegrationInWorker: true, // <---  for web workers
        }
    });
    browserWindow.maximize();
    browserWindow.show();


    // and load the index.html of the app.
    if (process.env.REACT_APP_URL) {
        browserWindow.loadURL(process.env.REACT_APP_URL);
    } else {
        browserWindow.loadFile(path.join(__dirname, "../build/index.html"));
    }

    // Open the DevTools.
    if (process.env.CHROME_DEV_TOOLS && process.env.CHROME_DEV_TOOLS === 'true') {
        browserWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    browserWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        container.ref = null
    });

    // In Electron >=14, enableRemoteModule is replace by following to access remote
    require("@electron/remote/main").enable(browserWindow.webContents);

    return browserWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => { windowContainer.ref = createWindow(windowContainer); });

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windowContainer.ref === null) {
        windowContainer.ref = createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

module.exports.windowContainer = windowContainer;
