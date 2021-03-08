class Plaintiff {
  constructor({ documentNumber, name, oabNumber, oabState, role, status }) {
    this.documentNumber = documentNumber
    this.name = name
    this.oabNumber = oabNumber
    this.oabState = oabState
    this.role = role
    this.status = status
  }
}
export class TicketItemVm {
  constructor({ disputeId, plaintiff, negotiatorId, disputeStatus, visualized, favorite }) {
    this.disputeId = disputeId
    this.disputeStatus = disputeStatus
    this.negotiatorName = negotiatorId
    this.plaintiff = new Plaintiff(plaintiff)
    this.visualized = visualized
    this.favorite = favorite
  }
}
