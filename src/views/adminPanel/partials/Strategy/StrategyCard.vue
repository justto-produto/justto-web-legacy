<template>
  <div
    class="strategy-card"
    @click="loadSelections4StrategyId(strategyData.id)"
  >
    <div class="strategy-card__header">
      <div class="strategy-card__private-icon-area">
        <el-tooltip :content="strategyData.privateStrategy ? 'Estratégia privada' : 'Estratégia pública'">
          <i
            :class="`el-icon-${strategyData.privateStrategy ? 'lock' : 'unlock'}`"
            class="strategy-card__icon"
            @click="changeStrategyPrivacy()"
          />
        </el-tooltip>
      </div>

      <div class="strategy-card__name-area">
        <jus-text-editable
          :value="strategyData.name"
          type="title"
          @hasEdition="changeStrategyData"
        />
      </div>

      <div class="strategy-card__action-area">
        <el-tooltip content="Copiar estratégia">
          <el-button
            type="text"
            icon="el-icon-copy-document"
            @click.native="emitCopyStrategy"
          />
        </el-tooltip>
        <el-tooltip content="Apagar estratégia">
          <el-button
            type="text"
            icon="el-icon-delete"
            @click.native="emitDeleteStrategy"
          />
        </el-tooltip>
      </div>
    </div>

    <div class="strategy-card__body">
      <div class="strategy-card__active-icon-area">
        <el-tooltip :content="strategyData.active ? 'Estratégia ativa' : 'Estratégia inativa'">
          <i
            :class="`el-icon-${strategyData.active ? 'open' : 'turn-off'}`"
            class="strategy-card__icon"
            @click="changeStrategyActive()"
          />
        </el-tooltip>
      </div>

      <div class="strategy-card__flex-area">
        <StrategyCommunication
          :triggers="strategyData.triggers"
          :strategy-id="strategy.id"
        />
      </div>

      <div class="strategy-card__flex-area">
        <div v-if="strategyData.privateStrategy && !strategySelections['s'+strategyData.id]">
          <span
            v-for="workspace in strategyData.workspaces"
            :key="workspace.id"> {{ workspace.teamName }},
          </span>
        </div>
        <el-select
          v-if="strategyData.privateStrategy && strategySelections['s'+strategyData.id]"
          v-model="associatedWorkspaces"
          placeholder="Selecione um workspace"
          :disabled="!strategyData.privateStrategy"
          multiple
          filterable
          @change="changeStrategyWorkspaces($event)"
        >
          <el-option
            v-for="workspace in availableWorkspaces"
            :key="`${strategyData.id}-${workspace.id}`"
            :label="workspace.teamName"
            :value="workspace.id"
          />
        </el-select>
        <div
          v-if="isWorkspacesNull"
          class="strategy-card__select-alert"
        >
          {{ workspacesPlaceholder }}
        </div>
      </div>

      <div class="strategy-card__flex-area">
        <el-select
          v-model="strategyData.types"
          filterable
          multiple
          placeholder="Selecione tipos"
          @focus="loadSelections4StrategyId(strategyData.id)"
          @change="changeStrategyTypes()"
        >
          <el-option
            v-for="(type, index) in defaultStrategyTypes"
            :key="index"
            :label="type.name"
            :value="type.value"
          />
        </el-select>
        <div
          v-if="istTypesNull"
          class="strategy-card__select-alert"
        >
          Sem tipo a estratégia <strong>não funciona!</strong> Escolha ao menos um!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { JusTextEditable } from '@/components/JusTextEditable'
import StrategyCommunication from './StrategyCommunication'

export default {
  name: 'PanelStrategy',
  components: {
    JusTextEditable,
    StrategyCommunication,
  },
  props: {
    strategy: {
      type: Object,
      required: true,
    },
    availableWorkspaces: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      strategyData: this.strategy,
      associatedWorkspaces: this.strategy.workspaces.map(w => w.id),
      defaultStrategyTypes: [
        { name: 'INDENIZATÓRIO DE VALOR', value: 'PAYMENT' },
        { name: 'COBRANÇA', value: 'RECOVERY' },
        { name: 'OBRIGAÇÃO DE FAZER', value: 'OBLIGATION' },
        { name: 'DESCONTO', value: 'DISCOUNT' },
      ],
      strategySelections: {},
    }
  },
  computed: {
    strategyValidator() {
      const rules = ['PAYMENT', 'RECOVERY']
      return !rules.every(rule => Object.values(this.strategyData.types).includes(rule))
    },
    workspacesPlaceholder() {
      return this.strategyData.privateStrategy ? 'Nimgém pode ver essa estratégia. Associe um time ou torne-a pública.' : 'Todos os times possuem acesso a esta estratégia.'
    },
    istTypesNull() {
      return !this.strategyData.types.length
    },
    isWorkspacesNull() {
      return !this.associatedWorkspaces.length
    },
  },
  methods: {
    changeStrategyData(newValue) {
      this.strategyData.name = newValue
      this.$emit('changeStrategyData', this.strategyData)
    },

    loadSelections4StrategyId(id) {
      this.$set(this.strategySelections, 's' + id, true)
    },

    changeStrategyTypes() {
      if (this.strategyValidator) {
        this.changeStrategyData()
      } else {
        this.strategyData.types.pop()

        this.$jusNotification({
          title: 'Ops!!',
          message: 'Estratégia com o tipo indenizatório e cobrança não pode existir. Por favor, verifique os tipos desta estratégia.',
          type: 'warning',
        })
      }
    },

    changeStrategyWorkspaces() {
      this.strategyData.workspaces = this.availableWorkspaces.filter(w => this.associatedWorkspaces.includes(w.id))
      this.changeStrategyData()
    },

    changeStrategyPrivacy() {
      this.strategyData.privateStrategy = !this.strategyData.privateStrategy
      this.changeStrategyData()
    },

    changeStrategyActive() {
      this.strategyData.active = !this.strategyData.active
      this.changeStrategyData()
    },

    emitCopyStrategy() {
      this.$emit('copyStrategy', this.strategyData)
    },

    emitDeleteStrategy() {
      this.$emit('deleteStrategy', this.strategyData)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.strategy-card {
  border-radius: 12px;
  border: 1px solid $--color-cloudy-blue;
  position: relative;
  box-shadow: inherit !important;
  margin-bottom: 24px;
  padding: 24px;

  &:hover {
    border: 1px solid $--color-primary;
    color: $--color-primary;
  }

  .strategy-card__header {
    display: flex;
    align-items: center;

    .strategy-card__private-icon-area {
      width: 32px;
      cursor: pointer;
      font-size: 32px;
    }

    .strategy-card__name-area {
      width: calc(100% - 110px);
      margin-left: 16px;
    }

    .strategy-card__action-area {
      position: absolute;
      top: 24px;
      right: 24px;
      display: none;
      i {font-size: 16px;}

      .el-icon-delete {
        color: $--color-danger;
      }
    }
  }

  &:hover {
    .strategy-card__header {
      .strategy-card__action-area {
        display: flex;
      }
    }
  }

  .strategy-card__body {
    margin-top: 16px;
    display: flex;

    .strategy-card__active-icon-area {
      width: 32px;
      cursor: pointer;
      font-size: 32px;
    }

    .strategy-card__flex-area {
      flex: 1;
      margin-left: 16px;

      .strategy-card__select-alert {
        color: $--color-text-secondary;
        font-size: 12px;
        line-height: 14px;
        padding: 6px 6px 0 6px;
      }
    }
  }
}

</style>
