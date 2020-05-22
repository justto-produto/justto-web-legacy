const imports = {
  state: {
    file: undefined,
    map: [],
  },
  mutations: {
    setImportsFile(state, file) {
      state.file = file
    },
    removeImportsFile(state) {
      state.file = undefined
      state.map = []
    },
    setImportsMap(state, map) {
      state.map = map
    },
    removeImportsMap(state, map) {
      state.map = []
    },
  },
  actions: {
    getImportsHistory() {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/imports/history')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getImportsColumns({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/imports/' + state.file.id + '/columns')
          .then(response => {
            if (response.status === 204) {
              setTimeout(function() {
                resolve(dispatch('getImportsColumns'))
              }, 3000)
            } else {
              commit('setImportsMap', response.data)
              resolve()
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getImportsTags({ state }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/imports/' + state.file.id + '/tags')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    mapImportColumns({ state }, map) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/imports/'+ state.file.id + '/map', map)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    uploadImportFile({ commit }, file) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/imports/upload', file)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    startGeneseRunner({ state }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/geneserunner/' + state.file.id + '/start')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    validateGeneseRunner({ state }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/geneserunner/' + state.file.id + '/validate')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  },
  getters: {
    importedFileName: state => state.file ? state.file.file_name : null,
    hasImportsFile: state => {
      return state.file !== undefined
    },
  },
}

export default imports
