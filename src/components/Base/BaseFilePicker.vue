<template>
  <div class="file-picker">
    <button class="file-btn" @click="onPick">
      <slot>{{ buttonText }}</slot>
    </button>
    <div v-if="displayLabel" class="file-label">{{ displayLabel }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Object],
  buttonText: {
    type: String,
    default: '選擇資料夾',
  },
  type: {
    type: String,
    default: 'folder', // 'file' or 'folder'
  },
  accept: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue', 'change']);
const picked = ref(props.modelValue || '');

const displayLabel = computed(() => {
  if (!picked.value) return '';
  if (typeof picked.value === 'string') return picked.value;
  if (picked.value.name) return picked.value.name;
  if (picked.value.path) return picked.value.path;
  return '';
});

async function onPick() {
  if (props.type === 'file') {
    if (window.electronAPI && window.electronAPI.selectFile) {
      const file = await window.electronAPI.selectFile([
        props.accept
          ? {
              name: props.accept.replace('application/', '').toUpperCase(),
              extensions: [props.accept.split('/')[1]],
            }
          : {name: 'All Files', extensions: ['*']},
      ]);
      if (file) {
        picked.value = file;
        emit('update:modelValue', file);
        emit('change', file);
      }
    }
  } else {
    if (window.electronAPI && window.electronAPI.selectFolder) {
      const path = await window.electronAPI.selectFolder();
      if (path) {
        picked.value = path;
        emit('update:modelValue', path);
        emit('change', path);
      }
    }
  }
}
</script>

<style scoped>
.file-picker {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
.file-btn {
  background: linear-gradient(90deg, #4f8cff 0%, #6ed0ff 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 6px;
  width: 100%;
}
.file-btn:hover {
  background: linear-gradient(90deg, #357ae8 0%, #4fc3f7 100%);
}
.file-label {
  font-size: 13px;
  color: #666;
  margin-left: 2px;
}
</style>
