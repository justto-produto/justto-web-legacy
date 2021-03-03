import Vue from 'vue'
import moment from 'moment'

import EDITOR_TABS from '@/constants/editor'

const omnichannelMutations = {
  setActiveTab: (state, tab) => {
    if (Object.values(EDITOR_TABS).includes(tab)) {
      Vue.set(state, 'activeTab', tab)
    }
  },
  setEditorReady: (state, isReady) => Vue.set(state.editor, 'ready', isReady),

  setEditorText: (state, text) => Vue.set(state.editor, 'messageText', text),

  setNoteEditorText: (state, text) => Vue.set(state.editor, 'noteText', text),

  setMessageType: (state, type) => Vue.set(state.editor, 'messageType', type),

  setOccurrences: (state, { content }) => {
    // TODO: Validar duplicidade/sobrescrita de ocorrências.
    const occurrences = content.map(el => ({ ...el, occurrences: el.occurrences.reverse() })).reverse()
    Vue.set(state.occurrences, 'list', occurrences)
  },

  addNegotiationOccurrence: (state, occurrence) => {
    const date = moment(occurrence.updateAt?.dateTime || occurrence.createAt?.dateTime).format('YYYY-MM-DD')
    const dates = state.occurrences.list.map(({ date }) => date)

    // TODO: Implementar validação dos tipos de occorrências por tipo de aba

    if (dates.includes(date)) {
      state.occurrences.list.map((item, dateIndex) => {
        if (item.date === date) {
          const index = item.occurrences.find(({ id }) => id === occurrence.id) || item.occurrences.length

          Vue.set(state.occurrences.list[dateIndex].occurrences, index, occurrence)
        }
      })
    } else {
      const next = state.occurrences.list.length

      Vue.set(state.occurrences.list, next, { date, occurrences: [occurrence] })
    }
  },

  setUpOccurrencesSize: (state) => (state.occurrences.filter.size += 10),

  addSumary: (state, { payload, data }) => {
    const { occurrenceId, type } = payload
    Vue.set(state.occurrences.summary[type], occurrenceId, data.content)
  },

  cleanSumary: (state, { type, occurrenceId }) => Vue.delete(state.occurrences.summary[type], occurrenceId),

  addFullMessage: (state, { id, content }) => Vue.set(state.occurrences.fullMessages, id, content),

  addRecentMessage: (state, message) => {
    const index = state.editor.recentMessages.length
    Vue.set(state.editor.recentMessages, index, message)
  },

  cleanRecentMessages: state => Vue.set(state.editor, 'recentMessages', []),

  removeFullMessage: (state, id) => Vue.delete(state.occurrences.fullMessages, id),

  setRecipients: (state, recipient) => {
    const { recipients } = state.editor
    const has = recipients.filter(({ value }) => value === recipient.value).length > 0

    if (has) {
      Vue.set(state.editor, 'recipients', recipients.filter(el => el.value !== recipient.value))
    } else {
      Vue.set(state.editor, 'recipients', [...recipients, recipient])
    }
  },

  setSendingMessage: (state, sending) => Vue.set(state.editor, 'sendinMessage', !!sending),

  resetRecipients: (state) => Vue.set(state.editor, 'recipients', []),

  setMessageAttachments: (state, attachs) => Vue.set(state.editor, 'attachments', attachs)
}

export default omnichannelMutations
