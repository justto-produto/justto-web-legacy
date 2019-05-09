const chatModule = {
  state: {
    typing: null,
    join: null,
    leave: null,
    message: null
  },
  mutations: {
    SOCKET_join (state, join) {
      state.join = join
    },
    SOCKET_type (state, typing) {
      state.typing = typing
    },
    SOCKET_message (state, message) {
      state.message = message
    },
    SOCKET_leave (state, leave) {
      state.leave = leave
    },
    clearTyping (state) {
      state.typing = null
    }
  },
  actions: {
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
    }
  },
  getters: {
  }
}

export default chatModule
