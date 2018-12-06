import router from '@/router'

const account = {
  state: {
    id: '',
    email: '',
    name: '',
    oab: {},
    oabNumber: '',
    oabState: '',
    status: '',
    token: localStorage.getItem('justoken') || ''
  },
  mutations: {
    authRequest (state) {
      state.status = 'loading'
    },
    authSuccess (state, token) {
      state.status = 'success'
      if (token) state.token = token
    },
    authError (state) {
      state.status = 'error'
    },
    logout (state) {
      state.id = ''
      state.email = ''
      state.name = ''
      state.oab = {}
      state.oabNumber = ''
      state.oabState = ''
      state.status = ''
      state.token = ''
    },
    changeUser (state, response) {
      if (response.user.id) state.id = response.user.id
      if (response.user.email) state.email = response.user.email
      if (response.user.name) state.name = response.user.name
      if (response.user.oab) state.oab = response.user.oab
    }
  },
  actions: {
    myAccount ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('/accounts/my')
          .then(response => {
            commit('changeUser', { user: response.data })
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    register ({ commit }, loginForm) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('/accounts/register', loginForm)
          .then(response => {
            resolve(response)
          }).catch(error => {
            reject(error)
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
          .catch(error => {
            reject(error)
          })
      })
    },
    login ({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        commit('authRequest')
        // eslint-disable-next-line
        axios.post('/accounts/token', credentials)
          .then(response => {
            const token = response.data.token
            // eslint-disable-next-line
            axios.defaults.headers.common['Authorization'] = token
            localStorage.setItem('justoken', token)
            commit('authSuccess', token)
            resolve(response)
          })
          .catch(error => {
            commit('authError')
            localStorage.removeItem('justoken')
            reject(error)
          })
      })
    },
    logout ({ commit }, options) {
      return new Promise((resolve, reject) => {
        commit('logout')
        commit('clearWorkspace')
        localStorage.removeItem('justoken')
        // eslint-disable-next-line
        delete axios.defaults.headers.common['Authorization']
        if (options && options.redirect === false) {
        } else router.push('login')
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
          .catch(error => {
            reject(error)
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
          .catch(error => {
            reject(error)
          })
      })
    },
    updateOab ({ commit }, oamForm) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('/accounts/oab', { number: oamForm.oab, state: oamForm.state})
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    syncInbox ({ commit }, object) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('/accounts/sync-inbox', object)
          .then(response => {
            resolve(response)
          }).catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status
  }
}

export default account
