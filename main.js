// Bringing in couple things from electron 
const {app,BrowserWindow,ipcMain} = require('electron');

// Node js core modules for loading the index.html 
const path = require('path');
const url = require('url');

// Global variable to avoid closing of window when JS is garbage collected 
let win, playWindow;

// Function for creating BrowserWindow 
function createWindow(){

    // Creating Browser Window 
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        icon:__dirname+'/assets/icons/linux/icon.png'
    });
    win.maximize();

    // Load the index HTML page 
    win.loadURL(url.format({
        pathname:path.join(__dirname,"loaderpage.html"),
        protocol:"file:",
        slashes:true
    }));

    // Open devtools
    // win.webContents.openDevTools();

    // Setting win to null when window is closed 
    win.on('closed', () => {
        app.quit();
        win = null;
    });
}

// Create window when the app is ready 
app.on('ready',createWindow);



function createPlayWindow() {
    playWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        frame: false
    });

    playWindow.maximize();
    
    playWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'gameplay.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    playWindow.on('close', function(){
        playWindow = null;
    });
}


app.on('window-all-closed',() => {
    if(process.platform != "darwin"){
        app.quit();
    }
});

ipcMain.on('loggedin', function(e){
    console.log("loggedin ipcMain");
    win.loadURL(url.format({
        pathname:path.join(__dirname,"homepage.html"),
        protocol:"file:",
        slashes:true
    }));
});

ipcMain.on('signup', function(e){
    win.loadURL(url.format({
        pathname:path.join(__dirname,"register.html"),
        protocol:"file:",
        slashes:true
    }));
});

var currentGameDetails;
var playGameDetails;

ipcMain.on('dashboard', function(e, game_details){
    win.loadURL(url.format({
        pathname:path.join(__dirname,"dashboard.html"),
        protocol:"file:",
        slashes:true
    }));

    currentGameDetails = game_details;
    // setTimeout(() => {win.webContents.send('game_id', game_id);},500)
    
});

ipcMain.on('loggedout', function(e){
    win.loadURL(url.format({
        pathname:path.join(__dirname,"index.html"),
        protocol:"file:",
        slashes:true
    }));
});

ipcMain.on('get_game_id', function(e) {
    win.webContents.send('game_details', currentGameDetails);
    currentGameDetails = null;
});

ipcMain.on('play_game', function(e, game_details) {
    playGameDetails = game_details;
    console.log("play_game ipcMain : " + game_details.gameID);
    createPlayWindow();
});

ipcMain.on('play_game_detials', function(e) {
    playWindow.webContents.send('play_details', playGameDetails);
    playGameDetails = null;
});