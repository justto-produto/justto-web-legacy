import { getFirstRole } from '@/plugins/jusUtils'

const disputeViewModel = function (disputes) {
  let viewModelDisputes = []
  for (let dispute of disputes) {
    let viewModelDispute = {
      disputeId: dispute.id,
      favorite: dispute.favorite,
      status: dispute.status,
      campaignName: dispute.campaign ? dispute.campaign.name : '',
      firstClaimant: getFirstRole(dispute.disputeRoles, 'CLAIMANT', 'PARTY'),
      firstClaimantLawyer: getFirstRole(dispute.disputeRoles, 'CLAIMANT', 'LAWYER'),
      expirationDate: dispute.expirationDate.dateTime,
      conclusionDate: dispute.conclusion ? dispute.conclusion.conclusionDate.dateTime : null,
      disputeUpperRange: 0,
      lastOfferValue: 0,
      lastCounterOfferValue: 0
    }
    let object = dispute.objects.length ? dispute.objects[0] : null
    if (object) {
      viewModelDispute.disputeUpperRange = object.respondentBoundary ? object.respondentBoundary.boundary : 0
      let lastOfferValue = object.offers.filter(offer => {
        return offer.role.party === 'RESPONDENT'
      })
      if (lastOfferValue.length) {
        viewModelDispute.lastOfferValue = lastOfferValue.slice(-1).pop().value
      }
      let lastCounterOfferValue = object.offers.filter(offer => {
        return offer.role.party === 'CLAIMANT'
      })
      if (lastCounterOfferValue.length) {
        viewModelDispute.lastCounterOfferValue = lastCounterOfferValue.slice(-1).pop().value
      }
    }
    viewModelDisputes.push(viewModelDispute)
  }
  return viewModelDisputes
}

export default disputeViewModel
