const campaign = {
  state: {
  },
  mutations: {
  },
  actions: {
    getCampaigns ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('https://64bd150f-5317-4c5d-abc9-b8271f00f3c4.mock.pstmn.io/campaigns')
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

export default campaign
