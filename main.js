const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const path = require('path');
const createGameJson = require('./cli/tasks/createGameJson.js');
const transitionJson = require('./cli/tasks/transitionJson.js');
const replaceGameJson = require('./cli/tasks/replaceGameJson.js');
const replaceGameJsonByAiJson = require('./cli/tasks/replaceGameJsonByAiJson.js');

const {default: TASKS} = require('./src/constants/tasks.js');

function createWindow() {
  // 處理檔案選擇請求（只允許 JSON）
  ipcMain.handle('select-file', async (event, filters) => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openFile'],
      filters: filters || [{name: 'JSON', extensions: ['json']}],
    });
    if (result.canceled || !result.filePaths[0]) return null;
    const filePath = result.filePaths[0];
    const fileName = path.basename(filePath);
    return {path: filePath, name: fileName};
  });
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true, // 必須為 true
    },
  });
  win.loadFile('dist/index.html');

  // 處理資料夾選擇請求
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
    });
    if (result.canceled) return null;
    return result.filePaths[0];
  });

  // 處理多任務請求
  ipcMain.handle('run-task', async (event, {stepId, task, folder, language, jsonFilePath}) => {
    console.log(`Received task: ${task}, folder: ${folder}, language: ${JSON.stringify(language)}`);
    const fs = require('fs');
    const fse = require('fs-extra');
    try {
      let mod, fn;
      let lastPercent = 0;
      // stepId 用於標記前端的步驟索引，由前端傳入
      const sendProgress = (id, percent, log, type = 'info') => {
        event.sender.send('task-progress', {stepId: id, percent, log, type});
      };
      switch (task) {
        case TASKS.CREATE_GAME_JSON:
          sendProgress(stepId, 10, '開始產生 game json', 'step');
          await createGameJson({gameDir: folder, language});
          sendProgress(stepId, 100, 'game json 產生完成', 'done');
          return {success: true, message: 'Create Game JSON 完成'};
          break;

        case TASKS.TRANSITION_JSON:
          await transitionJson({
            language,
            onProgress: (percent, text) => {
              if (percent - lastPercent >= 1 || percent === 100) {
                // 只回傳進度與幾分之幾，不傳 log
                sendProgress(stepId, percent, '', 'step');
                lastPercent = percent;
              }
            },
          });
          sendProgress(stepId, 100, '', 'done');
          return {success: true, message: 'Transition Game JSON 完成'};
          break;
        case TASKS.REPLACE_GAME_JSON:
          sendProgress(stepId, 10, '開始覆蓋 game json', 'step');
          await replaceGameJson({gameDir: folder, language});
          sendProgress(stepId, 100, '覆蓋完成', 'done');
          return {success: true, message: 'Replace Game JSON 完成'};
          break;
        case TASKS.AI_JSON_TRANSLATE:
          await replaceGameJsonByAiJson({
            gameDir: folder,
            language,
            jsonFilePath,
            onProgress: (percent, text) => {
              if (percent - lastPercent >= 1 || percent === 100) {
                sendProgress(stepId, percent, text, 'step');
                lastPercent = percent;
              }
            },
          });
          sendProgress(stepId, 100, 'AI JSON 翻譯完成', 'done');
          return {success: true, message: 'AI JSON 翻譯完成'};
          break;
        case TASKS.COPY_SDK_TO_DIR:
          const sdkSrc = path.join(__dirname, 'nw-sdk');
          try {
            // 檢查來源與目標是否重疊
            const srcReal = fs.realpathSync(sdkSrc);
            const destReal = fs.realpathSync(folder);
            if (destReal === srcReal || destReal.startsWith(srcReal + path.sep)) {
              const errMsg = '目標資料夾不能是 SDK 來源本身或其子目錄，請選擇其他資料夾';
              sendProgress(stepId, 100, '複製 SDK 失敗: ' + errMsg, 'error');
              return {success: false, message: '複製 SDK 失敗: ' + errMsg};
            }
            sendProgress(stepId, 10, '開始複製 SDK', 'step');
            await fse.copy(sdkSrc, folder);
            sendProgress(stepId, 100, 'SDK 複製完成', 'done');
            return {success: true, message: 'SDK 已複製到資料夾'};
          } catch (err) {
            sendProgress(stepId, 100, '複製 SDK 失敗: ' + err.message, 'error');
            return {success: false, message: '複製 SDK 失敗: ' + err.message};
          }
        default:
          break;
      }
    } catch (err) {
      return {success: false, message: err.message};
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
