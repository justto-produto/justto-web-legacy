const dispute = {
  state: {
  },
  mutations: {
  },
  actions: {
    editNegotiators ({ commit }, negotiators) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/disputes/' + negotiators.disputeId + '/negotiators', {negotiatorsId: negotiators.negotiators})
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
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
    getDisputes ({ rootState }, query) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/search/' + rootState.workspaceModule.id + '/t_el_disputes/', query)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    exportDisputes ({ rootState }, query) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/search/' + rootState.workspaceModule.id + '/t_el_disputes/export', query)
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
    },
    editCase ({ commit }, caseForm) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/disputes/' + caseForm.disputeId + '/update', {
          id: caseForm.disputeId,
          upperRange: caseForm.upperRange,
          expirationDate: caseForm.expirationDate,
          lastOffer: caseForm.lastOffer,
          description: caseForm.description
        })
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    editCaseReason ({ commit }, params) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/disputes/' + params.disputeId + '/reasons/' + params.reasonId + '/update', params.body)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    removeCase ({ commit }, disputeId) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.delete('api/disputes/' + disputeId)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    removePhone ({ commit }, removePhoneBody) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.delete('api/disputes/' + removePhoneBody.disputeId + '/phones/' + removePhoneBody.id)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    removeEmail ({ commit }, removeEmailBody) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.delete('api/disputes/' + removeEmailBody.disputeId + '/emails/' + removeEmailBody.id)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    removeOab ({ commit }, removeOabBody) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.delete('api/disputes/' + removeOabBody.disputeId + '/oab/' + removeOabBody.id)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
  }
}

export default dispute
