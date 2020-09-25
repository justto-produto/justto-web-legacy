<template>
  <el-container
    v-loading="loading"
    class="panel-strategy"
  >
    <div
      v-if="strategiesContent.length"
      class="panel-strategy__strategies-list"
    >
      <strategy-card
        v-for="(strategy) in strategiesContent"
        :key="strategy.id"
        :available-workspaces="workspaces"
        :strategy="strategy"
        @changeStrategyData="updateStrategy"
        @copyStrategy="copyStrategyHandler"
        @deleteStrategy="deleteStrategyHandler"
      />

      <infinite-loading
        v-if="strategies.totalElements >= 20"
        spinner="spiral"
        @infinite="loadStrategy"
      >
        <div slot="no-more">
          Fim das estratégias
        </div>
        <div slot="no-results">
          Fim das estratégias
        </div>
      </infinite-loading>
    </div>

    <div
      v-else
      class="panel-strategy__empty"
    >
      <jusIcon icon="empty-screen-filter" />
      <span class="panel-strategy__empty-label">
        Nenhuma estratégia encontrada.
      </span>
    </div>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PanelStrategy',
  components: {
    InfiniteLoading: () => import('vue-infinite-loading'),
    StrategyCard: () => import('./StrategyCard')
  },
  props: {
    filterTerm: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    filterDebounce: null
  }),
  computed: {
    ...mapGetters({
      isJusttoDev: 'isJusttoDev',
      strategies: 'getStrategies',
      workspaces: 'getAvailableWorkspaces',
      loading: 'getStrategiesLoadingStatus'
    }),

    strategiesContent() {
      return (this.strategies.content || []).filter(strategy => {
        if (this.isJusttoDev) {
          return true
        } else {
          return !strategy.name.startsWith('[TST]')
        }
      })
    }
  },
  watch: {
    filterTerm(newValue, oldValue) {
      this.setActiveStrategy(null)
      clearTimeout(this.filterDebounce)
      if (this.filterTerm !== oldValue) {
        this.filterDebounce = setTimeout(() => {
          this.setFilterTerm(newValue)
        }, 500)
      }
    }
  },
  beforeMount() {
    this.getAvailableWorkspace()
    this.getAvaliableVariablesToTemplate()
    this.getStrategies()
  },
  methods: {
    ...mapActions([
      'setActiveStrategy',
      'showLoading',
      'addStrategy',
      'cloneStrategy',
      'getAvaliableVariablesToTemplate',
      'getAvailableWorkspace',
      'getStrategies',
      'updateStrategy',
      'deleteStrategy',
      'incrementStrategySize',
      'clearStrategySize',
      'setFilterTerm'
    ]),

    loadStrategy($state) {
      this.getStrategies('isInfinite').then(response => {
        if (response.last) {
          $state.complete()
        } else {
          $state.loaded()
        }
      })
    },

    mainButtonHandler() {
      this.setActiveStrategy(null)
      this.$prompt('Digite o nome da estratégia', 'Criar estratégia', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => !!value,
        inputErrorMessage: 'Campo obrigatório'
      }).then(({ value }) => {
        this.addStrategy({ privateStrategy: true, name: value })
          .then(() => {
            this.$jusNotification({
              title: 'Yay!',
              message: 'Estratégia criada com sucesso!',
              type: 'success'
            })
            this.$emit('set-filter', value)
          })
      })
    },

    copyStrategyHandler(strategy) {
      this.$prompt('Nome da nova estratégia', 'Copiar estratégia', {
        confirmButtonText: 'Clonar',
        cancelButtonText: 'Cancelar',
        inputValue: `${strategy.name} (Cópia)`
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
        cancelButtonClass: 'is-plain'
      }).then(() => {
        this.deleteStrategy({ strategyId: strategy.id })
      })
    },

    saveStrategyCopy(strategy, newName) {
      const workspaceIds = []
      for (const workspace of strategy.workspaces) {
        if (workspace.id) {
          workspaceIds.push(workspace.id)
        }
      }

      const strategyClone = {
        newName,
        workspaceIds
      }

      this.cloneStrategy({
        strategyClone,
        originId: strategy.id
      }).then(() => {
        this.$emit('set-filter', newName)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.panel-strategy {
  background-color: #fff;
  padding: 32px;
  height: 100%;
  overflow: auto;

  .panel-strategy__strategies-list {
    width: 100%;
  }

  .panel-strategy__empty {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .panel-strategy__empty-label {
      margin-top: 24px;
      color: $--color-text-secondary;
    }
  }
}
</style>
