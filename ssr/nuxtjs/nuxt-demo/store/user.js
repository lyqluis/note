export const state = () => ({
  token: '',
})

export const mutations = {
  init(state, token) {
    state.token = token
  }
}

export const getters = {
  isLogin(state) {
    return !!state.token
  }
}

export const actions = {
  login({ commit, getters }, user) {
    return this.$axios.$post('/api/login', user)
      .then(({ token }) => {
        if (token) {
          commit("init", token)
        }
        return getters.isLogin
      })
  }
}