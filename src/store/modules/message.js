const message = {
  state: {
    recentMessages: []
  },
  mutations: {
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
        // eslint-disable-next-line
        axios.post('api/messages/send/email', body)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
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
    messageRecentMessages: state => state.recentMessages
  }
}

export default message
