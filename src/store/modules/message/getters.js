import { EditorBackup } from '@/models/message/editorBackup'

const messageGetters = {
  messageRecentMessages: state => state.recentMessages,
  getMessageResumeByDisputeId: state => (disputeId) => {
    return state.messageResumes.find(mr => mr.disputeId === disputeId)
  },
  quickReplyTemplates: state => state.quickReplyTemplates,
  getPreviewMessage: state => state.previewMessage,
  canShowPreview: state => state.showPreview,
  getMessagesBackup: state => state.messageBackup,
  getMessagesBackupById: state => disputeId => {
    return Object.keys(state.messageBackup).includes(String(disputeId)) ? state.messageBackup[disputeId] : new EditorBackup({})
  }
}

export default messageGetters
