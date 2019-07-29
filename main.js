const electron = require('electron');
const {app, BrowserWindow} = electron;

let win;

app.on('ready', () => {
    win = new BrowserWindow({
        height: 500,
        width: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('index.html');
})