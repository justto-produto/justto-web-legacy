import axiosDispatcher from '@/store/axiosDispatcher.js'

const message = {
  state: {
    recentMessages: [],
    messageResumes: [],
  },
  mutations: {
    addMessageResume(state, messageResume) {
      state.messageResumes.push(messageResume)
    },
    deleteMessageResumeByDisputeId(state, disputeId) {
      let index = state.messageResumes.findIndex(mr => mr.disputeId === disputeId)
      if (index !== -1) state.messageResumes.splice(index, 1)
    },
  },
  actions: {
    sendwhatsapp({ commit }, data) {
      return axiosDispatcher({
        url: 'api/messages/send/whatsapp',
        method: 'post',
        data: data,
      })
    },
    sendemail({ commit }, data) {
      return axiosDispatcher({
        url: 'api/messages/send/email',
        method: 'post',
        data: data,
      })
    },
    getOccurrenceMessage({ commit }, messageId) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/messages/' + messageId)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
  },
  getters: {
    messageRecentMessages: state => state.recentMessages,
    getMessageResumeByDisputeId: state => (disputeId) => {
      return state.messageResumes.find(mr => mr.disputeId === disputeId)
    },
  },
}

export default message
