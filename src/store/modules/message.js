import axiosDispatcher from '@/store/axiosDispatcher.js'

const message = {
  state: {
    recentMessages: [],
    messageResumes: []
  },
  mutations: {
    addMessageResume(state, messageResume) {
      state.messageResumes.push(messageResume)
    },
    deleteMessageResumeByDisputeId(state, disputeId) {
      const index = state.messageResumes.findIndex(mr => mr.disputeId === disputeId)
      if (index !== -1) state.messageResumes.splice(index, 1)
    }
  },
  actions: {
    canSendWhatsapp({ _ }, phone) {
      return axiosDispatcher({ url: `api/messages/can-send/${phone}` })
    },
    sendwhatsapp({ _ }, data) {
      return axiosDispatcher({
        url: 'api/messages/send/whatsapp',
        method: 'post',
        data: data
      })
    },
    sendemail({ _ }, data) {
      return axiosDispatcher({
        url: 'api/messages/send/email',
        method: 'post',
        data: data
      })
    },
    getOccurrenceMessage({ _ }, messageId) {
      return axiosDispatcher({
        url: `api/messages/${messageId}`
      })
    }
  },
  getters: {
    messageRecentMessages: state => state.recentMessages,
    getMessageResumeByDisputeId: state => (disputeId) => {
      return state.messageResumes.find(mr => mr.disputeId === disputeId)
    }
  }
}

export default message
