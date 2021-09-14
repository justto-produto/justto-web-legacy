import { CALL_STATUS } from '@/constants/callStatus'

class Call {
  constructor({
    disptueId,
    toRoleId,
    toRoleName,
    number,
    enqueuedDate,
    status,
    workspaceId,
    teamName,
    appInstance
  }) {
    this.disptueId = disptueId
    this.toRoleId = toRoleId
    this.toRoleName = toRoleName
    this.number = number
    this.enqueuedDate = enqueuedDate
    this.status = CALL_STATUS[status]
    this.workspaceId = workspaceId
    this.teamName = teamName
    this.appInstance = appInstance
  }
}

export { Call }
