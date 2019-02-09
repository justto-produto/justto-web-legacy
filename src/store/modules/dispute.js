const dispute = {
  state: {
  },
  mutations: {
  },
  actions: {
    getDispute ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('disputes/' + id)
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
  }
}

export default dispute
