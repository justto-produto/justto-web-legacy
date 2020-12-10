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
      console.log('sendMessage')
      const disputeId = this.dispute.id
      const { lastReceivedMessage } = this.dispute
      let email = ''
      /**
       * Busca email de interações recentes.
       */
      if (lastReceivedMessage && lastReceivedMessage.properties && lastReceivedMessage.properties.PERSON_NAME) {
        // TODO: Pegar o email do lastNegotiatorAccess.properties
        email = lastReceivedMessage.properties.PERSON_NAME || ''
      } else {
        await this.getLastInteractions(disputeId).then((interactions) => {
          email = interactions[0].address || ''
        })
      }
      /**
       * Busca o roleId do negociador.
       */
      const roleId = this.dispute.disputeRoles.find(role => {
        return role.roleNameNegotiator
      }).id
      const data = {
        message: this.messageDialogReplyEditor,
        roleId,
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
