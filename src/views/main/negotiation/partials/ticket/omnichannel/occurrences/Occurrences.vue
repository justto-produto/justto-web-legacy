<template>
  <section
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { eventBus } from '@/utils'

export default {
  components: {
    Date: () => import('./occurrence/Date'),
    Occurrence: () => import('./occurrence/Occurrence'),
    InfiniteLoading: () => import('vue-infinite-loading'),
    DisputeTips: () => import('@/views/main/dispute/partials/DisputeTips')
  },
  data: () => ({
    needScroll: false
  }),
  computed: {
    ...mapGetters({
      activeTab: 'getActiveTab',
      ticket: 'getTicketOverview',
      filter: 'getOccurrencesFilter',
      occurrences: 'getOccurrencesList',
      messageType: 'getEditorMessageType'
    }),
    infiniteLoadingIdentifier() {
      return `${this.activeTab}-${this.id}`
    },
    countRendereds() {
      return this.occurrences.filter(o => (o.renderCompleted) || (o.interaction && o.interaction.countRendereds)).length
    },
    id() {
      return this.$route.params.id
    },
    dispute() {
      return {
        ...this.ticket,
        id: Number(this.id),
        disputeRoles: [],
        hasDocument: this.ticket.hasDraft
      }
    }
  },
  watch: {
    '$route.params.id'() {
      this.resetRecipients()
      this.resetOccurrences()
    },
    'countRendereds'() {
      this.adjustScroll()
    }
  },
  mounted() {
    eventBus.$on('NEGOTIATION_WEBSOCKET_NEW_OCCURRENCE', () => {
      this.needScroll = true
    })
  },
  updated() {
    if (this.needScroll) this.adjustScroll(true)
  },
  beforeDestroy() {
    eventBus.$off()
  },
  methods: {
    ...mapActions([
      'setMessageType',
      'getOccurrences',
      'resetRecipients',
      'resetOccurrences'
    ]),

    adjustScroll(force = false) {
      if (this.filter.page <= 2 || force) {
        const omni = document.getElementsByClassName('occurrences-container omnichannel-container__occurrences')[0]
        omni.scrollTo({ top: omni.scrollHeight })
      }
    },

    loadOccurrences($state) {
      this.getOccurrences(this.id).then(response => {
        if (response.last) {
          if ($state) { $state.complete() }
        } else {
          if ($state) { $state.loaded() }
        }
      })
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
}
</style>
