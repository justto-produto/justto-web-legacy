import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters(['getDisputesNeedsRestart'])
  },

  methods: {
    ...mapActions(['sendDisputeAction']),
    ...mapMutations(['deleteRestartDisputeFlag'])
  },

  beforeRouteLeave(_to, _from, next) {
    if (this.getDisputesNeedsRestart[this.$route.params?.id]) {
      this.$confirm('Detectamos alteração nos dados da disputa. Deseja reiniciar a disputa?', 'Reiniciar disputa', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        type: 'warning',
        center: true
      }).then(() => {
        this.sendDisputeAction({
          action: 'restart-engagement',
          disputeId: this.$route.params?.id
        }).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Disputa reiniciada com sucesso.',
            type: 'success'
          })
        }).catch(error => this.$jusNotification({ error })).finally(() => {
          this.deleteRestartDisputeFlag(this.$route.params?.id)
        })
      }).finally(next)
    } else {
      next()
    }
  }
}
