import TicketItemVm from './TicketItemVm'
import CodedValueDomainDto from '../GenericClasses'

class CommunicationsEngagementStatusVm {
  constructor({ type, status }) {
    this.type = type
    this.status = status
  }
}

export default class TicketEngagementItemVm extends TicketItemVm {
  constructor(dispute) {
    const { pendingReason, communications } = dispute
    super(dispute)
    this.pendingReason = new CodedValueDomainDto(pendingReason)
    this.communications = new CommunicationsEngagementStatusVm(communications)
  }
}
