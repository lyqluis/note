打包不包含config

```javascript
// vue.config.js
configureWebpack: config => {
  if (process.env.NODE_ENV === 'production') {
    config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
  }
}
```
**必须添加环境判断代码，因为development环境下config.optimization是undefined*