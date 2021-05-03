import { getLastInteraction, eventBus } from '@/utils'
import events from '@/constants/negotiationEvents'

export default {
  methods: {
    hangleSelectTicket() {
      if (!this.isActive) {
        const id = this.ticket.disputeId

        eventBus.$emit(events.TICKET_CHANGE.callback, { id })

        this.$router.push({
          name: 'ticket',
          params: { id }
        })
      }
    },
    getLastInteraction(time) {
      return getLastInteraction(time)
    }
  }
}
