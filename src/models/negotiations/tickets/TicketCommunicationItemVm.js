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
    const { lastInboundInteraction, lastInteraction } = dispute
    super(dispute)
    this.lastInboundInteraction = new LastInboundInteractionVm(lastInboundInteraction || {
      dateTime: lastInteraction?.createAt,
      message: lastInteraction?.message?.resume,
      type: lastInteraction?.type
    })
  }
}
