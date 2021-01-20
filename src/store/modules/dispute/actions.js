import Vue from 'vue'
import moment from 'moment'
import { axiosDispatch, buildQuery } from '@/utils'

// const FileSaver = require('file-saver')
let removeDebounce = 0
const disputesPath = 'api/disputes'

const disputeActions = {
  SOCKET_ADD_DISPUTE({ commit, state }, disputeChanged) {
    if (state.dispute.id === disputeChanged.id) {
      if (!disputeChanged.properties) {
        disputeChanged.properties = state.dispute.properties
      }
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
  getLastInteractions({ _ }, disputeId) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/interaction`,
      mutation: 'setLastInteractions'
    })
  },
  updateDisputeData({ dispatch }, id) {
    dispatch('getDisputeMetadata', id)
    dispatch('getLastInteractions', id)
    dispatch('getDisputeProperties', id)
    dispatch('getDisputeAttachments', id)
  },
  getDispute({ commit, dispatch }, id) {
    return new Promise((resolve, reject) => {
      commit('clearDispute')
      // eslint-disable-next-line
      axios.get(`${disputesPath}/${id}/vm`)
        .then(response => {
          const onlineDocs = []
          response.data.disputeRoles.forEach(role => {
            if (role.online) {
              if (role.documentNumber) {
                onlineDocs.push({
                  documentNumber: role.documentNumber,
                  online: true
                })
              } else if (role.oabs.length) {
                const oab = role.oabs[0]
                onlineDocs.push({
                  documentNumber: `${oab.number}-${oab.state}`,
                  online: true
                })
              }
            }
          })
          commit('setOnlineDocs', onlineDocs)
          dispatch('updateDisputeData', id)
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
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/my-last-access`
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
      axios.post(`${disputesPath}/${params.disputeId}/bank-accounts/${params.bankAccountId}`)
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
      axios.delete(`${disputesPath}/${params.disputeId}/bank-accounts/${params.bankAccountId}`)
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
      axios.get(`${disputesPath}/${id}`)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getDisputeProperties({ commit }, disputeId) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/properties`,
      mutation: 'setDisputeProperties'
    })
  },
  putDisputeProperties({ _ }, { disputeId, data }) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/properties`,
      method: 'PUT',
      data,
      mutation: 'setDisputeProperties'
    })
  },
  getDisputeAttachments({ commit }, disputeId) {
    commit('showLoadingAttachments')
    return axiosDispatch({
      url: `api/office/documents/${disputeId}/attachments`,
      mutation: 'setDisputeAttachments'
    })
  },
  hideLoadingAttachments({ commit }) {
    commit('hideLoadingAttachments')
  },
  uploadAttachment({ commit }, { disputeId, formData }) {
    return axiosDispatch({
      url: `api/office/disputes/${disputeId}/attachment`,
      method: 'post',
      data: formData
    })
  },
  deleteAttachment({ commit, dispatch }, { disputeId, documentId }) {
    commit('showLoadingAttachments')
    return axiosDispatch({
      url: `api/office/disputes/${disputeId}/attachment/${documentId}`,
      method: 'delete'
    })
  },
  getDisputes({ commit, state }, command) {
    return new Promise((resolve, reject) => {
      if (command !== 'nextPage') state.loading = true
      if (command === 'resetPages') commit('resetDisputeQueryPage')
      // eslint-disable-next-line
      axios.get(`${disputesPath}/filter` + buildQuery(state.query, command, state.disputes.length)).then(response => {
        const dispute = {
          ...response.data,
          content: response.data.content.filter(d => !!d)
        }
        if (command === 'nextPage') {
          commit('addDisputes', dispute)
        } else {
          commit('setDisputes', dispute)
          commit('disputeSetHasNew', false)
        }
        commit('clearOnlineDocs')
        const onlineDocs = []
        dispute.content.map(dispute => {
          if (dispute.firstClaimantStatus === 'ONLINE') {
            onlineDocs.push({
              documentNumber: dispute.firstClaimantDocumentNumber,
              online: true
            })
          }
          if (dispute.firstClaimantLawyerStatus === 'ONLINE') {
            onlineDocs.push({
              documentNumber: dispute.firstClaimantLawyerDocumentNumber || dispute.firstClaimantLawyerOab,
              online: true
            })
          }
        })
        commit('setOnlineDocs', onlineDocs)
        resolve(response.data)
      }).catch(error => {
        commit('clearDisputes')
        reject(error)
      }).finally(() => {
        state.loading = false
      })
    })
  },
  searchDisputes({ _ }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get(`${disputesPath}/search?${params.key}=${params.value}`).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getExportColumns({ _ }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get(`${disputesPath}/columns/to-export`)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  exportDisputes({ state, dispatch }, colums) {
    const stringColums = colums.toString()
    dispatch('setAccountProperty', {
      JUS_EXPORT_COLUMNS: stringColums
    })
    return axiosDispatch({
      url: `${disputesPath}/export${buildQuery(state.query)}fileFormat=CSV&columnToExport=${stringColums}`
    }).then(() => { dispatch('getExportHistory') })
  },
  getDisputeTimeline({ commit }, disputeCode) {
    if (!disputeCode) return
    commit('showLoading')
    return axiosDispatch({
      url: `/api/fusion/lawsuit/timeline/${disputeCode}`
    }).then(res => {
      commit('setDisputeTimeline', { timeline: res, code: disputeCode })
    }).catch(() => {
      commit('setDisputeTimeline', { timeline: { lastUpdated: '', lawsuits: [] }, code: disputeCode })
    }).finally(() => commit('hideLoading'))
  },
  exportProtocols({ state }) {
    return axiosDispatch({
      url: `api/office/documents/export${buildQuery(state.query)}`
    })
  },
  getExportHistory({ commit, state }, command) {
    if (command) commit('addExportHistoryPage')
    else commit('resetExportHistoryPage')
    axiosDispatch({
      url: `${disputesPath}/my/exports?size=10&page=${state.exportHistoryPage}`,
      mutation: command ? 'pushExportHistory' : 'setExportHistory'
    })
  },
  editRole({ _ }, { disputeId, disputeRole }) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/dispute-roles`,
      method: 'PUT',
      data: disputeRole
    })
  },
  removeRole({ commit }, role) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.delete(`${disputesPath}/${role.disputeId}/role/${role.roleId}`, { disputeId: role.disputeId, id: role.roleId })
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
      axios.patch(`${disputesPath}/${params.disputeId}/dispute-roles/${params.disputeRoleId}/${params.disputeParty}`)
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
      axios.get(`${disputesPath}/summary/not-visualized`)
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
      axios.get(`${disputesPath}/summary/near-expiration`)
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
      axios.put(`${disputesPath}/${params.disputeId}/update-reason`, {
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
      axios.get(`${disputesPath}/outcome-reasons/${status}`)
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
    return axiosDispatch({
      url: `${disputesPath}/actions/batch${buildQuery(state.query)}`,
      method: 'PUT',
      data: params
    })
  },
  sendDisputeNote({ commit }, body) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post(`${disputesPath}/${body.disputeId}/note`, body)
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
      axios.delete(`${disputesPath}/note/${noteId}`)
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
      axios.put(`${disputesPath}/note/${note.activeOccurrence.id}`, {
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
        request = axios.patch(`${disputesPath}/${params.disputeId}/${params.action}`)
      } else if (params.action === 'resend-messages') {
        // eslint-disable-next-line
        request = axios.put('api/messages/resend/' + params.disputeId)
      } else if (params.action === 'settled' && params.value) {
        // eslint-disable-next-line
        request = axios.put(`api/disputes/${params.disputeId}/settled?value=${params.value}`, params.body)
      } else if (params.action === 'enrich') {
        // eslint-disable-next-line
        request = axios.patch('api/fusion-runner/enrich/' + params.disputeId)
      } else if (params.action === 'edit-negotiators') {
        // eslint-disable-next-line
        request = axios.put(`${disputesPath}/${params.disputeId}/negotiators`, { negotiatorsId: params.negotiatorsId })
      } else {
        // eslint-disable-next-line
        request = axios.put(`${disputesPath}/${params.disputeId}/${params.action}`, params.body)
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
      axios.patch(`${disputesPath}/${params.disputeId}/restart-engagement/${params.disputeRoleId}`)
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
      axios.patch(`/api/messages/engagement/${params.disputeId}/address/${params.contact}`)
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
      axios.put(`${disputesPath}/${dispute.id}/update`, dispute)
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
      axios.post(`${disputesPath}/${params.disputeId}/offer`, {
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
      axios.put(`${disputesPath}/${negotiators.disputeId}/negotiators`, { negotiatorsId: negotiators.negotiators })
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
      axios.put(`${disputesPath}/${params.disputeId}/update-reason/`, params.body)
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
      axios.delete(`${disputesPath}/${params.disputeId}/${params.reason}`)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  startNegotiation({ _ }, disputeId) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/start-negotiation`,
      method: 'PATCH'
    })
  },
  disputeSetVisualized({ _ }, params) {
    return axiosDispatch({
      url: `${disputesPath}/${params.disputeId}/visualized`,
      params,
      method: 'PATCH'
    })
  },
  getDisputeOccurrences({ commit, state }, disputeId) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get(`${disputesPath}/${disputeId}/occurrences?size=${state.occurrencesSize}&sort=createdAt,desc&sort=id,desc`)
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
      axios.get(`${disputesPath}/${disputeId}/occurrences/type/INTERACTION?size=${state.occurrencesSize}&sort=createdAt,desc&sort=id,desc`)
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
      axios.get(`${disputesPath}/${disputeId}/occurrences/type/NOTE`)
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
      axios.put(`${disputesPath}/${disputeId}/occurrences/load`)
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
      axios.get(`${disputesPath}/respondent-names`)
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
      axios.post(`${disputesPath}/${params.disputeId}/dispute-roles`, params.role)
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
      axios.post(`${disputesPath}/${params.disputeId}/counterproposal`, {
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
      axios.get(`${disputesPath}/interactions/sent-message-summary/${messageId}`)
        .then(response => {
          commit('setRespondents', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getDisputePartyAnalysis({ commit }, documentNumber) {
    return axiosDispatch({
      url: `${disputesPath}/party/analisis/${documentNumber}`,
      mutation: 'addPartyAnalysis',
      payload: documentNumber
    })
  },
  getNegotiators({ state, commit, dispatch }, params) {
    return axiosDispatch({
      url: `${disputesPath}/negotiators/filter${buildQuery({ ...state.query, ...params })}`
    })
  },
  getPrescriptions: () => axiosDispatch({
    // url: 'api/disputes/prescriptions',
    url: `${disputesPath}/prescriptions-fix-index/1`,
    mutation: 'setPrescriptionsList'
  }),
  addPhoneToDisputeRole({ _ }, { disputeId, disputeRoleId, value }) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/dispute-roles/${disputeRoleId}/add-phone`,
      method: 'PUT',
      data: { value },
      mutation: 'setDisputeRole'
    })
  },
  addEmailToDisputeRole({ _ }, { disputeId, disputeRoleId, value }) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/dispute-roles/${disputeRoleId}/add-email`,
      method: 'PUT',
      data: { value },
      mutation: 'setDisputeRole'
    })
  },
  addOabToDisputeRole({ _ }, { disputeId, disputeRoleId, number, state }) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/dispute-roles/${disputeRoleId}/add-oab`,
      method: 'PUT',
      data: { number, state },
      mutation: 'setDisputeRole'
    })
  },
  setDisputeProperty({ _ }, { disputeId, key, value }) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/properties/${key}`,
      method: 'PUT',
      data: { value },
      mutation: 'setDisputeProperty'
    })
  },
  getDisputeMetadata({ _ }, disputeId) {
    return axiosDispatch({
      url: `api/office/documents/dispute/${disputeId}/metadata`,
      mutation: 'setDisputeMetadata'
    })
  }
}

export default disputeActions
