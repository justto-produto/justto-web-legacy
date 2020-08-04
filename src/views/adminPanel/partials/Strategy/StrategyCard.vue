<template>
  <el-card class="strategy-card">
    <div class="strategy-card__icon-area">
      <el-tooltip :content="strategyData.privateStrategy ? 'Estratégia privada' : 'Estratégia pública'">
        <i
          :class="{
            [`el-icon-${strategyData.privateStrategy ? 'lock' : 'unlock'}`]: true
          }"
          class="strategy-card__icon"
          @click="changeStrategyPrivacy()"
        />
      </el-tooltip>
    </div>

    <div class="strategy-card__name-area">
      <jus-text-editable
        :value="strategyData.name"
        type="title"
        @hasEdition="changeStrategyName($event)"
      />
    </div>

    <div class="strategy-card__action-area">
      <el-tooltip content="Copiar estratégia">
        <el-button
          type="text"
          icon="el-icon-copy-document"
          class="strategy-card__action-button"
          @click.native="emitCopyStrategy"
        />
      </el-tooltip>
    </div>

    <div class="strategy-card__messages-area">
      <StrategyCommunication
        :communications="strategyData.communications"
        :strategyId="strategy.id"
      />
    </div>

    <div class="strategy-card__workspaces-area">
      <el-select
        v-model="associatedWorkspaces"
        :placeholder="workspacesPlaceholder"
        :disabled="!strategyData.privateStrategy"
        multiple
        filterable
        @visible-change="loadWorkspaces"
        @change="changeStrategyWorkspaces($event)"
      >
        <el-option
          v-for="item in availableWorkspaces"
          :key="`${strategyData.id}${item.id}`"
          :label="item.teamName"
          :value="item.id"
        />
      </el-select>
    </div>

    <div class="strategy-card__strategies-area">
      <!-- <JusTagContainer
        :tag-list="[{name: 'Pagamento'}]"
        @change="changeEstrategyData($event, 'types')"
      /> -->
    </div>
  </el-card>
</template>

<script>
// import { JusTagContainer } from '@/components/JusTagContainer'
import { JusTextEditable } from '@/components/JusTextEditable'
import StrategyCommunication from './StrategyCommunication'

export default {
  name: 'PanelStrategy',
  components: {
    // JusTagContainer,
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
    }
  },
  computed: {
    workspacesPlaceholder() {
      return this.strategyData.privateStrategy ? 'Nimgém pode ver essa estratégia. Associe um time ou torne-a pública.' : 'Todos os times possuem acesso a esta estratégia.'
    },
  },
  methods: {
    changeStrategyName(name) {
      this.strategyData.name = name
      this.$emit('changeStrategyData', this.strategyData)
    },

    changeStrategyWorkspaces() {
      this.strategyData.workspaces = this.availableWorkspaces.filter(w => this.associatedWorkspaces.includes(w.id))
      this.$emit('changeStrategyData', this.strategyData)
    },

    changeStrategyPrivacy() {
      this.strategyData.privateStrategy = !this.strategyData.privateStrategy
      this.$emit('changeStrategyData', this.strategyData)
    },

    emitCopyStrategy() {
      this.$emit('copyStrategy', {
        ...this.strategyData,
        name: `${this.strategyData.name} (Cópia)`,
      })
    },

    loadWorkspaces() {
      this.$emit('loadWorkspaces', this.strategyData.id)
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.panel-strategy {
  padding: 40px;

  .strategy-card {
    position: relative;
    &:hover {
      border: 1px solid $--color-primary;
      color: $--color-primary;
    }

    & > .el-card__body {
      display: grid;
      grid-template-areas:
        'icon-area name-area name-area action-area'
        'icon-area messages-area workspaces-area strategies-area';
      grid-template-columns: 32px repeat(3, 1fr);
      grid-template-rows: repeat(2, minmax(40px, auto));
      gap: 16px;

      &:hover {
        .strategy-card__action-area {
          display: block;
          position: absolute;
          top: 16px;
          right: 16px;

          .strategy-card__action-button {
            font-size: 16px;
          }
        }
      }

      .strategy-card__icon-area {
        grid-area: icon-area;

        & > i {
          cursor: pointer;
          font-size: 32px;
        }
      }

      .strategy-card__name-area {
        grid-area: name-area;
      }

      .strategy-card__action-area {
        display: none;
        grid-area: action-area;
      }

      .strategy-card__workspaces-area {
        grid-area: workspaces-area;

        & > .jus-tag-container {
          height: 100%;
        }
      }

      .strategy-card__messages-area {
        grid-area: messages-area;
      }

      .strategy-card__strategies-area {
        grid-area: strategies-area;

        & > .jus-tag-container {
          height: 100%;
        }
      }
    }
  }
}
</style>
