import { mapActions, mapGetters } from 'vuex'

/**
 * * * * PADRÕES
 * Usar o parâmetro messageDialogReplyEditor como model do texto.
 * Ter uma prop/computed/variável com o nome de dispute.
 * Usar handleVisibilityEditor como método para esconder o editor.
 */

export default {
  computed: {
    ...mapGetters({
      isLoading: 'loading'
    })
  },
  methods: {
    ...mapActions([
      'showLoading',
      'hideLoading',
      'getLastInteractions',
      'sendNegotiator'
    ]),

    async sendMessage() {
      const disputeId = this.dispute.getDisputeId
      const lastReceivedMessage = this.dispute.getDisputeLastReceivedMessage
      let email = ''
      /**
       * Busca email de interações recentes.
       */
      if (lastReceivedMessage?.message?.sender) {
        email = lastReceivedMessage?.message?.sender || ''
      } else {
        await this.getLastInteractions(disputeId).then((interactions) => {
          email = interactions.length ? interactions[0].address || '' : ''
        })
      }
      const data = {
        message: this.messageDialogReplyEditor,
        roleId: null,
        email
      }
      this.showLoading()
      this.$store.dispatch('sendNegotiator', { disputeId, data }).then(() => {
        this.messageDialogReplyEditor = ''
        this.$jusNotification({
          title: 'Yay!',
          message: 'Mensagem enviada com sucesso!',
          type: 'success'
        })
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.hideLoading()
        this.handleVisibilityEditor(false)
      })
    }
  }
}
