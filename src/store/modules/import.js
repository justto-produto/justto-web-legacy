const imports = {
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
    getImportsColumns () {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('http://homol.justto.com.br/api/imports/columns')
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
  }
}

export default imports
