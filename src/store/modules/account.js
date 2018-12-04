const account = {
  state: {
    id: '',
    email: '',
    name: '',
    oab: {}
  },
  mutations: {
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
            commit('authError')
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
  }
}

export default account
