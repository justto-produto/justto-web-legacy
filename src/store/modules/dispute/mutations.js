import Vue from 'vue'
import moment from 'moment'

let newUpdateTimeout = null

const disputeMutations = {
  setDisputeTimeline(state, { timeline, code }) {
    Vue.set(state.timeline, code, {
      ...timeline,
      lawsuits: (timeline.lawsuits || [])
    })
  },
  cleanDisputeTimeline(state) {
    state.timeline = { }
  },
  fillerDisputeRole(_, { data, payload }) {
    Vue.set(payload, 'disputeRoles', data.content)
  },
  setDisputes(state, pageable) {
    state.disputes = pageable.content
    state.query.size = pageable.size
    state.query.total = pageable.totalElements
  },
  addDisputes(state, pageable) {
    if (pageable.content && pageable.content.length) {
      state.disputes.push(...pageable.content)
      state.query.size = pageable.size
      state.query.total = pageable.totalElements
    }
  },
  setDispute(state, disputeVM) {
    state.dispute = disputeVM
  },
  setDisputeProperty(state, property) {
    const key = Object.keys(property)[0]
    Vue.set(state.dispute.properties, key, property[key])
    Vue.set(state.disputeProperties, key, property[key])
  },
  setDisputeProperties(state, disputeProperties) {
    // eslint-disable-next-line no-prototype-builtins
    if (disputeProperties.hasOwnProperty('ENRICHED')) {
      disputeProperties.ENRIQUECIDO = disputeProperties.ENRICHED ? 'SIM' : 'NÃO'
      delete disputeProperties.ENRICHED
    }
    state.disputeProperties = disputeProperties
    state.dispute.properties = disputeProperties
    // Vue.set(state.dispute, 'properties', disputeProperties)
  },
  setDisputeAttachments(state, disputeAttachments) {
    state.disputeAttachments = disputeAttachments || []
    state.loadingAttachments = false
  },
  hideLoadingAttachments(state) {
    state.loadingAttachments = false
  },
  showLoadingAttachments(state) {
    state.loadingAttachments = true
  },
  setDisputeRoles(state, disputeRoles) {
    state.dispute.disputeRoles = disputeRoles
  },
  clearDispute(state) {
    state.dispute = { id: 0 }
    state.disputeAttachments = []
    state.disputeProperties = {}
  },
  clearDisputeOccurrences(state) {
    state.occurrences.length = 0
  },
  clearDisputes(state) {
    state.disputes = []
    state.hasNew = false
  },
  incrementOccurrencesSize(state) {
    state.occurrencesSize = state.occurrencesSize + 10
  },
  clearOccurrencesSize(state) {
    state.occurrencesSize = state.occurrencesInitialSize
  },
  setDisputeQuery(state, query) {
    state.query = query
    state.query.page = 1
  },
  updateDisputeQuery(state, params) {
    state.query[params.key] = params.value
    state.query.page = 1
  },
  resetDisputeQueryPage(state) {
    state.query.page = 1
    state.query.size = 20
  },
  addDisputeQueryPage(state) {
    if (state.query.page === 1) {
      state.query.size = 5
      state.query.page = 5
    } else {
      state.query.page += 1
    }
  },
  setSummaryNearExpirations(state, summarys) {
    state.summaryNearExpirations = summarys
  },
  setSummaryNotVisualizeds(state, summarys) {
    state.summaryNotVisualizeds = summarys
  },
  clearDisputeQuery(state) {
    state.query = {
      status: ['RUNNING'],
      sort: [
        'visualized,asc',
        'lastInboundInteraction.createdAt,desc',
        'conclusionDate,asc'
      ],
      campaigns: [],
      strategy: [],
      tags: [],
      persons: [],
      expirationDate: [],
      dealDate: [],
      prescriptions: [],
      onlyFavorite: false,
      page: 1,
      size: 20,
      term: '',
      total: 0
    }
  },
  clearDisputeQueryByTab(state) {
    state.query = {
      status: [],
      campaigns: [],
      strategy: [],
      tags: [],
      persons: state.query.persons,
      dealDate: [],
      expirationDate: [],
      prescriptions: [],
      onlyFavorite: false,
      page: 1,
      size: 20,
      term: state.query.term,
      total: 0
    }
  },
  setDisputeHasFilters(state, bol) {
    state.hasFilters = bol
  },
  setDisputesTab(state, tab) {
    state.tab = tab
  },
  clearDisputeTab(state, tab) {
    state.tab = '2'
  },
  setDisputeOccurrences(state, occurrences) {
    if (occurrences && occurrences.length) state.occurrences = occurrences.reverse()
  },
  addLoadingOccurrence(state, occurrence) {
    state.occurrences.push(occurrence)
  },
  addDisputeOccurrence(state, newOccurrence) {
    Vue.nextTick(() => {
      if (!newOccurrence.id) {
        state.occurrences.push(newOccurrence)
      } else {
        const occurrenceIndex = state.occurrences.findIndex(d => {
          let externalId
          try {
            externalId = parseInt(newOccurrence.interaction.message.parameters.MESSAGE_ID)
          } catch (e) {}
          return newOccurrence.id === d.id || (d.externalIdentification && externalId === d.externalIdentification)
        })
        if (occurrenceIndex === -1) {
          state.occurrences.push(newOccurrence)
        } else {
          Vue.set(state.occurrences, occurrenceIndex, newOccurrence)
        }
      }
    })
  },
  SOCKET_ADD_DISPUTE_SUMARY(state, disputeWebsocketSummaryDto) {
    Vue.nextTick(() => {
      if (disputeWebsocketSummaryDto.type) {
        switch (disputeWebsocketSummaryDto.type) {
          case 'DISPUTE_NEAR_EXPIRATION' : state.summaryNearExpirations = disputeWebsocketSummaryDto.summaries
            break
          case 'DISPUTE_NOT_VISUALIZED' : state.summaryNotVisualizeds = disputeWebsocketSummaryDto.summaries
            break
        }
      }
    })
  },
  setLastInteractions(state, lastInteractions) {
    state.disputeLastInteractions = lastInteractions
  },
  setDisputeStatuses(state, status) {
    state.statuses[status.label] = status.value
  },
  disputeSetHasNew(state, bol) {
    clearTimeout(newUpdateTimeout)

    const time = (bol ? 5 : 0) * 1000

    newUpdateTimeout = setTimeout(() => Vue.set(state, 'hasNew', bol), time)
  },
  setRespondents(state, respondents) {
    state.respondents = respondents
  },
  addPrescription(state, prescription) {
    state.query.prescriptions.push(prescription)
    state.query.page = 1
  },
  removePrescription(state, prescription) {
    state.query.prescriptions.splice(state.query.prescriptions.indexOf(prescription), 1)
    state.query.page = 1
  },
  setRecentPrescription(state, prescription) {
    Vue.set(state.recentPrescriptions, prescription, new Date())
    localStorage.setItem('jusrecentprescriptions', JSON.stringify(state.recentPrescriptions))
  },
  addPartyAnalysis(state, analysis) {
    state.partyAnalysis[analysis.payload] = analysis.data
  },
  setExportHistory: (state, history) => (state.exportHistory = history),
  pushExportHistory: (state, history) => (state.exportHistory.content.push(...history.content)),
  addExportHistoryPage: (state) => (state.exportHistoryPage += 1),
  resetExportHistoryPage: (state) => (state.exportHistoryPage = 0),
  setPrescriptionsList: (state, prescriptions) => (state.prescriptionsList = prescriptions),
  setLastAccess: (state, { disputeId, lastAccessTime }) => {
    const time = moment(lastAccessTime)
    const message = lastAccessTime ? `Você acessou esta disputa ${time.fromNow()} - às ${time.format('HH:mm')}` : 'Ainda não sei quando você acessou esta disputa'
    Vue.set(state.lastAccess, disputeId, {
      date: message,
      log: new Date()
    })
  },
  cleanLastAccess: (state) => (state.lastAccess = {}),
  setDisputeRole: (state, disputeRole) => {
    (state.dispute?.disputeRoles || []).map((dr, index) => {
      if (dr.id === disputeRole.id) {
        Vue.set(state.dispute.disputeRoles, index, disputeRole)
      }
    })
  },
  setDisputeMetadata: (state, metadata) => {
    Vue.set(state, 'metadata', metadata)
  },

  setBatchActionsLastUse: (state, { action }) => {
    state.batchActionsLastUse[action] = moment().toISOString()
    localStorage.setItem('BATCH_ACTIONS_LAST_USE', JSON.stringify(state.batchActionsLastUse))

    const seconds = action === 'CHANGE_NEGOTIATOR' ? 60 : 30

    setTimeout(() => {
      Vue.delete(state.batchActionsLastUse, action)
      localStorage.setItem('BATCH_ACTIONS_LAST_USE', JSON.stringify(state.batchActionsLastUse))

      const vue = document.querySelector('.management-actions')?.parentElement?.__vue__
      if (vue) vue.$forceUpdate()
    }, seconds * 1000)
  }
}

export default disputeMutations
