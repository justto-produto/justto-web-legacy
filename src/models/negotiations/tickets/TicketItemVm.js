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
    id,
    disputeId,
    disputeStatus,
    status,
    negotiatorName,
    expirationDate,
    conclusionDate,
    conclusion,
    visualized,
    favorite,
    plaintiff,
    firstClaimant,
    firstClaimantLawyer,
    firstClaimantDocumentNumber,
    firstClaimantLawyerDocumentNumber,
    firstClaimantLawyerOab,
    firstClaimantStatus,
    firstClaimantLawyerStatus,
    disputeRoles,
    hasDocument,
    signStatus,
    hasDraft,
    lawyer,
    draftStatus,
    alwaysContactParty,
    contactPartyWhenInvalidLowyer,
    contactPartyWhenInvalidLawyer,
    contactPartyWhenNoLowyer,
    contactPartyWhenNoLawyer
  }) {
    const oab = firstClaimantLawyerOab ? firstClaimantLawyerOab.split('/') : []
    this.disputeId = disputeId || id
    this.alwaysContactParty = Boolean(alwaysContactParty)
    this.contactPartyWhenInvalidLawyer = Boolean(contactPartyWhenInvalidLawyer || contactPartyWhenInvalidLowyer)
    this.contactPartyWhenInvalidLowyer = Boolean(contactPartyWhenInvalidLawyer || contactPartyWhenInvalidLowyer)
    this.contactPartyWhenNoLawyer = Boolean(contactPartyWhenNoLawyer || contactPartyWhenNoLowyer)
    this.contactPartyWhenNoLowyer = Boolean(contactPartyWhenNoLawyer || contactPartyWhenNoLowyer)
    this.disputeStatus = disputeStatus || status
    this.negotiatorName = negotiatorName || disputeRoles?.find(role => role.roleNameNegotiator).name
    this.expirationDate = expirationDate
    this.conclusionDate = (conclusionDate || conclusion)
    this.visualized = visualized
    this.favorite = favorite
    this.lawyer = lawyer
    this.hasDraft = hasDraft || hasDocument
    this.signStatus = signStatus || draftStatus
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
