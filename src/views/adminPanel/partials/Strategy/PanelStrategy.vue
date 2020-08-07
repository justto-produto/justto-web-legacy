<template>
  <section class="panel-strategy">
    <el-collapse
      v-model="activeCollapse"
      v-loading="loading"
    >
      <el-collapse-item
        :title="`Ativas (${activeStrategies.length})`"
        name="active"
      >
        <strategy-card
          v-for="(strategy) in activeStrategies"
          :key="strategy.id"
          :available-workspaces="workspaces"
          :strategy="strategy"
          class="panel-strategy__card"
          @changeStrategyData="updateStrategy"
          @copyStrategy="copyStrategyHandler"
        />
      </el-collapse-item>
      <el-collapse-item
        :title="`Inativas (${inactiveStrategies.length})`"
        name="unactive"
      >
        <strategy-card
          v-for="(strategy) in inactiveStrategies"
          :key="strategy.id"
          :available-workspaces="workspaces"
          :strategy="strategy"
          class="panel-strategy__card"
          @changeStrategyData="updateStrategy"
          @copyStrategy="copyStrategyHandler"
        />
      </el-collapse-item>
    </el-collapse>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { filterByTerm } from '@/utils/jusUtils'

export default {
  name: 'PanelStrategy',
  components: {
    StrategyCard: () => import('./StrategyCard'),
  },
  props: {
    filterTerm: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    activeCollapse: ['active'],
    loading: true,
  }),
  computed: {
    ...mapGetters({
      strategies: 'getStrategies',
      workspaces: 'getAvailableWorkspaces',
    }),

    filteredStrategies() {
      return filterByTerm(this.filterTerm, this.strategies, 'name')
    },

    activeStrategies() {
      return this.filteredStrategies.filter(s => s.active)
    },

    inactiveStrategies() {
      return this.filteredStrategies.filter(s => !s.active)
    },
  },
  beforeMount() {
    this.getAvailableWorkspace()
    this.getAvaliableVariablesToTemplate()
    this.getStrategies().finally(() => (this.loading = false))
  },
  methods: {
    ...mapActions([
      'addStrategy',
      'cloneStrategy',
      'getAvaliableVariablesToTemplate',
      'getAvailableWorkspace',
      'getStrategies',
      'updateStrategy',
    ]),

    mainButtonHandler() {
      this.$prompt('Digite o nome da estratégia', 'Criar estratégia', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => !!value,
        inputErrorMessage: 'Campo obrigatório',
      }).then(({ value }) => {
        this.addStrategy({ privateStrategy: true, name: value })
          .then(() => {
            this.$jusNotification({
              title: 'Yay!',
              message: 'Estratégia criada com sucesso!',
              type: 'success',
            })
            this.$emit('set-filter', value)
          })
      })
    },

    copyStrategyHandler(strategy) {
      this.$prompt('Nome da nova estratégia', 'Copiar estratégia', {
        confirmButtonText: 'Clonar',
        cancelButtonText: 'Cancelar',
        inputValue: `${strategy.name} (Cópia)`,
      }).then(({ value }) => {
        this.saveStrategyCopy(strategy, value)
      })
    },

    saveStrategyCopy(strategy, newName) {
      const workspaceIds = []
      for (const workspace in strategy.workspaces) {
        workspaceIds.push(workspace.id)
      }

      const strategyClone = {
        newName,
        workspaceIds,
      }

      this.cloneStrategy({
        strategyClone,
        originId: this.strategyCopy.id,
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
