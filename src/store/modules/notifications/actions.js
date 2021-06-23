import { axiosDispatch } from '@/utils/'

const urlBase = '/api/disputes/v2'

const actionsNotifications = {
  getThamirisAlerts({ _ }) {
    return axiosDispatch({
      url: `${urlBase}/todo-list`,
      mutation: 'setNotifications'
    })
  },

  SOCKET_ADD_NOTIFICATIONS({ commit }, notification) {

  }
}

export default actionsNotifications
