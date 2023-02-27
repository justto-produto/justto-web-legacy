export class DisputeModel {
  #dtoV1
  // TODO: Mapear Ticket
  #dtoV2
  #dtoV3

  constructor(dispute) {
    if (dispute?.dtoVersion === '1') {
      this.#dtoV1 = dispute
    } else if (dispute?.dtoVersion === '2') {
      this.#dtoV2 = dispute
    } else if (dispute?.dtoVersion === '3') {
      this.#dtoV3 = dispute
    } else {
      // TODO: Remover esse quando tiver o campo 'dtoVersion'
      this.#dtoV1 = dispute
    }

    // NÃO DEVE SER APAGADO!!
    Object.assign(this, dispute)
  }

  get getDisputeCode() {
    return this.#dtoV1?.code || ''
  }

  get getDisputeVisualized() {
    return Boolean(this.#dtoV1?.visualized)
  }

  get getDisputeId() {
    return this.#dtoV1?.id ||
    this.#dtoV2?.disputeId
  }

  get getHashedDisputeId() {
    return `#${this.getDisputeId}`
  }

  get getDisputeCampaignName() {
    return this.#dtoV1?.campaign?.name || ''
  }

  get getDisputeUpperRange() {
    return Number(this.#dtoV1?.disputeUpperRange || 0)
  }

  get getDisputeLastOfferValue() {
    return Number(this.#dtoV1?.lastOfferValue || 0)
  }

  get getDisputeLastCounterOfferName() {
    return this.#dtoV1?.lastCounterOfferName
  }

  get getDisputeStatus() {
    return this.#dtoV1?.status ||
      this.#dtoV2?.disputeStatus ||
      ''
  }

  get getDisputeHasDocument() {
    return Boolean(this.#dtoV1?.hasDocument)
  }

  get getDisputeSignStatus() {
    return this.#dtoV1?.signStatus
  }

  get getDisputeLastCounterOfferValue() {
    return Number(this.#dtoV1?.lastCounterOfferValue || 0)
  }

  get getDisputeProperties() {
    return this.#dtoV1?.properties || {}
  }

  get getDisputeExpirationDate() {
    return this.#dtoV1?.expirationDate?.dateTime || ''
  }

  get getDisputeHasExpirationDate() {
    return Boolean(this.#dtoV1?.expirationDate?.dateTime)
  }

  get getDisputeDisputeNextToExpire() {
    return Boolean(this.#dtoV1?.disputeNextToExpire)
  }

  get getDisputeIsPaused() {
    return Boolean(this.#dtoV1?.paused) ||
      Boolean(this.#dtoV2?.paused)
  }

  get getDisputeIsExpired() {
    return this.getDisputeStatus !== 'EXPIRED'
  }

  get getDisputeDealValue() {
    return this.#dtoV1?.disputeDealValue
  }

  get getDisputeHasDealDate() {
    return Boolean(this.#dtoV1?.disputeDealDate?.dateTime)
  }

  get getDisputeDealDate() {
    return this.#dtoV1?.disputeDealDate?.dateTime || ''
  }

  get getDisputeIsWon() {
    return ['SETTLED', 'CHECKOUT', 'ACCEPTED'].includes(this.getDisputeStatus)
  }

  get getHasFirstClaimantLawyer() {
    return Boolean(this.#dtoV1?.firstClaimantLawyer)
  }

  get getFirstClaimantLawyerName() {
    return this.#dtoV1?.firstClaimantLawyer
  }

  get getDisputeIsFavorite() {
    return Boolean(this.#dtoV1?.favorite) ||
      Boolean(this.#dtoV2?.favorite)
  }

  get getDisputeIsInPreNegotiation() {
    return this.getDisputeStatus === 'PRE_NEGOTIATION'
  }

  get getDisputeIsInNegotiation() {
    return this.getDisputeStatus === 'RUNNING'
  }

  get getDisputeIsCanceled() {
    return this.getDisputeStatus === 'CANCELED'
  }

  set setDisputeRoles(roles) {
    if (this.#dtoV1?.disputeRoles) {
      this.#dtoV1.disputeRoles = roles
    } else if (this.#dtoV2?.disputeRoles) {
      this.#dtoV2.disputeRoles = roles
    }
  }

  get getDisputeRoles() {
    return this.#dtoV1?.disputeRoles || this.#dtoV2?.disputeRoles || []
  }

  get getDisputeHasRoles() {
    return this.getDisputeRoles.length > 0
  }

  get getDisputeNextStatus() {
    return {
      IMPORTED: 'ACCEPTED',
      ENRICHED: 'ACCEPTED',
      ENGAGEMENT: 'ACCEPTED',
      PENDING: 'ACCEPTED',
      RUNNING: 'ACCEPTED',
      UNSETTLED: 'ACCEPTED',
      ACCEPTED: 'CHECKOUT',
      CHECKOUT: 'SETTLED',
      '': 'RUNNING'
    }[this.getDisputeStatus]
  }

  get getDisputeStrategyId() {
    return this.#dtoV1?.strategyId || 0
  }

  get getDisputeHasLastReceivedMessage() {
    return Boolean(Object.keys(this.getDisputeLastReceivedMessage) > 1)
  }

  get getDisputeLastReceivedMessage() {
    return this.#dtoV1?.lastReceivedMessage ||
      this.#dtoV2?.lastReceivedMessage || { properties: {} }
  }

  get getDisputeHasLastReceivedMessageProperties() {
    return Boolean(Object.keys(this.#dtoV1?.lastReceivedMessage?.properties || {}).length) ||
      Boolean(Object.keys(this.#dtoV2?.lastReceivedMessage?.properties || {}).length)
  }

  get getDisputeLastReceivedMessageSender() {
    return this.getDisputeLastReceivedMessage?.message?.sender || ''
  }

  get getDisputeLastReceivedMessageHasSender() {
    Boolean(this.getDisputeLastReceivedMessageSender)
  }

  get getDisputeLastReceivedMessageResume() {
    return this.getDisputeLastReceivedMessage?.message?.resume || ''
  }

  get getDisputeLastReceivedMessageHasResume() {
    return this.getDisputeLastReceivedMessageResume.length > 0
  }

  get getDisputeLastReceivedMessageProperties() {
    return this.#dtoV1?.lastReceivedMessage?.properties ||
      this.#dtoV2?.lastReceivedMessage?.properties ||
      { PERSON_EMAIL: '', PERSON_NAME: '' }
  }

  // First Claymant getters

  get getDisputeFirstClaimantName() {
    return this.#dtoV1?.firstClaimant || ''
  }

  get getDisputeFirstClaimantFirstName() {
    return this.getDisputeFirstClaimantName.split(' ')[0]
  }

  get getDisputeHasFirstClaimant() {
    return this.getDisputeFirstClaimantName.length > 0
  }

  get getDisputeFirstClaimantDocumentNumber() {
    return this.#dtoV1?.firstClaimantDocumentNumber ||
      this.#dtoV2?.plaintiff?.documentNumber ||
      ''
  }

  get getDisputeFirstClaimantAlerts() {
    return this.#dtoV1?.firstClaimantAlerts || []
  }

  get getDisputeHasFirstClaimantAlerts() {
    return this.getDisputeFirstClaimantAlerts.length > 0
  }

  get getDisputeFirstClaimantStatus() {
    return this.#dtoV1?.firstClaimantStatus || 'OFFLINE'
  }

  get getDisputeFirstClaimantHasPhones() {
    return (this.getDisputeRoles || []).filter(({ phones, archived, dead, party, roles }) => (
      !archived && !dead && ['CLAIMANT'].includes(party) && (roles || []).includes('PARTY') && (phones || []).filter(({ archived, blocked, isValid }) => (
        !archived && !blocked && isValid
      ))
    )).length > 0 || this.#dtoV2?.plaintiff?.hasPhones
  }

  // First Claymant Lowyer getters

  get getDisputeFirstClaimantLawyerName() {
    return this.#dtoV1?.firstClaimantLawyer || ''
  }

  get getDisputeFirstClaimantLawyerFirstName() {
    return this.getDisputeFirstClaimantLawyerName.split(' ')[0]
  }

  get getDisputeHasFirstClaimantLawyer() {
    return this.getDisputeFirstClaimantLawyerName.length > 0
  }

  get getDisputeFirstClaimantLawyerOab() {
    return this.#dtoV1?.firstClaimantLawyerOab || ''
  }

  get getDisputeFirstClaimantLawyerDocumentNumber() {
    return this.#dtoV1?.firstClaimantLawyerDocumentNumber ||
      this.#dtoV2?.lawyer?.documentNumber ||
      ''
  }

  get getDisputeFirstClaimantLawyerAlerts() {
    return this.#dtoV1?.firstClaimantLawyerAlerts || []
  }

  get getDisputeHasFirstClaimantLawyerAlerts() {
    return this.getDisputeFirstClaimantLawyerAlerts.length > 0
  }

  get getDisputeFirstClaimantLawyerStatus() {
    return this.#dtoV1?.firstClaimantLawyerStatus || 'OFFLINE'
  }

  get getDisputeFirstClaimantLawyerHasPhones() {
    return (this.getDisputeRoles || []).filter(({ phones, archived, dead, party, roles }) => (
      !archived && !dead && ['CLAIMANT'].includes(party) && (roles || []).includes('LAWYER') && (phones || []).filter(({ archived, blocked, isValid }) => (
        !archived && !blocked && isValid
      ))
    )).length > 0 || this.#dtoV2?.lawyer?.hasPhones
  }

  get getDisputeLastOutboundInteraction() {
    return this.#dtoV1?.lastOutboundInteraction || {}
  }

  get getDisputeHasLastOutboundInteraction() {
    return Boolean(this.getDisputeLastOutboundInteraction?.id)
  }

  get getDisputeLastOutboundInteractionMessage() {
    return this.getDisputeLastOutboundInteraction?.message || {}
  }

  get getDisputeLastNegotiatorAccess() {
    return this.#dtoV1?.lastNegotiatorAccess || {}
  }

  get getDisputeHasLastNegotiatorAccess() {
    return Boolean(this.getDisputeLastNegotiatorAccess?.id)
  }

  get getDisputeLastNegotiatorAccessCreatAt() {
    return this.#dtoV1?.lastNegotiatorAccess?.createAt?.dateTime
  }

  get getDisputeLastInteraction() {
    return this.#dtoV1?.lastInteraction ||
      this.#dtoV2?.lastInteraction
  }

  get getDisputeHasLastInteraction() {
    return Object.keys(this.getDisputeLastInteraction) > 1
  }

  get getDisputeLastInteractionCreateAt() {
    return this.#dtoV1?.lastInteraction?.createAt?.dateTime ||
      this.#dtoV2?.lastInteraction?.createdAt
  }

  get getDisputeHasUnknownPolarityParty() {
    return this.getDisputeRoles.filter(({ party }) => (party === 'UNKNOWN')).length > 0 ||
      this.#dtoV2?.unknownPolarityParty
  }

  get getDisputeHasNoNegotiationInterest() {
    return this.#dtoV1?.properties?.NO_NEGOTIATION_INTEREST === String(true) ||
      Boolean(this.#dtoV2?.noNegotiationInterest)
  }

  getDisputeProperty(property) {
    return this.getProperties[property]
  }
}
