// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const ipcMain = require('electron').ipcMain;
const electron = require('electron');
const Datastore = require('nedb')
import { join } from 'path'
const Menu = electron.Menu;
const Tray = electron.Tray;
var globalShortcut = require('electron').globalShortcut;
const { clipboard } = require('electron')
import { getColorHexRGB } from './electronColorPicker' // TODO: NOTE: this can not be directly packed for release, check below
// import { Datastore } from './electronColorPicker' // TODO: NOTE: this can not be directly packed for release, check below

const PATH_HTML_FILE = join(__dirname, '../renderer/index.html')
const PATH_PRELOAD = join(__dirname, '../renderer/preload.js')
var db = new Datastore({ filename: 'path/to/datafile', autoload: true });
var userInfo = {
  getColor:'alt+q',               //取色快捷键
  oldGetColor:'alt+q',            //旧取色快捷键
  copyOption: "1",                //复制选项
  titleColorChangeClick: true,    //点击标题栏切换颜色
  ColorChangeAuto: true,          //标题栏颜色跟随变化
  Id:'userInfo'
}
// db.remove({}, { multi: true }, function (err, numRemoved) {
// });

// 初始化储存用户信息 
db.find({Id:'userInfo'},function (err, docs) {
  console.log(docs)
  if(docs.length === 0){
    db.insert(userInfo)
  }else{

  }
})
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
app.commandLine.appendSwitch('remote-debugging-port', '8315');
app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1');
ipcMain.on('getColor', function() {
  getColor()
});
// 最小化
ipcMain.on('titleMin', function() {
  mainWindow.minimize()
});
// 关闭
ipcMain.on('titleClose', function() {
  mainWindow.close()
  mainWindow = null
});
// 最大化
ipcMain.on('titleMax', function(event) {
  if(mainWindow.isMaximized()){
    mainWindow.unmaximize()
    
  }else{
    mainWindow.maximize()
    event.sender.send('titleMax-reply', "1") 
  }
});


ipcMain.on('changeGetColor', function(event, oldValue, newValue) {
  globalShortcut.register(newValue, function() {
    getColor()
  }) 
  globalShortcut.unregister(oldValue);
});

function init () {
  createWindow()
  globalShortcut.register('alt+q', function() {
    getColor()
  })  
  creatTray()


}
// 创建托盘
function creatTray(){
  var appTray = null;
    //系统托盘右键菜单
    var trayMenuTemplate = [
      {
          label: '退出',
          click: function () {
              //ipc.send('close-main-window');
               app.quit();
          }
      }
  ];

  //系统托盘图标目录
  var trayIcon = join(__dirname, '../static/img/logo.png');

  appTray = new Tray(join(trayIcon));
  //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  //设置此托盘图标的悬停提示内容
  appTray.setToolTip('神奇的颜色工具');

  //设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu);
  appTray.on("click", function(){
    var Windows =  BrowserWindow.getAllWindows()
    if(Windows.length == 0){
      createWindow()
    }
  }) 
}
function getColor(){
  if (mainWindow === null) createWindow()
  getColorHexRGB().then( e => {
    mainWindow.webContents.send('color-messages', e);
    console.log(e)
    mainWindow.show()
  }).catch((error) => {
    console.warn(`[ERROR] getColor`, error)
    return ''
  })
}
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 550,
    height: 480,
    minWidth:550,
    minHeight:480, 
    frame: false,
    // resizable:false,
    title:'Magical Color Tool',
    webPreferences: {
      preload: PATH_PRELOAD,
      webSecurity: false
    }
  })
  // mainWindow.setResizable(false)
  // mainWindow.setMenu(null)
  mainWindow.on('maximize', function() {
    mainWindow.webContents.send('titleMax-reply', "1") 
  })
  mainWindow.on('unmaximize', function() {
    mainWindow.webContents.send('titleMax-reply', "0") 
  })
  // and load the index.html of the app.
  mainWindow.loadFile(PATH_HTML_FILE)
  mainWindow.on('maximize', function() {
    console.log("12345")
  })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') app.quit()
  // globalShortcut.unregister('alt+q');

  // Unregister all shortcuts.
  // globalShortcut.unregisterAll();
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
