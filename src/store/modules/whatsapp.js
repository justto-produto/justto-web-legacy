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
      // eslint-disable-next-line
      axios.get('https://api.service.chatpro.com.br:31855/api/v1/status',{
        headers: {
          'Authorization': '70b36901fd1a81771ae98f07d4d5eee051ee36ac'
        }
      }).then(response => {
        commit('setStatus', response.data.connected)
      }).catch(error => {
        commit('setStatus', error.response.data.connected)
      })
    }
  },
  getters: {
    whatsappConnected: state => state.connected
  }
}

export default whatsappModule
