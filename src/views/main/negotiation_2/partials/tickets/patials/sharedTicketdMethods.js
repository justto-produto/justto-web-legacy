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

    isLawyerOnline() {
      const docs = Object.keys(this.online)
      const oab = `${this.ticket?.lawyer?.oabNumber}/${this.ticket?.lawyer?.oabState}`

      return this.ticket?.lawyer?.status === 'ONLINE' || docs.includes(this.ticket?.lawyer?.documentNumber) || docs.includes(oab)
    },

    hasLawyer() {
      return Object.keys(this.ticket?.lawyer || {}).length && !!this.ticket?.lawyer?.name
    },

    isSelfCause() {
      const { lawyer, plaintiff } = this.ticket

      return !!(lawyer && plaintiff && (lawyer.personId === plaintiff.personId || (lawyer.documentNumber === plaintiff.documentNumber || (lawyer.oabNumber === plaintiff.oabNumber && lawyer.oabState === plaintiff.oabState))))
    },

    lawyerName() {
      return this.ticket?.lawyer?.name || ''
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
