import { mapActions, mapMutations } from 'vuex'

export default {
  methods: {
    ...mapActions(['restartDisputeRoleEngagement']),
    ...mapMutations(['setRestartDisputeFlag']),

    verifyRestartEngagement({ status, party, name, disputeId, disputeRoleId }) {
      const enabledHotRestartEngagement = false

      if (!enabledHotRestartEngagement) {
        this.setRestartDisputeFlag(disputeId)
      } else {
        if (['CLAIMANT'].includes(party) && ['PENDING', 'ENGAGEMENT'].includes(status)) {
          const msg = `Detectamos alterações nos dados de contato. Quer reagendar as mensagens de ${name} para incluir o novo contato?`

          this.$confirm(msg, 'Reengajar', {
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            closeOnPressEscape: false,
            closeOnClickModal: false,
            showClose: false,
            center: true
          }).then(() => {
            this.restartDisputeRoleEngagement({ disputeId, disputeRoleId })
          }).catch(() => {})
        }
      }
    }
  }
}
