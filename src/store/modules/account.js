const account = {
  actions: {
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
