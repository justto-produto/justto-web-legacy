<template>
  <!--   FIXME concluir infinite scroll     -->
  <div
    v-loading="$store.state.loading"
    class="panel-strategy"
  >
    <table class="panel-strategy table-strategy">
      <strategy-card
        v-for="(strategy) in filteredStrategies"
        :key="strategy.id"
        :available-workspaces="workspaces"
        :strategy="strategy"
        @changeStrategyData="updateStrategy"
        @copyStrategy="copyStrategyHandler"
        @deleteStrategy="deleteStrategyHandler"
      />
    </table>
  </div>
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
    filterTermApplied: '',
    processingFilter: null,
    infiniteId: +new Date(),
  }),
  computed: {
    ...mapGetters({
      strategies: 'getStrategies',
      workspaces: 'getAvailableWorkspaces',
    }),

    filteredStrategies() {
      this.$store.dispatch('showLoading')
      const filteredStrategys = filterByTerm(this.filterTermApplied, this.strategies, 'name')
      this.$store.dispatch('hideLoading')
      return filteredStrategys
    },
  },
  watch: {
    filterTerm(newValue) {
      /**
       * FIXME refatorar esta merda para substituir por um debounce decente que controle sobrecarga,
       * não deixando sobrescrever por dados antigos nem fazer consultas desnecessarias
       */
      if (this.processingFilter != null) {
        try {
          clearTimeout(this.processingFilter)
        } catch (e) {}
      }
      this.processingFilter = setTimeout(() => {
        if (this.filterTermApplied !== newValue) {
          this.filterTermApplied = newValue
        }
      }, 400)
    },
  },
  beforeMount() {
    this.getAvailableWorkspace()
    this.getAvaliableVariablesToTemplate()
    this.getStrategies().finally(() => (this.$store.dispatch('hideLoading')))
  },

  methods: {
    ...mapActions([
      'addStrategy',
      'cloneStrategy',
      'getAvaliableVariablesToTemplate',
      'getAvailableWorkspace',
      'getStrategies',
      'updateStrategy',
      'deleteStrategy',
      'incrementStrategySize',
      'clearStrategySize',
    ]),

    loadStrategy($state) {
      this.$store.dispatch('getStrategies').then(response => {
        if (response.last) {
          $state.complete()
        } else {
          $state.loaded()
          this.$store.commit('incrementStrategySize')
        }
      })
    },

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

    deleteStrategyHandler(strategy) {
      this.$confirm('Tem certeza que deseja excluir esta estratégia? Esta ação é irreversível.', 'Atenção!', {
        confirmButtonClass: 'confirm-remove-btn',
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'error',
        cancelButtonClass: 'is-plain',
      }).then(() => {
        this.deleteStrategy({ strategyId: strategy.id })
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
.table-strategy {
    width: 100%;
}
.panel-strategy {
  background-color: #fff;
  padding: 40px;
  overflow: auto;
  height: 100%;

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
