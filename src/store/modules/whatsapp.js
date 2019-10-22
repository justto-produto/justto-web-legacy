const whatsappModule = {
  state: {
    connected: false
  },
  mutations: {
    setStatus (state, connected) {
      state.connected = connected
    }
  },
  actions: {
    getWhatsappStatus ({ commit }) {
      var xmlHttp = new XMLHttpRequest()
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          commit('setStatus', xmlHttp.responseText)
        }
      }
      xmlHttp.open('GET', 'https://justto.app/api/v1/status', true)
      xmlHttp.send(null)
    }
  },
  getters: {
    whatsappConnected: state => state.connected
  }
}

export default whatsappModule
