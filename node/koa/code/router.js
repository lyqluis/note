class Router {
  constructor() {
    this.stack = []
  }

  register(path, methods, middleware) {
    const route = { path, methods, middleware }
    this.stack.push(route)
  }

  get(path, middleware) {
    this.register(path, 'get', middleware)
  }

  post(path, middleware) {
    this.register(path, 'post', middleware)
  }

  // @return { middleware }
  routes() {
    const stack = this.stack
    return async function (ctx, next) {
      let currentPath = ctx.url
      let route
      
      // 匹配路由
      for (let i = 0, len = stack.length; i < len; i++) {
        const { path, methods, middleware } = stack[i]
        if (currentPath === path && methods.indexOf(ctx.method) >= 0) {
          route = middleware
          break
        }
      }

      if (typeof route === 'function') {
        route(ctx, next)
        return
      }
      await next()
    }
  }
}

module.exports = Router