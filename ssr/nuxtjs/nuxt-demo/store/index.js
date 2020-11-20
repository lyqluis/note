export const actions = {
  nuxtServerInit({ commit }, {app}) {
    // $cookie为cookie-universal-nuxt模块提供的api
    const token = app.$cookies.get('token')
    if (token) {
      commit('user/init', token)
    }
  }
}