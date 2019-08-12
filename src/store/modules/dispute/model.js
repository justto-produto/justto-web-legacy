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
      sentEmailMessages: dispute.communications.filter(c => c.status === 'PROCESSED' && c.direction === 'OUTBOUND' && c.type === 'EMAIL').length,
      sentCnaMessages: dispute.communications.filter(c => c.status === 'PROCESSED' && c.direction === 'OUTBOUND' && c.type === 'EMAIL_CNA').length,
      sendWhatsappMessages: dispute.communications.filter(c => c.status === 'PROCESSED' && c.direction === 'OUTBOUND' && c.type === 'WHATSAPP').length,
      isDeal: ['ACCEPTED', 'CHECKOUT', 'SETTLED'].some(s => s === dispute.status),
      hasInteraction: dispute.hasInteraction,
      lastOfferPercentToUpperRange: 0,
      paused: dispute.paused
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
    viewModelDispute.lastInteractionTooltip = getLastInteractionTooltip(viewModelDispute.lastInteractionType)
    viewModelDispute.lastInteractionIcon = getLastInteractionIcon(viewModelDispute.lastInteractionType)
    viewModelDispute.lastInteractionFormatedDate = getLastInteraction(viewModelDispute.lastInteractionDate)

    viewModelDispute.hasInvalidEmail = dispute.disputeRoles.filter(d => {
      return d.emails.filter(e => !e.isValid).length
    }).length
    viewModelDispute.hasInvalidPhone = dispute.disputeRoles.filter(d => {
      return d.phones.filter(e => !e.isValid).length
    }).length

    if (viewModelDispute.lastCounterOfferValue !== '0.0') {
      // viewModelDispute.lastOfferPercentToUpperRange
    }

    viewModelDisputes.push(viewModelDispute)
  }
  return viewModelDisputes
}

export default disputeViewModel
