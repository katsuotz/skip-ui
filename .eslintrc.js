module.exports = {
  env: {
    node: true,
  },
  parser: "vue-eslint-parser",
  plugins: [
    "@typescript-eslint"
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript'
  ],
  ignorePatterns: [
    "package.*json",
    "node_modules/",
    "dist/",
    "**/*.min.js",
    "src/assets/",
    "*.d.ts",
  ],
  rules: {
    // enable additional rules
    'indent': ['error', 2],
    // override/add rules settings here, such as:
    'vue/no-unused-vars': 'error',
    "vue/v-on-event-hyphenation": 'off',
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-setup-props-destructure': 'off',
    'vue/no-v-html': 'off',
  }
}
