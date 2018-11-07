const auth = {
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: {}
  },
  mutations: {
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, token, user) {
      state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.token = ''
    }
  },
  actions: {
    register ({ commit }, loginForm) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('/accounts/register', loginForm)
          .then(response => {
            resolve(response)
          }).catch(err => {
            reject(err)
          })
      })
    },
    activate ({ commit }, token) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('/accounts/activate/' + token)
          .then(response => {
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    login ({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        // eslint-disable-next-line
        axios.post('/accounts/token', user)
          .then(response => {
            const token = response.data.token
            const user = response.data.user
            localStorage.setItem('token', token)
            // eslint-disable-next-line
            axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', token, user)
            resolve(response)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('token')
        // eslint-disable-next-line
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    },
    forgotPassword ({ commit }, email) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('/accounts/reset-password?email=' + email)
          .then(response => {
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    resetPassword ({ commit }, data) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('/accounts/new-password/' + data.token, { password: data.password })
          .then(response => {
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status
  }
}

export default auth
