<template>
  <div class="content">
    <h1>{{ $t('RPG Maker Translate') }}</h1>
    <BaseCard style="width: 600px">
      <div class="card-content">
        <!-- 遊戲資料夾路徑選擇（兩任務共用） -->
        <BaseFilePicker v-model="gameDirPath" type="folder" :button-text="$t('選擇資料夾')" />
        <BaseSelect
          v-model="selectedTasks"
          :options="taskOptions"
          :placeholder="$t('請選擇任務')"
        />

        <template v-if="selectedTasks === 'direct'">
          <div style="display: flex; gap: 10px; align-items: center; width: 100%">
            <BaseSelect
              v-model="fromLang"
              :options="langOptions"
              :placeholder="$t('來源語言')"
              style="flex: 1"
            />
            <span>→</span>
            <BaseSelect
              v-model="toLang"
              :options="langOptions"
              :placeholder="$t('目標語言')"
              style="flex: 1"
            />
          </div>
        </template>
        <template v-else-if="selectedTasks === 'select_json'">
          <div style="width: 100%; margin: 10px 0">
            <BaseFilePicker
              v-model="jsonFile"
              type="file"
              accept="application/json"
              :button-text="$t('選擇 JSON 檔案')"
              @change="onJsonFileChange"
            />
          </div>
        </template>

        <button class="start-btn" @click="onStartTranslate">
          {{ $t('開始翻譯') }}
        </button>
      </div>
    </BaseCard>
  </div>
  <ProgressSection :isTranslating="isTranslating" :stepStates="stepStates" />
  <SelectI18n />
</template>

<script setup>
import localeConfigs from '@/configs/i18nLocales.js';
import TASKS from '@/constants/TASKS.js';
import I18N_LOCALE from '@/constants/I18N_LOCALE.js';
import ProgressSection from '@/components/Base/ProgressSection.vue';
const isTranslating = ref(false);
const stepStates = ref([]); // 每個任務步驟的進度與 log

const {t: $t, locale} = useI18n();

const selectedTasks = ref('direct');
const gameDirPath = ref(''); // 資料夾路徑
const jsonFile = ref(null); // File for json
const jsonFileName = ref('');
const fromLang = ref(I18N_LOCALE.JA);
const toLang = ref(locale.value || I18N_LOCALE.ZH);

const taskOptions = computed(() => [
  {label: $t('直接翻譯'), value: 'direct'},
  {label: $t('選擇 json 來翻譯'), value: 'select_json'},
]);

const langOptions = computed(() =>
  localeConfigs.map((config) => ({label: config.name, value: config.code})),
);

function onJsonFileChange(file) {
  jsonFileName.value = file ? file.name : '';
}

let removeTaskProgressListener = null;

async function onStartTranslate() {
  isTranslating.value = true;
  const folder = gameDirPath.value;
  const language = {from: fromLang.value, to: toLang.value};
  const jsonFilePath = jsonFile.value ? jsonFile.value.path : '';
  const data = {task: TASKS.COPY_SDK_TO_DIR, folder, language, jsonFilePath};

  let steps = [];
  if (selectedTasks.value === 'direct') {
    steps = [
      {task: TASKS.COPY_SDK_TO_DIR, label: $t('複製 SDK 到資料夾')},
      {task: TASKS.CREATE_GAME_JSON, label: $t('產生 game json')},
      {task: TASKS.TRANSITION_JSON, label: $t('執行翻譯')},
      {task: TASKS.REPLACE_GAME_JSON, label: $t('覆蓋遊戲 json')},
    ];
  } else if (selectedTasks.value === 'select_json') {
    steps = [
      {task: TASKS.COPY_SDK_TO_DIR, label: $t('複製 SDK 到資料夾')},
      {task: TASKS.AI_JSON_TRANSLATE, label: $t('覆蓋遊戲 json')},
    ];
  }

  // 初始化每個步驟的進度與 log
  stepStates.value = steps.map((s) => ({
    label: s.label,
    progress: 0,
    logs: [$t('開始：') + s.label],
  }));

  // 註冊 IPC 監聽
  if (removeTaskProgressListener) removeTaskProgressListener();
  const handler = (payload) => {
    const {stepId, percent, log, type} = payload;
    if (stepStates.value[stepId]) {
      stepStates.value[stepId].progress = percent;
      if (log) stepStates.value[stepId].logs.push(log);
    }
  };
  window.electronAPI.onTaskProgress(handler);
  removeTaskProgressListener = () => {
    window.electronAPI.onTaskProgress(() => {}); // 清空 handler
  };

  // 順序執行任務
  for (let i = 0; i < steps.length; i++) {
    data.task = steps[i].task;
    data.stepId = i;
    await window.electronAPI.runTask(data);
  }
  isTranslating.value = false;
  removeTaskProgressListener();
}
</script>

<style scoped>
.start-btn {
  margin-top: 24px;
  padding: 10px 32px;
  background: linear-gradient(90deg, #4f8cff 0%, #6ed0ff 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 17px;
  cursor: pointer;
  transition: background 0.2s;
}
.start-btn:hover {
  background: linear-gradient(90deg, #357ae8 0%, #4fc3f7 100%);
}
.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  text-align: center;
}

.card-content {
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}
.progress-bar-outer {
  width: 80%;
  height: 18px;
  background: #e0e0e0;
  border-radius: 9px;
  overflow: hidden;
  margin-bottom: 8px;
}
.progress-bar-inner {
  height: 100%;
  background: linear-gradient(90deg, #4f8cff 0%, #6ed0ff 100%);
  transition: width 0.3s;
}
.progress-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}
.log-area {
  width: 80%;
  min-height: 60px;
  background: #222;
  color: #b6ffb6;
  font-size: 13px;
  border-radius: 6px;
  padding: 10px 14px;
  margin-top: 8px;
  font-family: 'Fira Mono', 'Consolas', monospace;
  box-sizing: border-box;
  max-height: 120px;
  overflow-y: auto;
}
.log-line {
  white-space: pre-wrap;
}
</style>
