const personModule = {
  state: {
    person: {}
  },
  mutations: {
    setPerson (state, person) {
      if (person) state.person = person
    }
  },
  actions: {
    getPerson ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/persons/' + id)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    myPerson ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/persons/my')
          .then(response => {
            commit('setPerson', response.data)
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    addOab ({ commit }, oamForm) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/persons/my/oabs', { number: oamForm.oab, state: oamForm.state })
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    setPerson ({ commit }, person) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/persons', person)
          .then(response => {
            commit('setPerson', response.data)
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
  }
}

export default personModule
