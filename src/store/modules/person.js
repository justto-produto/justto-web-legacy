const personModule = {
  state: {
  },
  mutations: {
  },
  actions: {
    getPerson ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('/persons/' + id)
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

export default personModule
