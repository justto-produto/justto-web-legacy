import { getRoles } from '@/plugins/jusUtils'

const actions = {
  // CHAT
  sendMessageEvent ({ commit }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/disputes/' + params.id + '/chat/message', params.data)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  SOCKET_ADD_DISPUTE ({ commit, rootState }, dispute) {
    const negotiators = getRoles(dispute.disputeRoles, 'RESPONDENT', 'NEGOTIATOR')
    const negotiatorIds = negotiators.map(n => n.personId)
    if (rootState.workspaceModule.profile === 'ADMINISTRATOR' ||
      negotiatorIds.includes(rootState.personModule.currentPerson.id)) {
      commit('updateDisputeList', dispute)
      commit('updateDisputeAlerts', dispute)
    }
  },
  SOCKET_REMOVE_DISPUTE ({ commit }, dispute) {
    commit('removeDisputeFromList', dispute)
    commit('updateDisputeAlerts', dispute)
  }
  // SOCKET_ADD_ALERT ({ commit }, alert) {
  //   commit('addAlert', alert)
  // },
  // SOCKET_REMOVE_ALERT ({ commit }, alert) {
  //   commit('removeAlert', alert)
  // }
}

export default actions
