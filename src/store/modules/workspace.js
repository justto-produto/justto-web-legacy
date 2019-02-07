const workspaceModule = {
  state: {
    name: '',
    status: '',
    subdomain: '',
    negotiators: []
  },
  mutations: {
    updateWorkspace (state, response) {
      // eslint-disable-next-line
      axios.defaults.headers.common['Workspace'] = response.subDomain
      if (response) state.name = response.name
      if (response) state.status = response.status
      if (response) state.subdomain = response.subDomain
    },
    getError (state) {
      state.status = 'error'
    },
    clearWorkspace (state) {
      state.name = ''
      state.status = ''
      state.subdomain = ''
    },
    setWorkspaceNegotiators (state, response) {
      state.negotiators = response
    }
  },
  actions: {
    myWorkspace ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('/workspaces/my')
          .then(response => {
            commit('updateWorkspace', response.data[0])
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
            commit('updateWorkspace', response.data)
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    inviteTeammates ({ commit, state }, teammates) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('/workspaces/invite-teammates/' + state.subdomain, teammates)
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
    },
    whatsappCreate ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('/workspaces/whatsapp/create/' + state.subdomain)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    whatsappSend ({ commit, state }, object) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('/workspaces/whatsapp/send/' + state.subdomain, object)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    whatsappStart ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('/workspaces/whatsapp/start/' + state.subdomain)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    whatsappStatus ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('/workspaces/whatsapp/status/' + state.subdomain)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    whatsappStop ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('/workspaces/whatsapp/stop/' + state.subdomain)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    getWorkspaceNegotiators ({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('/workspaces/negotiators', {data: {}})
          .then(response => {
            var negotiators = []
            for (let id of response.data) {
              dispatch('getPerson', id).then(response2 => {
                negotiators.push(response2.data)
                if (id === response.data.slice(-1)[0]) {
                  commit('setWorkspaceNegotiators', negotiators)
                  resolve(response.data)
                }
              })
            }
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

export default workspaceModule
