const messageGetters = {
  messageRecentMessages: state => state.recentMessages,
  getMessageResumeByDisputeId: state => (disputeId) => {
    return state.messageResumes.find(mr => mr.disputeId === disputeId)
  },
  quickReplyTemplates: state => state.quickReplyTemplates,
  getPreviewMessage: state => state.previewMessage,
  canShowPreview: state => state.showPreview
}

export default messageGetters
