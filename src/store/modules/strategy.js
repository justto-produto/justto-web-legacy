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
        axios.get('https://64bd150f-5317-4c5d-abc9-b8271f00f3c4.mock.pstmn.io/strategies')
          .then(response => {
            commit('setStrategies', response.data)
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
