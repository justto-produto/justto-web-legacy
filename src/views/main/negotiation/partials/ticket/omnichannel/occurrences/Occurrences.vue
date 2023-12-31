<template>
  <section
    v-if="lastMessage.disputeId === id || localLoading"
    ref="occurrence-root"
    v-loading="localLoading"
    class="occurrences-container"
  >
    <div
      ref="scroolContainer"
      class="occurrences-container__occurrences"
    >
      <JusScrollLoading
        v-if="filter.page > 1"
        :target="scrollTarget"
        :loading.sync="localLoading"
        :ended="isInLastPage"
        :empty="Boolean(occurrences.length === 0)"
        reverse
        empty-text="Sem mensagens"
        end-text="Início das mensagens"
        @load="loadOccurrences"
      />

      <component
        :is="occurrence.id === null ? 'Date': 'Occurrence'"
        v-for="(occurrence, occurrenceIndex) in occurrences"
        :key="`occurrence-container-${occurrenceIndex}`"
        :value="occurrence"
        class="occurrences-container__occurrences-item"
      />

      <dispute-tips
        v-if="activeTab === 'MESSAGES'"
        :value="dispute"
      />
    </div>
  </section>

  <section
    v-else
    class="occurrences-container"
  >
    <div class="occurrences-container__omnichannel-error">
      <el-button
        type="primary"
        size="small"
        plain
        @click="resetTicket"
      >
        Click aqui para ver mensagens
      </el-button>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { eventBus } from '@/utils'
import events from '@/constants/negotiationEvents'
import Occurrence from './occurrence/Occurrence'

export default {
  components: {
    Date: () => import('./occurrence/Date'),
    Occurrence,
    DisputeTips: () => import('@/components/layouts/DisputeTips'),
    JusScrollLoading: () => import('@/components/others/JusScrollLoading')
  },

  data: () => ({
    needScroll: false,
    localLoading: false,
    scrollTarget: '.occurrences-container.omnichannel-container__occurrences'
  }),

  computed: {
    ...mapGetters({
      activeTab: 'getActiveTab',
      ticket: 'getTicketOverview',
      filter: 'getOccurrencesFilter',
      isLoading: 'isOccurrencesLoading',
      occurrencesList: 'getOccurrencesList',
      occurrencesListSorted: 'getOccurrencesListSorted',
      messageType: 'getEditorMessageType',
      isPrinting: 'getExportTicketModalVisible',
      backups: 'getMessagesBackupById',
      recipients: 'getEditorRecipients',
      autodetectRecipient: 'workspaceAutodetectRecipient',
      totalOfOccurrences: 'getTotalOccurrences',
      isInLastPage: 'getOccurrencesIsInLastPage'
    }),

    infiniteLoadingIdentifier() {
      return `${this.activeTab}-${this.id}`
    },

    countRendereds() {
      return this.occurrences.filter(o => (o.renderCompleted) || (o.interaction && o.interaction.countRendereds)).length
    },

    id() {
      return Number(this.$route.params.id)
    },

    occurrences() {
      return (this.activeTab === 'OCCURRENCES' ? this.occurrencesListSorted : this.occurrencesList).filter(({ disputeId }) => [null, this.id].includes(disputeId))
    },

    dispute() {
      return {
        ...this.ticket,
        id: this.id,
        disputeRoles: [],
        hasDocument: this.ticket.hasDraft,
        signStatus: this.ticket.draftStatus
      }
    },

    lastMessage() {
      const occurrences = this.occurrences.filter(({ id }) => id)

      return occurrences[this.occurrences.length - 1] || { disputeId: this.id }
    }
  },

  watch: {
    '$route.params.id'() {
      this.routeUpdate()
    },

    'countRendereds'() {
      this.adjustScroll()
    },

    activeTab() {
      this.resetTicket(this.id)
      this.adjustScroll(true)
    }
  },

  mounted() {
    eventBus.$on('NEGOTIATION_WEBSOCKET_NEW_OCCURRENCE', () => {
      this.needScroll = true
    })

    eventBus.$on(events.TICKET_CHANGE.callback, this.resetTicket)

    this.loadOccurrences(() => {
      this.resetTicket(this.id)
      this.adjustScroll(true)
    })
  },

  updated() {
    if (this.needScroll) this.adjustScroll()
  },

  beforeDestroy() {
    eventBus.$off('NEGOTIATION_WEBSOCKET_NEW_OCCURRENCE')
    eventBus.$off(events.TICKET_CHANGE.callback, this.resetTicket)
  },

  methods: {
    ...mapActions([
      'resetNoteText',
      'setMessageType',
      'getOccurrences',
      'resetRecipients',
      'resetOccurrences',
      'resetMessageText',
      'addRecipient',
      'autodetectTicketRecipients'
    ]),

    adjustScroll(force = false) {
      if (this.filter.page <= 2 || force) {
        const omni = document.getElementsByClassName('occurrences-container omnichannel-container__occurrences')[0]
        omni.scrollTo({ top: omni.scrollHeight })
        eventBus.$emit('adjustScroll', { id: this.id })
      }
    },

    loadOccurrences(callback) {
      const target = document.querySelector(this.scrollTarget)
      const scrollPosition = target?.scrollHeight - target?.scrollTop

      if (!this.isPrinting) {
        this.getOccurrences(this.id).then(response => {
          if (response.first) {
            this.adjustScroll(true)
          } else if (target) {
            target.scroll(0, document.querySelector(this.scrollTarget)?.scrollHeight - scrollPosition)
          }

          callback()
        }).finally(this.autodetectTicketRecipients)
      }
    },

    routeUpdate() {
      this.resetTicket(this.id)
    },

    resetTicket(id) {
      this.resetRecipients()
      this.resetOccurrences()
      this.resetMessageText()
      this.resetNoteText()
      if (this.lastMessage.disputeId !== id || !this.occurrences.length) {
        this.getOccurrences(id)
      }
      this.localLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.occurrences-container {
  overflow-y: auto;

  .infinite-loading-container > .infinite-status-prompt > div {
    color: #979797 !important;
    font-style: italic;
  }

  .occurrences-container__occurrences {
    display: flex;
    flex-direction: column;

    .occurrences-container__occurrences-date {
      top: 10px;
      text-align: center;
      z-index: 10;
      position: -webkit-sticky;
      position: sticky;
      width: 80%;

      margin: 18px 10% 10px;

      span {
        background-color: #e3f5ff;
        padding: 10px;
      }
    }
  }

  .occurrences-container__omnichannel-error {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
}
</style>
