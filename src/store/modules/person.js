const personModule = {
  state: {
    person: {}
  },
  mutations: {
    setPerson (state, person) {
      if (person) state.person = person
    },
    clearPerson (state) {
      state.person = {}
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
            commit('setPerson', response.data)
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    editRole ({ commit }, infoRole) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/persons', { id: infoRole.personId, name: infoRole.name, documentNumber: infoRole.documentNumber })
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    addOab ({ commit }, oabForm) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/persons/' + oabForm.personId +'/oabs', { number: oabForm.oab, state: oabForm.state })
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
    },
    changePersonName ({ commit }, person) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/persons/' + person.id + '/name', {
          name: person.name
        }).then(response => {
          commit('setPerson', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    createEmail ({ commit }, newEmailBody) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/persons/' + newEmailBody.personId + '/emails', {address: newEmailBody.address})
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    createPhone ({ commit }, newPhoneBody) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/persons/' + newPhoneBody.personId + '/phones', {number: newPhoneBody.number})
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
    personName: state => {
      return state.person.name
    },
    personId: state => {
      return state.person.id
    }
  }
}

export default personModule
