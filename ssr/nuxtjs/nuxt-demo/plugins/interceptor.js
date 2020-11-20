export default function ({ $axios, store }) {
  $axios.onRequest(config => {
    if (store.state.user.token) {
      // 添加请求头的Authorizatio: toekn
      config.headers.Authorization = "Bearer " + store.state.user.token
    }
    return config
  })
}
