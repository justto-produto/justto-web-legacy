const imports = {
  actions: {
    getImportsHistory () {
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
    getImportsColumns () {
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
    getImportsTags () {
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
    mapImportColumns () {
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
  }
}

export default imports
