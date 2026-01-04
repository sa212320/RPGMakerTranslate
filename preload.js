const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectFile: (filters) => ipcRenderer.invoke('select-file', filters),
  runTask: (args) => ipcRenderer.invoke('run-task', args),
  onTaskProgress: (cb) => ipcRenderer.on('task-progress', (event, payload) => cb(payload)),
});
