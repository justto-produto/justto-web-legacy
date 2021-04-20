import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      currentTicket: 'getTicketOverview'
    }),

    isPreNegotiation() {
      return this.currentTicket?.status === 'PRE_NEGOTIATION'
    }
  }
}
