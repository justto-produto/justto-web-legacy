const workspace = {
  state: {
  },
  mutations: {
  },
  actions: {
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
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    finishWorkspace ({ commit }, responses) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        // axios.post('/accounts/oab', { number: responses.oab, state: responses.state})
        //   .then(response => {
        //     resolve(response.data)
        //   }).catch(error => {
        //     reject(error)
        //   })
        // eslint-disable-next-line
        axios.post('/invite-teammates/'+responses.workspace, responses.teammates)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
  }
}

export default workspace
