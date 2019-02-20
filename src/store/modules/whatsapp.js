const whatsappModule = {
  state: {
    urlQrCode: '',
    status: 'OFFLINE',
    number: ''
  },
  mutations: {
    setWhatsappSocketMessage (state, message) {
      console.log(message)
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
