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

      const hasLawyer = !!lawyer
      const hasPlaintiff = !!plaintiff
      const isSamePersonId = lawyer?.personId && plaintiff?.personId && lawyer?.personId === plaintiff?.personId
      const isSameDocumentNumber = lawyer?.documentNumber && plaintiff?.documentNumber && lawyer?.documentNumber === plaintiff?.documentNumber
      const isSameOab = lawyer?.oabNumber && plaintiff?.oabNumber && lawyer?.oabState && plaintiff?.oabState && (lawyer?.oabNumber === plaintiff?.oabNumber && lawyer?.oabState === plaintiff?.oabState)

      return !!(hasLawyer && hasPlaintiff && (isSamePersonId || isSameDocumentNumber || isSameOab))
    },

    lawyerName() {
      return this.ticket?.lawyer?.name || ''
    }
  },

  methods: {
    handleSelectTicket() {
      if (!this.isActive) {
        const id = this.ticket.disputeId

        this.$router.replace({
          name: 'ticket',
          params: { id }
        })
        this.$emit('update', id)
      } else {
        this.$router.replace('/negotiation')
        this.$emit('update')
      }
    },
    getLastInteraction(time) {
      return getLastInteraction(time)
    }
  }
}
