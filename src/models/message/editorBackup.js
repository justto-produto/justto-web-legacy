class EditorBackup {
  constructor({
    message,
    tab,
    type,
    note,
    disputeId,
    contacts
  }) {
    this.message = message || ''
    this.note = note || ''
    this.type = type || ''
    this.tab = tab || ''
    this.disputeId = disputeId || ''
    this.contacts = contacts || []
  }
}

export { EditorBackup }
