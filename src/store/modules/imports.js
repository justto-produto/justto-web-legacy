const imports = {
  state: {
  },
  mutations: {
  },
  actions: {
    getImportsHistory ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('https://da05004f-ce2f-481a-84e2-a5efd07c8c2a.mock.pstmn.io/imports/history')
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
