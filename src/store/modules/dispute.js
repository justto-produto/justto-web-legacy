const dispute = {
  state: {
  },
  mutations: {
  },
  actions: {
    getDispute ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('disputes/' + id + '/overview')
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
        axios.post('https://justto.app/disputes/_search', query)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // getDisputeSummary ({ commit }, id) {
    //   return new Promise((resolve, reject) => {
    //     // eslint-disable-next-line
    //     axios.get('disputes/' + id + '/summary')
    //       .then(response => {
    //         resolve(response.data)
    //       })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },
    // getDisputeSubscribe ({ commit }, id) {
    //   return new Promise((resolve, reject) => {
    //     // eslint-disable-next-line
    //     axios.get('disputes/' + id + '/subscribe')
    //       .then(response => {
    //         resolve(response.data)
    //       })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },
    getDisputeMessages ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('disputes/' + id + '/messages')
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
        axios.put('disputes/batch', body)
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
        axios.post('disputes/' + body.disputeId + '/note', body)
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
