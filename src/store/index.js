import Vue from 'vue'
import Vuex from 'vuex'
// import VueAuthenticate from 'vue-authenticate'

Vue.use(Vuex)

// const vueAuth = new VueAuthenticate(Vue.prototype.$http, {
//   baseUrl: 'http://localhost:4000'
// })

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    ufList: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'],
    importList: []
  },
  getters: {
    // isAuthenticated () {
    //   return vueAuth.isAuthenticated()
    // }
  },
  mutations: {
    // isAuthenticated (state, payload) {
    //   state.isAuthenticated = payload.isAuthenticated
    // }
  },
  actions: {
    // login (context, payload) {
    //   vueAuth.login(payload.user, payload.requestOptions).then((response) => {
    //     context.commit('isAuthenticated', {
    //       isAuthenticated: vueAuth.isAuthenticated()
    //     })
    //   })
    // }
  }
})
