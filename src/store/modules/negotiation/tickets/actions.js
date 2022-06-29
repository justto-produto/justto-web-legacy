import { axiosDispatch, buildQuery } from '@/utils/'

const disputeApi = '/api/disputes/v2'

const getCorrespondingTab = disputeStatus => {
  switch (disputeStatus) {
    case 'PRE_NEGOTIATION':
      return 'pre-negotiation'
    case 'IMPORTED':
    case 'ENRICHED':
    case 'ENGAGEMENT':
    case 'PENDING':
      return 'engagement'
    case 'RUNNING':
      return 'running'
    case 'ACCEPTED':
    case 'CHECKOUT':
      return 'accepted'
    case 'UNSETTLED':
    case 'SETTLED':
    case 'CANCELED':
    case 'EXPIRED':
      return 'finished'
    default:
      return 'engagement'
  }
}

const overviewActions = {
  getTickets({ state, dispatch, commit }, command) {
    commit('incrementTicketsGettersCounter')

    if (command !== 'nextPage') dispatch('setTicketsQuery', { key: 'page', value: 1 })

    return axiosDispatch({
      url: `${disputeApi}/filter${buildQuery(state.ticketsQuery)}`,
      mutation: 'setCommunicationTickets',
      payload: command || 'firstPage'
    }).finally(() => commit('decrementTicketsGettersCounter'))
  },

  getTicketsNextPage({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('addTicketQueryPage')
      dispatch('getTickets', 'nextPage')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },

  setTicketsQuery({ commit }, params) {
    commit('setTicketsQuery', params)
  },

  setTicketPrescription({ commit }, prescription) {
    commit('setTicketPrescription', prescription)
  },

  unsetTicketPrescription({ commit }, prescription) {
    commit('unsetTicketPrescription', prescription)
  },

  setTicketsFilters({ commit }, { filters, hasFilters, preventFilters, preventSocket }) {
    commit('setTicketsFilters', filters)
    commit('setTicketsHasFilters', Boolean(hasFilters))
    commit('setPreventFilters', Boolean(preventFilters))
    commit('setPreventSocket', Boolean(preventSocket))
  },

  setTicketsActiveTab({ commit }, activeTab) {
    commit('setTicketsActiveTab', activeTab)
    localStorage.setItem('TICKET_ACTIVE_TAB', activeTab)
  },

  updateActiveTab({ state, commit }, disputeStatus) {
    const correspondingTab = getCorrespondingTab(disputeStatus)
    const isUpdate = ['ACCEPTED', 'CHECKOUT', 'SETTLED'].includes(disputeStatus) && state.tickets.content.length

    if (correspondingTab !== state.ticketsActiveTab && isUpdate) {
      const vue = document.querySelector('#app').__vue__

      document.querySelectorAll('.el-notification.info.right').forEach(tag => tag.__vue__.$parent.close())

      vue.$jusNotification({
        title: 'há atualizações nesta disputa',
        message: 'Clique se quiser recarregar ou feche se quiser continuar nesta página.',
        type: 'info',
        iconClass: 'el-icon-info',
        onClick: () => {
          document.querySelector('.el-notification.info.right').__vue__.$parent.close()
          commit('setTicketsActiveTab', correspondingTab)
        }
      })
    }
  },

  SOCKET_ADD_DISPUTE({ rootState, state, commit, dispatch }, dispute) {
    const correspondingTab = getCorrespondingTab(dispute.status)

    if (rootState.negotiationTicketsModule.ticketsPreventSocket) return

    if (rootState.negotiationOverviewModule.ticketOverview.disputeId === dispute.id) {
      const isUpdate = ['ACCEPTED', 'CHECKOUT', 'SETTLED'].includes(dispute.status) && !['ACCEPTED', 'CHECKOUT', 'SETTLED'].includes(rootState.negotiationOverviewModule.ticketOverview.status)
      const isInNegotiation = location.href.includes('negotiation')
      const isCorrespondingTab = correspondingTab !== state.ticketsActiveTab

      if (process.env.NODE_ENV === 'development') {
        console.table({
          isCorrespondingTab,
          isUpdate,
          isInNegotiation,
          status: dispute.status
        })
      }

      dispatch('getTicketOverview', dispute.id)

      if (isCorrespondingTab && isUpdate && isInNegotiation) {
        const vue = document.querySelector('#app').__vue__

        document.querySelectorAll('.el-notification.info.right').forEach(tag => tag.__vue__.$parent.close())

        vue.$jusNotification({
          title: 'há atualizações nesta disputa',
          message: 'Clique se quiser recarregar ou feche se quiser continuar nesta página.',
          type: 'info',
          iconClass: 'el-icon-info',
          duration: 50000,
          onClick: () => {
            document.querySelector('.el-notification.info.right').__vue__.$parent.close()
            commit('setTicketsActiveTab', correspondingTab)
          }
        })
      } else {
        commit('updateTicketItem', dispute)
      }

      commit('updateTicket', dispute)
    } else {
      if (correspondingTab !== state.ticketsActiveTab) {
        commit('deleteTicket', dispute.id)
      } else {
        commit('updateTicketItem', dispute)
      }
    }
  },

  SOCKET_REMOVE_DISPUTE({ commit }, dispute) {
    commit('deleteTicket', dispute.id)
  }
}

export default overviewActions
