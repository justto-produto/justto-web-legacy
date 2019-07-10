const disputeActions = {
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
  updateDispute ({ commit, rootState }, disputeId) {
    setTimeout(function () {
      // eslint-disable-next-line
      axios.post('api/search/' + rootState.workspaceModule.id + '/t_el_disputes/', {
        query: { bool: { must: [{ match: { disputeid: disputeId } }] } } })
        .then(response => {
          if (response.data.length > 0) {
            commit('updateDisputeList', response.data[0])
          } else {
            commit('removeDisputeFromList', disputeId)
          }
        })
    }, 1000)
  },
  getDisputes ({ commit, rootState }, query) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/search/' + rootState.workspaceModule.id + '/t_el_disputes/', query)
        .then(response => {
          commit('setDisputes', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getDisputeById ({ state }, id) {
    return new Promise((resolve, reject) => {
      let dispute = state.disputes.find((dispute) => {
        return dispute.disputeid === id
      })
      if (dispute) resolve(dispute)
    })
  },
  exportDisputes ({ rootState }, disputeIds) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/search/' + rootState.workspaceModule.id + '/t_el_disputes/export', {
        query: { bool: { must: [{ terms: { disputeid: disputeIds } }] } } })
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
  getDisputeStatuses ({ commit }, status) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/outcome-reasons/' + status)
        .then(response => {
          commit('setDisputeStatuses', { label: status, value: response.data })
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
  sendDisputeAction ({ commit }, params) {
    return new Promise((resolve, reject) => {
      let request
      if (params.action === 'restart-engagement') {
        // eslint-disable-next-line
        request = axios.patch('api/disputes/' + params.disputeId + '/' + params.action)
      } else {
        // eslint-disable-next-line
        request = axios.put('api/disputes/' + params.disputeId + '/' + params.action, params.body)
      }
      request
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  editDispute ({ commit }, disputeForm) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/disputes/' + disputeForm.disputeId + '/update', {
        id: disputeForm.disputeId,
        upperRange: disputeForm.upperRange,
        expirationDate: disputeForm.expirationDate,
        lastOffer: disputeForm.lastOffer,
        description: disputeForm.description
      })
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
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
  editDisputeReason ({ commit }, params) {
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
  removeDispute ({ commit }, disputeId) {
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
}

export default disputeActions
