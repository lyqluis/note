const fs = require('fs')
const path = require('path')

/**
 * @func: 获取静态资源
 * @param {String} dirPath 文件的相对路径，默认为static目录
 * @return {async Function} middleware 
 */
module.exports = (dirpath = './static') => {
  return async (ctx, next) => {
    // 判断url中是否有static关键词
    if (ctx.url.indexOf('/static') === 0) {
      const baseurl = path.resolve(__dirname, dirpath)  // 静态资源目录绝对路径
      const filepath = baseurl + ctx.url.replace('/static', '') // 目标文件绝对路径

      try {
        const filestats = fs.statSync(filepath);
        if (filestats.isDirectory()) {
          const res = []
          const dir = fs.readdirSync(filepath)  // 读取目录，返回目录内文件数组
          dir.forEach(filename => {
            const a = `<a href='${ctx.url}/${filename}'>${filename}</a>`
            if (filename.indexOf('.') >= 0) {
              res.push(`<p>file: ${a}</p>`)
            } else {
              res.push(`<p style="color: red">dir: ${a}</p>`)
            }
          })
          ctx.body = res.join('')
        } else {
          // 文件
          const res = fs.readFileSync(filepath)
          ctx.body = res
        }
      } catch (e) {
        ctx.body = '404 not found'
      }
      return
    }

    // 不是静态资源，调用下一个中间件
    await next()
  }
}