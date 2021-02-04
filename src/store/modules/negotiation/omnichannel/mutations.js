import Vue from 'vue'

import EDITOR_TABS from '@/constants/editor'

const omnichannelMutations = {
  setActiveTab: (state, tab) => {
    if (Object.values(EDITOR_TABS).includes(tab)) {
      Vue.set(state, 'activeTab', tab)
    }
  },
  setEditorReady: (state, isReady) => {
    Vue.set(state.editor, 'ready', isReady)
  },
  setEditorText: (state, text) => {
    Vue.set(state.editor, 'messageText', text)
  },
  setNoteEditorText: (state, text) => {
    Vue.set(state.editor, 'noteText', text)
  },
  setMessageType: (state, type) => {
    Vue.set(state.editor, 'messageType', type)
  },
  setOccurrences: (state, { content }) => {
    // TODO: Validar duplicidade/sobrescrita de ocorrências.
    const occurrences = content.map(el => ({ ...el, occurrences: el.occurrences.reverse() })).reverse()
    Vue.set(state.occurrences, 'list', occurrences)
  },
  addFullMessage: (state, { id, content }) => {
    Vue.set(state.occurrences.fullMessages, id, content)
  },
  removeFullMessage: (state, id) => {
    Vue.delete(state.occurrences.fullMessages, id)
  }
}

export default omnichannelMutations
