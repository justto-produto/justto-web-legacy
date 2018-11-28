const auth = {
  state: {
    status: '',
    token: localStorage.getItem('justoken') || '',
    user: {},
    workspace: []
  },
  mutations: {
    authRequest (state) {
      state.status = 'loading'
    },
    authSuccess (state, response) {
      state.status = 'success'
      if (response.token) state.token = response.token
      if (response.user) state.user = response.user
      if (response.workspace) state.workspace = response.workspace
    },
    authError (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.token = ''
      state.user = {}
      state.workspace = []
    }
  },
  actions: {
    my ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('/accounts/my', {headers: { 'Authorization': localStorage.getItem('justoken')}})
          .then(accountsResponse => {
            // eslint-disable-next-line
            axios.get('/workspaces/my', { headers: { 'Authorization': localStorage.getItem('justoken') } })
              .then(workspacesResponse => {
                commit('authSuccess', {
                  user: accountsResponse.data,
                  workspace: workspacesResponse.data
                })
                resolve({ accountsResponse, workspacesResponse })
              })
              .catch(error => {
                commit('authError')
                reject(error)
              })
          })
          .catch(error => {
            commit('authError')
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
            localStorage.setItem('justoken', token)
            // eslint-disable-next-line
            axios.defaults.headers.common['Authorization'] = token
            // eslint-disable-next-line
            axios.get('/accounts/my')
              .then(response => {
                commit('authSuccess', { token: token, user: response.data })
                resolve(response)
              })
              .catch(error => {
                commit('authError')
                localStorage.removeItem('justoken')
                reject(error)
              })
          })
          .catch(error => {
            commit('authError')
            localStorage.removeItem('justoken')
            reject(error)
          })
      })
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('justoken')
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
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    hasWorkspace: state => !state.workspace
  }
}

export default auth
