<template>
  <article class="strategy-conrainer">
    <StrategyTriggers
      v-if="hasStrategy"
      :strategy-id="strategyId"
      :triggers="activeStrategyModel.triggers"
      class="strategy-conrainer__triggers"
      @edit-communication="handleEditCommunoication"
    />
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'StrategyBase',

  components: {
    StrategyTriggers: () => import('./partials/StrategyTriggers')
  },

  computed: {
    ...mapGetters(['activeStrategyModel']),

    strategyId() {
      return Number(this.$route?.params?.id)
    },

    hasStrategy() {
      return Boolean(this.activeStrategyModel?.id)
    }
  },

  mounted() {
    this.setActiveStrategy(Number(this.$route?.params?.id))
  },

  methods: {
    ...mapActions(['setActiveStrategy']),

    handleEditCommunoication(communication) {
      console.log('handleEditCommunoication', communication)

      // TODO: Abrir editor de mensagem.
    }
  }
}
</script>

<style lang="scss" scoped>
.strategy-conrainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;

  .strategy-conrainer__triggers {
    flex: 2;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
  }

  .strategy-conrainer__details {
    flex: 1;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    border-left: solid blue thin;
  }
}
</style>
