<template>
  <section class="panel-strategy">
    <el-collapse v-model="activeCollapse">
      <el-collapse-item
        :title="`Ativas (${activeStrategies.length})`"
        name="active"
      >
        <strategy-card
          v-for="(strategy) in activeStrategies"
          :key="strategy.id"
          :strategy="strategy"
          class="panel-strategy__card"
          @changeEstrategyData="updateStrategy"
        />
      </el-collapse-item>
      <el-collapse-item
        :title="`Inativas (${inactiveStrategies.length})`"
        name="unactive"
      >
        <strategy-card
          v-for="(strategy) in inactiveStrategies"
          :key="strategy.id"
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
import { filterByTerm } from '@/utils/jusUtils'
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

    filteredStrategies() {
      const teste = filterByTerm(this.filterTerm, this.strategies, 'name')
      console.log(teste)
      return teste
    },

    activeStrategies() {
      const teste = this.filteredStrategies.filter(s => s.isActive)
      console.log(teste)
      return teste
    },

    inactiveStrategies() {
      return this.filteredStrategies.filter(s => !s.isActive)
    },
  },
  methods: {
    ...mapActions(['updateStrategy']),

    mainButtonHandler() {
      this.$prompt('Digite o nome da estratégia', 'Criar estratégia', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => !!value,
        inputErrorMessage: 'Campo obrigatório',
      }).then(({ value }) => {
        this.addStrategy(value)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-strategy {
  background-color: #fff;
  padding: 40px;
  overflow: auto;

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
