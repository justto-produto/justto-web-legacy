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
    },

    hasLawyer() {
      return this.ticket?.lawyer !== null
    },

    isSelfCause() {
      const { lawyer, plaintiff } = this.ticket

      return !!(lawyer && plaintiff && (lawyer.personId === plaintiff.personId || lawyer.documentNumber === plaintiff.documentNumber))
    },

    lawyerName() {
      const { lawyer } = this.ticket
      return lawyer ? lawyer.name : 'Sem advogado'
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
