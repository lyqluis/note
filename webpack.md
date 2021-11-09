#  Webpack

## 构建流程

![](https://image-static.segmentfault.com/142/390/1423901375-5ff2830c7aff8_articlex)

## 构建化境

### 初始化项目

打开项目文件夹
```shell
npm init -y
```
> *初始化模块，npm 生成 packge.json*
> **`-y` 默认全yes*

### 安装`webpack`

> 一般使用项目环境安装，不推荐全局安装（会锁定版本而造成版本冲突），*开发环境下安装 webpack*

```bash
# 安装最新稳定版本webpack
npm install -D webpack
# 安装指定版本webpack
npm install -D webpack@<version>
# 安装webpack v4+版本，需要额外安装webpack-cli
npm install -D webpack-cli

# 检查本地是否安装成功
npx webpack -v
# webpack 5.11.1
# webpack-cli 4.3.1
```

> `npx`为`npm`自带的工具，就是一个软连接，上述就是指向`node_modules/webpack/bin`里面的文件

#### package.json
```json
"script":{
  "build": "webpack (--config webpack.config.js)"
}
```
*运行 `npm run build` 就会生成打包文件*

## 构建项目

**一般语法**

```shell
npx webpack a.js bundle.js
```
> *用 webpack 打包 a.js -> bundle.js*



## webpack.config.js
webpack的配置文件

[配置官网](https://www.webpackjs.com/configuration/)

```js
const path = require('path');

module.exports = {
  ...
}
```
#### mode: "production"
*"production" | "development" | "none"*

- `development`

  > 将 `process.env.NODE_ENV` 的值设置为 `development`，启用 `NamedChunksPlugin` 和 `NamedModulesPlugin`

- `production`

  > 将 `process.env.NODE_ENV` 的值设置为 `production`，启用 `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`, `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin`和 `UglifyJsPlugin`

#### context

*string*

> 绝对路径，默认指向当前项目目录，改动会使得`entry`的相对目录发生改变 

#### entry: "./app/entry"

*string | object | array*  

> 项目入口，执行构建的入口

- **单入口：**
  ```js
  entry: './path...',	// string
  entry: ['./path...', '...']	// array
  ```
- **多入口：**
  ```js
  entry: {
    index: '../a',
    home: '../b',
    // ...
  }
  ```
#### output

```js
const path = require('path);

output:{
  path: path.resolve(__dirname, './dist'), //必须是绝对路径
  filename: 'main.js',
  publicPath: '/' //通常是CDN地址
}
```
  - **filename: ' '**
    *文件名*
    
    - **单入口**
    ```js
    filename: 'main.js'
    ```
    - **多入口**
    ```js
    filename: '[name]_[hash:5][chunkhash:5]_bundle.js'
    ```
    > 多入口的多出口文件名可以使用占位符来区分：
    >
    > *`name`为`entry`对象里的`key`，`hash`为计算出来的哈希值(`:5`为前5位，默认20位)，`chunkhash`是以chunk内容作为哈希，可以优化改动（未改动chunk就可以忽略打包）*
  - **path: path.resolve(__dirname, "dist")**
    
    > string 必须是绝对路径（使用 `Node.js` 的`path`模块）
    > 全局 `const path = require('path');`
    > *输出到`dist`目录内，`__dirname`为当前文件所在目录(`node`的特殊变量)*
  - **publicPath: "/assets/"**
    *string*    
    *输出解析文件的目录，url 相对于 HTML 页面*


#### module.loader
```js
// webpack.config.js
module.exports = {
  // ... 
  module: {
    // 关于模块配置
    rules: [
      // 模块规则（配置 loader、解析器等选项）
      {...},  // loader1
      {...},  // loader2
      ...
    ]
  }
}
```
  - **rules:[{...}]**
    - `test: /\.css$/`
    *正则*
    *匹配以css结尾的文件*
    - `use: ['style-loader','css-loader',...]`
    *所对应使用的loader，在数组内需要按照使用顺序从后往前写*
    `loader`也是可以是一个对象的
      - `loader` 指定一个loader
      - `options` 一个对象，对loader进行配置

##### babel-loader
将js文件转义为低版本

安装`babel-loader`插件
```shell
npm install babel-loader -D
```

配置`babel-loader`
可以直接在`webpack.config.js`中设置，也可以新建`.babelrc`设置

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": ["@babel/preset-env"],
            "plugins": [
              [
                "@babel/plugin-transform-runtime"
                {
                  "corejs": 3
                }
              ]
            ]
          }
        },
        exclude: /node_modules/ // 排除node_modules文件夹
      }
    ]
  }
  // ...
}
```
以新建`.babelrc`
```js
{
    "presets": ["@babel/preset-env"],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": 3
            }
        ]
    ]
}
```

##### 样式loader
- `css` 
  - `style-loader`：动态创建 `style` 标签，将 `css` 插入 `html`的 `head` 中
  - `css-loader`：负责处理 `@import` 等语句
  - `postcss-loader`：自动生成浏览器兼容性前缀
    - `autoprefixer`：`postcss-loader`的插件
- `sass-loader`：负责处理编译`.sass`文件,将其转为`css`
- `less-loader`
- `stylus-loader`
- ...

安装依赖
```shell
npm install style-loader sass-loader css-loader postcss-loader autoprefixer sass -D
```

```js
// webpack.config.js

module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.(sa|c)ss$/,
        loader: [
          'style-loader', 
          'css-loader', 
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')(),  // 自动生成浏览器兼容性前缀
              ]
            }
          }, 
          'sass'
          ],
        exclude: /node_module/,
        include: [path.resolve(__dirname, 'src')] // 只包含src的文件夹中的文件
      }
    ]
  }
  // ...
}
```

**`loader` 的执行顺序是从右向左执行的，也就是后面的 `loader` 先执行: `sass-loader` ---> `postcss-loader` ---> `css-loader` ---> `style-loader`*

在根目录下创建`.browserslistrc`，将`autoprefixer`的规则写在此文件中，`@babel/preset-env`、`stylelint`、`eslint-plugin-conmpat` 等都可以共用此文件

```json
// .browserslistrc

"browserslist": {
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version",
    "last 1 ie version"
  ]
}
```

##### 本地资源 loader
- url-loader
- file-loader
用来处理本地的资源文件（图片/字体/文件）

优先选择`url-loader`，可以指定在文件大小小于指定的限制时，返回 `DataURL`

安装依赖
```shell
npm install url-loader file-loader -D
```
需要一起装，只有`url-loader`无法正常运行
```js
// webpack.config.js

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10240, // 制大小10k，资源大小小于10K时，将资源转换为 base64，超过 10K，将图片拷贝到 dist 目录
          esModule: false, // esModule 设置为 false，否则，<img src={require('XXX.jpg')} /> 会出现 <img src=[Module Object] />
          name: '[name]_[hash:6].[ext]'
        },
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'public')]
      }
    ]
  }
  // ...
}
```
[更多`url-loader`](https://www.webpackjs.com/loaders/url-loader/)


#### plugins
插件
```shell
npm install $相关插件
```

##### HtmlWebpackPlugin
```shell
npm install html-webpack-plugin -D
```

```js
// webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',  // 模版
      filename: 'index.html', //打包后的文件名
      minify: {
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      hash: true //是否加上hash，默认是 false
    )}
  ],
  ...
}
```

##### CleanWebpackPlugin
> 每次打包前清空dist目录

```shell
npm install clean-webpack-plugin -D
```

```js
//webpack.config.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  ...
  plugins: [
    //不需要传参，它可以找到outputPath
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] // 不删除dll目录下的文件
    }) 
  ],
  ...
}
```
[更多`clean-webpack-plugin`配置](https://github.com/johnagan/clean-webpack-plugin)

##### 热更新
> `webpack`自带插件`HotModuleReplacementPlugin`

```js
// webpack.config.js
module.exports = {
  ...
  devServer: {
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()  // 热更新插件
  ]
  ...
}
```
在入口文件中添加
```js
// 入口js
if(module && module.hot) module.hot.accept()
```

##### ExtractTextWebpackPlugin

#### devServer

在浏览器中实时展示效果
```shell
npm i webpack-dev-server -D
```

修改`package.json`，增加`dev`命令
```json
"script": {
  "dev": "cross-env NODE_ENV=development webpack-dev-server"
}
```

配置`webpack.config.js`中的`devServer`

```js
module.exports = {
  ...
  devServer: {
    port: '3000', //默认是8080
    hot: true,  // 热更新 需要配合插件webpack.HotModuleReplacementPlugin
    quiet: false, //默认不启用
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: "errors-only", //终端仅打印 error
    overlay: false, //默认不启用
    clientLogLevel: "silent", //日志等级
    compress: true //是否启用 gzip 压缩
  }  
  ...
}
```

- `quiet`：一般不会开启；
启用后除了初始启动信息之外的任何内容都不会被打印到控制台。意味着来自 `webpack` 的错误或警告在控制台不可见
- `stats: "errors-only"` ， 终端中仅打印出 `error`；
当启用了 `quiet` 或者是 `noInfo` 时，此属性不起作用。
这个属性对于启用了 `eslint` 或者使用`TS`进行开发有用，太多的编译信息在终端中，会干扰到我们。
- `overlay`：默认关闭；
启用后，当编译出错时，会在浏览器窗口全屏输出错误
- `clientLogLevel`：当使用内联模式时，在浏览器的控制台将显示消息，如：在重新加载之前，在一个错误之前，或者模块热替换启用时
不想看这些信息，可以将其设置为 `silent` (`none` 即将被移除)。

[更多](https://webpack.js.org/configuration/dev-server/)

##### proxy
```js
// webpack.config.js

module.exports = {
  ...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',  // 目标域名
        pathRewrite: {
          '/api': ''
        }
      }
    },
    ...
  }
}
```

#### devtool

```js
// webpack.config.js
module.exports = {
  ...
  devtool: 'cheap-module-eval-source-map',  // 开发环境下使用
  ...
}
```

- `source-map` 最终会单独打包出一个 `.map` 文件，根据报错信息和`map` 文件，进行错误解析，定位到源代码；
其会在打包出的js文件中增加一个引用注释，以便开发工具知道在哪里可以找到它
- `hidden-source-map` 也会打包生成单独的 `.map` 文件，没有引用注释。
**一般不会直接将 `.map` 文件部署到`CDN`，因为会直接映射到源码，更希望将`.map`文件传到错误解析系统，然后根据上报的错误信息，直接解析到出错的源码位置*

[devtool更多](http://webpack.html.cn/configuration/devtool.html)

##### 

***
## 生产环境 & 开发环境
根目录分别创建
- **webpack.config.dev.js**, *开发*
- **webpack.config.prod.js**, *生产*
- **webpack.config.base.js** *公共部分*

### 环境配置
`process.env` 中默认并没有 `NODE_ENV`，
为了兼容Windows和Mac，安装 `cross-env`
```shell
npm install cross-env -D
```

配置`package.json`中的指令

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config=webpack.config.dev.js",
    "build": "cross-env NODE_ENV=production webpack --config=webpack.config.prod.js"
  }
}
```

### webpack-merge

`webpack-merge`专为 `webpack` 设计，提供了一个 `merge` 函数，用于连接数组，合并对象
```shell
npm install webpack-merge -D
```

```js
// webpack.base.config.js

module.exports = {
  公共部分...
}
```

```js
// webpack.prod.config.js && webpack.dev.config.js
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');

module.exports = webpackMerge(baseConfig, {
  // dev和prod的差异部分... 
  ...
})
```

***

以上参考： 
[带你深度解锁Webpack系列(基础篇)](https://juejin.im/post/5e5c65fc6fb9a07cd00d8838)
[带你深度解锁Webpack系列(进阶篇)](https://juejin.im/post/5e6518946fb9a07c820fbaaf)

***

## vue-cli@3.0
vue-cli@3.0将webpack的基础胚珠直接内嵌了，无法直接在项目内部创建修改webpack.config.js

按照官方，它预留了一个vue.config.js的js文件供我们对webpack进行自定义配置

参考
[官方](https://cli.vuejs.org/zh/config/#vue-config-js)
[vue-cli3搭建项目之webpack配置](https://blog.csdn.net/u014440483/article/details/87267160)

如果修改webpack内部
- chainWebpack
https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans
- configureWebpack

使用 `chainWebpack` 或者 `configureWebpack` 来进行修改内部配置
两者的不同点在于 `chainWebpack` 是链式修改，而 `configureWebpack` 更倾向于整体替换和修改
[参考](https://www.dazhuanlan.com/2019/10/17/5da8048b18da0/)

```javascript
// vue.config.js

module.exports = {
    ...
    // config 参数为已经解析好的 webpack 配置
    configureWebpack: config => {
        // config.plugins = []; // 这样会直接将 plugins 置空
        
        // 使用 return 一个对象会通过 webpack-merge 进行合并，plugins 不会置空
        return {
            plugins: []
        }
    }
    ...
}
```

***

## webpack 优化

### 分析工具

#### 时间分析 `speed-measure-webpack-plugin`
测量各个`plugin`和`loader`所花费的时间

```shell
npm install speed-measure-webpack-plugin -D
```

```js
// webpack.config.js

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin);
const smp = new SpeedMeasurePlugin();

const config = {
  // ...webpack配置
}

module.exports = ex.wrap(config);
```

运行`npm run build`构建命令，即可在`terminal`中打包完成后看到打包时间的细节信息

#### 包大小分析 `webpack-bundle-analyzer`
可以直观看到所有包的大小体积

```shell
npm install webpack-bundle-analyzer -D
```

```js
// webpack.config.js

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  ...
  plugins: [
    new BundleAnalyzerPlugin(),
  ]
  ...
}
```

运行`npm run build`构建，插件会默认打开`http://127.0.0.1:8888/`

### `loader`中的`exclude`和`include`
配置`loader`中的`exclude`/`include`来转译尽可能少的文件从而节省打包时间
- `exclude` 指定要排除的文件
- `include` 指定要包含的文件

**在`include`和`exclude`中使用绝对路径数组；*
**`exclude`的优先级高于`include`，更倾向于使用`include`，尽量避免`exclude`*

```js
const path = require('path');

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: ['babel-loader'],
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  }
  // ...
}
```

### resolve
`resolve`配置`webpack`如何寻找模块所对应的文件

假设我们确定模块都从根目录下的`node_modules`中查找：
```js
//webpack.config.js
const path = require('path');
module.exports = {
  //...
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
  }
}
```

- 如果配置了上述的`resolve.moudles`，可能会出现问题，例如，依赖中还存在`node_modules`目录，那么就会出现，对应的文件明明在，但是却提示找不到。因此不推荐配置这个；
- `resolve`的`extensions`配置，默认是`['.js', '.json']`，如果要配置，将频率最高的后缀放在第一位，并且控制列表的长度，以减少尝试次数

### external
将一些JS文件存储在`CDN`上，以减少`Webpack`打包出来的体积，再通过`<script>`引入`index.html`中

```js
//webpack.config.js
module.exports = {
  //...
  externals: {
    //jquery通过script引入之后，全局中即有了 jQuery 变量
    'jquery': 'jQuery'
  }
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="root">root</div>
    <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
</body>
</html>
```

### cache-loader
在一些性能开销较大的`loader`之前添加`cache-loader`，将结果缓存中磁盘中，可以减少第二次以及之后打包的时间
**默认保存目录`node_modueles/.cache/cache-loader`*

```shell
npm install cache-loader -D
```

```js
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: ['cache-loader', 'babel-loader']
      }
    ]
  }
}
```

#### 其他缓存 `babel-loader`
如果只打算给`babel-loader`配置`cache`的话，也可以不使用`cache-loader`，给`babel-loader`增加选项 `cacheDirectory`

- `cacheDirectory`：默认`false`；
设置`空值`或者`true`，使用默认缓存目录：`node_modules/.cache/babel-loader`

```js
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          }
        }
      }
    ]
  }
}
```

### happypack

`HappyPack`能把任务分解给多个子进程去**并发**执行，
子进程处理完后再把结果发送给主进程，以此来提高打包效率；

因为`js`是单线程，构建速度慢；
`webpack`是`node`写的，可以用`node-worker`进行多线程处理

它默认开启`CPU核数 - 1`个进程；也可以传递`threads`给 `Happypack`

**当项目不是很复杂时，不需要配置`happypack`，因为进程的分配和管理也需要时间，并不能有效提升构建速度，甚至会变慢*

```shell
npm install happypack -D
```

`Happypack`用来代替`loader`多线程处理特定文件

```js
// webpack.config.js

const Happypack = require('happypack')
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        use: 'Happypack/loader?id=js',
        include: [path.resolve(__dirname, 'src')]
      },
      {
        test: /\.css$/,
        use: 'Happypack/loader?id=css',
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules', 'bootstrap', 'dist')
        ]
      }
    ]
  },
  plugins: [
    new Happypack({
      id: 'js', // 和rule中的id=js对应
      //将之前 rule 中的 loader 在此配置
      use: ['babel-loader'] //必须是数组
    }),
    new Happypack({
      id: 'css',  // 和rule中的id=css对应
      use: ['style-loader', 'css-loader','postcss-loader'],
    })
  ]
}
```

**当`postcss-loader`配置在`Happypack`中，必须要在项目中创建`postcss.config.js`*
*否则，会抛出错误：`Error: No PostCSS Config found`*

```js
//postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')()
  ]
}
```

### HardSourceWebpackPlugin
`HardSourceWebpackPlugin`为模块提供中间缓存，缓存默认的存放路径是：`node_modules/.cache/hard-source`

配置`hard-source-webpack-plugin`后，首次构建时间没有太大变化，但是第二次开始，构建时间大约可以节约 **80%**

```shell
npm install hard-source-webpack-plugin -D
```

```js
//webpack.config.js
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
  //...
  plugins: [
    new HardSourceWebpackPlugin()
  ]
}
```
[更多`HardSourceWebpackPlugin`](https://www.npmjs.com/package/hard-source-webpack-plugin)

### DllPlugin & DLLReferencePlugin
`DllPlugin`和`DLLReferencePlugin`是`webpack`的内置模块，用来拆分`bundles`，这样可以提升构建速度

使用`DllPlugin`将`不会频繁更新的库`进行编译，当这些依赖的版本没有变化时，就不需要重新编译

即先对第三方包进行一遍预打包，然后打包项目的时候这些依赖包不会被打包了，加快了打包速度

根目录新建`webpack.config.dll.js`，进行配置
```js
// webpack.config.dll.js

const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    // 预先处理的第三方包
    react: ['vue/dist/vue.esm', 'vue-router', 'axios']
  },
  output: {
    filename: '[name].dll.[hash:6].js', // 输出名字
    path: path.resolve(__dirname, 'dist', 'dll'), // 输出路径
    //libraryTarget 指定如何暴露内容，缺省时就是 var
    library: '[name]_dll' //暴露给外部使用
  },
  plugins: [
    // 生成一个json来告诉真正的打包文件哪些包已经预处理了，无需再次打包
    new webpack.DllPlugin({
      name: '[name]_dll', // name和output中的library同名
      path: path.resolve(__dirname, 'dist', 'dll', 'manifest.json') // manifest.json的生成路径
    })
  ]
}
```

在`package.json`中配置dll打包指令
```json
{
  "scripts": {
    "dll": "webpack --config webpack.config.dll.js"
  },
}
```
执行`npm run dll`，可以看到`dist`文件夹中多出了`dll`文件夹，里面有`js`和`json`文件；
配置`webpack.conifg.js`里的`DllReferencePlugin`插件
```js
//webpack.config.js

const webpack = require('webpack');
const path = require('path');
module.exports = {
  //...
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },

  plugins: [
    // 配置已打包的库依赖json路径
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist', 'dll', 'manifest.json')
    }),
    // 使用CleanWebpackPlugin插件不要每次删除dll文件
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] //不删除dll目录
    }),
    //...
  ]
}
```
并在`index.html`文件中用`<script>`引入刚才预打包的第三方库；
执行`npm run build`

### 分割公共代码
一般运行`npm run build`会产生三个文件：
- app.js - 项目主体
- vendor.js - 依赖第三方库（node_modules）
- manifest.js - 运行代码

> 单页面&多页面：
> - 单页面项目 - 只有一个entry
> - 多页面项目 - 多个entry

一般分割打包方式：
- 多页面应用
  - 主业务代码 + 公共依赖 + 第三方包 + webpack运行代码
- 单页面
  - 主业务代码 + 异步模块 + 第三方包 + webpack运行代码

一般分割公共代码是对于多页应用来说的，如果多个页面引入了一些公共模块，那么可以把这些公共的模块抽离出来，单独打包。公共代码只需要下载一次就缓存起来了，避免了重复下载

但是分割公共代码对于单页应用和多页应该在配置上没有什么区别，都是配置在`optimization.splitChunks`中

```js
//webpack.config.js
module.exports = {
  // ...
  // 优化模块
  optimization: {
    // 运行代码 分割
    runtimeChunk: true,

    // 依赖包 分割
    splitChunks: {
      // 指定缓存组
      cacheGroups: {
        //  第三方依赖
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 1, //设置优先级，首先抽离第三方模块
          chunks: 'initial',  // initial 表示只要你在文件中异步引入其他模块，它就会被单独打包
          minSize: 0, // 公共模块的最小值，大于这个值才会打包公共模块
          minChunks: 1  // 最少引入了1次
        },
        // 公共模块
        common: {
          chunks: 'initial',
          name: 'common',
          minSize: 100, // 大小超过100个字节
          minChunks: 3  // 最少引入了3次
        }
      }
    }
  }
  // ...
}
```

*在js中异步引入其他模块，使用webpack的api*
```js
import('./module1.js');
```
或
```js
require.ensure([], function () {
   require('./module1.js')
})
```

***
以上参考
[带你深度解锁Webpack系列(优化篇)](https://juejin.im/post/5e6cfdc85188254913107c1f)