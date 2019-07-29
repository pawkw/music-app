const electron = require('electron');
const {app, BrowserWindow} = electron;
const path = require('path');

let win;

app.on('ready', () => {
    win = new BrowserWindow({
        height: 500,
        width: 600,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.setMenu(null);
    win.loadFile('index.html');
})