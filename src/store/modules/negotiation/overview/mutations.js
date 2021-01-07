const classesPath = '@/modules/negotiations/overview'
import DisputeOverview from `${classesPath}/DisputeOverviewInfoVm`
import DisputeOverviewInfo from `${classesPath}/DisputeOverviewInfoVm`
import DisputeOverviewParties from `${classesPath}/DisputeOverviewPartiesVm`
import DisputeOverviewProperties from `${classesPath}/DisputeOverviewPropertiesVm`
import DisputeOverviewAttachments from `${classesPath}/DisputeOverviewAttachmentsVm`

const overviewMutations = {
  setDisputeOverview: ({ disputeOverview }, params) => (disputeOverview = new DisputeOverview(params)),
  setDisputeOverviewInfo: ({ disputeOverviewInfo }, params) => (disputeOverviewInfo = new DisputeOverviewInfo(params)),
  setDisputeOverviewParties: ({ disputeOverviewParties }, params) => (disputeOverviewParties = new DisputeOverviewParties(params)),
  setDisputeOverviewProperties: ({ disputeOverviewParties }, params) => (disputeOverviewParties = new DisputeOverviewProperties(params)),
  setDisputeOverviewAttachments: ({ disputeOverviewAttachments }, params) => (disputeOverviewAttachments = new DisputeOverviewAttachments(params))
}

export default overviewMutations