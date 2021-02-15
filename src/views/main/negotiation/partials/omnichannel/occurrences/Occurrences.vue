<template>
  <section
    id="occurrencesOmnichanelNegotiation"
    ref="occurrence-root"
    class="occurrences-container"
  >
    <InfiniteLoading
      :identifier="infiniteId"
      :distance="10"
      spinner="spiral"
      direction="top"
      @infinite="loadOccurrences">
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
    </InfiniteLoading>
    <div
      v-for="(occurrenceContainer, occurrenceContainerIndex) in occurrences"
      :key="`occurrence-container-${occurrenceContainerIndex}`"
      class="occurrences-container__occurrences"
    >
      <span class="occurrences-container__occurrences-date">
        <span>
          {{ $moment(occurrenceContainer.date).format('DD/MM/YYYY') }}
        </span>
      </span>
      <Occurrence
        v-for="(occurrence, occurrenceIndex) in occurrenceContainer.occurrences"
        :key="`occurrence-container-${occurrenceIndex}`"
        :value="occurrence"
        class="occurrences-container__occurrences-item"
      />
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    Occurrence: () => import('./occurrence/Occurrence'),
    InfiniteLoading: () => import('vue-infinite-loading')
  },
  data: () => ({
    infiniteId: +new Date()
  }),
  computed: {
    ...mapGetters({
      activeTab: 'getActiveTab',
      filter: 'getOccurrencesFilter',
      occurrences: 'getOccurrencesList',
      messageType: 'getEditorMessageType'
    }),
    id: {
      get() {
        return this.$route.params.id
      }
    }
  },
  watch: {
    activeTab() {
      this.infiniteId += 1
      this.goToChatBottom()
    },
    '$route.params.id'() {
      this.getOccurrences(this.id)
    }
  },
  // TODO: Validar a troca de ticket.
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions([
      'setMessageType',
      'getOccurrences'
    ]),

    init() {
      this.goToChatBottom()
    },

    loadOccurrences($state) {
      this.getOccurrences(this.id).then(response => {
        if (response.last) {
          $state.complete()
        } else {
          $state.loaded()
          this.$store.commit('setUpOccurrencesSize')
        }
      })
    },

    goToChatBottom() {
      setTimeout(() => {
        const height = this.$refs['occurrence-root'].scrollHeight
        this.$refs['occurrence-root'].scroll(0, height)
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.occurrences-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
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
