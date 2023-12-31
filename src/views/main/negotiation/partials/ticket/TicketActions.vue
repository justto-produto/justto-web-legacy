<template>
  <article
    class="ticket-actions"
    :class="{'dispute-mode': isInDispute}"
  >
    <span
      v-for="action in actionListFiltered"
      :key="action.name"
    >
      <el-tooltip
        :content="$options.filters.capitalize($tc(`actions.${action.name}.name`, action.label))"
        :open-delay="600"
      >
        <el-button
          class="ticket-actions__dynamic-buttons ticket-actions__buttons"
          @click="action.method(action.name)"
        >
          <i
            v-if="action.isElementIcon"
            :class="`${action.icon} ticket-actions__icons_element`"
          />

          <JusIcon
            v-else
            :icon="action.icon"
            class="ticket-actions__icons"
          />
        </el-button>
      </el-tooltip>
    </span>

    <el-popover
      v-if="!isInDispute"
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

    <TicketActionsDialogs
      ref="dialogActions"
      :ticket="ticket"
      :force-status="forceStatus"
      @conclude="forceStatus = ''"
    />

    <NotifyOnCompanyAnalysis
      ref="notifyOnCompanyAnalysis"
    />

    <ConfirmActionDialog
      ref="confirmActionDialog"
    />

    <SetSettledDialog
      ref="setSettledDialog"
      :status="ticket.status"
    />
  </article>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { DisputeModel } from '@/models/dispute/DisputeModel'

export default {
  name: 'TicketActions',

  components: {
    TicketActionsDialogs: () => import('./TicketActionsDialogs'),
    NotifyOnCompanyAnalysis: () => import('@/components/dialogs/NotifyOnCompanyAnalysis'),
    ConfirmActionDialog: () => import('@/components/dialogs/ConfirmActionDialog'),
    SetSettledDialog: () => import('@/components/dialogs/SetSettledDialog')
  },

  props: {
    ticket: {
      type: Object,
      required: true
    },

    isInDispute: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({ forceStatus: '' }),

  computed: {
    ...mapGetters({
      isGhost: 'ghostMode',
      activeTab: 'getActiveTab',
      isJusttoAdmin: 'isJusttoAdmin',
      userPreferences: 'userPreferences',
      features: 'getMappedFeaturesAndModules',
      showNegotiationTypeMenu: 'showNegotiationTypeMenu'
    }),

    actionsList() {
      return [
        {
          name: 'SETTLED',
          icon: 'positive-hand',
          label: ['CHECKOUT', 'ACCEPTED'].includes(this.ticket.status),
          method: (action) => this.handleSettled(action),
          isVisible: this.canSettled,
          isDynamic: !this.ticket?.favorite
        },
        {
          name: 'UNSETTLED',
          icon: 'negative-hand',
          method: (action) => this.handleUnsettled(action),
          isVisible: this.canUnsettled,
          isDynamic: !this.ticket?.favorite
        },
        {
          name: 'RESUME',
          icon: 'el-icon-video-play',
          method: (action) => this.handlePauseResume(action),
          isVisible: this.canResume,
          isDynamic: this.isPaused,
          isElementIcon: true
        },
        {
          name: 'PAUSED',
          icon: 'pause',
          method: (action) => this.handlePauseResume(action),
          isVisible: this.canPause
        },
        {
          name: 'RESTART_ENGAGEMENT',
          icon: 'refresh',
          method: (action) => this.handleRestartEngagement(action),
          isVisible: this.canRestartEngagement
        },
        {
          name: 'RESEND_MESSAGES',
          icon: 'resend-messages',
          method: (action) => this.handleResendMessages(action),
          isVisible: this.canResendMessages
        },
        {
          name: 'CANCEL_MESSAGES',
          icon: 'cancel-messages',
          method: (action) => this.handleCancelMessages(action),
          isVisible: !this.isPreNegotiation
        },
        {
          name: 'EDIT_NEGOTIATORS',
          icon: 'delegate',
          method: (action) => this.handleEditNegotiators(action),
          isVisible: !this.isPreNegotiation
        },
        {
          name: 'ENRICH',
          icon: 'enrich',
          method: (action) => this.handleEnrich(action),
          isVisible: !this.isPreNegotiation && !this.isFavorite
        },
        {
          name: 'MANUAL_COUNTERPROPOSAL',
          icon: 'exchange',
          method: (action) => this.handleManualCounterproposal(action),
          isVisible: this.canManualCounterproposal,
          isDynamic: true
        },
        {
          name: 'RENEGOTIATE',
          icon: 'move-to-running',
          method: (action) => this.handleRenegotiate(action),
          isVisible: this.canRenegotiate,
          isDynamic: this.isCanceled || this.isSettled || this.isUnsettled
        },
        {
          name: 'SET_UNREAD',
          icon: 'open-close-envelopes',
          method: (action) => this.handleSetUnread(action),
          isVisible: this.canSetUnread,
          isDynamic: true
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
        },
        {
          name: 'UPLOAD_ATTACHMENT',
          icon: 'upload-file',
          method: (action) => this.handleUploadAttachment(action),
          isVisible: !this.isPreNegotiation
        },
        {
          name: 'FAVORITE',
          icon: 'offices-tower',
          isVisible: !this.isFavorite,
          method: () => this.handleFavorite()
        },
        {
          name: 'DISFAVOR',
          icon: 'offices-tower-active',
          isVisible: this.isFavorite,
          isDynamic: true,
          method: () => this.handleDisfavor()
        },
        {
          name: `PRINT_TICKET_${this.activeTab}`,
          icon: 'el-icon-printer',
          method: (_action) => (window.open(`/#/print/negotiation/${this.$route.params.id}?tab=${this.activeTab}`, '_blank')),
          isElementIcon: true,
          isVisible: true
        }
      ].filter(action => {
        if (this.isPaused) {
          return this.pausedDisputeActionList.includes(action.name)
        } else if (this.isCanceled) {
          return this.canceledDisputeActionList.includes(action.name)
        } else if (this.isSettled || this.isUnsettled) {
          return !(action.name === 'CANCEL_MESSAGES') && action.isVisible
        } else if (this.isExpired) {
          return !['SETTLED', 'UNSETTLED', 'MANUAL_COUNTERPROPOSAL', 'RESTART_ENGAGEMENT', 'CANCEL_MESSAGES'].includes(action.name) && action.isVisible
        } else return action.isVisible
      })
    },

    actionListFiltered() {
      return this.isInDispute ? this.actionsList.filter(({ isVisible }) => isVisible) : this.actionsList.filter(({ isDynamic, isVisible }) => isDynamic && isVisible)
    },

    pausedDisputeActionList() {
      return ['RESUME', 'REDIRECTMANAGEMENT', 'UPLOAD_ATTACHMENT', 'EDIT_NEGOTIATORS', `PRINT_TICKET_${this.activeTab}`]
    },

    canceledDisputeActionList() {
      return ['RENEGOTIATE', 'REDIRECTMANAGEMENT', 'UPLOAD_ATTACHMENT', `PRINT_TICKET_${this.activeTab}`]
    },

    isFavorite() {
      return this.ticket?.favorite
    },

    isPaused() {
      return this.ticket.paused
    },

    isPreNegotiation() {
      const { status } = this.ticket
      return status === 'PRE_NEGOTIATION'
    },

    isCanceled() {
      const { status } = this.ticket
      return status === 'CANCELED'
    },

    isSettled() {
      const { status } = this.ticket
      return status === 'SETTLED'
    },

    isUnsettled() {
      const { status } = this.ticket
      return status === 'UNSETTLED'
    },

    isExpired() {
      const { status } = this.ticket
      return status === 'EXPIRED'
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
      const { isPreNegotiation, ticket, isFavorite } = this
      return ticket.status && !['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(ticket.status) && !isPreNegotiation && !isFavorite
    },

    canResendMessages() {
      const { isPreNegotiation, ticket } = this
      return ticket.status && ticket.status === 'RUNNING' && !isPreNegotiation
    },

    canRenegotiate() {
      const { isPreNegotiation, ticket } = this
      return ticket.status && ['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED', 'CANCELED'].includes(ticket.status) && !isPreNegotiation
    }
  },

  methods: {
    ...mapActions([
      'toggleExportTicketModalVisible',
      'setTicketVisualized',
      'deleteTicket',
      'startNegotiation',
      'enrichTicket',
      'revertStatus',
      'resendMessages',
      'cancelMessages',
      'sendTicketAction',
      'deleteDocument',
      'favoriteTicket',
      'disfavorTicket',
      'setAccountProperty',
      'resetRecipients'
    ]),

    ...mapMutations(['deleteRestartDisputeFlag']),

    confirmAction(action, message = 'Tem certeza que deseja realizar está ação?') {
      const title = this.$options.filters.capitalize(this.$t(`actions.${action}.name`))
      const options = {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        dangerouslyUseHTMLString: true,
        showClose: false
      }

      return this.$confirm(message, title, options)
    },

    concludeAction(action, disputeId) {
      const message = this.$options.filters.capitalize(this.$tc(`actions.${action}.feedback-message`))

      this.$jusNotification({
        message: `${message} com sucesso.`,
        title: 'Yay!',
        type: 'success',
        dangerouslyUseHTMLString: true
      })
      this.$jusSegment(`SUCCESSFUL_ACTION_${action}`, { ...this.ticket })

      if (['DISFAVOR', 'FAVORITE'].includes(action) && this.isJusttoAdmin) {
        this.$refs.notifyOnCompanyAnalysis.open(action, new DisputeModel({ dtoVersion: '2', ...this.ticket }))
      }
    },

    handleActionNotify(key, value) {
      const propertie = {}

      propertie[key] = value

      this.setAccountProperty(propertie)
    },

    handleFavorite() {
      const showNotify = this.userPreferences.properties?.FAVORITE_NOTIFICATION === 'ALWAYS'

      this.$refs.confirmActionDialog.handleNotify = (value) => this.handleActionNotify('FAVORITE_NOTIFICATION', value ? 'ALWAYS' : '')
      this.$refs.confirmActionDialog.handleConfirm = this.handleConfirmFavoriteTicket

      this.$refs.confirmActionDialog.open({
        visible: true,
        showNotifyInput: showNotify,
        title: this.$options.filters.capitalize(this.$t('actions.FAVORITE.name')),
        notify: showNotify,
        action: 'FAVORITE'
      })
    },

    handleConfirmFavoriteTicket() {
      const { id: disputeId } = this.$route.params

      this.favoriteTicket(disputeId).then(() => {
        this.$jusSegment('ACTIVE_fAVORITE', { ...this.ticket })
        this.concludeAction('FAVORITE', disputeId)
      }).catch(error => this.$jusNotification({ error }))
    },

    handleConfirmDisfavorTicket() {
      const { id: disputeId } = this.$route.params

      this.disfavorTicket(disputeId).then(() => {
        this.$jusSegment('DEACTIVE_fAVORITE', { ...this.ticket })
        this.concludeAction('DISFAVOR', disputeId)
      }).catch(error => this.$jusNotification({ error }))
    },

    handleDisfavor() {
      const showNotify = this.userPreferences.properties?.FAVORITE_NOTIFICATION === 'ALWAYS'

      this.$refs.confirmActionDialog.handleNotify = (value) => this.handleActionNotify('FAVORITE_NOTIFICATION', value ? 'ALWAYS' : '')
      this.$refs.confirmActionDialog.handleConfirm = this.handleConfirmDisfavorTicket

      this.$refs.confirmActionDialog.open({
        visible: true,
        showNotifyInput: showNotify,
        title: this.$options.filters.capitalize(this.$t('actions.DISFAVOR.name')),
        notify: showNotify
      })
    },

    handleSettled(action) {
      const { paused, status } = this.ticket

      const settledTicket = () => {
        // TODO: Validar todos os estatus de onde se pode "ganhar a disputa".
        if (!this.features.DRAFT_MANAGEMENT && !['PRE_NEGOTIATION', 'CHECKOUT', 'SETTLED'].includes(this.ticket.status) && !this.forceStatus) {
          this.forceStatus = 'SETTLED'
          this.handleSettled(action)
        } else if (this.features.DRAFT_MANAGEMENT && !['PRE_NEGOTIATION', 'CHECKOUT', 'SETTLED'].includes(this.ticket.status) && !this.forceStatus) {
          this.$refs.setSettledDialog.open((status) => {
            this.forceStatus = status
            this.handleSettled(action)
          })
        } else if (status === 'CHECKOUT' || status === 'ACCEPTED') {
          this.$refs.dialogActions.openTicketResumeDialog(action, 'WIN')
        } else {
          this.$refs.dialogActions.openOfferDialog(action)
        }
      }

      if (paused) {
        const message = 'A disputa está pausada, deseja despausar negociação para ganhar?'
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
      const customMessage = 'A disputa está pausada, deseja despausar negociação para enviar uma contraproposta?'

      if (paused) {
        this.handlePauseResume('RESUME', customMessage)
          .then(() => this.$refs.dialogActions.openOfferDialog(action))
      } else {
        this.$refs.dialogActions.openOfferDialog(action)
      }
    },

    handleSetUnread(action) {
      const { disputeId } = this.ticket

      this.setTicketVisualized({
        disputeId,
        visualized: false,
        anonymous: this.isJusttoAdmin && this.isGhost
      })
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
      const { disputeId, status } = this.ticket

      this.handleManualStrategy(action)
        .then(() => this.confirmAction(action)
          .then(() => this.revertStatus({ disputeId, action, status })
            .then(() => {
              this.deleteRestartDisputeFlag(disputeId)
              this.concludeAction(action, disputeId)
            })
            .catch(error => this.$jusNotification({ error }))
          )
        )
    },

    handleResendMessages(action) {
      const { disputeId } = this.ticket

      this.handleManualStrategy(action)
        .then(() => this.confirmAction(action)
          .then(() => this.resendMessages(disputeId)
            .then(() => this.concludeAction(action, disputeId))
            .catch(error => this.$jusNotification({ error }))
          )
        )
    },

    handleCancelMessages(action) {
      const { disputeId } = this.ticket

      this.handleManualStrategy(action)
        .then(() => this.confirmAction(action)
          .then(() => this.cancelMessages(disputeId)
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
      const { disputeId, hasDraft, status } = this.ticket

      this.confirmAction(action)
        .then(() => this.revertStatus({ disputeId, action, status })
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
      this.$refs.dialogActions.openDropLawsuitDialog(action)
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
    },

    redirectToManagement() {
      const path = this.isInDispute ? `/negotiation/${this.$route.params.id}` : `/management/dispute/${this.$route.params.id}`

      this.resetRecipients()
      this.$jusSegment('SWITCH_DISPUTE_INTERFACE', {})
      this.$router.push({ path })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.ticket-actions {
  margin-left: 10px;
  display: flex;
  justify-content: flex-end;
  width: auto;
  max-width: 260px;
  // min-width: 260px;

  .ticket-actions__buttons {
    padding: 10px;
    border-radius: 6px;

    .ticket-actions__icons {
      width: 20px;
      height: 20px;
    }
    .ticket-actions__icons_element {
      font-size: 19px;
    }
  }

  .ticket-actions__more-actions {
    margin-left: 8px;
    &--hidden { display: none }
  }

  &.dispute-mode {
    max-width: 100%;
  }
}

@media (max-width: 900px) {
  .ticket-actions {
    min-width: 44px;

    .ticket-actions__dynamic-buttons {
      display: none;
    }
    .ticket-actions__more-actions {
      &--hidden { display: block }
    }
  }
}

@media (max-height: 900px) {
  .ticket-actions {
    .ticket-actions__buttons {
      margin-left: 8px;
    }
    .ticket-actions__buttons {
      .ticket-actions__icons {
        width: 18px;
        height: 18px;
      }
    }
    .ticket-actions__more-actions {
      margin-left: 0px;
    }
  }
}
</style>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.ticket-actions__popover {
  padding: 0;

  .ticket-actions__actions-list {
    list-style: none;
    padding: 0;
    margin: 8px 0;

    .ticket-actions__list-item {
      cursor: pointer;
      padding: 3px 16px;
      &--hidden { display: none; }
      &:hover { background-color: $--color-light-gray; }
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
