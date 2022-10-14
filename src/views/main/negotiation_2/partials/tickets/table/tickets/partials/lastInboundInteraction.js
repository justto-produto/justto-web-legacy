export default {
  computed: {
    /**
     * Needs access to this.ticket.
     * @returns Object with last interacion resume logic.
     */
    lastInboundInteraction() {
      const { lastInboundInteraction, lastReceivedMessage, disputeStatus, expirationDate, conclusionDate } = this.ticket

      if (this.isAcceptedTab || this.isFinishedTab) {
        if (conclusionDate?.dateTime) {
          return {
            message: 'Disputa ' + this.$t(`ticket-status.${disputeStatus}`),
            dateTime: conclusionDate?.dateTime
          }
        } else {
          return {
            typeMessage: 'Expirada em:',
            message: 'Disputa ' + this.$t(`ticket-status.${disputeStatus}`),
            dateTime: expirationDate.dateTime || '--/--/--'
          }
        }
      } else if (lastInboundInteraction?.type !== 'COMMUNICATION') {
        const { type, dateTime } = (lastInboundInteraction || {})

        return {
          icon: type ? this.$tc(`interaction-types.${type}.icon`) : null,
          message: this.$options.filters.capitalize(this.$tc(`interaction-types.${type}.message`)),
          dateTime: dateTime.dateTime
        }
      } else if (lastReceivedMessage?.message && lastReceivedMessage?.contentType === 'TEXT') {
        const { message, dateTime } = lastReceivedMessage

        return {
          message,
          dateTime: dateTime.dateTime
        }
      } else if (lastInboundInteraction?.dateTime?.dateTime) {
        const { message, dateTime, contentType } = lastInboundInteraction

        if (['AUDIO', 'IMAGE', 'VIDEO', 'ATTACHMENT'].includes(contentType || message?.contentType)) {
          return {
            message: 'Anexo recebido.',
            dateTime: dateTime.dateTime,
            icon: this.$tc('interaction-types.ATTACHMENT.icon')
          }
        }

        return {
          message,
          dateTime: dateTime.dateTime
        }
      } else {
        return {
          typeMessage: 'Expirada em:',
          message: 'Disputa ' + this.$t(`ticket-status.${disputeStatus}`),
          dateTime: expirationDate.dateTime || '--/--/--'
        }
      }
    }
  }
}
