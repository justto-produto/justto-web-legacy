<template>
  <el-card class="strategy-card">
    <div class="strategy-card__icon-area">
      <i
        :class="{
          [`el-icon-${strategyData.privateStrategy ? 'lock' : 'unlock'}`]: true
        }"
      />
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
      <strategy-communication :communications="strategyData.triggers" />
    </div>

    <div class="strategy-card__workspaces-area">
      <!-- <jus-tag-container
        :options="[
          { id: 1, name: 'Mock Workspace' },
          { id: 2, name: 'Test 1' },
          { id: 3, name: 'Test 2' },
        ]"
        :tag-list="strategyData.workspaces"
        placeholder="Todos os times possuem acesso a esta estratégia."
        title="Times"
        @change="changeEstrategyData($event, 'workspaces')"
      /> -->
    </div>

    <div class="strategy-card__strategies-area">
      <jus-tag-container
        :tag-list="[{name: 'Pagamento'}]"
        @change="changeEstrategyData($event, 'workspaces')"
      />
    </div>
  </el-card>
</template>

<script>
import { JusTagContainer } from '@/components/JusTagContainer'
import { JusTextEditable } from '@/components/JusTextEditable'
import StrategyCommunication from './StrategyCommunication'

export default {
  name: 'PanelStrategy',
  components: {
    JusTagContainer,
    JusTextEditable,
    StrategyCommunication,
  },
  props: {
    strategy: {
      type: Object,
      required: true,
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
    emitCopyStrategy() {
      this.$emit('copyStrategy', {
        ...this.strategyData,
        name: `${this.strategyData.name} (Cópia)`,
      })
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.panel-strategy {
  padding: 40px;

  .strategy-card {
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
          display: flex;
          justify-content: flex-end;

          .strategy-card__action-button {
            font-size: 16px;
          }
        }
      }

      .strategy-card__icon-area {
        grid-area: icon-area;

        & > i {
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
