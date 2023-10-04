import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const dispute = {
  state: {
    dispute: {
      id: 0,
      properties: []
    },
    disputeLastInteractions: [],
    disputeAttachments: [],
    loadingAttachments: false,
    disputeProperties: {},
    metadata: { phones: [], emails: [] },
    loading: false,
    disputes: [],
    occurrences: [],
    occurrencesInitialSize: 20,
    occurrencesSize: 20,
    summaryNearExpirations: [],
    summaryNotVisualizeds: [],
    tab: '2',
    hasNew: false,
    query: {
      status: ['RUNNING'],
      sort: [
        'visualized,asc',
        'lastInboundInteraction.createdAt,desc',
        'expirationDate,asc'
      ],
      campaigns: [],
      strategy: [],
      tags: [],
      noTags: [],
      persons: [],
      expirationDate: [],
      dealDate: [],
      prescriptions: [],
      onlyFavorite: false,
      uf: [],
      page: 1,
      size: 20,
      term: '',
      total: 0
    },
    notesQuery: {
      page: 1,
      size: 20,
      sort: ['createdAt,desc', 'id,desc']
    },
    recentPrescriptions: JSON.parse(localStorage.getItem('jusrecentprescriptions')) || {},
    lastAccess: {},
    hasFilters: false,
    statuses: {},
    respondents: [],
    partyAnalysis: {},
    exportHistory: {
      content: [],
      empty: false,
      last: false
    },
    exportHistoryPage: 0,
    prescriptionsList: [],
    timeline: {},
    batchActionsLastUse: {},
    disputesNeedsRestart: {},
    engagementLimitExceeded: false,
    preventFilters: false
  },
  mutations,
  actions,
  getters
}

export default dispute
