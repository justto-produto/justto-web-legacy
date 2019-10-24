const whatsappModule = {
  state: {
    reconectCounter: 0,
    connected: undefined
  },
  mutations: {
    setStatus (state, connected) {
      state.connected = connected
    },
    addReconectCounter (state) {
      state.reconectCounter = state.reconectCounter + 1
    },
    resetReconectCounter (state) {
      state.reconectCounter = 0
    }
  },
  actions: {
    getWhatsappStatus ({ commit, dispatch, state }) {
      let xmlHttp = new XMLHttpRequest()
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
          if (xmlHttp.status === 200) {
            commit('setStatus', true)
          } else {
            if (state.reconectCounter < 4) {
              setTimeout(() => {
                dispatch('getWhatsappStatus')
              }, 4 * 1000)
              commit('addReconectCounter')
            } else {
              commit('setStatus', false)
              commit('resetReconectCounter')
            }
          }
        }
      }
      xmlHttp.open('GET', 'https://justto.app/api/v1/status', true)
      xmlHttp.send(null)
    }
  },
  getters: {
    whatsappStatus: state => state.connected
  }
}

export default whatsappModule
