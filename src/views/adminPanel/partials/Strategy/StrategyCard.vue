<template>
  <el-card class="strategy-card">
    <div class="strategy-card__icon-area">
      <el-tooltip :content="strategyData.privateStrategy ? 'Estratégia privada' : 'Estratégia pública'">
        <i
          :class="{
            [`el-icon-${strategyData.privateStrategy ? 'lock' : 'unlock'}`]: true
          }"
          class="strategy-card__icon"
          @click="changeEstrategyPrivacy()"
        />
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
        :communications="strategyData.communications"
        :strategyId="strategy.id"
      />
    </div>

    <div class="strategy-card__workspaces-area">
      <!-- {{ availableWorkspaces }} -->
      {{ strategyData.workspaces.map(el => el.id) }}
      <el-select
        v-model="strategyData.workspaces"
        multiple
        placeholder="Select"
        @change="changeEstrategyData($event, 'workspaces')"
      >
        <el-option
          v-for="item in availableWorkspaces"
          :key="`strategy${strategyData.id}-option${item.id}`"
          :label="item.teamName"
          :value="item.id"
        >
          <span class="label-item">{{ item.teamName }}</span>
        </el-option>
      </el-select>
      <!-- <JusTagContainer
        :options="availableWorkspaces"
        :tag-list="strategyData.workspaces"
        :is-private="strategyData.privateStrategy"
        :can-add-tag="strategyData.privateStrategy"
        title="Times"
        @change="changeEstrategyData($event, 'workspaces')"
        @showInput="loadWorkspaces"
      /> -->
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
    }
  },
  mounted() {
    this.loadWorkspaces()
  },
  methods: {
    changeEstrategyData(val, key) {
      this.strategyData[key] = val
      this.$emit('changeEstrategyData', this.strategyData)
    },

    changeEstrategyPrivacy() {
      this.strategyData.privateStrategy = !this.strategyData.privateStrategy
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

.label-item {
    background-color: #f4effe;
    border-color: #eadffd;
    height: 32px;
    padding: 0 10px;
    line-height: 30px;
    font-size: 12px;
    color: #9461f7;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
}

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
