<template>
  <section class="panel-strategy">
    <strategy-card
      v-for="(strategy, index) in filteredStrategie"
      :key="`${index}-${_uid}`"
      :strategy="strategy"
      class="panel-strategy__card"
      @changeEstrategyData="updateStrategy"
    />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VueNestable, VueNestableHandle } from 'vue-nestable'
import StrategyCard from './StrategyCard'

export default {
  name: 'PanelStrategy',
  components: {
    StrategyCard,
    VueNestable,
    VueNestableHandle,
  },
  props: {
    filterTerm: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters({
      strategies: 'getStrategies',
    }),

    filteredStrategie() {
      return this.strategies
        .filter(s => s.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .includes(this.filterTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
        )
    },
  },
  methods: {
    ...mapActions(['updateStrategy']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/nestable.scss';

.panel-strategy {
  background-color: #fff;
  padding: 40px;

  .panel-strategy__card {
    margin-bottom: 32px;
  }
}
</style>
