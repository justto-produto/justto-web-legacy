class ClassificationVm {
  constructor({ name, details }) {
    this.name = name
    this.details = details.map(detail => new ClassificationVm(detail))
  }
}

export class DisputeOverviewInfoVm {
  constructor({ disputeId, strategyId, contactPartyWhenInvalidLowyer, contactPartyWhenNoLowyer, businessHoursEngagement, alwaysContactParty, skipEnrichment, denySavingDeposit, ownerProposalRoleId, requestedValue, materialDamageValue, moralDamageValue, internalIdentification, provisionedValue, campaign, importDate, expirationDate, classification }) {
    this.disputeId = disputeId
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
    this.classification = new ClassificationVm(classification)
  }
}
