import TicketItemVm from './TicketItemVm'
import CodedValueDomainDto from '../GenericClasses'

class CommunicationsEngagementStatusVm {
  constructor({ type, status }) {
    this.type = type
    this.status = status
  }
}

export class TicketEngagementItemVm extends TicketItemVm {
  constructor({ pendingReason, communications }) {
    super()
    this.pendingReason = new CodedValueDomainDto(pendingReason)
    this.communications = new CommunicationsEngagementStatusVm(communications)
  }
}
