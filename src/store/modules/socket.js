const socket = {
  state: {
    urlQrCode: ''
  },
  mutations: {
    setMessage (state, urlQrCode) {
      state.urlQrCode = urlQrCode
    },
    clearSocket (state) {
      state.urlQrCode = ''
    }
  },
  actions: {
  },
  getters: {
  }
}

export default socket
