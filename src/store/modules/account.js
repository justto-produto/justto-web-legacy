const account = {
  actions: {
    updateOab ({ commit }, oamForm) {
      return new Promisse((resolve,reject) => {
        // eslint-disable-next-line
        axios.put('/accounts/oab', { number: responses.oab, state: responses.state})
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
