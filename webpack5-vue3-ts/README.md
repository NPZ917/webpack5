# webpack5 + vue3 + ts

以 webpack5-st 为基础 + vue3 + ts

## vue + ts 依赖

```js
npm i vue -S
npm i typescript -D
```

## 结构、文件修改

清除 src 下文件，新建 App.vue 和 main.ts，入口文件调整

```js
// App.vue
<template>
  <div>{{ num }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const num = 1
    return {
      num
    }
  }
})
</script>

<style scoped></style>

```

```js
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

```js
// webpack.base.js
 entry: path.resolve(__dirname, '../src/main.ts'),
```

## 配置 loader

```js
npm i vue-loader @vue/compiler-sfc -D
```

```js
// webpack.base.js
const { VueLoaderPlugin } = require('vue-loader')

modules: [
  rules: [
    // ...
    {
      test: /\.vue$/,
      use: 'vue-loader'
    },
  ]
]
plugins: [
  // ...
  new VueLoaderPlugin()
]
```

ts 编译

```js
npm i @babel/preset-typescript -D
```

```js
// webpack.base.js

{
  test: /\.(j|t)s$/,
  exclude: /node_modules/,
  include: [path.resolve(__dirname, '../src')],
  use: ['thread-loader', 'babel-loader']
},
```

```js
// babel.config.js
// babel.config.js
module.exports = {
  // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
  presets: [
    [
      '@babel/preset-env',
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        // "targets": {
        //  "chrome": 35,
        //  "ie": 9
        // },
        useBuiltIns: 'usage', // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        corejs: 3 // 配置使用core-js使用的版本
      }
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true //支持所有文件扩展名
      }
    ]
  ]
}
```

解决 import App from './App.vue' 报错 找不到

- src 目录下新增 shim-vue.d.ts 导入 .vue 后缀名不可省略
- 或者 src 目录下新建 types 文件夹，tsconfig `include:[ "types/**/*.d.ts" ]`

```js
//  shim-vue.d.ts

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

解决 App.vue 中 eslint 文件报错，重新生成 .eslintrc.js

```js
npx eslint --init
```

解决错误

```js
env: {
  node: true
}
extends: [
  // ...
  'plugin:prettier/recommended'
],
rules: {
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-var-requires': 'off'
}
```
