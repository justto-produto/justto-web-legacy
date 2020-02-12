const message = {
  state: {
    recentMessages: [],
    messageResumes: []
  },
  mutations: {
    addMessageResume (state, messageResume) {
      state.messageResumes.push(messageResume)
    },
    deleteMessageResumeByDisputeId (state, disputeId) {
      let index = state.messageResumes.findIndex(mr => mr.disputeId === disputeId)
      if (index !== -1) state.messageResumes.splice(index, 1)
    }
  },
  actions: {
    sendwhatsapp ({ commit }, body) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/messages/send/whatsapp', body)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    sendemail ({ commit }, body) {
      return new Promise((resolve, reject) => {
        resolve()

        // eslint-disable-next-line
        // axios.post('api/messages/send/email', body)
        //   .then(response => {
        //     resolve(response.data)
        //   })
        //   .catch(error => {
        //     reject(error)
        //   })
      })
    },
    sendcna ({ commit }, body) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/messages/send/cna', body)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getOccurrenceMessage ({ commit }, messageId) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/messages/' + messageId)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
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
