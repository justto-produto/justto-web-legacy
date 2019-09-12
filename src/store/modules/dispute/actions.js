const FileSaver = require('file-saver')
import { getRoles } from '@/plugins/jusUtils'

const queryBuilder = q => {
  let query = '?'
  console.log(q);
  for (let [key, value] of Object.entries(q)) {
    if (['initialSize', 'total'].includes(key)) break
    if (!value) break
    if (Array.isArray(value)) {
      for (let v of value) {
        query = query + key + '=' + v + '&'
      }
    } else if (key === 'page') {
      query = query + key + '=' + (value - 1) + '&'
    } else {
      query = query + key + '=' + value + '&'
    }
  }
  return query
}

const disputeActions = {
  getDispute ({ commit }, id) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/' + id)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getDisputes ({ commit, state }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/filter' + queryBuilder(state.query)).then(response => {
        commit('setDisputes', response.data)
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  // editRole ({ commit }, params) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.put('api/disputes/' + params.disputeId +'/dispute-roles', params.disputeRole)
  //       .then(response => {
  //         resolve(response.data)
  //       }).catch(error => {
  //         reject(error.response)
  //       })
  //   })
  // },
  // removeRole ({ commit }, role) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.delete('api/disputes/' + role.disputeId + '/role/' + role.roleId, { disputeId: role.disputeId, id: role.roleId })
  //       .then(response => {
  //         resolve(response.data)
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // editCaseReason ({ commit }, params) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.put('api/disputes/' + params.disputeId + '/update-reason', {
  //       reason: params.reasonValue
  //     })
  //       .then(response => {
  //         resolve(response.data)
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // getDisputeOccurrences ({ commit }, id) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.get('api/disputes/' + id + '/occurrences?sort=id,asc&size=100000')
  //       .then(response => {
  //         resolve(response.data)
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // getDisputeStatuses ({ commit }, status) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.get('api/disputes/outcome-reasons/' + status)
  //       .then(response => {
  //         commit('setDisputeStatuses', { label: status, value: response.data })
  //         resolve(response.data)
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // sendBatchAction ({ commit }, body) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.put('api/disputes/actions/batch', body)
  //       .then(response => {
  //         resolve(response.data)
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // sendDisputeNote ({ commit }, body) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.post('api/disputes/' + body.disputeId + '/note', body)
  //       .then(response => {
  //         resolve(response.data)
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // sendDisputeAction ({ commit }, params) {
  //   return new Promise((resolve, reject) => {
  //     let request
  //     if (params.action === 'restart-engagement') {
  //       // eslint-disable-next-line
  //       request = axios.patch('api/disputes/' + params.disputeId + '/' + params.action)
  //     } else if (params.action === 'enrich') {
  //       // eslint-disable-next-line
  //       request = axios.patch('api/fusion-runner/enrich/' + params.disputeId)
  //     } else {
  //       // eslint-disable-next-line
  //       request = axios.put('api/disputes/' + params.disputeId + '/' + params.action, params.body)
  //     }
  //     request
  //       .then(response => {
  //         resolve(response.data)
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // editDispute ({ commit }, dispute) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.put('api/disputes/' + dispute.id + '/update', dispute)
  //       .then(response => {
  //         resolve(response.data)
  //       }).catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // editDisputeOffer ({ commit }, params) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.post('api/disputes/' + params.disputeId + '/offer', {
  //       attribute: { id: params.objectId },
  //       role: { id: params.roleId },
  //       value: params.value
  //     })
  //       .then(response => {
  //         resolve(response.data)
  //       }).catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // editNegotiators ({ commit }, negotiators) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.put('api/disputes/' + negotiators.disputeId + '/negotiators', {negotiatorsId: negotiators.negotiators})
  //       .then(response => {
  //         resolve(response.data)
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // editDisputeReason ({ commit }, params) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.put('api/disputes/' + params.disputeId + '/update-reason/', params.body)
  //       .then(response => {
  //         resolve(response.data)
  //       }).catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // removeDispute ({ commit }, disputeId) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.delete('api/disputes/' + disputeId)
  //       .then(response => {
  //         resolve(response.data)
  //       }).catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // disputeVisualized ({ commit }, disputeId) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.patch('api/disputes/' + disputeId + '/visualized/')
  //       .then(response => {
  //         resolve(response.data)
  //       }).catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // loadDisputeOccurrences ({ commit }, disputeId) {
  //   return new Promise((resolve, reject) => {
  //     // eslint-disable-next-line
  //     axios.put('api/disputes/' + disputeId + '/occurrences/load')
  //       .then(response => {
  //         resolve(response.data)
  //       }).catch(error => {
  //         reject(error)
  //       })
  //   })
  // }
}

export default disputeActions
