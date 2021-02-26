<template>
  <section
    ref="occurrence-root"
    class="occurrences-container"
  >
    <infinite-loading
      :identifier="activeTab"
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
    '$route.params.id'() {
      this.getOccurrences(this.id)
    }
  },
  methods: {
    ...mapActions([
      'setMessageType',
      'getOccurrences'
    ]),

    loadOccurrences($state) {
      this.getOccurrences(this.id).then(response => {
        if (response.last) {
          $state.complete()
        } else {
          $state.loaded()
          this.$store.commit('setUpOccurrencesSize')
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
