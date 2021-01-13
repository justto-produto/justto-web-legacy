export class TicketItemVm {
  constructor({ disputeId, plaintiff, plaintiffRole, negotiatorId, disputeStatus }) {
    this.disputeId = disputeId
    this.disputeStatus = disputeStatus
    this.plaintiffRole = plaintiffRole
    this.plaintiffName = plaintiff
    this.negotiatorName = negotiatorId
  }
}
