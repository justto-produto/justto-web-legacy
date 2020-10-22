import axiosDispatcher from '@/store/axiosDispatcher'

const socketActions = {
  // CHAT
  sendMessageEvent({ _ }, params) {
    return axiosDispatcher({
      url: `api/disputes/${params.id}/chat/message`,
      method: 'PUT',
      data: params.data
    })
  }
  // SOCKET_ADD_ALERT ({ commit }, alert) {
  //   commit('addAlert', alert)
  // },
  // SOCKET_REMOVE_ALERT ({ commit }, alert) {
  //   commit('removeAlert', alert)
  // }
}

export default socketActions
