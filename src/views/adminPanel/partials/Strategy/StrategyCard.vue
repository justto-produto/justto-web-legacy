<template>
  <el-card class="strategy-card">

    <div class="strategy-card__private-icon-area">
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

    <div class="strategy-card__active-icon-area">
      <el-tooltip :content="strategyData.active ? 'Estratégia ativa' : 'Estratégia inativa'">
        <span @click="changeStrategyActive()">
          <jus-icon
            :icon="strategyData.active ? 'eye' : 'hide'"
            class="strategy-card__icon"
          />
        </span>
      </el-tooltip>
    </div>

    <div class="strategy-card__name-area">
      <jus-text-editable
        :value="strategyData.name"
        type="title"
        @hasEdition="changeEstrategyData($event, 'name')"
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
        :triggers="strategyData.triggers"
        :strategyId="strategy.id"
      />
    </div>

    <div class="strategy-card__workspaces-area">
      <JusTagContainer
        :options="availableWorkspaces"
        :tag-list="strategyData.workspaces"
        :is-private="strategyData.privateStrategy"
        :can-add-tag="strategyData.privateStrategy"
        title="Times"
        @change="changeEstrategyData($event, 'workspaces')"
        @showInput="loadWorkspaces"
      />
    </div>

    <div class="strategy-card__strategies-area">
      <JusTagContainer
        :tag-list="[{name: 'Pagamento'}]"
        @change="changeEstrategyData($event, 'types')"
      />
    </div>
  </el-card>
</template>

<script>
import { JusTagContainer } from '@/components/JusTagContainer'
import { JusTextEditable } from '@/components/JusTextEditable'

export default {
  name: 'PanelStrategy',
  components: {
    JusTagContainer,
    JusTextEditable,
    StrategyCommunication: () => import('./StrategyCommunication'),
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
    }
  },
  methods: {
    changeEstrategyData(val, key) {
      this.strategyData[key] = val
      this.$emit('changeEstrategyData', this.strategyData)
    },

    changeStrategyPrivacy() {
      this.strategyData.privateStrategy = !this.strategyData.privateStrategy
      this.$emit('changeEstrategyData', this.strategyData)
    },

    changeStrategyActive() {
      console.log('foi?')
      this.strategyData.active = !this.strategyData.active
      this.$emit('changeEstrategyData', this.strategyData)
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
        'private-icon-area name-area name-area action-area'
        'active-icon-area messages-area workspaces-area strategies-area';
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

      .strategy-card__private-icon-area {
        grid-area: private-icon-area;

        & > i {
          cursor: pointer;
          font-size: 32px;
        }
      }

      .strategy-card__active-icon-area {
        grid-area: active-icon-area;

        .strategy-card__icon {
          cursor: pointer;
          width: 32px;
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
