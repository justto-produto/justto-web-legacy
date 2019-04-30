const chatModule = {
  state: {
    typing: null
  },
  mutations: {
    SOCKET_join (state, param) {
      // console.log(param)
    },
    SOCKET_type (state, param) {
      state.typing = param
    },
    SOCKET_message (state, param) {
      // console.log(param)
    },
    SOCKET_leave (state, param) {
      // console.log(param)
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
