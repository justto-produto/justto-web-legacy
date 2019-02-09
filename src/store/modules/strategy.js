const strategy = {
  state: {
    list: []
  },
  mutations: {
    setStrategies (state, response) {
      state.list = response
    }
  },
  actions: {
    getStrategies ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('strategies/list')
          .then(response => {
            commit('setStrategies', response.data)
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getStrategyEngagement ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('strategies/' + id + '/engagement')
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

export default strategy
