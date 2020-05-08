import router from '@/router'
import axiosDispatcher from '@/store/axiosDispatcher.js'

const account = {
  state: {
    id: '',
    name: '',
    email: '',
    token: localStorage.getItem('justoken') || ''
  },
  mutations: {
    setToken (state, token) {
      if (token) state.token = token
    },
    logout (state) {
      state.id = ''
      state.name = ''
      state.email = ''
      state.token = ''
    },
    setUser (state, response) {
      if (response.id) state.id = response.id
      if (response.name) state.name = response.name
      if (response.email) state.email = response.email
    }
  },
  actions: {
    myAccount () {
      return axiosDispatcher({
        url: 'api/accounts/my',
        mutation: 'setUser'
      })
    },
    register ({ commit }, loginForm) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/accounts/register', loginForm)
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
        axios.put('api/accounts/activate/' + token)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    login ({ commit }, credentials) {
      // eslint-disable-next-line
      delete axios.defaults.headers.common['Authorization']
      // eslint-disable-next-line
      delete axios.defaults.headers.common['Workspace']
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/accounts/token', credentials)
          .then(response => {
            const token = response.data.token
            // eslint-disable-next-line
            axios.defaults.headers.common['Authorization'] = token
            localStorage.setItem('justoken', token)
            commit('setToken', token)
            resolve(response)
          })
          .catch(error => {
            localStorage.removeItem('justoken')
            reject(error)
          })
      })
    },
    refreshToken ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/accounts/refresh-token')
          .then(response => {
            // eslint-disable-next-line
            delete axios.defaults.headers.common['Authorization']
            const token = response.data.token
            // eslint-disable-next-line
            axios.defaults.headers.common['Authorization'] = token
            localStorage.setItem('justoken', token)
            commit('setToken', token)
            resolve(response)
          })
          .catch(error => {
            localStorage.removeItem('justoken')
            reject(error)
          })
      })
    },
    logout ({ commit }, options) {
      commit('logout')
      commit('clearWorkspace')
      commit('clearDisputes')
      commit('clearDisputeTab')
      commit('clearDashboard')
      localStorage.removeItem('justoken')
      // eslint-disable-next-line
      delete axios.defaults.headers.common['Authorization']
      if (options && options.redirect === false) {
      } else router.push('/login')
    },
    forgotPassword ({ commit }, email) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/accounts/reset-password?email=' + email)
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
        axios.put('api/accounts/new-password/' + data.token, { password: data.password })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updatePassword ({ commit }, form) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/accounts/my/update-password', form)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
    accountToken: state => state.token,
    isLoggedIn: state => !!state.token,
    accountId: state => state.id,
    accountEmail: state => state.email,
    isJusttoAdmin: state => {
      if (state.email.endsWith('@justto.com.br')) return true
      return false
    }
  }
}

export default account
