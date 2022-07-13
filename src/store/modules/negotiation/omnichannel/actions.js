import { axiosDispatch, isSimilarStrings, buildQuery, validateCurrentId, stripHtml } from '@/utils'
import { EditorBackup } from '@/models/message/editorBackup'

const vue = () => document.getElementById('app')?.__vue__

const disputeApi = 'api/disputes/v2'
const messagesPath = 'api/messages'

const omnichannelActions = {
  setOmnichannelActiveTab({ commit, getters: { getActiveTab }, dispatch }, tab) {
    if (tab === 'MESSAGES') {
      dispatch('setSignature')
    }

    return new Promise(resolve => {
      if (getActiveTab !== tab) {
        commit('setOmnichannelActiveTab', tab)
        commit('resetRecipients')
        commit('resetOccurrences')
        dispatch('setEditorBackup')
        resolve(tab)
      } else {
        resolve(tab)
      }
    })
  },

  setSignature({ dispatch, getters: { getEditorText, workspaceName, loggedPersonName, getEditorMessageType, useSignature } }) {
    if (useSignature) {
      const signature = !['sms', 'whatsapp'].includes(getEditorMessageType) ? `<br><br>Att,<br>${loggedPersonName}<br>${workspaceName}` : `\n\nAtt,\n${loggedPersonName}\n${workspaceName}`

      const clearText = str => stripHtml(str).replaceAll(/[^a-zA-Z]+/g, '')

      if (!clearText(getEditorText).includes(clearText(signature))) {
        dispatch('setEditorText', `${getEditorText}${signature}`)
      }
    }
  },

  setEditorText: ({ dispatch, commit }, message) => {
    commit('setEditorText', message)
    dispatch('setEditorBackup')
  },

  setNoteEditorText: ({ commit, dispatch }, note) => {
    commit('setNoteEditorText', note)
    dispatch('setEditorBackup')
  },

  setMessageType({ commit, dispatch, getters: { getEditorMessageType } }, type) {
    commit('setMessageAttachments', [])
    commit('setMessageType', type)

    const alreadySimpleText = ['whatsapp', 'sms'].includes((getEditorMessageType || '').toLowerCase())
    const willBeSimpleText = ['whatsapp', 'sms'].includes((type || '').toLowerCase())

    if (alreadySimpleText !== willBeSimpleText) {
      commit('resetRecipients')

      commit('convertText')
    }
    dispatch('setEditorBackup')
    dispatch('setSignature')
  },

  getOccurrences({ getters }, disputeId) {
    const params = {
      ...getters.getOccurrencesFilter,
      type: getters.getOccurrencesFilter.type === 'LOG' ? null : getters.getOccurrencesFilter.type
    }

    const url = `${disputeApi}/${disputeId}/occurrences${buildQuery(params)}`

    return validateCurrentId(disputeId, () => axiosDispatch({ url, mutation: 'setOccurrences' }))
  },

  getAllOccurrences({ getters }, disputeId) {
    const params = {
      ...getters.getOccurrencesFilter,
      size: 999999,
      page: 1,
      type: { MESSAGES: 'INTERACTION', NOTES: 'NOTE', OCCURRENCES: null }[getters.getActiveTab]
    }

    const url = `${disputeApi}/${disputeId}/occurrences${buildQuery(params)}`.slice(0, -1)

    return validateCurrentId(disputeId, () => axiosDispatch({
      url, params: { resumed: false }, mutation: 'setOccurrences'
    }))
  },

  getFullMessage({ _ }, messageId) {
    if (messageId) {
      return axiosDispatch({
        url: `${messagesPath}/${messageId}`,
        mutation: 'addFullMessage'
      })
    }
  },

  deleteFullMessage: ({ commit }, messageId) => commit('removeFullMessage', messageId),

  cleanRecentMessages: ({ commit }) => commit('cleanRecentMessages'),

  deleteTicketNote: ({ _ }, id) => axiosDispatch({
    url: `api/disputes/note/${id}`,
    method: 'DELETE',
    mutation: 'removeTicketNote',
    payload: { id }
  }),

  saveTicketNote({ _ }, params) {
    const { disputeId, id, note } = params

    return validateCurrentId(disputeId, () => axiosDispatch({
      url: `api/disputes/note/${id}`,
      method: 'PUT',
      data: { disputeId, note }
    }))
  },

  getSummaryOccurrecies({ getters, commit }, { disputeId, communicationType, summaryRoleId, summaryOccurrenceId }) {
    const keys = getters.getOccurrencesSummaryKeys

    const payload = {
      type: communicationType,
      occurrenceId: summaryOccurrenceId
    }

    if (!keys[communicationType].includes(summaryOccurrenceId)) {
      return validateCurrentId(disputeId, () => axiosDispatch({
        url: `${disputeApi}/${disputeId}/occurrences`,
        params: {
          summaryRoleId,
          communicationType,
          summaryOccurrenceId
        },
        mutation: 'addSumary',
        payload
      }))
    } else {
      return new Promise((resolve) => {
        // commit('cleanSumary', payload)
        resolve()
      })
    }
  },

  addRecipient({ commit, dispatch, getters }, recipient) {
    const { type, value } = recipient
    const { getEditorMessageType, getEditorRecipients } = getters

    if (getEditorRecipients.find(el => el.value === value)) {
      commit('removeRecipient', value)
    } else {
      const callback = () => {
        if (getEditorMessageType !== type && value) dispatch('setMessageType', type)
        if (type === 'whatsapp') commit('resetRecipients')
        if (value) commit('setRecipients', recipient)
        dispatch('setEditorBackup')
      }
      if (getEditorMessageType !== type && getEditorRecipients.length) {
        const oldType = vue().$tc('negotiation.ticket.recipient.message-type.' + getEditorMessageType)
        const newType = vue().$tc('negotiation.ticket.recipient.message-type.' + type)
        const message = `<p>Detectamos uma mudança no tipo de contato do destinatário: <b>${oldType}</b> para <b>${newType}</b>!</p>
        <br>
        <p>Desera realmente continuar?</p>`

        vue().$confirm(message, 'Atenção!', {
          customClass: 'confirm-change-recipent-type',
          dangerouslyUseHTMLString: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          closeOnPressEscape: false,
          closeOnClickModal: false,
          showClose: false,
          center: true
        }).then(callback).catch(() => {
          // TODO: SAAS-5197 Ação adicional ao não mudar de destinatário.
        })
      } else {
        callback()
      }
    }

    dispatch('setEditorBackup')
  },

  verifyRecipient({ _ }, recipient) {
    const { value, disputeId } = recipient
    const params = {
      adress: value
    }
    return axiosDispatch({
      url: `api/disputes/${disputeId}/communications/status-2-send`,
      params
    })
  },

  resetRecipients: ({ commit }) => Promise.resolve(commit('resetRecipients')),

  resetOccurrences: ({ commit }) => {
    commit('resetOccurrences')
  },

  resetMessageText: ({ commit }) => {
    commit('setEditorText', '')
  },

  resetNoteText: ({ commit }) => {
    commit('setNoteEditorText', '')
  },

  sendMessage({ dispatch, getters }, disputeId) {
    const {
      getTicketOverviewNegotiators: negotiators,
      getSelectedAttachments: attachments,
      getEditorTextScaped: messageText,
      getEditorRecipients: recipients,
      getEditorText: messageEmail,
      getEditorMessageType: type
    } = getters

    const roleId = negotiators[0].disputeRoleId
    const to = recipients.map(({ value, key }) => ({ [key]: value }))
    const externalIdentification = +new Date()
    const messagesToReply = recipients.map(r => r.inReplyTo).filter(r => r != null)
    const inReplyTo = messagesToReply.length > 0 ? messagesToReply[0] : null

    if (type === 'email') {
      const data = {
        to,
        disputeId,
        attachments,
        message: messageEmail,
        externalIdentification,
        inReplyTo
      }

      return new Promise((resolve, reject) => {
        dispatch('sendemail', data).then(res => {
          dispatch('getDisputeOccurrences', disputeId)
          resolve(res)
        }).catch(reject)
      })
    } else if (type === 'whatsapp') {
      const data = {
        to,
        disputeId,
        externalIdentification,
        message: messageText.trim()
      }

      return new Promise((resolve, reject) => {
        dispatch('validateWhatsappMessage', { data, contact: recipients[0].value }).then(res => {
          dispatch('getDisputeOccurrences', disputeId)
          resolve(res)
        }).catch(reject)
      })
    } else {
      const data = {
        roleId,
        message: messageEmail,
        email: recipients[0].value
      }
      return new Promise((resolve, reject) => {
        dispatch('sendNegotiator', { disputeId, data }).then(res => {
          dispatch('getDisputeOccurrences', disputeId)
          resolve(res)
        }).catch(reject)
      })
    }
  },

  validateWhatsappMessage({ commit, dispatch, getters }, { contact, data }) {
    return new Promise((resolve, reject) => {
      dispatch('canSendWhatsapp', contact).then(({ canSend }) => {
        if (canSend) {
          const can = getters.getRecentWhatsappMessages.filter(msg => isSimilarStrings(data.message, msg, 75)).length === 0
          if (can) {
            dispatch('sendwhatsapp', data).then(res => resolve(res))
          } else {
            commit('setEditorText', '')
            reject(JSON.stringify({
              title: 'Ops!',
              message: 'Parece que você enviou uma mensagem parecida recentemente.\nDevido às políticas de SPAM do WhatsApp, a mensagem não pôde ser enviada.',
              type: 'error'
            }))
          }
        } else {
          commit('resetRecipients')
          reject(JSON.stringify({
            title: 'Ops!',
            message: 'O envio de mensagem para este número WhatsApp não é permitido neste momento.\nO prazo para responder mensagens no WhatsApp é de 24 horas.\n\nNão encontramos uma mensagem deste número nas últimas 24 horas para que você possa responder.',
            type: 'error'
          }))
        }
      })
    })
  },

  setMessageAttachments({ commit }, attachs) {
    commit('setMessageAttachments', attachs || [])
  },

  SOCKET_ADD_OCCURRENCE({ commit }, occurrence) {
    if (!occurrence.archived) {
      if (window.location.href.includes('negotiation')) {
        commit('addNegotiationOccurrence', occurrence)
      }
      if (window.location.href.includes('dispute')) {
        commit('addDisputeOccurrence', occurrence)
        commit('addNegotiationOccurrence', occurrence)
      }
    }
  },

  toggleExportTicketModalVisible({ commit }, visible) {
    commit('toggleExportTicketModalVisible', visible)
  },

  replyNps({ _ }, { disputeId, disputeRoleId, data, occurrenceId }) {
    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/nps/${disputeRoleId}/response`,
      method: 'PATCH',
      data,
      mutation: 'updateNpsReply',
      payload: { occurrenceId, data }
    })
  },

  getDisputeProtocol({ state }, { disputeId, docNumber, canSetDisputeProtocol = true }) {
    return axiosDispatch({
      url: `/api/office/documents/${disputeId}/to-signer/${docNumber}`,
      mutation: canSetDisputeProtocol ? 'setDisputeProtocol' : null
    })
  },

  setInteractionMessageContent({ _ }, { disputeId, content, communicationMessageId }) {
    return axiosDispatch({
      url: `api/disputes/${disputeId}/communications/${communicationMessageId}`,
      method: 'PATCH',
      data: { content }
    })
  },

  setEditorBackup({ state, getters, dispatch }, id = null) {
    const {
      getEditorText,
      getNoteEditorText,
      getEditorRecipients,
      getEditorMessageType,
      getCurrentRoute: { params: { id: disputeId } }
    } = getters

    dispatch('setMessageBackup', new EditorBackup({
      disputeId: id || disputeId,
      message: getEditorText,
      type: getEditorMessageType,
      note: getNoteEditorText,
      tab: state.activeTab,
      contacts: getEditorRecipients
    }))
  },

  getGroupedOccurrences({ _ }, { disputeId, occurrences, parentId }) {
    const url = `${disputeApi}/${disputeId}/occurrences${buildQuery({ id: occurrences })}`

    return axiosDispatch({
      url,
      mutation: 'setGroupedOccurrencesById',
      payload: { parentId }
    })
  },

  getGroupedOccurrencesByOccurrenceId({ state, commit }, id) {
    // TODO: SAAS-5036 Implementar GET das Ocorrências agrupadas aqui.
    commit('setGroupedOccurrencesById', {
      data: {
        content: state.occurrences.list.filter(({ id: occId }) => occId === id)
      },
      payload: id
    })

    return Promise.resolve()
  },

  resetGroupedOccurrencesByOccurrenceId({ commit }, id) {
    commit('deleteGroupedOccurrencesById', id)

    return Promise.resolve()
  },

  clearAllGroupedOccurreces({ getters: { getGroupedOccurrences }, commit }) {
    Object.keys(getGroupedOccurrences).forEach(id => commit('deleteGroupedOccurrencesById', id))
  },

  autodetectTicketRecipients({ getters: { workspaceAutodetectRecipient, getEditorRecipients, getOccurrencesList }, dispatch }) {
    if (workspaceAutodetectRecipient && !getEditorRecipients.length) {
      const onlyComunnications = (getOccurrencesList || []).filter(({ interaction }) => (interaction?.type === 'COMMUNICATION' && interaction?.direction === 'INBOUND'))

      onlyComunnications.reverse()

      for (const item of onlyComunnications) {
        const { interaction: { message: { communicationType, sender, messageId } } } = item

        dispatch('addRecipient', {
          value: sender,
          type: communicationType.toLowerCase(),
          inReplyTo: messageId,
          key: 'address'
        })
        break
      }
    }
  }
}

export default omnichannelActions
