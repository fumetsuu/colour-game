const electron = require('electron')
const { app, BrowserWindow } = electron

require('electron-reload')(__dirname, {})

let mainWindow

app.on('ready', () => {
    let mainWindow = new BrowserWindow({ width: 800, height: 600 })
    mainWindow.setTitle('colour-game')
    mainWindow.loadURL('file://'+__dirname+'/app/index.html')
})