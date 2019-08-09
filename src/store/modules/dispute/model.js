import {
  getFirstRole,
  getRoles,
  getLastInteraction,
  getLastInteractionIcon,
  getLastInteractionTooltip
} from '@/plugins/jusUtils'

const disputeViewModel = function (disputes) {
  let viewModelDisputes = []
  for (let dispute of disputes) {
    let viewModelDispute = {
      id: dispute.id,
      code: dispute.code,
      favorite: !!dispute.favorite,
      status: dispute.status,
      strategyName: dispute.campaign ? dispute.campaign.strategy : '',
      campaignName: dispute.campaign ? dispute.campaign.name : '',
      firstClaimant: getFirstRole(dispute.disputeRoles, 'CLAIMANT', 'PARTY'),
      firstClaimantLawyer: getFirstRole(dispute.disputeRoles, 'CLAIMANT', 'LAWYER'),
      disputeRoles: dispute.disputeRoles,
      expirationDate: dispute.expirationDate.dateTime,
      disputeDealDate: dispute.conclusion ? dispute.conclusion.conclusionDate.dateTime : null,
      lastInteractionDate: dispute.lastInteraction ? dispute.lastInteraction.date.dateTime : null,
      lastInteractionType: dispute.lastInteraction ? dispute.lastInteraction.type : null,
      communicationMsgTotalSent: dispute.communications.filter(c => c.status === 'PROCESSED').length,
      communicationMsgTotalsShedulled: dispute.communications.filter(c => c.status === 'WAITING').length,
      negotiators: getRoles(dispute.disputeRoles, 'RESPONDENT', 'NEGOTIATOR'),
      disputeUpperRange:  '0.0',
      lastOfferValue: '0.0',
      lastCounterOfferValue: '0.0',
      disputeDealValue: '0.0',
      enrichedEmails: 0,
      enrichedPhones: 0,
      sentEmailMessages: 0,
      sentCnaMessages: 0,
      sendWhatsappMessages: 0,
      visualizedMessages: 0,
      isDeal: false,
      hasInteraction: dispute.hasInteraction
    }
    let object = dispute.objects.length ? dispute.objects[0] : null
    if (object) {
      viewModelDispute.disputeUpperRange = object.respondentBoundary ? object.respondentBoundary.boundary : 0

      let lastOfferValue = object.offers.filter(o => o.role.party === 'RESPONDENT')
      let lastCounterOfferValue = object.offers.filter(o => o.role.party === 'CLAIMANT')

      if (lastOfferValue.length) {
        viewModelDispute.lastOfferValue = lastOfferValue.slice(-1).pop().value
      }
      if (lastCounterOfferValue.length) {
        viewModelDispute.lastCounterOfferValue = lastCounterOfferValue.slice(-1).pop().value
      }
      if (['SETTLED', 'CHECKOUT', 'ACCEPTED'].includes(dispute.status)) {
        viewModelDispute.disputeDealValue = object.offers.slice(-1).pop().value
      }
    }
    dispute.lastInteractionTooltip = getLastInteractionTooltip(dispute.lastInteractionType)
    dispute.lastInteractionIcon = getLastInteractionIcon(dispute.lastInteractionType)
    dispute.lastInteractionFormatedDate = getLastInteraction(dispute.lastInteractionDate)
    viewModelDisputes.push(viewModelDispute)
  }
  return viewModelDisputes
}

export default disputeViewModel
