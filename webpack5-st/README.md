# Webpack5

- 静态资源打包工具
- 将语法打包成浏览器可以识别的语法
- 输出的文件 `bundle`

## 相关概念/顶层配置项

- entry 入口 从哪个文件开始打包
- output 出口
- loader 处理除 js/json 之外的文件
- plugin 插件 扩展 Webpack 以外的功能
- mode 模式 开发/生产
- resolve alias-路径别名 extensions-省略后缀名
- optimization
- devServer
- devtool
- cache
- externals

### entry

各个模块之间存在一个依赖关系，需要一个入口来进入

- 单入口
- 多入口

```js
// 单入口
module.exports = {
  entry: './src/index.js'
}
// 多入口
module.exports = {
  entry: {
    app: './src/app.js',
    adming: './src/admin.js'
  }
}
```

### output

告诉 webpack 将编译后的文件放在哪里  
打包后产物的 hash 值

- hash 打包时，每个文件都同时写入一个同一个 hash 值，相当于所有代码资源更新 全量更新`[name].[hash].js`
- chunkhash 当文件改变时，当前文件引入的依赖和当前文件的 hash 值都会重新生成新的 hash 值，其他无依赖关系的文件，保持原有的 hash 值，局部更新`[name].[chunkhash].js`
- contenthash 当前文件的内容改变时，当前文件的 hash 值重新生成，涉及到的依赖的文件和其他文件没有改变内容的情况下，保持原有的 hash 值，最小量更新 `[name].[contenthash].js`

```js
// 单入口
const path = require('path');

module.exports = {
  //...
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist'),,
  },
};
// 多入口
const path = require('path');

module.exports = {
  //...
  output: {
    filename: "[name].js", // 使用占位符
    // filename: "[name].[fullhash].js", // 使用占位符
    path: path.resolve(__dirname, 'dist'),,
  },
};
```

### loader

webpack 仅支持 JS 和 JSON 两种文件类型(自带能力)，loader 可以使得 webpack 支持其他类型文件将它们转化为有效的模块  
本身是一个函数，接受源文件作为参数，最终返回转化的结果

常见的 loader

- babel-loader 转换 ES6、ES7 等 JS 新语法
- style-loader 将 css 代码转成 style 标签插入 head 中
- css-loader 支持.css 文件的加载和解析
- less-loader 将 less 文件转换成 css 文件
- sass-loader 将 sass\scss 文件转成 css 文件
- postcss-loader 搭配 autoprefixer 自当补全浏览器前缀
- ts-loader 将 ts 文件转换成 js 文件
- file-loade 进行图片、字体等打包
- thread-loader 多进程打包 JS 和 CSS
- vue-loader 对 .vue 文件的支持
-

用法
放在一个单独的 module 对象的 rules 中，rules 作为一个数组可以添加多个 loader，右到左，下到上依次解析，通过两个属性配置 loader：

- test 属性，指定匹配规则，识别出哪些文件会被转换。
- use 属性，指定使用的 loader 名称，即在进行转换时，应该使用哪个 loader。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
}
```

### plugin

Loader 用于处理 webpack 无法解析的文件，Plugin 则可以用于执行范围更广的任务，  
比如：打包优化，资源管理，注入环境变量。

常见 plugin

- HtmlWebpackPlugin 创建 html 文件去承载输出的 bundle 可指定 template
- copy-webpack-plugin 复制文件夹
- speed-measure-webpack-plugin 构建耗时分析
- mini-css-extract-plugin 抽取 css 文件
- css-minimizer-webpack-plugin 压缩 css 文件
- terser-webpack-plugin 压缩 js 文件

用法
plugins: [new 实例]

```js
const HtmlWebpackPlugin = require('html-webpack-plugin') // 通过 npm 安装
const webpack = require('webpack') // 用于访问内置插件

module.exports = {
  // ...
  plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin({ template: './src/index.html' })]
}
```

### mode

用于指定当前的构建环境是 production、development 或 none，默认 production

Mode 的内置函数

- development 设置 process.env.NODE_ENV 为 development，开启 NamedChunksPlugin 和 NamedModulesPlugin（在热更新中，可以看到具体更新的模块）
- production 设置 process.env.NODE_ENV 为 production，开启 FlagDependencyUsagePlugin、FlagIncludedChunksPlugin、ModuleConcatenationPlugin、NoEmitOnErrorsPlugin、OccurrenceOrderPlugin、SideEffectsFlagPlugin 和 TerserPlugin
- none 不开启任何优化选项

<!-- ### Module Federation/模块联邦

[待](https://juejin.cn/post/7117055274682155038) -->

## 基本配置

### 初始化

- webpack-dev-server 搭建本地开发服务器
- webpack-merge 合并 base 和 development/production
- cross-env 设置环境环境变量，跨终端进行设置
  - process.env 的 NODE_ENV 为自定义属性，用来区分环境变量，不同电脑上的设置方式不一样

base

- 入口
- 代码处理(loader)
- 解析配置
- ...

dev

- dev-server 本地服务、热更新、接口代理
- 代码规范检查
- devtool
- ...

prod

- 提取公共代码
- 压缩混淆
- 文件压缩
- 去除无用代码
- devtool
- ...

```js
mkdir webpack_demo
cd webpack_demo
npm init -y
npm i webpack webpack-cli webpack-dev-server html-webpack-plugin webpack-merge cross-env -D
```

```js
|-- webpack_demo
  |-- config
    |-- webpack.base.js
    |-- webpack.dev.js
    |-- webpack.prod.js
  |-- public
    |-- index.html
    |-- favicon.ico
  |-- src
    |-- count.js
    |-- index.js
  |-- package.json
  |-- package-lock.json
```

```html
// publc/index.html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- // 1. html-webpack-plugin 提供title
  <title>
    <%= htmlWebpackPlugin.options.title %>
  </title> -->
    // 2. 直接写死
    <title>webpack_demo</title>
  </head>

  <body>
    <noscript>
      <strong
        >We're sorry but project doesn't work properly without JavaScript enabled. Please enable it
        to continue.</strong
      >
    </noscript>
    <div id="app"></div>
  </body>
</html>
```

```js
// count.js
export function count(x, y) {
  return x - y
}

export function sum(...args) {
  return args.reduce((p, c) => p + c, 0)
}
export function sleep(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(1), delay)
  })
}
------------------------------------------------
// index.js

import { count, sum, sleep } from './count'

console.error(count(2, 1))
console.error(sum(1, 2, 3))
sleep(5000)
  .then(res => console.error(res))

console.error(6666);
```

```json
// package.json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "cross-env NODE_ENV=development webpack server -c config/webpack.dev.js",
  "build": "cross-env NODE_ENV=production webpack -c config/webpack.prod.js"
},
```

```js
// webpack.base.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
    clean: true, // 每次打包自动清除dist
    publicPath: '/', // 打包后文件的公共前缀路径
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      // title: 'webpack_demo',
      inject: true,
    }),
  ],
  resolve: {
    extensions: ['.js'], // 省略后缀
  },
}

--------------------------------------
// webpack.dev.js
const baseConfig = require('./webpack.base')
const { merge } = require('webpack-merge')

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    host: 'localhost', // 指定host，，改为0.0.0.0可以被外部访问
    port: 9000, // 指定端口号
    open: true, // 服务启动后自动打开默认浏览器
    historyApiFallback: true, // history模式 当找不到页面时，会返回index.html
    hot: true, // 启用模块热替换HMR，在修改模块时不会重新加载整个页面，只会更新改变的内容
    compress: true, // 启动GZip压缩
    https: false, // 是否启用https协议
    proxy: {
      // 启用请求代理，可以解决前端跨域请求的问题
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
      },
    },
  },
})

--------------------------------------
// webpack.prod.js
const baseConfig = require('./webpack.base')
const { merge } = require('webpack-merge')

module.exports = merge(baseConfig, {
  mode: 'production',
})

```

### 样式处理

从右到左、从下到上顺序执行

- css 处理
- sass 处理
- less 处理
- css3 兼容
  - 根目录下新建 .browserslistrc 兼容的浏览器版本
  - 根目录下新建 postcss.config.js postcss-loader 的配置文件，自动读取该配置

```js
npm i css-loader style-loader -D
npm i node-sass sass-loader -D
npm i less less-loader -D
npm i postcss-loader autoprefixer -D
```

```json
// webpack.base.js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    },
    {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
    },
    {
      test: /\.s(a|c)ss$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
    },
  ],
},
```

```js
// .browserslistrc
IE 9 # 兼容IE 9
chrome 35 # 兼容chrome 35
```

```js
// postcss.config.js
module.exports = {
  plugins: ['autoprefixer']
}
```

### babel 处理 js 兼容

- babel-loader: 使用 babel 加载最新 js 代码并将其转换为 ES5
- @babel/corer: babel 编译的核心包
- @babel/preset-env: babel 编译的预设,可以转换目前最新的 js 标准语法
- core-js: 使用低版本 js 语法模拟高版本的库,也就是垫片

- '@babel/preset-react', 一个用来编译 React jsx 语法的预设
- '@babel/preset-typescript' 一个用来编译 TypeScript 语法的预设

```js
npm i babel-loader @babel/core @babel/preset-env core-js -D
```

根目录下新建 babel.config.js

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
    ]
  ]
}
```

```js
// webpack.base.js
{
  test: /\.js$/,
  exclude: /node_modules/, // 排除文件
  use: 'babel-loader',
},
```

### 图片资源

webpack5 使用内置的 asset module  
之前通常使用

- raw-loader 将文件导入字符串
- url-loader 将文件作为 data URI 内联到 bundle 中
- file-loader 将文件发送到输出目录

4 种来替换这些 loader

- asset/resource 发送一个单独的文件并导出 URL 对应 file-loader
- asset/inline 导出一个资源的 data URI 对应 url-loader
- asset/source 导出资源的源代码 对应 row-loader
- asset 在导出一个 data URI 和发送一个单独的文件之间自动选择. 对应 url-loader + 配置资源体积限制实现

```js
module:{
  rules: [
    {
      test: /\.(png|jpe?g|gif|webp)$/,
      type: "asset",
      generator: {
        // 输出到指定目录
        // [ext]: 使用之前的文件扩展名
        filename: 'static/[name][ext]'
      },
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024 // 小于10kb的图片会被base64处理
        }
      }
    },
  ]
},
```

### 字体文件和媒体文件

```js
{
  test: /\.(ttf|woff2?|map4|map3|avi)$/,
  type: "asset/resource",
  generator: {
    filename: "static/media/[name]][ext]",
  },
},
```

### 复制 public 文件夹

静态资源文件以绝对路径引用

```html
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
```

```js
npm i copy-webpack-plugin -D
```

```js
// webpack.prod.js
const CopyPlugin = require('copy-webpack-plugin')

plugins: [
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, '../dist'),
        filter: source => {
          return !source.includes('index.html') // 忽略index.html
        },
      },
    ],
  }),
],
```

## 优化速度

### 构建耗时分析

```js
npm i speed-measure-webpack-plugin -D
```

config 下新建 webpack.analy.js,不影响现有环境

```js
// webpack.analy.js
const prodConfig = require('./webpack.prod.js') // 引入打包配置
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin') // 引入webpack打包速度分析插件
const smp = new SpeedMeasurePlugin() // 实例化分析插件
const { merge } = require('webpack-merge') // 引入合并webpack配置方法

// 使用smp.wrap方法,把生产环境配置传进去
module.exports = smp.wrap(merge(prodConfig, {}))
```

```js
// package.json
"analy": "cross-env NODE_ENV=production webpack -c config/webpack.analy.js"
```

### 开启持久化缓存

开发环境和生产环境 第二次耗时减少

```js
cache: {
  type: 'filesystem', // 使用文件缓存
},
```

### 开启多线程 loader

```js
npm i thread-loader -D
```

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: ['thread-loader', 'babel-loader'],
},
```

### 别名

减少路径复杂度

```js
resolve: {
  alias: {
    '@': path.join(__dirname, '../src')
  }
}
```

### 缩小 loader 范围

减少不必要的 loader 解析，节省时间

- include：只解析该选项配置的模块
- exclude：不解该选项配置的模块,优先级更高

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  include: [path.resolve(__dirname, '../src')],
  use: ['thread-loader', 'babel-loader'],
},
```

### devtool

- inline 代码内通过 dataUrl 形式引入 ScourceMap
- hidden 生成 SourceMap 文件，但不使用
- eval eval(...) 形式执行代码，通过 dataUrl 形式引入 SourceMap
- cheap 定位到行信息,不需要列信息
- module 展示源代码中的错误位置

开发: eval-cheap-module-source-map
生产不生成

### 其他

## 优化文件

### 包分析工具

```js
npm install webpack-bundle-analyzer -D
```

```js
// webpack.analy.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer') // 引入分析打包结果插件

// 使用smp.wrap方法,把生产环境配置传进去
module.exports = smp.wrap(
  merge(prodConfig, {
    plugins: [
      new BundleAnalyzerPlugin() // 配置分析打包结果插件
    ]
  })
)
```

npm run analy 后自动打开窗口

### 抽取 css

```js
npm i mini-css-extract-plugin -D
```

```js
// webpack.base.js

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development' // 是否是开发模式

 {
  test: /\.css$/,
  include: [path.resolve(__dirname, '../src')],
  use: [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',
  ],
},
{
  test: /\.less$/,
  include: [path.resolve(__dirname, '../src')],
  use: [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',
    'less-loader',
  ],
},
{
  test: /\.s(a|c)ss$/,
  include: [path.resolve(__dirname, '../src')],
  use: [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',
    'sass-loader',
  ],
}
```

```js
// webpack.prod.js

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
plugins: [
  new MiniCssExtractPlugin({
    filename: 'static/css/[name].css' // 抽离css的输出目录和名称
  })
]
```

### 压缩 css

提取后,css 未压缩

```js
npm i css-minimizer-webpack-plugin -D
```

```js
// webpack.prod.js

optimization: {
  minimizer: [
    new CssMinimizerPlugin(), // 压缩css
  ],
}
```

### 压缩 js

配置 optimization.minimizer 压缩 css 后 js 压缩失效了

```js
npm i terser-webpack-plugin -D
```

```js
// webpack.prod.js

const TerserPlugin = require('terser-webpack-plugin')

optimization: {
  minimizer: [
    new TerserPlugin({
      // 压缩js
      parallel: true, // 开启多线程压缩
      terserOptions: {
        compress: {
          pure_funcs: ['console.log'], // 删除console.log
        },
      },
    }),
  ],
},
```

### 配置文件 hash 值

```js
// webpack.base.js
output: {
  filename: 'static/js/[name].[chunkhash:8].js',
},
rules: [
  {
    test:/.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
    // ...
    generator:{
      filename:'static/images/[name].[contenthash:8][ext]'
    },
  },
  {
    test:/.(woff2?|eot|ttf|otf)$/, // 匹配字体文件
    // ...
    generator:{
      filename:'static/fonts/[name].[contenthash:8][ext]',
    },
  },
  {
    test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
    // ...
    generator:{
      filename:'static/media/[name].[contenthash:8][ext]',
    },
  },
]
```

```js
// webpack.prod.js
new MiniCssExtractPlugin({
  filename: 'static/css/[name].[contenthash:8].css' // 加上[contenthash:8]
}),
```

### code split

- 第三方包变化频率小，利用浏览器缓存
- 公共模块提取，避免重复打包

```js
// webpack.prod.js
optimization: {
  // ...
  splitChunks: { // 分隔代码
    cacheGroups: {
      vendors: { // 提取node_modules代码
        test: /node_modules/, // 只匹配node_modules里面的模块
        name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
        minChunks: 1, // 只要使用一次就提取出来
        chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
        minSize: 0, // 提取代码体积大于0就提取出来
        priority: 1, // 提取优先级为1
      },
      commons: { // 提取页面公共代码
        name: 'commons', // 提取文件命名为commons
        minChunks: 2, // 只要使用两次就提取出来
        chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
        minSize: 0, // 提取代码体积大于0就提取出来
      }
    }
  }
}
```

### tree shaking

- js
- css 清除
  - npm i purgecss-webpack-plugin@4 glob-all -D

css

```js
// webpack.prod.js
const globAll = require('glob-all')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')

plugins: [
  new PurgeCSSPlugin({
    // 检测src下所有tsx文件和public下index.html中使用的类名和id和标签名称
    // 只打包这些文件中用到的样式
    paths: globAll.sync([
      `${path.join(__dirname, '../src')}/**/*.js`,
      path.join(__dirname, '../public/index.html')
    ])
  })
]
```

## 代码规范

![](/fe/module/2.jpg)

### .editorconfig

vscode 需配合 EditorConfig 插件使用

```js
root = true # 控制配置文件 .editorconfig 是否生效的字段
​
[**] # 匹配全部文件
indent_style = space # 缩进风格，可选space｜tab
indent_size = 2 # 缩进的空格数
charset = utf-8 # 设置字符集
trim_trailing_whitespace = true # 删除一行中的前后空格
insert_final_newline = true # 设为true表示使文件以一个空白行结尾
end_of_line = lf
​
[**.md] # 匹配md文件
trim_trailing_whitespace = false

```

### Eslint

- ESLint 插件方便调试

```js
npm i eslint -D
```

生成 .eslintrc.js 文件

```js
npx eslint --init
```

- 需配置 node 环境 env:{ node: true }, webpack.xxx.js 报错
- parser: npm i @babel/eslint-parser -D, 解决 Unexpected token <

```js
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: '@babel/eslint-parser', // ++++
  extends: 'eslint:recommended',
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
  rules: {}
}
```

```js
// package.json

"eslint": "eslint src/**/*.js"
```

### lint-staged

只检查暂存区的文件，优化 lint 速度

```js
npm i lint-staged -D
```

```js
// package.json

script: {
  "eslint": "eslint --max-warnings=0" // 最多0个警告
  "check": "npx lint-staged"
}

"lint-staged": {
  "src/**/*.js": [
    "npm run eslint"
  ]
},
```

```js
git init
git add src/index.js
npm run check
```

### husky

监听 git 一些操作，完成某些事情

```js
npm i husky -D
```

生成 .husky 文件

```js
npx husky install
```

husky 支持监听 pre-commit 监听到后执行 npm runcheck 语法检测。  
.husky 目录下会生成 pre-commit 文件

```js
npx husky add .husky/pre-commit 'npm run check'
```

当 git add git commit 后 会执行 npm run check -> npx lint-staged, eslint 不通过不可以提交

husky 生效需要手动执行 husky install，借助 package.json 里面的 postintall 钩子实现这个功能，该钩子会在依赖安装完成后执行

```js
"scripts": {
  "postinstall": "husky install"
}
```

### commitlint

备注规范

```js
npm i @commitlint/config-conventional @commitlint/cli -D
```

根目录下 commitlint.config.js

```js
module.exports = {
  // 继承的规则
  extends: ['@commitlint/config-conventional'],
  // 定义规则类型
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'docs', // 文档注释
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不增加新功能，也不是修复bug)
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build' // 打包
      ]
    ], // subject 大小写不做校验
    'subject-case': [0]
  }
}
```

husky 监听 commit-msg  
.husky 目录下生成 commit-msg 文件

```js
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

git commit -m "xxx: xxx" xxx 不符合规范提交报错

### commitizen

辅助生成 commit 信息

```js
npm i commitizen -g       // 全局安装，负责无法执行插件的 git cz
npm i cz-customizable -D
```

```js
// package.json

"config": {
  "commitizen": {
    "path": "./node_modules/cz-customizable"
  }
}
```

根目录下新建 .cz-config.js

```js
// cz-config.js

module.exports = {
  // 可选类型，和上面commitlint.config.js配置的规则一一对应
  types: [
    { value: 'feat', name: 'feat: 新功能' },
    { value: 'fix', name: 'fix: 修复' },
    { value: 'docs', name: 'docs: 文档变更' },
    { value: 'style', name: 'style: 代码格式(不影响代码运行的变动)' },
    {
      value: 'refactor',
      name: 'refactor: 重构(既不是增加feature，也不是修复bug)'
    },
    { value: 'perf', name: 'perf: 性能优化' },
    { value: 'test', name: 'test: 增加测试' },
    { value: 'chore', name: 'chore: 构建过程或辅助工具的变动' },
    { value: 'revert', name: 'revert: 回退' },
    { value: 'build', name: 'build: 打包' }
  ], // 消息步骤，正常只需要选择
  messages: {
    type: '请选择提交类型:', // customScope: '请输入修改范围(可选):',
    subject: '请简要描述提交(必填):', // body: '请输入详细描述(可选):',
    footer: '请输入要关闭的issue(可选):',
    confirmCommit: '确认使用以上信息提交？(y/n)'
  }, // 跳过问题：修改范围，自定义修改范围，详细描述，issue相关
  skipQuestions: ['scope', 'customScope', 'body', 'footer'], // subject描述文字长度最长是72
  subjectLimit: 72
}
```

git add -> git cz -> 选择提交

### prettier

可配合插件 Prettier - Code formatter

```js
npm i prettier eslint-config-prettier eslint-plugin-prettier -D
```

根目录下新建 .prettierrc.js

```js
module.exports = {
  printWidth: 100, // 一行的字符数，如果超过会进行换行
  tabWidth: 2, // 一个tab代表几个空格数，默认就是2
  useTabs: false, // 是否启用tab取代空格符缩进，.editorconfig设置空格缩进，所以设置为false
  semi: false, // 行尾是否使用分号，默认为true
  singleQuote: true, // 字符串是否使用单引号
  trailingComma: 'none', // 对象或数组末尾是否添加逗号 none| es5| all
  jsxSingleQuote: true, // 在jsx里是否使用单引号，你看着办
  bracketSpacing: true, // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  arrowParens: 'avoid', // 箭头函数如果只有一个参数则省略括号
  endOfLine: 'auto'
}
```

```js
// .eslintrc.js
plugins: ['prettier'],
extends: ['eslint:recommended', 'plugin:prettier/recommended'],
```
