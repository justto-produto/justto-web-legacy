import TicketItemVm from './TicketItemVm'
import { DateTime } from '../GenericClasses'

class LastInboundInteractionVm {
  constructor({ dateTime, message, type }) {
    this.dateTime = new DateTime(dateTime || {})
    this.message = message
    this.type = type
  }
}

export default class TicketCommunicationItemVm extends TicketItemVm {
  constructor(dispute) {
    const { lastInboundInteraction, lastReceivedMessage, firstInteraction } = dispute
    super(dispute)
    this.lastInboundInteraction = new LastInboundInteractionVm(lastInboundInteraction || {
      dateTime: (lastReceivedMessage || firstInteraction).createAt,
      message: (lastReceivedMessage || firstInteraction).message?.resume,
      type: (lastReceivedMessage || firstInteraction).type
    })
  }
}
