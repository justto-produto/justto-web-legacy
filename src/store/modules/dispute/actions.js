import Vue from 'vue'
import moment from 'moment'
import { axiosDispatch, buildQuery, extractMentions } from '@/utils'
import { Validate } from 'validate-cnj'

// const FileSaver = require('file-saver')
let removeDebounce = 0
const disputesPath = 'api/disputes'
const documentsPath = 'api/office/documents'

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
    dispatch('getLastInteractions', id)
    dispatch('getDisputeProperties', id)
    dispatch('getDisputeAttachments', id)
  },

  fillerDisputeRole({ _ }, dispute) {
    return axiosDispatch({
      url: `${disputesPath}/${dispute.id}/dispute-roles`,
      mutation: 'fillerDisputeRole',
      payload: dispute
    })
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

  // TODO: Duplicar pro Store do Negotiation
  linkDisputeBankAccounts({ _ }, { bankAccountId, disputeId }) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/bank-accounts/${bankAccountId}`,
      method: 'POST'
    })
  },

  // TODO: Duplicar pro Store do Negotiation
  unlinkDisputeBankAccounts({ _ }, { bankAccountId, disputeId }) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/bank-accounts/${bankAccountId}`,
      method: 'DELETE'
    })
  },

  getDisputeDTO({ _ }, id) {
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

  uploadAttachment({ commit }, { disputeId, formData, confidential }) {
    return axiosDispatch({
      url: `api/office/disputes/${disputeId}/attachment`,
      method: 'post',
      data: formData,
      params: { confidential }
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

      const { textSearch, textSearchType } = state.query

      const tempQuery = {
        ...state.query,
        textSearch: undefined,
        textSearchType: undefined
      }

      const query = buildQuery(tempQuery, command, state.disputes.length)

      axiosDispatch({
        url: `${disputesPath}/filter/apply${query}`,
        method: 'POST',
        data: { textSearch, textSearchType }
      }).then(data => {
        const dispute = {
          ...data,
          content: data.content.filter(d => !!d)
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
        resolve(data)
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
    const ordenationQuery = {}

    const data = {
      ...state.query,
      fileFormat: 'CSV',
      columnToExport: stringColums.split(',')
    }

    if (state.query.transactionType) {
      data.transactionType = state.query.transactionType.split(',')
    }

    ['expirationDate', 'dealDate', 'importingDate', 'lastInteractionDate'].forEach(key => {
      if (data[key]?.length) {
        data[`${key}Start`] = moment(data[key][0]).startOf('day').utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
        data[`${key}End`] = moment(data[key][1]).endOf('day').utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
      }

      delete data[key]
    });

    ['sort', 'size', 'page', 'total'].forEach(key => {
      ordenationQuery[key] = state?.query[key]

      delete data[key]
    })

    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key]) || typeof data[key] === 'string') {
        if (!data[key]?.length) delete data[key]
      } else if (typeof data[key] === 'boolean' && !['onlyNotVisualized', 'onlyNotPaused'].includes(key) && !data[key]) {
        delete data[key]
      }
    })

    const query = buildQuery(ordenationQuery)

    dispatch('setAccountProperty', {
      JUS_EXPORT_COLUMNS: stringColums
    })

    return axiosDispatch({
      method: 'POST',
      url: `${disputesPath}/export${query}`,
      data
    }).then(() => { dispatch('getExportHistory') })
  },

  getDisputeTimeline({ commit }, disputeCode) {
    if (!disputeCode) return

    commit('showLoading')
    try {
      Validate.load(disputeCode)
    } catch (error) {
      if (!Vue.options.filters.validateTJbyCode(disputeCode)) {
        commit('setDisputeTimeline', { timeline: { lastUpdated: '', lawsuits: [], isValid: false }, code: disputeCode })
        commit('hideLoading')
        return
      }
    }

    return axiosDispatch({
      url: `/api/fusion/lawsuit/timeline/${disputeCode}`
    }).then(res => {
      commit('setDisputeTimeline', { timeline: { ...res, isValid: true }, code: disputeCode })
    }).catch(() => {
      commit('setDisputeTimeline', { timeline: { lastUpdated: '', lawsuits: [], isValid: true }, code: disputeCode })
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
    const { textSearch, textSearchType } = state.query

    const tempQuery = {
      ...state.query,
      textSearch: undefined,
      textSearchType: undefined
    }

    return axiosDispatch({
      url: `${disputesPath}/actions/batch${buildQuery(tempQuery)}`,
      method: 'PUT',
      data: { ...params, textSearch, textSearchType }
    }).finally(() => {
      commit('setBatchActionsLastUse', { action: params.type })
    })
  },

  sendDisputeNote({ _ }, data) {
    const { note } = data

    return axiosDispatch({
      url: `${disputesPath}/${data.disputeId}/note`,
      method: 'post',
      data: { ...data, mentionedPeople: extractMentions(note) }
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

  sendDisputeAction({ commit, mutation }, params) {
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
          commit('deleteRestartDisputeFlag', params.disputeId)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  restartDisputeRoleEngagement({ _ }, { disputeId, disputeRoleId }) {
    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/restart-engagement/${disputeRoleId}`,
      method: 'patch'
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

  disputeSetVisualized({ _ }, params) {
    const { disputeId } = params

    delete params.disputeId

    return axiosDispatch({
      url: `${disputesPath}/${disputeId}/visualized`,
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
      const query = {
        page: state.notesQuery.page,
        size: state.notesQuery.size,
        sort: state.notesQuery.sort
      }

      // eslint-disable-next-line
      axios.get(`${disputesPath}/${disputeId}/occurrences/type/NOTE${buildQuery(query)}`)
        .then(response => {
          console.log(response)
          commit('setDisputeOccurrences', response.data.content)
          commit('setNoteQuery', response.data)
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
        action: params.action,
        updateUpperRange: params.updateUpperRange,
        forceStatus: params.forceStatus
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
    const { textSearch, textSearchType } = state.query
    const query = {
      ...state.query,
      textSearch: undefined,
      textSearchType: undefined
    }
    return axiosDispatch({
      url: `${disputesPath}/negotiators/filter${buildQuery({ ...query, ...params })}`,
      method: 'PATCH',
      data: { textSearch, textSearchType }
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
  },

  getFinishedDisputesCount({ state }, { id, allSelected }) {
    const { textSearch, textSearchType } = state.query
    const query = {
      ...state.query,
      allSelected,
      id,
      textSearchType: undefined,
      textSearch: undefined
    }

    return axiosDispatch({
      method: 'POST',
      url: `/api/disputes/count-finished/${buildQuery(query)}`,
      data: { textSearch, textSearchType },
      mutation: 'setDisputeMetadata'
    })
  },

  putWorkspacePreNegotiationKeywords({ _ }, keywords) {
    return axiosDispatch({
      url: `${disputesPath}/pre-negotiation/keywords`,
      method: 'PUT',
      data: keywords
    })
  },

  getWorkspacePreNegotiationKeywords({ _ }) {
    return axiosDispatch({
      url: `${disputesPath}/pre-negotiation/keywords`,
      mutation: 'setPreNegotiationKeywords'
    })
  },

  putPreNegotiationLimitValue({ _ }, value) {
    return axiosDispatch({
      url: `${disputesPath}/pre-negotiation/limit-value`,
      method: 'PUT',
      data: { value }
    })
  },

  getPreNegotiationLimitValue({ _ }) {
    return axiosDispatch({
      url: `${disputesPath}/pre-negotiation/limit-value`,
      mutation: 'setPreNegotiationLimitValue'
    })
  },

  restartDisputeValidatingStatus({ _ }, { disputeId, status }) {
    if (['PENDING'].includes(status)) {
      return axiosDispatch({
        url: `${disputesPath}/${disputeId}/restart-engagement`,
        method: 'PATCH'
      })
    }
  },

  getAttachmentSignInfo({ _ }, documentId) {
    return axiosDispatch({
      url: `${documentsPath}/draft/${documentId}`
    })
  },

  setAttachmentSigners({ _ }, { signers, documentId }) {
    return axiosDispatch({
      url: `${documentsPath}/${documentId}/sign`,
      method: 'POST',
      data: signers
    })
  },

  deleteSignedAttachment({ _ }, documentId) {
    return axiosDispatch({
      url: `${documentsPath}/${documentId}/sign`,
      method: 'DELETE'
    })
  }
}

export default disputeActions
