module.exports = async function (ctx, next) {
  const { req } = ctx
  const blackList = ['127.0.0.1']
  const ip = getClientIP(req)
  // 拦截黑名单中的ip
  if (blackList.includes(ip)) {
    ctx.body = "not allowed"
  } else {
    await next()
  }
}

function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"] || // 判断是否有反向代理理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress
  )
}