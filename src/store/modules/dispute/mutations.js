import Vue from 'vue'

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
  setDisputeProprieties(state, disputeProprieties) {
    // eslint-disable-next-line no-prototype-builtins
    if (disputeProprieties.hasOwnProperty('ENRICHED')) {
      disputeProprieties.ENRIQUECIDO = disputeProprieties.ENRICHED ? 'SIM' : 'NÃO'
      delete disputeProprieties.ENRICHED
    }
    state.disputeProprieties = disputeProprieties
  },
  setDisputeAttachments(state, disputeAttachments) {
    state.disputeAttachments = disputeAttachments || []
  },
  setDisputeRoles(state, disputeRoles) {
    state.dispute.disputeRoles = disputeRoles
  },
  clearDispute(state) {
    state.dispute = { id: 0 }
    state.disputeAttachments = []
    state.disputeProprieties = {}
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
      sort: ['visualized,asc', 'conclusionDate,asc'],
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
    state.tab = '1'
  },
  setDisputeOccurrences(state, occurrences) {
    if (occurrences && occurrences.length) state.occurrences = occurrences.reverse()
  },
  addLoadingOccurrence(state, occurrence) {
    state.occurrences.push(occurrence)
  },
  SOCKET_ADD_OCCURRENCE(state, newOccurrence) {
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
  setDisputeStatuses(state, status) {
    state.statuses[status.label] = status.value
  },
  disputeSetHasNew(state, bol) {
    state.hasNew = bol
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
  addPartyAnalysis(state, analysis) {
    state.partyAnalysis[analysis.payload] = analysis.data
  },
  setExportHistory: (state, history) => (state.exportHistory = history),
  pushExportHistory: (state, history) => (state.exportHistory.content.push(...history.content)),
  addExportHistoryPage: (state) => (state.exportHistoryPage += 1),
  resetExportHistoryPage: (state) => (state.exportHistoryPage = 0),
  setPrescriptionsList: (state, prescriptions) => (state.prescriptionsList = prescriptions)
}

export default disputeMutations
