const campaign = {
  state: {
    list: []
  },
  mutations: {
    setCampaigns(state, response) {
      state.list = response
    }
  },
  actions: {
    getCampaigns({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/disputes/campaigns')
          .then(response => {
            commit('setCampaigns', response.data)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getCampaignByName({ commit }, name) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/campaigns/search?name=' + name)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    createCampaign({ commit }, campaign) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/campaigns', campaign)
          .then(response => {
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
      if (a < b) return 1
      if (a > b) return -1
      return 0
    })
    // activeCampaigns: (state, getters) => {
    //   let filteredCampaigns = []
    //   for (let dispute of getters.disputes) {
    //     let activeCampaign = state.list.filter((campaign) => {
    //       return campaign.name === dispute.campaignName
    //     })
    //     if (activeCampaign && activeCampaign.length) filteredCampaigns.push(activeCampaign[0])
    //   }
    //   filteredCampaigns = filteredCampaigns.sort((a, b) => {
    //     if (a.createdAt < b.createdAt) { return 1 }
    //     if (a.createdAt > b.createdAt) { return -1 }
    //     return 0
    //   })
    //   return new Set(filteredCampaigns)
    // }
  }
}

export default campaign
