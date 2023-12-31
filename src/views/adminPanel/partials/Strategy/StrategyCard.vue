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
        <span style="float: left; margin-right: 5px; vertical-align: center">#{{ strategyData.id }}</span>
        <jus-text-editable
          :value="strategyData.name"
          type="title"
          @hasEdition="changeStrategyName"
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
        <el-tooltip :content="strategyData.active ? 'Estratégia ativa' : 'Estratégia inativa. ATENÇÃO: Não estará visível para importação'">
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
        <div
          v-if="!strategySelections[`strategy${strategyData.id}`] || !strategyData.privateStrategy"
          class="strategy-card__tags-area"
        >
          <el-tag
            v-for="workspace in strategyData.workspaces"
            :key="workspace.id"
            class="strategy-card__tags"
            size="small"
          >
            {{ workspace.teamName }}
          </el-tag>
          <span
            v-if="isWorkspacesNull"
            class="strategy-card__select-alert"
          >
            {{ workspacesPlaceholder }}
          </span>
        </div>
        <el-select
          v-if="strategyData.privateStrategy && strategySelections[`strategy${strategyData.id}`]"
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
      </div>

      <div class="strategy-card__flex-area">
        <div
          v-if="!strategySelections[`strategy${strategyData.id}`]"
          class="strategy-card__tags-area"
        >
          <el-tag
            v-for="(type, index) in strategyData.types"
            :key="index"
            class="strategy-card__tags"
            size="small"
          >
            {{ $t(`strategyTypes.${type}`).toUpperCase() }}
          </el-tag>
          <span
            v-if="istTypesNull"
            class="strategy-card__select-alert"
          >
            Sem tipo a estratégia <strong>não funciona!</strong> Escolha ao menos um!
          </span>
        </div>
        <div v-else>
          <el-select
            v-if="strategySelections[`strategy${strategyData.id}`]"
            v-model="strategyData.types"
            filterable
            multiple
            placeholder="Selecione tipos"
            @change="changeStrategyTypes()"
          >
            <el-option
              v-for="(type, index) in defaultStrategyTypes"
              :key="index"
              :label="$t(`strategyTypes.${type}`).toUpperCase()"
              :value="type"
            />
          </el-select>
          <span
            v-if="strategyData.types.length === 0"
            class="strategy-card__flex-area-select-alert"
          >
            Sem tipo a estratégia <strong>não funciona!</strong> Escolha ao menos um!
          </span>
        </div>
      </div>
    </div>

    <div class="strategy-card__footer">
      <span v-if="strategyData.createdAt">Criado em {{ formatDate(strategyData.createdAt) }} por {{ strategyData.createdBy }}</span>
      <span
        v-if="strategyData.updatedAt"
        class="strategy-card__footer-updated"
      >
        Atualizado em {{ formatDate(strategyData.updatedAt) }} por {{ strategyData.updatedBy }}
      </span>
    </div>
  </div>
</template>

<script>
import { JusTextEditable } from '@/components/JusTextEditable'

export default {
  name: 'PanelStrategy',
  components: {
    JusTextEditable,
    StrategyCommunication: () => import('./StrategyCommunication')
  },
  props: {
    strategy: {
      type: Object,
      required: true
    },
    availableWorkspaces: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      associatedWorkspaces: this.strategy.workspaces.map(w => w.id),
      defaultStrategyTypes: ['COMMUNICATION', 'PAYMENT', 'RECOVERY', 'OBLIGATION', 'DISCOUNT', 'MULTI_PARTY_NEGOTIATION', 'LEGAL_MKT'],
      strategySelections: {}
    }
  },
  computed: {
    strategyData() {
      return this.strategy
    },
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
    }
  },
  methods: {
    changeStrategyData() {
      this.$emit('changeStrategyData', this.strategyData)
    },

    changeStrategyName(newValue) {
      this.strategyData.name = newValue
      this.changeStrategyData()
    },

    loadSelections4StrategyId(id) {
      this.$set(this.strategySelections, `strategy${id}`, true)
    },

    changeStrategyTypes() {
      if (this.strategyValidator) {
        this.changeStrategyData()
      } else {
        this.strategyData.types.pop()

        this.$jusNotification({
          title: 'Ops!!',
          message: 'Estratégia com o tipo indenizatório e cobrança não pode existir. Por favor, verifique os tipos desta estratégia.',
          type: 'warning'
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
      if (this.strategyData.types?.length) {
        this.strategyData.active = !this.strategyData.active
        this.changeStrategyData()
      } else {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Escolha ao menos um tipo para a estratégia'
        })
      }
    },

    emitCopyStrategy() {
      this.$emit('copyStrategy', this.strategyData)
    },

    emitDeleteStrategy() {
      this.$emit('deleteStrategy', this.strategyData)
    },

    formatDate(date) {
      return this.$moment(new Date(date)).format('DD/MM/YYYY')
    }
  }
}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.strategy-card {
  border-radius: 8px;
  border: 1px solid $--color-light-gray;
  position: relative;
  box-shadow: inherit !important;
  margin-bottom: 24px;
  padding: 24px;
  width: 100%;

  .el-icon-turn-off {
    color: $--color-danger;
  }

  .el-icon-open {
    color: $--color-primary;
  }

  &:hover {
    border: 1px solid $--color-primary;
    color: $--color-primary;
    .strategy-card__header {
      .strategy-card__action-area {
        display: flex;
      }
    }
    .strategy-card__footer {
      color: $--color-gray;
    }
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

      .strategy-card__tags-area {
        border: solid 1px $--color-light-gray;
        border-radius: 2px;
        padding: 4px;

        .strategy-card__select-alert {
          color: $--color-text-secondary;
          font-size: 12px;
        }

        .strategy-card__tags {
          color: $--color-text-primary;
          margin: 2px;
        }
      }

      .strategy-card__flex-area-select-alert {
        color: red;
        font-size: 12px;
      }
    }
  }

  .strategy-card__footer {
    display: flex;
    color: white;
    font-size: 11px;
    margin-top: 8px;
    .strategy-card__footer-updated {
      position: absolute;
      right: 0;
      margin-right: 30px;
    }
  }
}

</style>
