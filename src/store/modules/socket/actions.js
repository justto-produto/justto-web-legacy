const actions = {
  // CHAT
  sendMessageEvent ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/disputes/' + params.id + '/chat/message', params.data)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // DISPUTE
  SOCKET_add ({ dispatch }, dispute) {
    dispatch('updateDispute', dispute.id)
  },
  SOCKET_remove ({ dispatch }, dispute) {
    dispatch('updateDispute', dispute.id)
  }
}

export default actions
