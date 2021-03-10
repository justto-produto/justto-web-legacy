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
export default class TicketItemVm {
  constructor({
    disputeId, id,
    disputeStatus, status,
    negotiatorName,
    visualized,
    favorite,
    plaintiff,
    firstClaimant,
    firstClaimantLawyer,
    firstClaimantDocumentNumber,
    firstClaimantLawyerDocumentNumber,
    firstClaimantLawyerOab,
    firstClaimantStatus,
    firstClaimantLawyerStatus
  }) {
    const oab = firstClaimantLawyerOab ? firstClaimantLawyerOab.split('/') : []
    this.disputeId = disputeId || id
    this.disputeStatus = disputeStatus || status
    this.negotiatorName = negotiatorName
    this.visualized = visualized
    this.favorite = favorite
    this.plaintiff = new Plaintiff(plaintiff || {
      name: firstClaimant || firstClaimantLawyer,
      documentNumber: firstClaimantDocumentNumber || firstClaimantLawyerDocumentNumber,
      oabNumber: oab[0] || '',
      oabState: oab[1] || '',
      role: firstClaimant ? 'PARTY' : 'LAWYER',
      status: firstClaimant ? firstClaimantStatus : firstClaimantLawyerStatus
    })
  }
}
