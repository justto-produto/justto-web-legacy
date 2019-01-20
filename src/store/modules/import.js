const imports = {
  state: {
  },
  mutations: {
  },
  actions: {
    getImportsHistory ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('https://64bd150f-5317-4c5d-abc9-b8271f00f3c4.mock.pstmn.io/imports/history')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getImportsColumns ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('https://64bd150f-5317-4c5d-abc9-b8271f00f3c4.mock.pstmn.io/imports/columns')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getImportsTags ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('https://64bd150f-5317-4c5d-abc9-b8271f00f3c4.mock.pstmn.io/imports/tags')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    mapImportColumns ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('https://64bd150f-5317-4c5d-abc9-b8271f00f3c4.mock.pstmn.io/imports/map/42')
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
