import { getLastInteraction } from '@/utils'

export default {
  methods: {
    hangleSelectTicket() {
      if (!this.isActive) {
        const id = this.ticket.disputeId

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
