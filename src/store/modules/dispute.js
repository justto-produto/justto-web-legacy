const dispute = {
  state: {
  },
  mutations: {
  },
  actions: {
    getDispute ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/disputes/' + id + '/overview')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getDisputes ({ commit }, query) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('disputes/_search', query)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getDisputeMessages ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/disputes/' + id + '/messages')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    sendBatchAction ({ commit }, body) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/disputes/batch', body)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    sendDisputeNote ({ commit }, body) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/disputes/' + body.disputeId + '/note', body)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    sendDisputeAction ({ commit }, body) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/disputes/' + body.disputeId + '/' + body.action)
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

export default dispute
