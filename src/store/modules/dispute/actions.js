import Vue from 'vue'
import axiosDispatcher from '@/store/axiosDispatcher.js'
import { queryBuilder } from '@/utils/jusUtils'
import moment from 'moment'

// const FileSaver = require('file-saver')
let removeDebounce = 0

const disputeActions = {
  SOCKET_ADD_DISPUTE({ commit, state }, disputeChanged) {
    if (state.dispute.id === disputeChanged.id) {
      state.dispute = disputeChanged
    } else {
      const disputeIndex = state.disputes.findIndex(d => disputeChanged.id === d.id)
      if (disputeIndex !== -1) {
        const dispute = state.disputes.find(d => disputeChanged.id === d.id)
        if (dispute.status !== disputeChanged.status && state.tab !== '3') {
          commit('disputeSetHasNew', true)
        } else {
          Vue.set(state.disputes, disputeIndex, disputeChanged)
        }
      } else {
        if (state.query.status.includes(disputeChanged.status)) {
          commit('disputeSetHasNew', true)
        }
      }
    }
    commit('deleteMessageResumeByDisputeId', disputeChanged.id)
  },
  SOCKET_REMOVE_DISPUTE({ dispatch }) {
    clearTimeout(removeDebounce)
    removeDebounce = setTimeout(() => {
      dispatch('getDisputes', 'update')
    }, 1000)
  },
  getDispute({ commit, dispatch }, id) {
    return new Promise((resolve, reject) => {
      commit('clearDispute')
      dispatch('getDisputeProprieties', id)
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
  getDisputeLastAccess({ commit, state }, disputeId) {
    if (state.lastAccess[disputeId]) {
      const time1 = moment(state.lastAccess[disputeId].log)
      const time2 = moment(new Date())
      const dif = time2.diff(time1)
      if (dif <= 3000) {
        return
      }
    }
    return axiosDispatcher({
      url: `api/disputes/${disputeId}/my-last-access`
    }).then(res => {
      commit('setLastAccess', {
        disputeId,
        lastAccessTime: res ? res.lastAccessed.dateTime : ''
      })
    })
  },
  cleanDisputeLastAccess({ commit }) {
    commit('cleanLastAccess')
  },
  linkDisputeBankAccounts({ commit }, params) {
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
  unlinkDisputeBankAccounts({ commit }, params) {
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
  getDisputeDTO({ commit }, id) {
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
  getDisputeProprieties({ commit }, disputeId) {
    return axiosDispatcher({
      url: `api/disputes/${disputeId}/properties`,
      mutation: 'setDisputeProprieties'
    })
  },
  putDisputeProprieties({ commit }, params) {
    return axiosDispatcher({
      url: `api/disputes/${params.disputeId}/properties`,
      method: 'PUT',
      data: params.data,
      mutation: 'setDisputeProprieties'
    })
  },
  getDisputeAttachments({ commit }, disputeId) {
    axiosDispatcher({
      url: `api/office/documents/${disputeId}/attachments`,
      mutation: 'setDisputeAttachments'
    })
  },
  uploadAttachment({ commit }, { disputeId, formData }) {
    return axiosDispatcher({
      url: `api/office/disputes/${disputeId}/attachment`,
      method: 'post',
      data: formData
    })
  },
  deleteAttachment({ commit }, { disputeId, documentId }) {
    return axiosDispatcher({
      url: `api/office/disputes/${disputeId}/attachment/${documentId}`,
      method: 'delete'
    })
  },
  getDisputes({ commit, state }, command) {
    return new Promise((resolve, reject) => {
      if (command !== 'nextPage') state.loading = true
      if (command === 'resetPages') commit('resetDisputeQueryPage')
      // eslint-disable-next-line
      axios.get('api/disputes/filter' + queryBuilder(state.query, command, state.disputes.length)).then(response => {
        if (command === 'nextPage') {
          commit('addDisputes', response.data)
        } else {
          commit('setDisputes', response.data)
          commit('disputeSetHasNew', false)
        }

        resolve(response.data)
      }).catch(error => {
        commit('clearDisputes')
        reject(error)
      }).finally(() => {
        state.loading = false
      })
    })
  },
  searchDisputes({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/search?' + params.key + '=' + params.value).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getExportColumns({ commit }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/disputes/columns/to-export')
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  exportDisputes({ state, dispatch }, colums) {
    const stringColums = colums.toString()
    return axiosDispatcher({
      url: `api/disputes/export${queryBuilder(state.query)}fileFormat=CSV&columnToExport=${stringColums}`
    }).then(() => { dispatch('getExportHistory') })
    // return new Promise((resolve, reject) => {
    //   const stringColums = colums.toString()
    //   // eslint-disable-next-line
    //   axios.get('api/disputes/export'+ queryBuilder(state.query) + 'fileFormat=CSV&columnToExport=' + stringColums, {
    //     responseType: 'arraybuffer',
    //     ContentType: 'application/json; charset=utf-8',
    //   }).then(response => {
    //     // const blob = new Blob([
    //     //   new Uint8Array([0xEF, 0xBB, 0xBF]),
    //     //   response.data,
    //     // ], {
    //     //   type: 'text/plain;charset=utf-8',
    //     // })
    //     // const fileName = new Date().getTime() + '.csv'
    //     // FileSaver.saveAs(blob, fileName)
    //     dispatch('getExportHistory')
    //     resolve(response)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },
  getDisputeTimeline({ commit }, disputeCode) {
    if (!disputeCode) return
    commit('showLoading')
    return axiosDispatcher({
      url: `/api/fusion/lawsuit/timeline/${disputeCode}`
    }).then(res => {
      commit('setDisputeTimeline', { timeline: res, code: disputeCode })
    }).catch(() => {
      commit('setDisputeTimeline', { timeline: { lastUpdated: '', lawsuits: [] }, code: disputeCode })
    }).finally(() => commit('hideLoading'))
  },
  exportProtocols({ state }) {
    return axiosDispatcher({
      url: `api/office/documents/export${queryBuilder(state.query)}`
    })
  },
  getExportHistory({ commit, state }, command) {
    if (command) commit('addExportHistoryPage')
    else commit('resetExportHistoryPage')
    axiosDispatcher({
      url: `api/disputes/my/exports?size=10&page=${state.exportHistoryPage}`,
      mutation: command ? 'pushExportHistory' : 'setExportHistory'
    })
  },
  editRole({ _ }, { disputeId, disputeRole }) {
    return axiosDispatcher({
      url: `api/disputes/${disputeId}/dispute-roles`,
      method: 'PUT',
      data: disputeRole
    })
  },
  removeRole({ commit }, role) {
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
  setDisputeparty({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.patch('api/disputes/' + params.disputeId + '/dispute-roles/' + params.disputeRoleId + '/' + params.disputeParty)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getNotVisualizeds({ commit }) {
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
  getNearExpirations({ commit }) {
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
  editCaseReason({ commit }, params) {
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
  getDisputeStatuses({ commit }, status) {
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
  sendBatchAction({ commit, state }, params) {
    return axiosDispatcher({
      url: `api/disputes/actions/batch${queryBuilder(state.query)}`,
      method: 'PUT',
      data: params
    })
  },
  sendDisputeNote({ commit }, body) {
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
  deleteDisputeNote({ commit }, noteId) {
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
  editDisputeNote({ commit }, note) {
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
  sendDisputeAction({ commit }, params) {
    return new Promise((resolve, reject) => {
      let request
      if (params.action === 'restart-engagement' || params.action === 'renegotiate') {
        // eslint-disable-next-line
        request = axios.patch('api/disputes/' + params.disputeId + '/' + params.action)
      } else if (params.action === 'resend-messages') {
        // eslint-disable-next-line
        request = axios.put('api/messages/resend/' + params.disputeId)
      } else if (params.action === 'settled' && params.value) {
        // eslint-disable-next-line
        request = axios.put(`api/disputes/${params.disputeId}/settled?value=${params.value}`)
      } else if (params.action === 'enrich') {
        // eslint-disable-next-line
        request = axios.patch('api/fusion-runner/enrich/' + params.disputeId)
      } else if (params.action === 'edit-negotiators') {
        // eslint-disable-next-line
        request = axios.put('api/disputes/' + params.disputeId + '/negotiators', { negotiatorsId: params.negotiatorsId })
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
  restartDisputeRoleEngagement({ commit }, params) {
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
  restartEngagementByContact({ commit }, params) {
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
  editDispute({ commit }, dispute) {
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
  editDisputeOffer({ commit }, params) {
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
  editNegotiators({ commit }, negotiators) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/disputes/' + negotiators.disputeId + '/negotiators', { negotiatorsId: negotiators.negotiators })
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  editDisputeReason({ commit }, params) {
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
  removeDispute({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.delete(`api/disputes/${params.disputeId}/${params.reason}`)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  startNegotiation({ _ }, disputeId) {
    return axiosDispatcher({
      url: `/api/disputes/${disputeId}/start-negotiation`,
      method: 'PATCH'
    })
  },
  disputeSetVisualized({ _ }, params) {
    return axiosDispatcher({
      url: `api/disputes/${params.disputeId}/visualized`,
      params,
      method: 'PATCH'
    })
  },
  getDisputeOccurrences({ commit, state }, disputeId) {
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
  getDisputeCommunications({ commit, state }, disputeId) {
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
  getDisputeNotes({ commit, state }, disputeId) {
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
  loadDisputeOccurrences({ commit }, disputeId) {
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
  getRespondents({ commit, state }) {
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
  newDisputeRole({ commit }, params) {
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
  sendDisputeCounterProposal({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/disputes/' + params.disputeId + '/counterproposal', {
        attribute: { id: params.objectId },
        role: { id: params.roleId },
        value: params.value,
        note: params.note,
        updateUpperRange: params.updateUpperRange
      }).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getMessageSummary({ commit }, messageId) {
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
  },
  getDisputePartyAnalysis({ commit }, documentNumber) {
    return axiosDispatcher({
      url: `api/disputes/party/analisis/${documentNumber}`,
      mutation: 'addPartyAnalysis',
      payload: documentNumber
    })
  },
  getNegotiators({ state, commit, dispatch }, params) {
    return axiosDispatcher({
      url: `/api/disputes/negotiators/filter${queryBuilder({ ...state.query, ...params })}`
    })
  },
  getPrescriptions: () => axiosDispatcher({
    // url: 'api/disputes/prescriptions',
    url: 'api/disputes/prescriptions-fix-index/1',
    mutation: 'setPrescriptionsList'
  })
}

export default disputeActions
