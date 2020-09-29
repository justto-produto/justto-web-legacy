const actions = {
  // CHAT
  sendMessageEvent({ commit }, params) {
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
  }
  // SOCKET_ADD_ALERT ({ commit }, alert) {
  //   commit('addAlert', alert)
  // },
  // SOCKET_REMOVE_ALERT ({ commit }, alert) {
  //   commit('removeAlert', alert)
  // }
}

export default actions
