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
        axios.get('api/campaigns')
          .then(response => {
            commit('setCampaign', response.data.content)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    createCampaign ({ commit }, campaign) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/campaigns', campaign)
          .then(response => {
            if (campaign.importId) {
              // eslint-disable-next-line
              axios.post('api/genese/' + campaign.importId + '/start')
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
    campaignList: state => state.list.sort((a, b) => {
      if (a.createdAt < b.createdAt) { return 1 }
      if (a.createdAt > b.createdAt) { return -1 }
      return 0
    }),
    activeCampaigns: (state, getters) => {
      let filteredCampaigns = []
      for (let dispute of getters.disputes) {
        let activeCampaign = state.list.filter((campaign) => {
          return campaign.id === dispute.campaignid
        })
        filteredCampaigns.push(activeCampaign[0])
      }
      filteredCampaigns = filteredCampaigns.sort((a, b) => {
        if (a.createdAt < b.createdAt) { return 1 }
        if (a.createdAt > b.createdAt) { return -1 }
        return 0
      })
      return new Set(filteredCampaigns)
    }
  }
}

export default campaign
