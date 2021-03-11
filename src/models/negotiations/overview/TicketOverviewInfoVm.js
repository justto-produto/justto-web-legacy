import { DateTime } from '../GenericClasses'

class ClassificationVm {
  constructor({ name, details }) {
    this.name = name
    this.details = details
  }
}

export default class DisputeOverviewInfoVm {
  constructor({
    disputeId, id,
    strategyId,
    internalIdentification, externalId,
    contactPartyWhenInvalidLowyer,
    contactPartyWhenNoLowyer,
    businessHoursEngagement,
    alwaysContactParty,
    skipEnrichment,
    denySavingDeposit,
    campaignName,
    campaign,
    requestedValue,
    materialDamageValue, materialDamage,
    moralDamageValue, moralDamage,
    provisionedValue,
    importedDate, createAt,
    expireDate, expirationDate,
    classification
  }) {
    this.disputeId = disputeId || id
    this.strategyId = strategyId
    this.internalIdentification = internalIdentification || externalId
    this.contactPartyWhenInvalidLowyer = contactPartyWhenInvalidLowyer || campaign.contactPartyWhenInvalidLowyer
    this.contactPartyWhenNoLowyer = contactPartyWhenNoLowyer || campaign.contactPartyWhenNoLowyer
    this.businessHoursEngagement = businessHoursEngagement || campaign.businessHoursEngagement
    this.alwaysContactParty = alwaysContactParty || campaign.alwaysContactParty
    this.denySavingDeposit = denySavingDeposit || campaign.denySavingDeposit
    this.skipEnrichment = skipEnrichment || campaign.skipEnrichment
    this.campaignName = campaignName || campaign.name
    this.requestedValue = requestedValue
    this.materialDamageValue = materialDamageValue || materialDamage
    this.moralDamageValue = moralDamageValue || moralDamage
    this.provisionedValue = provisionedValue
    this.importedDate = new DateTime((importedDate || createAt) || {})
    this.expireDate = new DateTime((expireDate || expirationDate) || {})
    this.classification = new ClassificationVm(classification || {})
  }
}
