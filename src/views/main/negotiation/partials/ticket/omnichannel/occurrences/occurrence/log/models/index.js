class SummaryVM {
  constructor({ type, count, personName, disputeRoleId }) {
    this.type = type
    this.count = count
    this.personName = personName
    this.disputeRoleId = disputeRoleId
  }
}

class SummaryMessage {
  constructor({ communicationType, createdBy, messageId, resume, status, sender, receiver }) {
    this.sender = sender
    this.status = status
    this.resume = resume
    this.receiver = receiver
    this.createdBy = createdBy
    this.messageId = messageId
    this.communicationType = communicationType
  }
}

class SummaryInteraction {
  constructor({ createAt, updateAt, type, properties, message }) {
    this.type = type
    this.createAt = createAt
    this.updateAt = updateAt
    this.properties = properties
    this.message = message ? new SummaryMessage(message) : null
  }

  get messageId() {
    return this.message?.messageId || new Date().toISOString()
  }

  get messageStatus() {
    return this.message?.status || 'VOID'
  }
}

class SummaryOccurrence {
  constructor({ createAt, updateAt, interaction, description, disputeId, properties, type }) {
    this.type = type
    this.createAt = createAt
    this.updateAt = updateAt
    this.disputeId = disputeId
    this.properties = properties
    this.description = description || ''
    this.interaction = interaction ? new SummaryInteraction(interaction) : null
  }

  get messageId() {
    return this.interaction.messageId
  }

  get groupedOccurrences() {
    return JSON.parse((this.properties.GROUPED_OCCURRENCES || '[]').replace(/'/g, '"'))
  }

  get messagesStatus() {
    return [
      {
        status: this.interaction.messageStatus,
        date: this.createAt.dateTime
      },
      ...this.groupedOccurrences.map(_date => ({
        status: this.interaction.messageStatus,
        date: this.createAt.dateTime
      }))
    ]
  }
}

export {
  SummaryVM,
  SummaryMessage,
  SummaryInteraction,
  SummaryOccurrence
}
