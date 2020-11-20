export default function ({ route, redirect, store }) {
  // 通过context.store访问vuex中的全局状态
  // 通过vuex中令牌存在与否判断是否登录
  if (!store.state.user.token) {
    console.log(route)
    // 重定向到登陆页面，并且用route.query来保存本来要转跳的地址
    redirect("/login?redirect=" + route.path);
  }
}