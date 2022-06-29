import { CALL_STATUS } from '@/constants/callStatus'
import { uuidv4 } from '@/utils'

class Call {
  constructor({
    disputeId,
    disputeStatus,
    toRoleId,
    toRoleName,
    number,
    enqueuedDate,
    status,
    appInstance,
    contacts,
    scheduling
  }) {
    this.id = uuidv4()
    this.disputeId = disputeId
    this.disputeStatus = disputeStatus
    this.toRoleId = toRoleId
    this.toRoleName = toRoleName
    this.number = number
    this.enqueuedDate = enqueuedDate
    this.status = CALL_STATUS[status]
    this.appInstance = appInstance
    this.contacts = contacts || { emails: [], phones: [] }
    this.scheduling = scheduling
  }
}

export { Call }
