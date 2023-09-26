import EDITOR_CONSTANTS from '@/constants/editor'
class OccurrenceFilter {
  constructor(page, size, sort) {
    this.page = page || 1
    this.size = size || 20
    this.sort = sort || ['createdAt,desc']
  }

  get getPage() {
    return this.page
  }
}
class OccurrenceSummary {
  constructor(sms, email, whatsapp) {
    this.SMS = sms || {}
    this.EMAIL = email || {}
    this.WHATSAPP = whatsapp || {}
  }

  get getSMS() {
    return this.SMS
  }
}
export class StateOccurrences {
  constructor(filter, list, summary, fullMessages, renderedCounts, totalElements) {
    this.filter = filter || new OccurrenceFilter()
    this.list = list || []
    this.summary = summary || new OccurrenceSummary()
    this.fullMessages = fullMessages || {}
    this.renderedCounts = renderedCounts || 0
    this.totalElements = totalElements || this.totalElements
  }

  get getFilter() {
    return this.filter
  }
}

const omnichannelMutations = {
  activeTab: EDITOR_CONSTANTS.MESSAGES,
  countOmnichannelGetters: 0,
  totalOfOccurrences: 20,
  lastPage: false,
  occurrences: new StateOccurrences(),
  groupedOccurrences: {},
  editor: {
    messageText: '',
    messageSubject: '',
    recentMessages: [],
    noteText: '',
    messageType: 'email',
    recipients: [],
    attachments: []
  },
  disputeProtocol: {},
  exportTicketModalVisible: false
}

export default omnichannelMutations
