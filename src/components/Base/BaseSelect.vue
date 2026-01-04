<template>
  <div class="base-select" :class="{disabled}">
    <div
      class="select-display"
      @click="toggleDropdown"
      :tabindex="disabled ? -1 : 0"
      @blur="closeDropdown"
      :aria-disabled="disabled"
    >
      <span v-if="selectedLabel">{{ selectedLabel }}</span>
      <span v-else class="placeholder">{{ placeholder }}</span>
      <svg class="icon" viewBox="0 0 20 20">
        <path
          d="M7 7l3 3 3-3"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <transition name="fade">
      <ul v-if="dropdownOpen" class="select-dropdown">
        <li
          v-for="option in options"
          :key="option.value"
          :class="{selected: option.value === modelValue, disabled: option.disabled}"
          @click="selectOption(option)"
          :aria-selected="option.value === modelValue"
          :aria-disabled="option.disabled"
        >
          <slot name="option" :option="option">
            {{ option.label }}
          </slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted, onBeforeUnmount} from 'vue';
const props = defineProps({
  modelValue: [String, Number, Boolean, Object, null],
  options: {
    type: Array,
    required: true,
    // [{ label: '中文', value: 'zh' }, ...]
  },
  placeholder: {
    type: String,
    default: '請選擇',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:modelValue']);

const dropdownOpen = ref(false);
const selectedLabel = computed(() => {
  const found = props.options.find((opt) => opt.value === props.modelValue);
  return found ? found.label : '';
});

function toggleDropdown() {
  if (props.disabled) return;
  dropdownOpen.value = !dropdownOpen.value;
}
function closeDropdown() {
  dropdownOpen.value = false;
}
function selectOption(option) {
  if (option.disabled) return;
  emit('update:modelValue', option.value);
  dropdownOpen.value = false;
}

// 點擊外部自動關閉
function handleClickOutside(e) {
  if (!e.target.closest('.base-select')) {
    dropdownOpen.value = false;
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.base-select {
  position: relative;
  width: 100%;
  font-size: 1em;
  user-select: none;
}
.select-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1.5px solid #b2f0e6;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  min-height: 38px;
  transition: border 0.2s;
}
.select-display:focus {
  outline: none;
  border-color: #42b983;
}
.base-select.disabled .select-display {
  background: #f3f3f3;
  color: #aaa;
  cursor: not-allowed;
}
.placeholder {
  color: #bbb;
}
.icon {
  width: 18px;
  height: 18px;
  margin-left: 8px;
  pointer-events: none;
}
.select-dropdown {
  position: absolute;
  left: 0;
  right: 0;
  top: 110%;
  background: #fff;
  border: 1.5px solid #b2f0e6;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(66, 185, 131, 0.1);
  z-index: 10;
  margin-top: 4px;
  padding: 4px 0;
  max-height: 220px;
  overflow-y: auto;
  animation: fadeIn 0.2s;
}
.select-dropdown li {
  padding: 8px 16px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  font-size: 1em;
}
.select-dropdown li.selected {
  background: #e6f9f2;
  color: #42b983;
  font-weight: 600;
}
.select-dropdown li.disabled {
  color: #bbb;
  cursor: not-allowed;
}
.select-dropdown li:not(.disabled):hover {
  background: #f0f9f6;
  color: #38a169;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
