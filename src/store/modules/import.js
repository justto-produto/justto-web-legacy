const imports = {
  state: {
    file: undefined
  },
  mutations: {
    setImportsFile (state, file) {
      state.file = file
    },
    removeImportsFile (state) {
      state.file = undefined
    }
  },
  actions: {
    getImportsHistory () {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('http://homol.justto.com.br/api/imports/history')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getImportsColumns ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('http://homol.justto.com.br/api/imports/' + state.file.id + '/columns')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getImportsTags () {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('http://homol.justto.com.br/api/imports/tags')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    mapImportColumns () {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('http://homol.justto.com.br/api/imports/map/42')
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
    hasImportsFile: state => {
      return state.file !== undefined
    }
  }
}

export default imports
