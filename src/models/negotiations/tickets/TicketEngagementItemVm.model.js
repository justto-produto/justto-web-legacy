import TicketItemVm from './TicketItemVm.model'

class PendingReason {
  constructor({ code, description }) {
    this.code = code
    this.description = description
  }
}

class Communications {
  constructor({ type, status }) {
    this.type = type
    this.status = status
  }
}

export class TicketEngagementItemVm extends TicketItemVm {
  constructor({ pendingReason, communications }) {
    this.pendingReason = new PendingReason(pendingReason)
    this.communications = new Communications(communications)
  }
}