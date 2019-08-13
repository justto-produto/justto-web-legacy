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
  SOCKET_ADD ({ commit }, dispute) {
    commit('updateDisputeList', dispute)
  },
  SOCKET_REMOVE ({ commit }, dispute) {
    commit('removeDisputeFromList', dispute)
  }
}

export default actions
