<template>
  <article
    v-loading="loading"
    class="strategies-list__container"
  >
    <StrategyItem
      v-for="(item, key) in (strategies.content || [])"
      :key="key"
      :strategy="item"
      class="strategies-list__item"
    />

    <JusScrollLoading
      target=".strategies-list__container.strategy-container__list"
      end-text="Fim das estratégias"
      empty-text="Sem estratégias"
      :loading.sync="loading"
      :ended="Boolean(strategiesIsInLastpage)"
      :empty="Boolean(strategiesLength === 0)"
      @load="infiniteHandler"
    />
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import StrategyItem from './partials/StrategyItem'
import JusScrollLoading from '@/components/others/JusScrollLoading'

export default {
  name: 'StrategiesList',

  components: { StrategyItem, JusScrollLoading },

  data: () => ({ loading: true }),

  computed: {
    ...mapGetters({ strategies: 'getStrategies' }),

    strategiesIsInLastpage() {
      return this.strategies?.last
    },

    strategiesLength() {
      return this.strategies?.content?.length || 0
    }
  },

  beforeMount() {
    this.getAvailableWorkspace()
    this.getAvaliableVariablesToTemplate()
    this.getStrategies().finally(() => {
      this.loading = false
    })
  },

  methods: {
    ...mapActions([
      'getAvailableWorkspace',
      'getAvaliableVariablesToTemplate',
      'getStrategies'
    ]),

    infiniteHandler(callback) {
      this.getStrategies('isInfinite')
        .catch(error => this.$jusnotification({ error }))
        .finally(callback)
    }
  }
}
</script>

<style lang="scss" scoped>
.strategies-list__container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 4px;
  gap: 8px;
  overflow-y: auto;

  .strategies-list__item {
    flex: 1;
  }
}
</style>

<style lang="scss">
.strategies-list__container {
  &::-webkit-scrollbar {
    width: 4px;
    position: absolute;
  }

  &::-webkit-scrollbar-thumb {
    border: none !important;
  }
}
</style>
