const actions = {
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
  removeRole ({ commit }, role) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.delete('api/disputes/' + role.disputeId + '/role/' + role.roleId, { disputeId: role.disputeId, id: role.roleId })
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
          commit('setCurrentPerson', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  editRole ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/disputes/' + params.disputeId +'/dispute-roles', params.disputeRole)
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
          commit('setCurrentPerson', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  changePersonName ({ commit }, person) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/persons/' + person.id + '/name', {
        name: person.name
      }).then(response => {
        commit('setCurrentPerson', response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default actions
