# hei-jia-jia-backstage

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# RPG Maker Translate

## 介紹

這是一個基於 Electron + Vue3 的 RPG Maker 遊戲自動翻譯工具，支援資料夾與 JSON 檔案選擇、AI 輔助翻譯、進度條與即時 log 顯示。

## 主要功能

- 支援 RPG Maker MV/MZ 遊戲資料夾自動翻譯
- 可選擇資料夾或單一 JSON 檔案進行翻譯
- 支援多語言（如日文→繁中、英文→繁中等）
- 進度條與詳細 log 實時顯示
- Electron 桌面應用，跨平台

## 使用方式

1. 安裝依賴：
   ```bash
   npm install
   ```
2. 開發模式啟動：
   ```bash
   npm run dev
   ```
3. 打包桌面應用：
   ```bash
   npm run build && npm run electron:build
   ```
4. 執行應用程式，依照 UI 操作：
   - 選擇遊戲資料夾或 JSON 檔案
   - 選擇翻譯任務與語言
   - 點擊「開始翻譯」
   - 於畫面下方查看進度與 log

## 目錄結構

- `src/`：前端 Vue3 源碼
- `cli/tasks/`：Node.js 後端翻譯任務腳本
- `public/lang/`：語言包
- `main.js`、`preload.js`：Electron 主程序與 contextBridge

## 常見問題

- 若遇到「AI_JSON_TRANSLATE」當機，請確認遊戲資料夾與 JSON 檔案皆正確，且資料夾結構完整。
- 若有權限或檔案存取問題，請以管理員身份執行。

## 貢獻

歡迎 PR、issue 與建議！

---

本專案僅供學術與個人用途，請勿用於商業用途。

---
