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
          @changeEstrategyData="updateStrategy"
          @copyStrategy="copyStrategyHandler"
          @loadWorkspaces="getStrategyAvailableWorkspaces"
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

    <el-dialog
      title="Copiar estratégia"
      :visible.sync="dialogIsVisible"
    >
      <el-form :model="strategyCopy">
        <el-form-item label="Nome">
          <el-input
            v-model="strategyCopy.name"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item>
          <JusTagContainer
            :options="workspaces"
            :tag-list="strategyCopy.workspaces"
            title="Equipes"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogIsVisible = false">
          Cancelar
        </el-button>
        <el-button
          type="primary"
          @click="saveStrategyCopy"
        >
          Salvar
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { filterByTerm } from '@/utils/jusUtils'

export default {
  name: 'PanelStrategy',
  components: {
    JusTagContainer: () => import('@/components/JusTagContainer'),
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
    dialogIsVisible: false,
    strategyCopy: { },
  }),
  computed: {
    ...mapGetters({
      strategies: 'getStrategies',
      workspaces: 'getStrategyAvailableWorkspaces',
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
    this.getStrategies().finally(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions([
      'addStrategy',
      'getStrategies',
      'getStrategyAvailableWorkspaces',
      'updateStrategy',
    ]),

    mainButtonHandler() {
      this.$prompt('Digite o nome da estratégia', 'Criar estratégia', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => !!value,
        inputErrorMessage: 'Campo obrigatório',
      }).then(({ value }) => {
        this.addStrategy({ name: value })
      })
    },

    copyStrategyHandler(strategy) {
      this.strategyCopy = strategy
      this.getStrategyAvailableWorkspaces(strategy.id).then(({ workspaces }) => {
        delete this.strategyCopy.id
        this.dialogIsVisible = true
      })
    },

    saveStrategyCopy() {
      this.addStrategy(this.strategyCopy)
      this.dialogIsVisible = false
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
