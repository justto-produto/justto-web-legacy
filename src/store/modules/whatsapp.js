const whatsappModule = {
  state: {
    qrCode: '',
    status: 'STARTING',
    number: ''
  },
  mutations: {
    setWhatsappSocketMessage (state, message) {
      if (message.qrCode) state.qrCode = message.qrCode
      if (message.status) state.status = message.status
      if (message.number) state.number = message.number
    },
    clearSocket (state) {
      state.qrCode = ''
    },
    SOCKET_refresh (state, message) {
      if (message.qrCode) state.qrCode = message.qrCode
      if (message.status) state.status = message.status
      if (message.number) state.number = message.number
    }
  },
  actions: {
  },
  getters: {
    isWhatsappOffline: state => {
      return state.status === 'OFFLINE'
    },
    isWhatsappStarting: state => {
      return state.status === 'STARTING'
    },
    isWhatsappReady: state => {
      return state.status === 'READY'
    },
    isWhatsappConnected: state => {
      return state.status === 'CONNECTED'
    }
  }
}

export default whatsappModule
