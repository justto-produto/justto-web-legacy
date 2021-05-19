import { DateTime } from '../GenericClasses'

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
    expirationDate,
    conclusionDate, conclusion,
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
    hasDraft,
    draftStatus
  }) {
    const oab = firstClaimantLawyerOab ? firstClaimantLawyerOab.split('/') : []
    this.disputeId = disputeId || id
    this.disputeStatus = disputeStatus || status
    this.negotiatorName = negotiatorName || disputeRoles?.find(role => role.roleNameNegotiator).name
    this.expirationDate = new DateTime(expirationDate || {})
    this.conclusionDate = new DateTime((conclusionDate || conclusion) || {})
    this.visualized = visualized
    this.favorite = favorite
    this.hasDraft = hasDraft
    this.draftStatus = draftStatus
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
