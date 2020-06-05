<template>
  <section class="panel-strategy">
    <strategy-card
      v-for="(strategy, index) in strategies"
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
  computed: {
    ...mapGetters({
      strategies: 'getStrategies',
    }),
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
