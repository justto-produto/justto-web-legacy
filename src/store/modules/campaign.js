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
        axios.get('campaigns')
          .then(response => {
            commit('setCampaign', response.data.content)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    createCampaign ({ commit }, campaign, importId) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('campaigns', campaign)
          .then(response => {
            if( importId ) {
              new Promise((resolve, reject) => {
                // eslint-disable-next-line
                axios.post( 'genese/' + importId + '/start', campaign)
              })  
            }
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
