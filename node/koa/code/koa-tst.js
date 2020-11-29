const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class MY_KOA {
  constructor() {
    this.middlewares = [] // 中间件数组
  }

  use(middleware) {
    // 将中间件推入数组
    this.middlewares.push(middleware)
  }

  listen(...args) {
    const server = http.createServer(async (req, res) => {
      // 创建context
      const ctx = this.createContext(req, res)
      // 合并中间件
      const middleware = this.compose(this.middlewares)
      await middleware(ctx)
      // 结束响应
      res.end(ctx.body)
    })
    server.listen(...args)
  }

  // 构建上下文
  createContext(req, res) {
    const ctx = Object.create(context)
    ctx.request = Object.create(request)
    ctx.response = Object.create(response)

    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res

    return ctx
  }

  // 合成函数
  compose(middlewares) {
    return function (ctx) { // 传⼊上下⽂
      return dispatch(0)
      function dispatch(i) {
        let fn = middlewares[i]
        if (!fn) return Promise.resolve()
        return Promise.resolve(
          // 将上下文和next传⼊中间件，middleware(ctx,next)
          fn(ctx, function next() {
            return dispatch(i + 1)
          })
        );
      }
    };
  }

}

module.exports = MY_KOA