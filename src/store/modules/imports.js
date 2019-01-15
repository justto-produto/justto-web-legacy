const imports = {
  state: {
  },
  mutations: {
  },
  actions: {
    getImportsHistory ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('https://cc6f2346-bf26-4d00-8ad8-b0e7a6a0d4f9.mock.pstmn.io/imports/history')
          .then(response => {
            resolve(response.data)
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

export default imports
