class ScheduledCallModel {
  constructor({
    dispute,
    contact,
    phoneNumber,
    appInstance,
    scheduling
  }) {
    this.number = phoneNumber
    this.appInstance = appInstance
    this.disputeId = dispute?.id
    this.disputeStatus = dispute?.status
    this.toRoleId = contact?.roleId
    this.toRoleName = contact?.name
    this.scheduling = scheduling
    this.contacts = {
      emails: contact?.phones || [],
      phones: contact?.emails || []
    }
  }
}

export { ScheduledCallModel }
