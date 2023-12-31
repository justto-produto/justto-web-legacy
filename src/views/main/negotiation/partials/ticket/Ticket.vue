<template>
  <section class="ticket-container">
    <section class="ticket-container__omnichannel">
      <TicketHeader
        :show-overview="showOverview"
        @toggle-show-overview="toggleShowOverview"
      />

      <Omnichannel :show-overview="showOverview" />

      <div
        v-if="width <= 1200 && showOverview"
        class="ticket-container__omnichannel-overlay"
      />
    </section>

    <section
      class="ticket-container__overview"
      :class=" { 'ticket-container__overview--active': showOverview }"
    >
      <Overview
        :show-overview="showOverview"
        @toggle-show-overview="toggleShowOverview"
      />
    </section>

    <TicketResume />
  </section>
</template>

<script>
import events from '@/constants/negotiationEvents'
import { eventBus } from '@/utils'
import { mapActions, mapGetters } from 'vuex'
import restartEngagementBeforeRouteLeave from '@/utils/mixins/restartEngagementBeforeRouteLeave'

export default {
  name: 'Ticket',

  components: {
    Omnichannel: () => import('./omnichannel/Omnichannel'),
    Overview: () => import('./overview/Overview'),
    TicketHeader: () => import('./TicketHeader'),
    TicketResume: () => import('./TicketResumeDialog')
  },

  mixins: [restartEngagementBeforeRouteLeave],

  data: () => ({
    showOverview: false
  }),

  computed: {
    ...mapGetters({
      isGhost: 'ghostMode',
      width: 'getWindowWidth',
      authorization: 'accountToken',
      isJusttoAdmin: 'isJusttoAdmin',
      workspace: 'workspaceSubdomain',
      loggedPersonId: 'loggedPersonId',
      backups: 'getMessagesBackupById'
    }),

    socketHeaders() {
      return {
        workspace: this.workspace,
        authorization: this.authorization
      }
    }
  },

  $route: {
    deep: true,
    handler: 'resetTicket'
  },

  mounted() {
    this.fetchData(Number(this.$route.params.id))
    eventBus.$on(events.TICKET_CHANGE.callback, this.fetchData)
    eventBus.$on(events.TICKET_WEB_SOCKET_DISCONNECT.callback, this.socketAction)
  },

  beforeDestroy() {
    eventBus.$off(events.TICKET_CHANGE.callback, this.fetchData)
    eventBus.$off(events.TICKET_WEB_SOCKET_DISCONNECT.callback, this.socketAction)
  },

  methods: {
    ...mapActions([
      'setTicketVisualized',
      'getTicketOverview',
      'getDisputeTags',
      'getLastTicketOffers',
      'cleanRecentMessages',
      'getAssociatedContacts',
      'getQuickReplyTemplates',
      'getTicketOverviewParties',
      'getTicketMetadata',
      'setDisputeProperty',
      'getTicketOverviewInfo',
      'setAccountProperty',
      'setEditorBackup',
      'resetRecipients'
    ]),

    async fetchData(id) {
      this.setAccountProperty({ PREFERRED_INTERFACE: 'NEGOTIATION' })
      this.socketAction('subscribe', id)
      await this.cleanRecentMessages()
      this.getTicketOverview(id).catch(error => this.$jusNotification({ error })).finally(() => {
        if (!this.backups(id).tab) {
          this.setEditorBackup()
        }
      })
      this.getTicketOverviewInfo(id)
      this.getTicketOverviewParties(id).then(() => {
        this.getTicketMetadata(id).then(() => {
          this.getAssociatedContacts(id).then(res => {
            if (res['CONTATOS ASSOCIADOS'] === 'MAIS TARDE') {
              this.setDisputeProperty({ key: 'CONTATOS ASSOCIADOS', disputeId: id, value: 'NAO' }).then(() => {
                this.getAssociatedContacts(id)
              })
            }
          })
        })
      })
      this.getDisputeTags(id)
      this.getLastTicketOffers(id)
      this.getQuickReplyTemplates(id)
      this.setTicketVisualized({
        visualized: true,
        disputeId: Number(id),
        anonymous: this.isJusttoAdmin && this.isGhost
      })
    },

    socketAction(action, id) {
      if (this.workspace && this.loggedPersonId) {
        const channel = '/topic/' + this.workspace + '/' + this.loggedPersonId + '/dispute/' + id + '/occurrence'

        this.$socket.emit(action, {
          headers: this.socketHeaders,
          channel
        })
      }
    },

    toggleShowOverview() {
      this.showOverview = !this.showOverview
    },

    resetTicket() {
      this.resetRecipients()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.ticket-container {
  display: flex;
  position: relative;
  overflow: hidden;
  height: 100%;

  .ticket-container__omnichannel {
    display: flex;
    position: relative;
    flex-direction: column;
    flex: 1;
    height: 100%;

    .ticket-container__omnichannel-overlay {
      position: absolute;
      background-color: #000000;
      opacity: .75;
      width: 100%;
      height: 100%;
      z-index: 10;
    }
  }

  .ticket-container__overview {
    width: 310px;
    max-width: 310px;
    height: 100%;
    background-color: #fff;
    border-left: 1px solid $--color-light-gray;
    transition: .6s cubic-bezier(0.19, 1, 0.22, 1);
    &--active { width: 0; }
  }
}

@media (max-width: 1200px) {
  .ticket-container {
    overflow-x: hidden;

    .ticket-container__overview {
      position: absolute;
      z-index: 100;
      right: 0;
      transform: translateX(100%);
      width: 300px;
      max-width: 300px;

      &--active {
        transform: translateX(0);
      }
    }
  }
}

@media (max-width: 600px) {
  .ticket-container {
    .ticket-container__overview {
      width: calc(100% - 48px);
    }
  }
}

</style>
