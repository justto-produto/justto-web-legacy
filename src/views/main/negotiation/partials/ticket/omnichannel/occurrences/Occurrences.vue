<template>
  <section
    v-if="lastMessage.disputeId === id || localLoading"
    ref="occurrence-root"
    class="occurrences-container"
  >
    <div class="occurrences-container__occurrences">
      <infinite-loading
        :identifier="infiniteLoadingIdentifier"
        :distance="680"
        spinner="spiral"
        direction="top"
        @infinite="loadOccurrences"
      >
        <div
          slot="no-more"
        >
          Início das ocorrências
        </div>
        <div
          slot="no-results"
        >
          Início das ocorrências
        </div>
      </infinite-loading>
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

export default {
  components: {
    Date: () => import('./occurrence/Date'),
    Occurrence: () => import('./occurrence/Occurrence'),
    InfiniteLoading: () => import('vue-infinite-loading'),
    DisputeTips: () => import('@/views/main/dispute/partials/DisputeTips')
  },

  data: () => ({
    needScroll: false,
    localLoading: false
  }),

  computed: {
    ...mapGetters({
      activeTab: 'getActiveTab',
      ticket: 'getTicketOverview',
      filter: 'getOccurrencesFilter',
      isLoading: 'isOccurrencesLoading',
      occurrences: 'getOccurrencesList',
      messageType: 'getEditorMessageType',
      isPrinting: 'getExportTicketModalVisible'
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
    dispute() {
      return {
        ...this.ticket,
        id: this.id,
        disputeRoles: [],
        hasDocument: this.ticket.hasDraft
      }
    },
    lastMessage() {
      return this.occurrences[this.occurrences.length - 1] || { disputeId: this.id }
    }
  },

  watch: {
    'countRendereds'() {
      this.adjustScroll()
    }
  },

  mounted() {
    eventBus.$on('NEGOTIATION_WEBSOCKET_NEW_OCCURRENCE', () => {
      this.needScroll = true
    })
    eventBus.$on(events.TICKET_CHANGE.callback, this.resetTicket)
  },

  updated() {
    if (this.needScroll) this.adjustScroll(true)
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
      'resetMessageText'
    ]),

    adjustScroll(force = false) {
      if (this.filter.page <= 2 || force) {
        const omni = document.getElementsByClassName('occurrences-container omnichannel-container__occurrences')[0]
        omni.scrollTo({ top: omni.scrollHeight })
        eventBus.$emit('adjustScroll', { id: this.id })
      }
    },

    loadOccurrences($state) {
      if (!this.isPrinting) {
        this.getOccurrences(this.id).then(response => {
          if (response.last) {
            if ($state) { $state.complete() }
          } else {
            if ($state) { $state.loaded() }
          }
        })
      } else {
        $state.complete()
      }
    },

    resetTicket(_current, _old) {
      this.resetRecipients()
      this.resetOccurrences()
      this.resetMessageText()
      this.resetNoteText()
      this.localLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

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

      margin: 18px 0px 10px;

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
