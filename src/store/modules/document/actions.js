const actions = {
  getDocumentModels ({ commit }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/documents/model')
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  createDocumentByModel ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/documents/' + params.modelId + '/' + params.disputeId)
        .then(response => {
          if (response.status === 204) {
            resolve(null)
          } else resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getDocumentByDisputeId ({ commit }, disputeId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/documents/' + disputeId)
        .then(response => {
          if (response.status === 204) {
            resolve(null)
          } else resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  setDocumentSigners ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/documents/signer/' + params.disputeId, {
        ...params.body
      }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default actions
