# webpack5 + vue

webpack5-st 为基础 + vue2

## 添加.vue

安装 vue2 相关依赖 vue-loader 最新 17 版本报错，使用 15 版本  
重新生成 eslint 配置文件选择 vue

```js
npm i vue@2 vue-loader@15 vue-template-compiler -D
npx eslint --init
```

src 清除，新建 App.vue index.js

```js
// App.vue

<template>
  <div>hello world</div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped></style>

```

```js
// main.js
import Vue from 'vue'
import App from '@/App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})
```

```js
// .eslintrc.js

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:prettier/recommended'],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {}
}
```

```js
// webpack.base.js
const { VueLoaderPlugin } = require('vue-loader')

module: {
  rules: [
    // ....
    {
      test: /\.vue$/,
      use: 'vue-loader'
    }
  ]
},

plugins: [
  // ...
  new VueLoaderPlugin()
],
```
