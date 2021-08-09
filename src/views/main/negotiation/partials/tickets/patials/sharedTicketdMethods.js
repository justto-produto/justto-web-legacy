import { getLastInteraction } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      online: 'onlineDocuments'
    }),

    isOnline() {
      const docs = Object.keys(this.online)
      const oab = `${this.ticket?.plaintiff?.oabNumber}/${this.ticket?.plaintiff?.oabState}`

      return this.ticket?.plaintiff?.status === 'ONLINE' || docs.includes(this.ticket?.plaintiff?.documentNumber) || docs.includes(oab)
    }
  },

  methods: {
    handleSelectTicket() {
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
