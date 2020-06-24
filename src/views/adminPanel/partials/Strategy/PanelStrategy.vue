<template>
  <section class="panel-strategy">
    <el-collapse v-model="activeCollapse">
      <el-collapse-item
        title="Ativas"
        name="active"
      >
        <strategy-card
          v-for="(strategy, index) in filteredStrategie"
          :key="`${index}-${_uid}`"
          :strategy="strategy"
          class="panel-strategy__card"
          @changeEstrategyData="updateStrategy"
        />
      </el-collapse-item>
      <el-collapse-item
        title="Inativas"
        name="unactive"
      >
        <strategy-card
          v-for="(strategy, index) in filteredStrategie"
          :key="`${index}-${_uid}`"
          :strategy="strategy"
          class="panel-strategy__card"
          @changeEstrategyData="updateStrategy"
        />
      </el-collapse-item>
    </el-collapse>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import StrategyCard from './StrategyCard'

export default {
  name: 'PanelStrategy',
  components: {
    StrategyCard,
  },
  props: {
    filterTerm: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    activeCollapse: ['active'],
  }),
  computed: {
    ...mapGetters({
      strategies: 'getStrategies',
    }),

    filteredStrategie() {
      return this.strategies
        .filter(s => s.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .includes(this.filterTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')),
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

<style lang="scss">
.panel-strategy {
  .el-collapse-item__header {
    font-size: 20px;
    font-weight: bold;
    color: #adadad;
  }
  .el-collapse-item__arrow {
    margin: 0 0 0 8px;
  }
}
</style>
