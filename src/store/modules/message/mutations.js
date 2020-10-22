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
  setQuickReplyTemplates: (state, templates) => (state.quickReplyTemplates = templates),
  archiveQuickReplyTemplate(state, templateId) {
    const index = state.quickReplyTemplates.findIndex(t => t.template.id === templateId)
    if (index !== -1) state.uickReplyTemplates.splice(index, 1)
  }
}

export default messageMutations
