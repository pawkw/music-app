const electron = require('electron');
const {app, BrowserWindow, ipcMain, Notification} = electron;
const path = require('path');

let win;
let notification;

// TODO: http://alexkatz.me/posts/building-a-custom-html5-audio-player-with-javascript/

app.on('ready', () => {
    win = new BrowserWindow({
        height: 500,
        width: 600,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: true
        }
    });
    // win.setMenu(null);
    win.loadFile('index.html');
});

ipcMain.on('playing', (event, song)=>{
    if(Notification.isSupported()) {
        notification = new Notification("Now playing", {
            body: song,
            silent: true,
        });
        notification.show();
    }
})