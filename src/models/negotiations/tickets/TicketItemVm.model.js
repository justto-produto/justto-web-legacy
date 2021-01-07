export class TicketItemVm {
  constructor({ disputeId, plaintiff, plaintiffRole, negotiator, disputeStatus }) {
    this.disputeId = disputeId
    this.disputeStatus = disputeStatus
    this.plaintiffRole = plaintiffRole
    this.plaintiff = plaintiff
    this.negotiator = negotiator
  }
}