import Vue from 'vue'

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

  setUpOccurrencesSize: (state) => (state.occurrences.filter.size += 10),

  addSumary: (state, { payload, data }) => {
    const { occurrenceId, type } = payload
    Vue.set(state.occurrences.summary[type], occurrenceId, data.content)
  },

  cleanSumary: (state, { type, occurrenceId }) => Vue.delete(state.occurrences.summary[type], occurrenceId),

  addFullMessage: (state, { id, content }) => Vue.set(state.occurrences.fullMessages, id, content),

  removeFullMessage: (state, id) => Vue.delete(state.occurrences.fullMessages, id),

  setRecipients: (state, recipient) => {
    const { recipients } = state.editor
    const has = recipients.filter(({ address }) => address === recipient.address).length > 0

    if (has) {
      Vue.set(state.editor, 'recipients', recipients.filter(el => el.address !== recipient.address))
    } else {
      Vue.set(state.editor, 'recipients', [...recipients, recipient])
    }
  },
  resetRecipients: (state) => Vue.set(state.editor, 'recipients', [])
}

export default omnichannelMutations
