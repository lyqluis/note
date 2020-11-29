const MY_KOA = require('./koa-tst')
const app = new MY_KOA()
const static = require('./static')

app.use(static(__dirname + '/static'))

app.use(require("./interceptor"))
// app.use((ctx, next) => {
//   ctx.body = 'hello my koa'
//   next()
// })

// const Router = require('./router')
// const router = new Router()

// router.get('/index', async ctx => { ctx.body = 'index page' })
// router.get('/post', async ctx => { ctx.body = 'post page' })
// router.get('/list', async ctx => { ctx.body = 'list page' })
// router.post('/index', async ctx => { ctx.body = 'post page' })

// // 路由实例输出⽗中间件，router.routes()返回一个中间件
// const routes = router.routes()
// app.use(routes)

app.listen(3003, () => {
  console.log('listen@3003')
})
