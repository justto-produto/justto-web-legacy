<template>
  <section
    ref="occurrence-root"
    class="occurrences-container"
  >
    <div class="occurrences-container__occurrences">
      <infinite-loading
        :identifier="activeTab"
        spinner="spiral"
        direction="top"
        distance="1000"
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
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    Date: () => import('./occurrence/Date'),
    Occurrence: () => import('./occurrence/Occurrence'),
    InfiniteLoading: () => import('vue-infinite-loading')
  },
  computed: {
    ...mapGetters({
      activeTab: 'getActiveTab',
      filter: 'getOccurrencesFilter',
      occurrences: 'getOccurrencesList',
      messageType: 'getEditorMessageType',
      getOccurrencesFilter: 'getOccurrencesFilter'
    }),
    countRendereds() {
      return this.occurrences.filter(o => o.renderCompleted).length
    },
    id: {
      get() {
        return this.$route.params.id
      }
    }
  },
  watch: {
    '$route.params.id'() {
      this.getOccurrences(this.id)
    },
    'countRendereds'() {
      this.adjustScroll()
    }
  },
  methods: {
    ...mapActions([
      'setMessageType',
      'getOccurrences'
    ]),

    adjustScroll() {
      if (this.getOccurrencesFilter.page === 0) {
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
