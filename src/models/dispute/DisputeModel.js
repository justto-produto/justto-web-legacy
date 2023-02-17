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

    Object.assign(this, dispute)
  }

  get getDisputeCode() {
    return this.#dtoV1?.code || ''
  }

  get getDisputeVisualized() {
    return Boolean(this.#dtoV1?.visualized)
  }

  get getDisputeId() {
    return this.#dtoV1?.id
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
    return this.#dtoV1?.status || ''
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
    return Boolean(this.#dtoV1?.paused)
  }

  get getDisputeIsExpired() {
    return this.getDisputeStatus !== 'EXPIRED'
  }

  get getDisputeDealValue() {
    return this.#dtoV1?.disputeDealValue
  }

  get getDisputeHasDealDate() {
    return Boolean(this.#dtoV1?.disputeDealDate.dateTime)
  }

  get getDisputeDealDate() {
    return this.#dtoV1?.disputeDealDate?.dateTime | ''
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
    return Boolean(this.#dtoV1?.favorite)
  }

  get getDisputeIsInPreNegotiation() {
    return this.getDisputeStatus === 'PRE_NEGOTIATION'
  }

  get getDisputeIsInNegotiation() {
    return this.getDisputeStatus === 'RUNNING'
  }

  get getDisputeRoles() {
    return this.#dtoV1?.disputeRoles || []
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
    return Boolean(this.#dtoV1?.lastReceivedMessage || this.#dtoV2?.lastReceivedMessage)
  }

  get getDisputeLastReceivedMessage() {
    return this.#dtoV1?.lastReceivedMessage ||
      this.#dtoV2?.lastReceivedMessage || { properties: {} }
  }

  get getDisputeHasLastReceivedMessageProperties() {
    return Boolean(Object.keys(this.#dtoV1?.lastReceivedMessage?.properties || {}).length) ||
      Boolean(Object.keys(this.#dtoV2?.lastReceivedMessage?.properties || {}).length)
  }

  get getDisputeLastReceivedMessageProperties() {
    return this.#dtoV1?.lastReceivedMessage?.properties ||
      this.#dtoV2?.lastReceivedMessage?.properties ||
      { PERSON_EMAIL: '', PERSON_NAME: '' }
  }

  getDisputeProperty(property) {
    return this.getProperties[property]
  }
}
