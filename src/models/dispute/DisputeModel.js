import moment from 'moment'

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
    return this.#dtoV1?.code || this.#dtoV3?.code || ''
  }

  get getDisputeVisualized() {
    return Boolean(this.#dtoV1?.visualized || this.#dtoV3?.visualized)
  }

  get getDisputeId() {
    return this.#dtoV1?.id ||
    this.#dtoV2?.disputeId ||
    this.#dtoV3?.id
  }

  get getHashedDisputeId() {
    return `#${this.getDisputeId}`
  }

  get getDisputeCampaignName() {
    return this.#dtoV1?.campaign?.name ||
    this.#dtoV3?.campaignName ||
    ''
  }

  get getDisputeUpperRange() {
    return Number(this.#dtoV1?.disputeUpperRange || this.#dtoV3?.upperRange || 0)
  }

  get getDisputeLastOfferValue() {
    return Number(this.#dtoV1?.lastOfferValue ||
      this.#dtoV3?.dealValue || 0)
  }

  get getDisputeLastCounterOfferName() {
    return this.#dtoV1?.lastCounterOfferName || this.#dtoV3?.ownerCounterproposal
  }

  get getDisputeStatus() {
    return this.#dtoV1?.status ||
      this.#dtoV2?.disputeStatus ||
      this.#dtoV3?.status ||
      ''
  }

  get getDisputeHasDocument() {
    return Boolean(this.#dtoV1?.hasDocument || this.#dtoV3?.hasDraft)
  }

  get getDisputeSignStatus() {
    return this.#dtoV1?.signStatus || this.#dtoV3?.awaitingSignature ? 'SIGNING' : (this.#dtoV3?.signedDraft ? 'SIGNED' : null)
  }

  get getDisputeLastCounterOfferValue() {
    return Number(this.#dtoV1?.lastCounterOfferValue ||
      this.#dtoV3?.counterproposalValue ||
      0)
  }

  get getDisputeProperties() {
    // TODO: Não utilizar
    return this.#dtoV1?.properties || {}
  }

  get getDisputePropertyPreNegotiationWords() {
    return this.#dtoV1?.properties['PALAVRAS PRE NEGOCIACAO'] || this.#dtoV3?.prenegotiationKeywords
  }

  get getDisputePropertyPreNegotiationReason() {
    // TODO: Não achei
    return this.#dtoV1?.properties['MOTIVO PRE NEGOCIACAO']
  }

  get getDisputeExpirationDate() {
    return this.#dtoV1?.expirationDate?.dateTime ||
      this.#dtoV3?.expirationDate ||
      ''
  }

  get getDisputeHasExpirationDate() {
    return Boolean(this.getDisputeExpirationDate)
  }

  get getDisputeDisputeNextToExpire() {
    if (this.#dtoV3?.expirationDate) {
      return moment(this.#dtoV3?.expirationDate).diff(moment(), 'days') <= 3
    }

    return Boolean(this.#dtoV1?.disputeNextToExpire)
  }

  get getDisputeIsPaused() {
    return Boolean(this.#dtoV1?.paused) ||
      Boolean(this.#dtoV2?.paused) ||
      Boolean(this.#dtoV3?.paused)
  }

  get getDisputeIsExpired() {
    return this.getDisputeStatus !== 'EXPIRED'
  }

  get getDisputeDealValue() {
    return this.#dtoV1?.disputeDealValue ||
      this.#dtoV3?.dealValue
  }

  get getDisputeDealDate() {
    return this.#dtoV1?.disputeDealDate?.dateTime ||
      this.#dtoV3?.dealDate ||
      ''
  }

  get getDisputeHasDealDate() {
    return Boolean(this.getDisputeDealDate)
  }

  get getDisputeIsWon() {
    return ['SETTLED', 'CHECKOUT', 'ACCEPTED'].includes(this.getDisputeStatus)
  }

  get getDisputeIsFavorite() {
    return Boolean(this.#dtoV1?.favorite) ||
      Boolean(this.#dtoV2?.favorite) ||
      Boolean(this.#dtoV3?.favorite)
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
    // TODO: Não achei
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
    return this.#dtoV1?.strategyId ||
      this.#dtoV3?.strategyId ||
      0
  }

  get getDisputeHasLastReceivedMessage() {
    return Boolean(this.getDisputeLastReceivedMessage?.type)
  }

  get getDisputeLastReceivedMessage() {
    // TODO: Não achei
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
    return this.#dtoV1?.firstClaimant ||
      this.#dtoV3?.firstPartyName ||
      ''
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
      this.#dtoV3?.firstPartyDocument ||
      ''
  }

  get getDisputeFirstClaimantAlerts() {
    return this.#dtoV1?.firstClaimantAlerts || []
  }

  get getDisputeHasFirstClaimantAlerts() {
    return this.getDisputeFirstClaimantAlerts.length > 0 ||
      this.#dtoV3?.hasVexatiousParty
  }

  get getDisputeFirstClaimantStatus() {
    if (this.#dtoV3?.lastNegotiatorAccessUsingCpf) {
      return moment(this.#dtoV3?.lastNegotiatorAccessUsingCpf).diff(moment, 'minutes') >= 5
    }

    return this.#dtoV1?.firstClaimantStatus || 'OFFLINE'
  }

  get getDisputeFirstClaimantHasPhones() {
    return (this.getDisputeRoles || []).filter(({ phones, archived, dead, party, roles }) => (
      !archived && !dead && ['CLAIMANT'].includes(party) && (roles || []).includes('PARTY') && (phones || []).filter(({ archived, blocked, isValid }) => (
        !archived && !blocked && isValid
      ))
    )).length > 0 ||
      this.#dtoV2?.plaintiff?.hasPhones ||
      this.#dtoV3?.hasClaimantPhone
  }

  // First Claymant Lowyer getters

  get getDisputeFirstClaimantLawyerName() {
    return this.#dtoV1?.firstClaimantLawyer ||
      this.#dtoV3?.firstLawyerName ||
      ''
  }

  get getDisputeFirstClaimantLawyerFirstName() {
    return this.getDisputeFirstClaimantLawyerName.split(' ')[0]
  }

  get getDisputeHasFirstClaimantLawyer() {
    return this.getDisputeFirstClaimantLawyerName.length > 0
  }

  get getDisputeFirstClaimantLawyerOab() {
    return this.#dtoV1?.firstClaimantLawyerOab || this.#dtoV3?.firstLawyerOab || ''
  }

  get getDisputeFirstClaimantLawyerDocumentNumber() {
    return this.#dtoV1?.firstClaimantLawyerDocumentNumber ||
      this.#dtoV2?.lawyer?.documentNumber ||
      this.#dtoV3?.firstLawyerDocument ||
      ''
  }

  get getDisputeFirstClaimantLawyerAlerts() {
    return this.#dtoV1?.firstClaimantLawyerAlerts || []
  }

  get getDisputeHasFirstClaimantLawyerAlerts() {
    return this.getDisputeFirstClaimantLawyerAlerts.length > 0 ||
      this.#dtoV3?.hasVexatiousLawyer
  }

  get getDisputeFirstClaimantLawyerStatus() {
    if (this.#dtoV3?.lastNegotiatorAccessUsingOab) {
      return moment(this.#dtoV3?.lastNegotiatorAccessUsingOab).diff(moment, 'minutes') >= 5
    }

    return this.#dtoV1?.firstClaimantLawyerStatus || 'OFFLINE'
  }

  get getDisputeFirstClaimantLawyerHasPhones() {
    return (this.getDisputeRoles || []).filter(({ phones, archived, dead, party, roles }) => (
      !archived && !dead && ['CLAIMANT'].includes(party) && (roles || []).includes('LAWYER') && (phones || []).filter(({ archived, blocked, isValid }) => (
        !archived && !blocked && isValid
      ))
    )).length > 0 || this.#dtoV2?.lawyer?.hasPhones || this.#dtoV3?.hasLawyerClaimantPhone
  }

  get getDisputeLastOutboundInteraction() {
    // TODO: Não achei
    return this.#dtoV1?.lastOutboundInteraction || {}
  }

  get getDisputeHasLastOutboundInteraction() {
    // TODO: Não achei
    return Boolean(this.getDisputeLastOutboundInteraction?.id)
  }

  get getDisputeLastOutboundInteractionMessage() {
    // TODO: Não achei
    return this.getDisputeLastOutboundInteraction?.message || {}
  }

  get getDisputeLastNegotiatorAccess() {
    // TODO: Não achei
    return this.#dtoV1?.lastNegotiatorAccess || {}
  }

  get getDisputeHasLastNegotiatorAccess() {
    return Boolean(this.getDisputeLastNegotiatorAccess?.id) ||
      Boolean(this.#dtoV3?.lastNegotiatorAccessUsingCpf) ||
      Boolean(this.#dtoV3?.lastNegotiatorAccessUsingOab)
  }

  get getDisputeLastNegotiatorAccessCreatAt() {
    // TODO: Não achei
    return this.#dtoV1?.lastNegotiatorAccess?.createAt?.dateTime
  }

  /**
   * Principais acessos:
   * .direction
   * .type
   * .createAt
   */
  get getDisputeLastInteraction() {
    // TODO: Não achei
    return this.#dtoV1?.lastInteraction ||
      this.#dtoV2?.lastInteraction
  }

  get getDisputeHasLastInteraction() {
    // TODO: Não achei
    return this.getDisputeLastInteraction?.direction?.length > 0
  }

  get getDisputeLastInteractionCreateAt() {
    // TODO: Não achei
    return this.#dtoV1?.lastInteraction?.createAt?.dateTime ||
      this.#dtoV2?.lastInteraction?.createdAt
  }

  get getDisputeHasUnknownPolarityParty() {
    // TODO: Não achei
    return this.getDisputeRoles.filter(({ party }) => (party === 'UNKNOWN')).length > 0 ||
      this.#dtoV2?.unknownPolarityParty
  }

  get getDisputeHasNoNegotiationInterest() {
    return this.#dtoV1?.properties?.NO_NEGOTIATION_INTEREST === String(true) ||
      Boolean(this.#dtoV2?.noNegotiationInterest) ||
      Boolean(this.#dtoV3?.hasNegotiationInterest)
  }

  getDisputeProperty(property) {
    return this.getDisputeProperties[property]
  }
}
