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
  }
}

export default omnichannelMutations
