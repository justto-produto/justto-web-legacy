const workspace = {
  state: {
    name: '',
    status: '',
    subDomain: ''
  },
  mutations: {
    changeWorkspace (state, response) {
      if (response) state.name = response.name
      if (response) state.status = response.status
      if (response) state.subDomain = response.subDomain
    },
    getError (state) {
      state.status = 'error'
    },
    clearWorkspace (state) {
      state.name = ''
      state.status = ''
      state.subDomain = ''
    }
  },
  actions: {
    myWorkspace ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('/workspaces/my')
          .then(response => {
            commit('changeWorkspace', response.data[0])
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    verifyAvailability ({ commit }, subdomain) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('/workspaces/sub-domain-availability', {subDomain: subdomain})
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    createWorkpace ({ commit }, object) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('/workspaces', object)
          .then(response => {
            commit('changeWorkspace', response.data)
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    inviteTeammates ({ commit, state }, teammates) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('/workspaces/invite-teammates/' + state.subDomain, teammates)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    readyWorkspace ({ commit }, workspace) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('/workspaces/ready/' + workspace)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
    hasWorkspace: state => {
      return state.status !== '' && state.status !== 'CREATING'
    },
    creatingWorkspace: state => {
      return state.status === 'CREATING'
    }
  }
}

export default workspace
