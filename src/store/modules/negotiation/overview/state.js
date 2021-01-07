const classesPath = '@/modules/negotiations/overview'
import Overview from `${classesPath}/DisputeOverviewInfoVm`
import OverviewInfo from `${classesPath}/DisputeOverviewRolesVm`
import OverviewRoles from `${classesPath}/DisputeOverviewInfoVm`
import OverviewAttachments from `${classesPath}/DisputeOverviewAttachmentsVm`
import OverviewProperties from `${classesPath}/DisputeOverviewPropertiesVm`

const overviewState = {
  state: {
    overview: new Overview(),
    overviewInfo: new OverviewInfo(),
    overviewRoles: new OverviewRoles(),
    overviewAttachments: new OverviewAttachments(),
    overviewProperties: new OverviewProperties(),
  }
}

export default overviewState