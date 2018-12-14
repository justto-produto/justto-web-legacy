const socket = {
  state: {
    urlQrCode: '',
    status: 'STARTING',
    number: ''
  },
  mutations: {
    setMessage (state, message) {
      if (message.urlQrCode) state.urlQrCode = message.urlQrCode
      if (message.status) state.status = message.status
      if (message.number) state.number = message.number
    },
    clearSocket (state) {
      state.urlQrCode = ''
    }
  },
  actions: {
  },
  getters: {
    isOffline: state => {
      return state.status === 'OFFLINE'
    },
    isReady: state => {
      return state.status === 'READY'
    },
    isStarting: state => {
      return state.status === 'STARTING'
    },
    isConnected: state => {
      return state.status === 'CONNECTED'
    }
  }
}

export default socket
