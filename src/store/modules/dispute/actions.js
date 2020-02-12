import Vue from 'vue'
import moment from 'moment'
const FileSaver = require('file-saver')

const queryBuilder = q => {
  let query = '?'
  for (let [key, value] of Object.entries(q)) {
    if (['initialSize', 'total'].includes(key)) continue
    if (!value) continue
    if (Array.isArray(value)) {
      if (!value.length) continue
      if (['expirationDate', 'dealDate', 'importingDate'].includes(key)) {
        query = query + key + 'Start' + '=' + moment(value[0]).startOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]') + '&'
        query = query + key + 'End' + '=' + moment(value[1]).endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]') + '&'
      } else {
        for (let v of value) {
          if (v === 'PENDING' && key === 'prescriptions') {
            query = query + 'status' + '=' + v + '&'
          } else {
            query = query + key + '=' + v + '&'
          }
        }
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
  SOCKET_ADD_DISPUTE ({ commit, state, rootState }, disputeChanged) {
    if (state.dispute.id === disputeChanged.id) {
      state.dispute = disputeChanged
    } else {
      let disputeIndex = state.disputes.findIndex(d => disputeChanged.id === d.id)
      if (disputeIndex !== -1) {
        let dispute = state.disputes.find(d => disputeChanged.id === d.id)
        if (dispute.status !== disputeChanged.status && state.tab !== '3') {
          commit('disputeSetHasNew', true)
        } else {
          if (dispute.updatedAt && disputeChanged.updatedAt && moment(dispute.updatedAt.dateTime).isSameOrBefore(moment(disputeChanged.updatedAt.dateTime))) {
            Vue.set(state.disputes, disputeIndex, disputeChanged)
          } else {
            Vue.set(state.disputes, disputeIndex, disputeChanged)
          }
        }
      } else {
        if (state.query.status.includes(disputeChanged.status)) {
          commit('disputeSetHasNew', true)
        }
      }
    }
    commit('deleteMessageResumeByDisputeId', disputeChanged.id)
  },
  SOCKET_REMOVE_DISPUTE ({ commit }) {
    commit('disputeSetHasNew', true)
  },
  getDispute ({ commit }, id) {
    return new Promise((resolve, reject) => {
      commit('clearDispute')
      // eslint-disable-next-line
      axios.get('api/disputes/' + id + '/vm')
        .then(response => {
          commit('setDispute', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  linkDisputeBankAccounts ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/disputes/' + params.disputeId + '/bank-accounts/' + params.bankAccountId)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  unlinkDisputeBankAccounts ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.delete('api/disputes/' + params.disputeId + '/bank-accounts/' + params.bankAccountId)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getDisputeDTO ({ commit }, id) {
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
        commit('disputeSetHasNew', false)
        resolve(response.data)
      }).catch(error => {
        commit('clearDisputes')
        reject(error)
      })
    })
  },
  searchDisputes ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/search?' + params.key + '=' + params.value).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  exportDisputes ({ rootState, state }, disputeIds) {
    return new Promise((resolve, reject) => {
    // eslint-disable-next-line
    axios.get('api/disputes/export'+ queryBuilder(state.query), {
        responseType: 'arraybuffer'
      }).then(response => {
        const blob = new Blob([response.data], {
          // type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          type: 'application/octet-stream'
        })
        let fileName = new Date().getTime() + '.xlsx'
        FileSaver.saveAs(blob, fileName)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  editRole ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/disputes/' + params.disputeId +'/dispute-roles', params.disputeRole)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  removeRole ({ commit }, role) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.delete('api/disputes/' + role.disputeId + '/role/' + role.roleId, { disputeId: role.disputeId, id: role.roleId })
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getNotVisualizeds ({ commit }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/summary/not-visualized')
        .then(response => {
          commit('setSummaryNotVisualizeds', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getNearExpirations ({ commit }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/summary/near-expiration')
        .then(response => {
          commit('setSummaryNearExpirations', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  editCaseReason ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/disputes/' + params.disputeId + '/update-reason', {
        reason: params.reasonValue
      })
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
      axios.put('api/disputes/actions/batch', body)
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
  deleteDisputeNote ({ commit }, noteId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.delete('api/disputes/note/' + noteId)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  editDisputeNote ({ commit }, note) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/disputes/note/' + note.activeOccurrence.id, {
        note: note.newNoteContent,
        disputeId: note.activeOccurrence.disputeId
      })
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
      } else if (params.action === 'settled' && params.value) {
        // eslint-disable-next-line
        request = axios.put(`api/disputes/${params.disputeId}/settled?value=${params.value}`)
      } else if (params.action === 'enrich') {
        // eslint-disable-next-line
        request = axios.patch('api/fusion-runner/enrich/' + params.disputeId)
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
  enrichDispute ({ commit }, disputeId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.patch('api/fusion-runner/enrich/' + disputeId)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  restartDisputeRoleEngagement ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.patch('api/disputes/' + params.disputeId + '/restart-engagement/' + params.disputeRoleId)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  restartEngagementByContact ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.patch('/api/messages/engagement/' + params.disputeId + '/address/' + params.contact)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  editDispute ({ commit }, dispute) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/disputes/' + dispute.id + '/update', dispute)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  editDisputeOffer ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/disputes/' + params.disputeId + '/offer', {
        attribute: { id: params.objectId },
        role: { id: params.roleId },
        value: params.value
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
      axios.put('api/disputes/' + params.disputeId + '/update-reason/', params.body)
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
  disputeSetVisualized ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.patch('api/disputes/' + params.disputeId + '/visualized?visualized=' + params.visualized)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getDisputeOccurrences ({ commit, state }, disputeId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/' + disputeId + '/occurrences?size=' + state.occurrencesSize + '&sort=createdAt,desc&sort=id,desc')
        .then(response => {
          commit('setDisputeOccurrences', response.data.content)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getDisputeCommunications ({ commit, state }, disputeId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get(`api/disputes/${disputeId}/occurrences/type/INTERACTION?size=${state.occurrencesSize}&sort=createdAt,desc&sort=id,desc`)
        .then(response => {
          commit('setDisputeOccurrences', response.data.content)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getDisputeNotes ({ commit, state }, disputeId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/' + disputeId + '/occurrences/type/NOTE')
        .then(response => {
          commit('setDisputeOccurrences', response.data.content)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  loadDisputeOccurrences ({ commit }, disputeId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/disputes/' + disputeId + '/occurrences/load')
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getRespondents ({ commit, state }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/respondent-names')
        .then(response => {
          commit('setRespondents', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  newDisputeRole ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/disputes/' + params.disputeId + '/dispute-roles', params.role)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  sendDisputeCounterProposal ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/disputes/' + params.disputeId + '/counterproposal', {
        attribute: { id: params.objectId },
        role: { id: params.roleId },
        value: params.value
      }).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getMessageSummary ({ commit }, messageId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/interactions/sent-message-summary/' + messageId)
        .then(response => {
          commit('setRespondents', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  }
}

export default disputeActions
