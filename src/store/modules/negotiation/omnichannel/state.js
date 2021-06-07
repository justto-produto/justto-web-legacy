import EDITOR_CONSTANTS from '@/constants/editor'
class OccurrenceFilter {
  constructor(page, size, sort) {
    this.page = page || 1
    this.size = size || 20
    this.sort = sort || ['createdAt,desc']
  }
}
class OccurrenceSummary {
  constructor(sms, email, whatsapp) {
    this.SMS = sms || {}
    this.EMAIL = email || {}
    this.WHATSAPP = whatsapp || {}
  }
}
export class StateOccurrences {
  constructor(filter, list, summary, fullMessages, renderedCounts, totalElements) {
    this.filter = filter || new OccurrenceFilter()
    this.list = list || []
    this.summary = summary || new OccurrenceSummary()
    this.fullMessages = fullMessages || {}
    this.renderedCounts = renderedCounts || 0
    this.totalElements = totalElements || 0
  }
}

const omnichannelMutations = {
  activeTab: EDITOR_CONSTANTS.MESSAGES,
  countOmnichannelGetters: 0,
  occurrences: new StateOccurrences(),
  editor: {
    messageText: '',
    recentMessages: [],
    noteText: '',
    messageType: 'email',
    recipients: [],
    attachments: []
  },
  exportTicketModalVisible: false
}

export default omnichannelMutations
