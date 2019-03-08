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
    }
  },
  actions: {
  },
  getters: {
    isWhatsappOffline: state => {
      return state.status === 'OFFLINE'
    },
    isWhatsappReady: state => {
      return state.status === 'READY'
    },
    isWhatsappStarting: state => {
      return state.status === 'STARTING'
    },
    isWhatsappConnected: state => {
      return state.status === 'CONNECTED'
    }
  }
}

export default whatsappModule
