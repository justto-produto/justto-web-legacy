<template>
  <article class="ticket-actions">
    <el-button
      v-for="action in actionsList.filter(a => a.isDynamic && a.isVisible)"
      :key="action.name"
      class="ticket-actions__dynamic-buttons ticket-actions__buttons"
      @click="action.method(action.name)"
    >
      <el-tooltip :content="$options.filters.capitalize($tc(`actions.${action.name}.name`, action.label))">
        <JusIcon
          :icon="action.icon"
          class="ticket-actions__icons"
        />
      </el-tooltip>
    </el-button>

    <el-popover
      :class="{ 'ticket-actions__more-actions--hidden': isPreNegotiation }"
      class="ticket-actions__more-actions"
      popper-class="ticket-actions__popover"
    >
      <ul class="ticket-actions__actions-list">
        <li
          v-for="action in actionsList"
          :key="action.name"
          :class="{ 'ticket-actions__list-item--hidden': action.isDynamic }"
          class="ticket-actions__list-item"
          @click="action.method(action.name)"
        >
          {{ $tc(`actions.${action.name}.name`, action.label) | capitalize }}
        </li>
      </ul>
      <el-button
        slot="reference"
        class="ticket-actions__buttons"
      >
        <JusIcon
          icon="options-list"
          class="ticket-actions__icons"
        />
      </el-button>
    </el-popover>

    <DialogAction
      ref="dialogActions"
      :ticket="ticket"
    />
  </article>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'TicketActions',
  components: {
    DialogAction: () => import('./TicketActionsDialogs')
  },
  props: {
    ticket: {
      type: Object,
      required: true
    }
  },
  computed: {
    actionsList() {
      return [
        {
          name: 'SETTLED',
          icon: 'positive-hand',
          label: ['CHECKOUT', 'ACCEPTED'].includes(this.ticket.status),
          method: (action) => this.handleSettled(action),
          isVisible: this.canSettled,
          isDynamic: true
        },
        {
          name: 'UNSETTLED',
          icon: 'negative-hand',
          method: (action) => this.handleUnsettled(action),
          isVisible: this.canUnsettled,
          isDynamic: true
        },
        {
          name: 'MANUAL_COUNTERPROPOSAL',
          icon: 'exchange',
          method: (action) => this.handleManualCounterproposal(action),
          isVisible: this.canManualCounterproposal,
          isDynamic: true
        },
        {
          name: 'SET_UNREAD',
          icon: 'open-close-envelopes',
          method: (action) => this.handleSetUnread(action),
          isVisible: this.canSetUnread,
          isDynamic: true
        },
        {
          name: 'RESUME',
          method: (action) => this.handlePauseResume(action),
          isVisible: this.canResume
        },
        {
          name: 'PAUSE',
          method: (action) => this.handlePauseResume(action),
          isVisible: this.canPause
        },
        {
          name: 'RESTART_ENGAGEMENT',
          method: (action) => this.handleRestartEngagement(action),
          isVisible: !this.isPreNegotiation
        },
        {
          name: 'RESEND_MESSAGES',
          method: (action) => this.handleResendMessages(action),
          isVisible: this.canResendMessages
        },
        {
          name: 'CANCEL_MESSAGES',
          method: (action) => this.handleCancelMessages(action),
          isVisible: !this.isPreNegotiation
        },
        {
          name: 'EDIT_NEGOTIATORS',
          method: (action) => this.handleEditNegotiators(action),
          isVisible: !this.isPreNegotiation
        },
        {
          name: 'ENRICH',
          method: (action) => this.handleEnrich(action),
          isVisible: !this.isPreNegotiation
        },
        {
          name: 'RENEGOTIATE',
          method: (action) => this.handleRenegotiate(action),
          isVisible: this.canRenegotiate
        },
        {
          name: 'UPLOAD_ATTACHMENT',
          method: (action) => this.handleUploadAttachment(action),
          isVisible: !this.isPreNegotiation
        },
        {
          name: 'DROP_LAWSUIT',
          icon: 'hammer',
          method: (action) => this.handleDropLawsuit(action),
          isVisible: this.isPreNegotiation,
          isDynamic: true
        },
        {
          name: 'START_NEGOTIATION',
          icon: 'right-arrow',
          method: (action) => this.handleStartNegotiation(action),
          isVisible: this.isPreNegotiation,
          isDynamic: true
        }
      ].filter(action => action.isVisible)
    },
    isPreNegotiation() {
      const { status } = this.ticket
      return status === 'PRE_NEGOTIATION'
    },
    canSettled() {
      const { isPreNegotiation, ticket } = this
      return ticket.status && ticket.status !== 'SETTLED' && !isPreNegotiation
    },
    canUnsettled() {
      const { isPreNegotiation, ticket } = this
      return ticket.status && ticket.status !== 'UNSETTLED' && !isPreNegotiation
    },
    canManualCounterproposal() {
      const { isPreNegotiation, ticket } = this
      return ticket.status && !['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(ticket.status) && !isPreNegotiation
    },
    canSetUnread() {
      const { isPreNegotiation, ticket } = this
      return ticket.status && !['IMPORTED', 'ENRICHED', 'ENGAGEMENT'].includes(ticket.status) && !isPreNegotiation
    },
    canResume() {
      const { isPreNegotiation, ticket } = this
      return ticket.paused && !isPreNegotiation
    },
    canPause() {
      const { isPreNegotiation, ticket } = this
      return !ticket.paused && !isPreNegotiation
    },
    canRestartEngagement() {
      const { isPreNegotiation, ticket } = this
      return ticket.status && !['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(ticket.status) && !isPreNegotiation
    },
    canResendMessages() {
      const { isPreNegotiation, ticket } = this
      return ticket.status && ticket.status === 'RUNNING' && !isPreNegotiation
    },
    canRenegotiate() {
      const { isPreNegotiation, ticket } = this
      return ticket.status && ['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(ticket.status) && !isPreNegotiation
    }
  },
  methods: {
    ...mapActions([
      'setVisualized',
      'deleteTicket',
      'startNegotiation',
      'enrichTicket',
      'revertStatus',
      'resendMessages',
      'cancelMessages',
      'sendTicketAction',
      'deleteDocument'
    ]),

    confirmAction(action, message = 'Tem certeza que deseja realizar está ação?') {
      const title = this.$options.filters.capitalize(this.$t(`actions.${action}.name`))
      const options = {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        dangerouslyUseHTMLString: true,
        showClose: false
      }

      return new Promise((resolve, reject) => {
        this.$confirm(message, title, options)
          .then(success => resolve(success))
          .catch(error => reject(error))
      })
    },

    concludeAction(action, disputeId) {
      const message = this.$options.filters.capitalize(this.$tc(`actions.${action}.feedback-message`))

      this.$jusNotification({
        message: `${message} com sucesso.`,
        title: 'Yay!',
        type: 'success'
      })
      this.$jusSegment(message, { disputeId })
    },

    handleSettled(action) {
      const { paused, status } = this.ticket

      const settledTicket = () => {
        if (status === 'CHECKOUT' || status === 'ACCEPTED') {
          this.$refs.dialogActions.openTicketResumeDialog(action, 'WIN')
        } else {
          this.$refs.dialogActions.openOfferDialog(action)
        }
      }

      if (paused) {
        const message = 'A disputa está pausada, deseja retomar negociação para ganhar?'
        this.handlePauseResume('RESUME', message)
          .then(() => settledTicket())
      } else {
        settledTicket()
      }
    },

    handleUnsettled(action) {
      this.$refs.dialogActions.openOfferDialog(action)
    },

    handleManualCounterproposal(action) {
      const { paused } = this.ticket
      const customMessage = 'A disputa está pausada, deseja retomar negociação para enviar uma contraproposta?'

      if (paused) {
        this.handlePauseResume('RESUME', customMessage)
          .then(() => this.$refs.dialogActions.openOfferDialog(action))
      } else {
        this.$refs.dialogActions.openOfferDialog(action)
      }
    },

    handleSetUnread(action) {
      const { disputeId } = this.ticket

      this.setVisualized({ disputeId, visualized: false, anonymous: false })
        .then(() => {
          this.concludeAction(action, disputeId)
          this.$router.push('/negotiation')
        })
        .catch(error => {
          this.$jusNotification({ error })
        })
    },

    handlePauseResume(action = 'RESUME', customMessage) {
      const { disputeId } = this.ticket

      return new Promise((resolve, reject) => {
        this.confirmAction(action, customMessage)
          .then(() => this.sendTicketAction({ disputeId, action })
            .then(() => {
              this.concludeAction(action, disputeId)
              resolve()
            })
            .catch(error => {
              this.$jusNotification({ error })
              reject(error)
            })
          )
      })
    },

    handleRestartEngagement(action) {
      const { disputeId } = this.ticket

      this.handleManualStrategy(action)
        .then(() => this.confirmAction(action)
          .then(() => this.revertStatus({ disputeId, action })
            .then(() => this.concludeAction(action, disputeId))
            .catch(error => this.$jusNotification({ error }))
          )
        )
    },

    handleResendMessages(action) {
      const { disputeId } = this.ticket

      this.handleManualStrategy(action)
        .then(() => this.confirmAction(action)
          .then(() => this.resendMessages({ disputeId, action })
            .then(() => this.concludeAction(action, disputeId))
            .catch(error => this.$jusNotification({ error }))
          )
        )
    },

    handleCancelMessages(action) {
      const { disputeId } = this.ticket

      this.handleManualStrategy(action)
        .then(() => this.confirmAction(action)
          .then(() => this.cancelMessages({ disputeId, action })
            .then(() => this.concludeAction(action, disputeId))
            .catch(error => this.$jusNotification({ error }))
          )
        )
    },

    handleEditNegotiators(action) {
      this.$refs.dialogActions.openEditNegotiatorsDialog(action)
    },

    handleEnrich(action) {
      const { disputeId } = this.ticket

      this.confirmAction(action)
        .then(() => this.enrichTicket(disputeId)
          .then(() => this.concludeAction(action, disputeId))
          .catch(error => this.$jusNotification({ error }))
        )
    },

    handleRenegotiate(action) {
      const { disputeId, hasDraft } = this.ticket

      this.confirmAction(action)
        .then(() => this.revertStatus({ disputeId, action })
          .then(() => {
            if (hasDraft) {
              const confirmMessage = 'Esta disputa possui documento gerado, deseja exclui-lo?'

              this.confirmAction('DELETE_DOCUMENT', confirmMessage)
                .then(() => this.deleteDocument(disputeId)
                  .then(() => this.concludeAction('DELETE_DOCUMENT', disputeId))
                  .catch(error => this.$jusNotification({ error }))
                )
            }
            this.concludeAction(action, disputeId)
          })
          .catch(error => {
            this.$jusNotification({ error })
          })
        )
    },

    handleUploadAttachment(action) {
      this.$refs.dialogActions.openAttachmentDialog(action)
    },

    handleDropLawsuit(action) {
      const { disputeId } = this.ticket
      const confirmMessage = 'Esta ação é irreversível, tem certeza que deseja continuar?'

      this.confirmAction(action, confirmMessage)
        .then(() => {
          this.deleteTicket({ disputeId, reason: 'DISPUTE_DROPPED' })
            .then(() => {
              this.concludeAction(action, disputeId)
              this.$router.push('/negotiation')
            })
            .catch(error => {
              this.$jusNotification({ error })
            })
        })
    },

    handleStartNegotiation(action) {
      const { disputeId } = this.ticket

      this.confirmAction(action)
        .then(() => this.startNegotiation(disputeId)
          .then(() => this.concludeAction(action, disputeId))
          .catch(error => this.$jusNotification({ error }))
        )
    },

    handleManualStrategy(action) {
      const { isManual } = this.ticket.strategy
      const title = this.$options.filters.capitalize(this.$t(`actions.${action}.name`))
      const message = 'Esta disputa está com uma estratégia de <b>engajamento manual</b>. Se deseja realizar engajamento automático, edite a disputa e escolha uma estratégia de engajamento adequada'
      const options = {
        title,
        confirmButtonText: 'OK',
        dangerouslyUseHTMLString: true,
        showClose: false
      }
      const error = new Error('A estratégia dessa disputa é manual. Mude a estratégial para poder reiniciar disputa, reiniciar engajamento ou cancelar mensagens')

      return new Promise((resolve, reject) => {
        if (isManual) {
          this.$alert(message, options)
          reject(error)
        } resolve()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.ticket-actions {
  display: flex;
  justify-content: flex-end;
  min-width: 260px;

  .ticket-actions__buttons {
    padding: 10px;
    border-radius: 6px;

    .ticket-actions__icons {
      width: 22px;
      height: 22px;
    }
  }

  .ticket-actions__more-actions {
    margin-left: 10px;
  }
}

@media (max-width: 900px) {
  .ticket-actions {
    min-width: 44px;

    .ticket-actions__dynamic-buttons {
      display: none;
    }
    .ticket-actions__more-actions {
      &--hidden { display: none }
    }
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.ticket-actions__popover {
  padding: 0;

  .ticket-actions__actions-list {
    list-style: none;
    padding: 0;

    .ticket-actions__list-item {
      cursor: pointer;
      padding: 3px 30px;
      &--hidden { display: none; }
      &:hover { background-color: $--light-gray; }
    }
  }
}

@media (max-width: 900px) {
  .ticket-actions__popover{
    .ticket-actions__actions-list {
      .ticket-actions__list-item {
        &--hidden { display: list-item; }
      }
    }
  }
}
</style>