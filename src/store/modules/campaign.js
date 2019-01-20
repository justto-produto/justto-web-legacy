const campaign = {
  state: {
    list: []
  },
  mutations: {
    setCampaign (state, response) {
      state.list = response
    }
  },
  actions: {
    getCampaigns ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('https://64bd150f-5317-4c5d-abc9-b8271f00f3c4.mock.pstmn.io/campaigns')
          .then(response => {
            commit('setCampaign', response.data)
            resolve(response)
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

export default campaign
