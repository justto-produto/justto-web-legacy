const actions = {
  getStrategiesList({ commit }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/strategies/list')
        .then(response => {
          commit('setImportedStrategies', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getStrategyEngagement({ commit }, id) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/strategies/' + id + '/engagement')
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  editStrategyTemplate({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/templates/', params)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  }
}

export default actions
