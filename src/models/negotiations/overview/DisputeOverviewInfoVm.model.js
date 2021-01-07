class Classification {
  constructor({ name, details }) {
    this.name = name
    this.details = details.map(detail => new Classification(detail))
  }
}

export class DisputeOverviewInfoVm {
  constructor({
    id,
    strategyId,
    contactPartyWhenInvalidLowyer,
    contactPartyWhenNoLowyer,
    businessHoursEngagement,
    alwaysContactParty,
    skipEnrichment,
    denySavingDeposit,
    ownerProposalRoleId,
    requestedValue,
    materialDamageValue,
    moralDamageValue,
    internalIdentification,
    provisionedValue,
    campaign,
    importDate,
    expirationDate,
    classification
  }) {
    this.id = id
    this.strategyId = strategyId
    this.contactPartyWhenInvalidLowyer = contactPartyWhenInvalidLowyer
    this.contactPartyWhenNoLowyer = contactPartyWhenNoLowyer
    this.businessHoursEngagement = businessHoursEngagement
    this.alwaysContactParty = alwaysContactParty
    this.skipEnrichment = skipEnrichment
    this.denySavingDeposit = denySavingDeposit
    this.ownerProposalRoleId = ownerProposalRoleId
    this.requestedValue = requestedValue
    this.materialDamageValue = materialDamageValue
    this.moralDamageValue = moralDamageValue
    this.internalIdentification = internalIdentification
    this.provisionedValue = provisionedValue
    this.campaign = campaign
    this.importDate = importDate
    this.expirationDate = expirationDate
    this.classification = new Classification(classification)
  }
}