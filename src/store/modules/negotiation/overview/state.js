const classesPath = '@/modules/negotiations/overview'
import DisputeOverview from `${classesPath}/DisputeOverviewInfoVm`
import DisputeOverviewInfo from `${classesPath}/DisputeOverviewInfoVm`
import DisputeOverviewParties from `${classesPath}/DisputeOverviewPartiesVm`
import DisputeOverviewProperties from `${classesPath}/DisputeOverviewPropertiesVm`
import DisputeOverviewAttachments from `${classesPath}/DisputeOverviewAttachmentsVm`

const overviewState = {
  state: {
    disputeOverview: new DisputeOverview(),
    disputeOverviewInfo: new DisputeOverviewInfo(),
    disputeOverviewParties: new DisputeOverviewParties(),
    disputeOverviewAttachments: new DisputeOverviewAttachments(),
    disputeOverviewProperties: new DisputeOverviewProperties(),
  }
}

export default overviewState