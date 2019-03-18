# Webpack

**一般语法**
`webpack a.js bundle.js`
*用 webpack 打包 a.js -> bundle.js*

## 项目内
`npm init -y`
*初始化模块，npm 生成 packge.json*
//*`-y` 默认全yes*

`npm i(install) -D webpack(@版本号) webpack-cli`
*开发环境下安装 webpack*

### package.json
```
'script':{
  'build': 'webpack (--config webpack.config.js)'
}
```
*运行 `npm run build` 就会生成打包文件*
***

## webpack .config.js
https://www.webpackjs.com/configuration/
```
const path = require('path');

module.exports = {
  ...
}
```
#### mode: "production"
*"production" | "development" | "none"*

#### entry: "./app/entry"
*string | object | array*  
- **单入口：**
  `entry: './path...'`
- **多入口：**
  ```
  entry: {
    index: '../a',
    home: '../b',
    ...
  }
  ```
#### output
```
output:{
  ...
}
```
  - **filename: ''**
  *文件名*
    - **单入口**
    `filename: 'bundle.js'`
    - **多入口**
    `filename: [name](_[hash:5])_bundle.js`
    *name为entry里的name，hash为计算出来的哈希值(:5为前5位)*
  - **path: path.resolve(__dirname, "dist")**
  string 必须是绝对路径（使用 Node.js 的 path 模块）
  全局 `const path = require('path');`
  *输出到dist文件内，__dirname为当前文件所在目录(node的特殊变量)*
  - **publicPath: "/assets/"**
  *string*    
  *输出解析文件的目录，url 相对于 HTML 页面*


#### loader
```
  module: {
    // 关于模块配置
    rules: [
      // 模块规则（配置 loader、解析器等选项）
      {...},
      {...},
      ...
    ]
  }
```
  - **rules:[{...}]**
    - `test: /.css$/`
    *正则*
    *匹配以css结尾的文件*
    - `use: ['style-loader','css-loader',...]`
    *所对应使用的loader，在数组内需要按照使用顺序从后往前写*







#### plugins:[...]
*插件*
`npm install 相关插件`  
  - **HtmlWebpackPlugin**
  全局 `const HtmlWebpackPlugin = require('html-webpack-plugin')`
  ```
  new HtmlWebpackPlugin({
    ...
  })
  ```
    - `template: './src/index.html'`
    *模版*
  - **ExtractTextWebpackPlugin**
  全局 `const HtmlWebpackPlugin = require('extract-text-webpack-plugin')`
  `new ExtractTexWebpackPlugin('style.css')`
  *输出的文件名为style.css*
    - **在module.rules中**
    ```
    {
      use: ExtractTexWebpackPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader',...]
      })
    }
    ```
  - 

***
## 生产环境&开发环境
- 分别创建
**webpack.dev.config.js**, *//开发*
**webpack.prod.config.js**, *//生产*
**webpack.base.config.js** *//公共部分*
`npm i webpack-merge`
*用于base部分的合并*
#### package.json.script
`    "dev": "webpack --congfig webpack.dev.config.js"`    
`"build":"webpack --congfig webpack.prod.config.js"`

- `npm install 相关依赖包`
#### webpack.base.config.js
```
module.exports = webpackMerge(baseConfig, {
  公共部分...
})
```

#### webpack.dev.config.js
#### webpack.prod.config.js

  `const webpackMerge = require('webpack-merge');`
  `const baseConfig = require('./webpack.base.config.js');`
```
module.exports = webpackMerge(baseConfig, {
  dev和prod的差异部分
})
```
***
