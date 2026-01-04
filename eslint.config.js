import {defineConfig} from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginOxlint from 'eslint-plugin-oxlint';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import vueI18n from '@intlify/eslint-plugin-vue-i18n';
import fs from 'fs';
import path from 'path';

// 動態讀取 auto-import 生成的全域變數
let autoImportGlobals = {};

try {
  const autoImportPath = path.resolve('./.eslintrc-auto-import.json');

  if (fs.existsSync(autoImportPath)) {
    const autoImportConfig = JSON.parse(fs.readFileSync(autoImportPath, 'utf-8'));

    autoImportGlobals = autoImportConfig.globals || {};
  }
} catch (_error) {
  // 如果讀取失敗，使用空對象，不影響其他配置
}

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/*.min.js',
    ],
  },

  {
    name: 'app/language-options',
    languageOptions: {
      ecmaVersion: 2025,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2025,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // JavaScript 嚴格規則
  js.configs.recommended,

  // Vue 最嚴格配置
  ...pluginVue.configs['flat/base'],
  ...pluginVue.configs['flat/essential'],
  ...pluginVue.configs['flat/strongly-recommended'],
  ...pluginVue.configs['flat/recommended'],

  // i18n
  ...vueI18n.configs.recommended,

  // Oxlint 推薦配置
  ...pluginOxlint.configs['flat/recommended'],

  {
    name: 'app/strict-rules',
    rules: {
      // ===============================
      // 🚨 錯誤預防規則 (Error Prevention)
      // ===============================

      // 控制台和調試
      // 警告使用 console.log (開發時允許，生產環境應移除)
      'no-console': 'warn',
      // 禁止使用 debugger 語句
      'no-debugger': 'error',

      // 變數管理
      // 禁止未使用的變數 (以 _ 開頭的除外)
      'no-unused-vars': [
        'error',
        {
          // 忽略以 _ 開頭的參數
          argsIgnorePattern: '^_',
          // 忽略以 _ 開頭的變數
          varsIgnorePattern: '^_',
          // 忽略以 _ 開頭的 catch 錯誤
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // 禁止使用未定義的變數
      'no-undef': 'error',
      // 暫時關閉變數遮蔽檢查 (因為很多現有代碼有此問題)
      'no-shadow': 'off',
      // 禁止將變數初始化為 undefined
      'no-undef-init': 'error',
      // 暫時允許使用 undefined (因為現有代碼需要)
      'no-undefined': 'off',

      // 代碼錯誤檢測
      // 禁止不可達的代碼
      'no-unreachable': 'error',
      // 禁止常量條件表達式
      'no-constant-condition': 'error',
      // 禁止重複的 case 標籤
      'no-duplicate-case': 'error',
      // 禁止空的程式碼區塊
      'no-empty': ['error', {allowEmptyCatch: false}],
      // 禁止不必要的布林轉換
      'no-extra-boolean-cast': 'error',
      // 禁止不必要的分號
      'no-extra-semi': 'error',
      // 禁止對 function 聲明重新賦值
      'no-func-assign': 'error',
      // 禁止在嵌套的區塊中出現變數聲明或 function 聲明
      'no-inner-declarations': 'error',
      // 禁止無效的正則表達式字符串
      'no-invalid-regexp': 'error',
      // 禁止在字符串和註釋之外不規則的空白
      'no-irregular-whitespace': 'error',
      // 禁止把全域物件作為函數調用
      'no-obj-calls': 'error',
      // 禁止稀疏陣列
      'no-sparse-arrays': 'error',
      // 要求使用 isNaN() 檢查 NaN
      'use-isnan': 'error',
      // 強制 typeof 表達式與有效的字符串進行比較
      'valid-typeof': 'error',

      // ===============================
      // 🎯 最佳實踐規則 (Best Practices)
      // ===============================

      // 條件和比較
      // 強制所有控制語句使用一致的括號風格
      curly: ['error', 'all'],
      // 強制盡可能地使用點號
      'dot-notation': 'error',
      // 要求使用 === 和 !==
      eqeqeq: ['error', 'always'],

      // 危險操作防護
      // 禁用 alert、confirm 和 prompt
      'no-alert': 'error',
      // 禁用 arguments.caller 或 arguments.callee
      'no-caller': 'error',
      // 禁用 eval()
      'no-eval': 'error',
      // 禁止擴展原生類型
      'no-extend-native': 'error',
      // 禁止不必要的 .bind() 調用
      'no-extra-bind': 'error',
      // 禁止 case 語句落空
      'no-fallthrough': 'error',
      // 禁止數字字面量中使用前導和末尾小數點
      'no-floating-decimal': 'error',
      // 禁止使用類似 eval() 的方法
      'no-implied-eval': 'error',
      // 禁用 __iterator__ 屬性
      'no-iterator': 'error',
      // 禁用標籤語句
      'no-labels': 'error',
      // 禁用不必要的嵌套塊
      'no-lone-blocks': 'error',
      // 禁止在循環中出現 function 聲明和表達式
      'no-loop-func': 'error',
      // 禁止使用多個空格
      'no-multi-spaces': 'error',
      // 禁止使用多行字符串
      'no-multi-str': 'error',
      // 禁止使用 new 以避免產生副作用
      'no-new': 'error',
      // 禁止對 Function 對象使用 new 操作符
      'no-new-func': 'error',
      // 禁止對 String，Number 和 Boolean 使用 new 操作符
      'no-new-wrappers': 'error',
      // 禁用八進制字面量
      'no-octal': 'error',
      // 禁止在字符串中使用八進制轉義序列
      'no-octal-escape': 'error',
      // 禁用 __proto__ 屬性
      'no-proto': 'error',
      // 禁止多次聲明同一變數
      'no-redeclare': 'error',
      // 禁止在 return 語句中使用賦值語句
      'no-return-assign': 'error',
      // 禁止使用 javascript: url
      'no-script-url': 'error',
      // 禁止自身比較
      'no-self-compare': 'error',
      // 禁用逗號操作符
      'no-sequences': 'error',
      // 禁止拋出非異常字面量
      'no-throw-literal': 'error',
      // 禁止出現未使用的表達式
      'no-unused-expressions': 'error',
      // 禁用 void 操作符
      'no-void': 'error',
      // 禁用 with 語句
      'no-with': 'error',
      // 強制在parseInt()使用基數參數
      radix: 'error',
      // 要求所有的 var 聲明出現在它們所在的作用域頂部
      'vars-on-top': 'error',
      // 要求 IIFE 使用括號括起來
      'wrap-iife': ['error', 'any'],
      // 要求或禁止 "Yoda" 條件
      yoda: 'error',

      // ===============================
      // 📝 代碼風格規則 (Stylistic Issues)
      // ===============================

      // 嚴格模式
      // 禁止使用嚴格模式指令 (模組自動為嚴格模式)
      strict: ['error', 'never'],

      // 變數聲明
      // 禁止 catch 子句的參數與外層作用域中的變數同名
      'no-catch-shadow': 'error',
      // 禁止刪除變數
      'no-delete-var': 'error',
      // 不允許標籤與變數同名
      'no-label-var': 'error',
      // 禁止將標識符定義為受限的名字
      'no-shadow-restricted-names': 'error',

      // 空格和格式
      // 強制陣列方括號中使用一致的空格
      'array-bracket-spacing': ['error', 'never'],
      // 強制在單行代碼塊中使用一致的空格
      'block-spacing': 'error',
      // 強制在代碼塊中使用一致的大括號風格
      'brace-style': ['error', '1tbs'],
      // 要求或禁止末尾逗號
      'comma-dangle': ['error', 'always-multiline'],
      // 強制在逗號前後使用一致的空格
      'comma-spacing': ['error', {before: false, after: true}],
      // 強制使用一致的逗號風格
      'comma-style': ['error', 'last'],
      // 強制在計算的屬性的方括號中使用一致的空格
      'computed-property-spacing': ['error', 'never'],
      // 要求或禁止文件末尾存在空行
      'eol-last': 'error',
      // 強制在對象字面量的屬性中鍵和值之間使用一致的間距
      'key-spacing': ['error', {beforeColon: false, afterColon: true}],
      // 禁止空格和 tab 的混合縮進
      'no-mixed-spaces-and-tabs': 'error',
      // 禁止出現多行空行
      'no-multiple-empty-lines': ['error', {max: 2}],
      // 禁用行尾空格
      'no-trailing-spaces': 'error',
      // 強制在大括號中使用一致的空格
      'object-curly-spacing': ['error', 'never'],
      // 強制在塊之前使用一致的空格
      'space-before-blocks': 'error',
      // 強制在 function的左括號之前使用一致的空格
      'space-before-function-paren': ['error', 'never'],
      // 強制在圓括號內使用一致的空格
      'space-in-parens': ['error', 'never'],
      // 要求操作符周圍有空格
      'space-infix-ops': 'error',
      // 強制在一元操作符前後使用一致的空格
      'space-unary-ops': ['error', {words: true, nonwords: false}],

      // 命名規範
      // 強制使用駱駝拼寫法命名約定
      camelcase: ['error', {properties: 'never'}],
      // 暫時關閉構造函數首字母大寫 (Element Plus 組件衝突)
      'new-cap': 'off',

      // 其他風格
      // 當獲取當前執行環境的上下文時，強制使用一致的命名
      'consistent-this': 'error',
      // 暫時關閉函數命名要求 (箭頭函數不需要)
      'func-names': 'off',
      // 暫時關閉函數聲明風格要求 (現代 JS 使用多種風格)
      'func-style': 'off',
      // 要求在註釋周圍有空行
      'lines-around-comment': 'error',
      // 強制回調函數最大嵌套深度
      'max-nested-callbacks': ['error', 4],
      // 強制或禁止調用無參構造函數時有圓括號
      'new-parens': 'error',
      // 要求或禁止 var 聲明語句後有一行空行
      'newline-after-var': 'error',
      // 禁用 Array 構造函數
      'no-array-constructor': 'error',
      // 禁止在代碼行後使用內聯註釋
      'no-inline-comments': 'error',
      // 禁止 if 作為唯一的語句出現在 else 語句中
      'no-lonely-if': 'error',
      // 禁用嵌套的三元表達式
      'no-nested-ternary': 'error',
      // 禁用 Object 的構造函數
      'no-new-object': 'error',
      // 禁止 function 標識符和括號之間出現空格
      'no-spaced-func': 'error',
      // 允許三元操作符
      'no-ternary': 'off',
      // 暫時允許標識符中有懸空下劃線 (__dirname 等需要)
      'no-underscore-dangle': 'off',
      // 強制函數中的變數要麼一起聲明要麼分開聲明
      'one-var': ['error', 'never'],
      // 要求或禁止在可能的情況下使用簡化的賦值操作符
      'operator-assignment': ['error', 'always'],
      // 要求或禁止在代碼塊中填充空行
      'padded-blocks': ['error', 'never'],
      // 要求對象字面量屬性名稱用引號括起來
      'quote-props': ['error', 'as-needed'],
      // 強制使用一致的反勾號、雙引號或單引號
      quotes: ['error', 'single'],
      // 要求或禁止使用分號代替 ASI
      semi: ['error', 'always'],
      // 強制分號之前和之後使用一致的空格
      'semi-spacing': ['error', {before: false, after: true}],
      // 要求同一個聲明塊中的變數按順序排列
      'sort-vars': 'error',
      // 強制關鍵字後面使用一致的空格
      'space-after-keywords': 'error',
      // 強制在 return、throw、case 後面使用一致的空格
      'space-return-throw-case': 'error',
      // 強制在註釋中 // 或 /* 使用一致的空格
      'spaced-comment': 'error',
      // 要求正則表達式被括號括起來
      'wrap-regex': 'error',

      // 縮進 (在 Vue 文件中會被覆蓋)
      // 強制使用一致的縮進
      indent: ['error', 2, {SwitchCase: 1}],

      // ===============================
      // 🎨 Vue 特定規則 (Vue-specific Rules)
      // ===============================

      // Vue 基礎錯誤預防
      // 禁止在模板中使用未定義的變數
      'vue/no-unused-vars': 'error',
      // 禁止註冊但未使用的組件
      'vue/no-unused-components': 'error',
      // 要求 v-for 指令的元素有 key 屬性
      'vue/require-v-for-key': 'error',
      // 禁止重複的屬性
      'vue/no-duplicate-attributes': 'error',
      // 禁止模板中的變數遮蔽外層作用域的變數
      'vue/no-template-shadow': 'error',

      // Vue 組件和 Props 規範
      // 暫時關閉 prop 類型要求 (現有代碼需要大量修改)
      'vue/require-prop-types': 'off',
      // 暫時關閉 prop 預設值要求
      'vue/require-default-prop': 'off',
      // 強制模板中的組件名使用 PascalCase
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      // 強制 prop 名稱使用駱駝命名法
      'vue/prop-name-casing': ['error', 'camelCase'],
      // 強制組件定義名稱使用 PascalCase
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      // 強制自定義事件名稱使用駱駝命名法
      'vue/custom-event-name-casing': ['error', 'camelCase'],

      // Vue 3 Composition API 規範
      // 強制 defineProps 和 defineEmits 的順序
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits'],
        },
      ],

      // Vue 模板規範
      // 要求 button 元素有明確的 type 屬性
      'vue/html-button-has-type': 'error',
      // 強制 HTML 註釋的內容周圍有空格
      'vue/html-comment-content-spacing': 'error',
      // 強制 HTML 註釋的一致縮進
      'vue/html-comment-indent': 'error',
      // 禁止在 class 屬性中使用多個對象
      'vue/no-multiple-objects-in-class': 'error',
      // 暫時允許內聯樣式 (某些動態樣式需要)
      'vue/no-static-inline-styles': 'off',
      // 禁止在模板中使用 target="_blank" 而不使用 rel="noopener noreferrer"
      'vue/no-template-target-blank': 'error',

      // Vue 進階規範
      // 暫時關閉組件文件名匹配 (文件結構需要調整)
      'vue/match-component-file-name': 'off',
      // 要求多行屬性之間有換行符
      'vue/new-line-between-multi-line-property': 'error',
      // 禁止布林 prop 有預設值
      'vue/no-boolean-default': 'error',
      // 禁止重複的屬性繼承
      'vue/no-duplicate-attr-inheritance': 'error',
      // 禁止空的組件塊
      'vue/no-empty-component-block': 'error',
      // 禁止組件選項中可能的拼寫錯誤
      'vue/no-potential-component-option-typo': 'error',
      // 禁止使用保留的組件名稱
      'vue/no-reserved-component-names': 'error',
      // 禁止特定的語法
      'vue/no-restricted-syntax': 'error',
      // 禁止在 beforeRouteEnter 中使用 this
      'vue/no-this-in-before-route-enter': 'error',
      // 暫時關閉未定義組件檢查 (Element Plus 自動導入)
      'vue/no-undef-components': 'off',
      // 暫時關閉未定義屬性檢查 (需要更好的類型定義)
      'vue/no-undef-properties': 'off',
      // 禁止不支援的 Vue.js 語法
      'vue/no-unsupported-features': 'error',
      // 禁止未使用的屬性
      'vue/no-unused-properties': 'error',
      // 禁止未使用的 refs
      'vue/no-unused-refs': 'error',
      // 禁止不必要的插值
      'vue/no-useless-mustaches': 'error',
      // 禁止不必要的 v-bind
      'vue/no-useless-v-bind': 'error',
      // 要求模板塊之間有空行
      'vue/padding-line-between-blocks': 'error',
      // 優先使用單獨的靜態 class
      'vue/prefer-separate-static-class': 'error',
      // 優先使用 true 屬性的簡寫
      'vue/prefer-true-attribute-shorthand': 'error',
      // 要求組件直接導出
      'vue/require-direct-export': 'error',
      // 暫時關閉 emit 驗證器要求
      'vue/require-emit-validator': 'off',
      // 暫時關閉 expose 要求
      'vue/require-expose': 'off',
      // 暫時關閉組件名稱屬性要求
      'vue/require-name-property': 'off',
      // Vue script 塊的縮進規則
      'vue/script-indent': ['error', 2, {baseIndent: 0}],
      // 強制靜態 class 名稱的順序
      'vue/static-class-names-order': 'error',
      // 強制 v-for 指令的分隔符風格
      'vue/v-for-delimiter-style': 'error',
      // 強制有效的 nextTick 函數調用
      'vue/valid-next-tick': 'error',
    },
  },

  {
    name: 'app/eslint-i18n-config-overrides',
    settings: {
      'vue-i18n': {
        localeDir: './public/lang/*.json',
        messageSyntaxVersion: '^11.1.11',
      },
    },
    rules: {
      // i18n 相關規則
      '@intlify/vue-i18n/no-missing-keys': 'error',
      '@intlify/vue-i18n/no-raw-text': 'warn',
      '@intlify/vue-i18n/no-duplicate-keys-in-locale': 'error',
      // 暫時關閉鍵值格式要求，因為中文項目通常使用中文作為鍵值
      '@intlify/vue-i18n/key-format-style': 'off',
      '@intlify/vue-i18n/no-dynamic-keys': 'error',
      '@intlify/vue-i18n/no-unused-keys': 'error',
      '@intlify/vue-i18n/prefer-linked-key-with-paren': 'error',
      '@intlify/vue-i18n/prefer-sfc-lang-attr': 'error',
      '@intlify/vue-i18n/sfc-locale-attr': 'error',
      '@intlify/vue-i18n/valid-message-syntax': 'error',
    },
  },

  {
    name: 'app/eslint-config-overrides',
    files: ['eslint.config.js'],
    rules: {
      // 在 ESLint 配置文件中允許內聯註釋
      'no-inline-comments': 'off',
      // 在配置文件中允許較長的文件
      'max-lines': 'off',
    },
  },

  {
    name: 'app/cli-overrides',
    files: ['cli/*.js', 'cli/**/*.js', './*.js'],
    rules: {
      'no-console': 'off',
    },
  },

  {
    name: 'app/vue-overrides',
    files: ['**/*.vue'],
    rules: {
      // Vue 文件特定的覆蓋規則
      // 關閉 JavaScript 縮進檢查，使用 Vue 特定的縮進規則
      indent: 'off',
      // Vue script 塊的縮進規則
      'vue/script-indent': ['error', 2, {baseIndent: 0}],
      // 在 Vue 文件中放寬變數聲明後的空行要求
      'newline-after-var': 'off',
      // 關閉內聯註釋限制，Vue 文件中經常需要簡短註釋
      'no-inline-comments': 'off',
    },
  },

  {
    name: 'app/globals',
    languageOptions: {
      globals: {
        // 手動配置的基礎全域變數
        useHead: 'readonly',
        useSeoMeta: 'readonly',

        // 動態載入的 auto-import 全域變數
        ...autoImportGlobals,
      },
    },
  },

  // 保持格式化跳過配置在最後
  skipFormatting,
]);
