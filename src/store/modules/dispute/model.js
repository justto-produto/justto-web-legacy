import {
  getFirstRole,
  getRoles,
  getLastInteraction,
  getLastInteractionIcon,
  getLastInteractionTooltip
} from '@/plugins/jusUtils'

const getDisputeVMList = function (disputes) {
  let vmList = []
  for (let dispute of disputes) {
    let viewModelDispute = getDisputeVM(dispute)
    vmList.push(viewModelDispute)
  }
  return vmList
}

const getDisputeVM = function (dispute) {
  if (!dispute) {
    return {}
  }
  let vm = {
    id: dispute.id,
    code: dispute.code,
    favorite: !!dispute.favorite,
    status: dispute.status,
    strategyName: dispute.campaign ? dispute.campaign.strategy : '',
    strategy: {
      name: dispute.campaign ? dispute.campaign.strategy : '',
      id: dispute.campaign ? dispute.campaign.strategyId : 0
    },
    campaignName: dispute.campaign ? dispute.campaign.name : '',
    firstClaimant: getFirstRole(dispute.disputeRoles, 'CLAIMANT', 'PARTY'),
    firstClaimantLawyer: getFirstRole(dispute.disputeRoles, 'CLAIMANT', 'LAWYER'),
    disputeRoles: dispute.disputeRoles,
    expirationDate: dispute.expirationDate.dateTime,
    disputeDealDate: dispute.conclusion ? dispute.conclusion.conclusionDate.dateTime : null,
    lastInteractionDate: dispute.lastInteraction ? dispute.lastInteraction.date.dateTime : null,
    lastInteractionType: dispute.lastInteraction ? dispute.lastInteraction.type : null,
    communicationMsgTotalSent: dispute.communications.filter(c => c.status === 'PROCESSED' && c.direction === 'OUTBOUND').length,
    communicationMsgTotalsShedulled: dispute.communications.filter(c => c.status === 'WAITING' && c.direction === 'OUTBOUND').length,
    negotiators: getRoles(dispute.disputeRoles, 'RESPONDENT', 'NEGOTIATOR'),
    disputeUpperRange: '0.0',
    lastOfferValue: '0.0',
    lastCounterOfferValue: '0.0',
    disputeDealValue: '0.0',
    enrichedEmails: dispute.disputeRoles.map(r => r.emails).filter(p => p.enriched).length,
    enrichedPhones: dispute.disputeRoles.map(r => r.phones).filter(p => p.enriched).length,
    sentEmailMessages: dispute.communications.filter(c => c.status === 'PROCESSED' && c.direction === 'OUTBOUND' && c.communicationType === 'EMAIL').length,
    sentCnaMessages: dispute.communications.filter(c => c.status === 'PROCESSED' && c.direction === 'OUTBOUND' && c.communicationType === 'EMAIL_CNA').length,
    sendWhatsappMessages: dispute.communications.filter(c => c.status === 'PROCESSED' && c.direction === 'OUTBOUND' && c.communicationType === 'WHATSAPP').length,
    isDeal: ['ACCEPTED', 'CHECKOUT', 'SETTLED'].includes(dispute.status),
    hasInteraction: dispute.hasInteraction,
    lastOfferPercentToUpperRange: 0,
    paused: dispute.paused
  }
  let object = dispute.objects.length ? dispute.objects[0] : null
  if (object) {
    vm.disputeUpperRange = object.respondentBoundary ? object.respondentBoundary.boundary : 0
    let lastOfferValue = object.offers.filter(o => o.role.party === 'RESPONDENT')
    let lastCounterOfferValue = object.offers.filter(o => o.role.party === 'CLAIMANT')
    if (lastOfferValue.length) {
      vm.lastOfferValue = lastOfferValue.slice(-1).pop().value
    }
    if (lastCounterOfferValue.length) {
      vm.lastCounterOfferValue = lastCounterOfferValue.slice(-1).pop().value
    }
    if (['SETTLED', 'CHECKOUT', 'ACCEPTED'].includes(dispute.status)) {
      vm.disputeDealValue = object.offers.slice(-1).pop().value
    }
  }
  vm.lastInteractionTooltip = getLastInteractionTooltip(vm.lastInteractionType)
  vm.lastInteractionIcon = getLastInteractionIcon(vm.lastInteractionType)
  vm.lastInteractionFormatedDate = getLastInteraction(vm.lastInteractionDate)
  vm.hasInvalidEmail = dispute.disputeRoles.filter(d => {
    return d.emails.filter(e => !e.isValid).length
  }).length
  vm.hasInvalidPhone = dispute.disputeRoles.filter(d => {
    return d.phones.filter(e => !e.isValid).length
  }).length
  if (vm.lastCounterOfferValue !== '0.0') {
    vm.lastOfferPercentToUpperRange = vm.lastOfferValue / vm.disputeUpperRange * 100
  }
  return vm
}

export { getDisputeVMList, getDisputeVM }
