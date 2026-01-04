<template>
  <div v-if="showProgress" class="progress-section">
    <div v-if="currentStep" class="step-card">
      <div class="step-header">
        <span v-if="currentStepIndex >= 0" class="step-index">STEP {{ currentStepIndex + 1 }}</span>
        <span class="step-label">{{ currentStep.label }}</span>
      </div>
      <div class="progress-bar-outer">
        <div class="progress-bar-inner" :style="{width: currentStep.progress + '%'}">
          <span class="progress-text">{{ currentStep.progress }}%</span>
        </div>
      </div>
      <div class="log-area" v-if="currentStep.logs && currentStep.logs.length" ref="logAreaRef">
        <div
          v-for="(msg, lidx) in currentStep.logs"
          :key="lidx"
          :class="['log-line', getLogType(msg)]"
        >
          {{ msg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch, nextTick} from 'vue';

const logAreaRef = ref(null);

const props = defineProps({
  isTranslating: Boolean,
  stepStates: Array,
});

function getLogType(msg) {
  if (typeof msg === 'string') {
    if (msg.includes('錯誤') || msg.toLowerCase().includes('error')) return 'log-error';
    if (msg.includes('完成') || msg.toLowerCase().includes('done')) return 'log-done';
    if (msg.includes('開始') || msg.toLowerCase().includes('start')) return 'log-start';
  }
  return '';
}

const currentStepIndex = computed(() => {
  // 強制依賴每個 progress，確保響應
  const progresses = props.stepStates?.map((s) => s.progress) || [];
  if (!props.stepStates || props.stepStates.length === 0) return 0;
  // 找到第一個未完成的步驟
  const idx = props.stepStates.findIndex((s) => s.progress < 100);
  if (idx === -1) return props.stepStates.length - 1; // 全部完成時顯示最後一個
  return idx;
});
const currentStep = computed(() => {
  if (!props.stepStates || props.stepStates.length === 0) return null;
  const idx = currentStepIndex.value;
  if (idx === -1) return null;
  return props.stepStates[idx];
});

// 自動捲動 log 區域
watch(
  () => currentStep.value && currentStep.value.logs && currentStep.value.logs.length,
  async () => {
    await nextTick();
    if (logAreaRef.value) {
      logAreaRef.value.scrollTop = logAreaRef.value.scrollHeight;
    }
  },
);
const showProgress = computed(() => {
  // 只要有未完成的步驟就顯示
  if (!props.stepStates || props.stepStates.length === 0) return false;
  return currentStep.value !== null && props.isTranslating;
});
</script>

<style scoped>
.progress-section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0;
  padding: 0;
  transition: background 0.3s;
}
.step-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(80, 120, 255, 0.18);
  padding: 36px 48px 28px 48px;
  min-width: 340px;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0;
  animation: popin 0.3s cubic-bezier(0.4, 2, 0.3, 1);
}

@keyframes popin {
  0% {
    transform: scale(0.92);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.step-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.step-index {
  background: linear-gradient(90deg, #4f8cff 0%, #6ed0ff 100%);
  color: #fff;
  font-weight: bold;
  border-radius: 8px;
  padding: 2px 12px;
  font-size: 13px;
  letter-spacing: 1px;
}
.step-label {
  font-size: 18px;
  font-weight: 600;
  color: #357ae8;
}
.progress-bar-outer {
  width: 100%;
  height: 22px;
  background: #e0e0e0;
  border-radius: 11px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(80, 120, 255, 0.08);
}
.progress-bar-inner {
  height: 100%;
  background: linear-gradient(90deg, #4f8cff 0%, #6ed0ff 100%);
  transition: width 0.5s cubic-bezier(0.4, 2, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  font-size: 15px;
  color: #fff;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 0 0 8px #6ed0ff44;
}
.progress-text {
  text-shadow: 0 1px 4px #357ae8aa;
}
.log-area {
  width: 100%;
  min-height: 60px;
  background: #222;
  color: #b6ffb6;
  font-size: 14px;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 10px;
  font-family: 'Fira Mono', 'Consolas', monospace;
  box-sizing: border-box;
  max-height: 140px;
  overflow-y: auto;
  box-shadow: 0 2px 8px #222a;
}
.log-line {
  white-space: pre-wrap;
  margin-bottom: 2px;
  transition: color 0.2s;
}
.log-line.log-error {
  color: #ff6b6b;
  font-weight: bold;
}
.log-line.log-done {
  color: #6ed0ff;
}
.log-line.log-start {
  color: #ffe066;
}
</style>
