import Vue from 'vue'

const messageMutations = {
  addMessageResume: (state, messageResume) => (state.messageResumes.push(messageResume)),
  deleteMessageResumeByDisputeId(state, disputeId) {
    const index = state.messageResumes.findIndex(mr => mr.disputeId === disputeId)
    if (index !== -1) state.messageResumes.splice(index, 1)
  },
  // editQuickReplyTemplate(state, template) {
  //   const index =  state.quickReplyTemplates.findIndex(t => t.template.id === template.id)
  //   state.quickReplyTemplates[index].template = template
  // },
  setQuickReplyTemplates: (state, templates) => {
    Vue.set(state, 'quickReplyTemplates', templates)
  },
  archiveQuickReplyTemplate(state, templateId) {
    const index = state.quickReplyTemplates.findIndex(t => t.template.id === templateId)
    if (index !== -1) {
      Vue.delete(state.quickReplyTemplates, index)
    }
  },
  setMessageToPreview(state, { body }) {
    Vue.set(state, 'previewMessage', body)
    Vue.set(state, 'showPreview', Boolean(body?.length))
  },
  setShowPreview(state, visibility) {
    Vue.set(state, 'showPreview', visibility)
  }
}

export default messageMutations
