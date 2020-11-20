// 模拟后台数据
const koa = require('koa')
const app = new koa()
// 处理post请求参数的模块
const bodyparser = require('koa-bodyparser')
// 路由的配置，所有api增加前缀 '/api'
const router = require('koa-router')({ prefix: '/api' })

// 设置cookie密钥
app.keys = ['some secret', 'another secrect']

const goods = [
  { id: 1, name: "cup", price: 999 },
  { id: 2, name: "apple", price: 9 },
  { id: 3, name: "orange", price: 9 },
  { id: 4, name: "water", price: 99 },
]

// 设置路由
// /api/goods
router.get('/goods', ctx => {
  ctx.body = {
    ok: 1,
    goods
  }
})

// /api/detail
router.get('/detail', ctx => {
  ctx.body = {
    ok: 1,
    data: goods.find(good => good.id === ctx.query.id)
  }
})

// /api/login
router.post('/login', ctx => {
  const user = ctx.request.body
  if (user.username === "jerry" && user.password === "123") {
    // 将token存入cookie
    const token = 'a mock token'
    ctx.cookies.set('token', token)
    ctx.body = { ok: 1, token }
  } else {
    ctx.body = { ok: 0 }
  }
})

// 解析post数据
app.use(bodyparser())
// 注册路由
app.use(router.routes())

app.listen(8080, () => console.log('server api:8080 ok!'))