import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      activeTab: 'getTicketsActiveTab'
    }),

    isPreNegotiation() {
      return this.activeTab === 'pre-negotiation'
    }
  }
}
