<template>
  <article
    class="strategy-item__container prevent-select"
    @click="openStrategy(strategy)"
  >
    <!-- <div class="strategy-item__actions">
      <el-tooltip
        content="ID da Estratégia."
        placement="right"
      >
        <el-button
          type="text"
          class="strategy-item__action strategy-item__actions__id"
        >
          #{{ strategy.id }}
        </el-button>
      </el-tooltip>

      <el-tooltip
        :content="`Estratégia está ${strategy.privateStrategy ? 'privada' : 'pública'}`"
        placement="right"
      >
        <el-button
          type="text"
          :icon="strategy.privateStrategy ? 'el-icon-lock' : 'el-icon-unlock'"
          class="strategy-item__action"
        />
      </el-tooltip>

      <el-tooltip
        :content="`Estratégia está ${strategy.active ? 'ativa' : 'inativa'}`"
        placement="right"
      >
        <el-button
          type="text"
          :icon="strategy.active ? 'el-icon-open' : 'el-icon-turn-off'"
          class="strategy-item__action"
        />
      </el-tooltip>
    </div> -->

    <div class="strategy-item__body">
      <div class="strategy-item__body__title">
        <span class="strategy-item__body__name">
          {{ strategy.name }}
        </span>
      </div>

      <WorkspacesView
        :workspaces="strategy.workspaces || []"
        class="strategy-item__body__workspaces"
      />

      <TypesView
        :types="strategy.types || []"
        class="strategy-item__body__types"
      />
    </div>

    <!-- <div class="strategy-item__actions">
      <el-tooltip
        content="Copiar estratégia"
        placement="right"
      >
        <el-button
          type="text"
          icon="el-icon-copy-document"
          class="strategy-item__action"
        />
      </el-tooltip>

      <el-tooltip
        content="Apagar estratégia"
        placement="right"
      >
        <el-button
          type="text"
          icon="el-icon-delete"
          class="strategy-item__action"
        />
      </el-tooltip>
    </div> -->
  </article>
</template>

<script>
export default {
  name: 'StrategyItem',

  components: {
    TypesView: () => import('./partials/TypesView'),
    WorkspacesView: () => import('./partials/WorkspacesView')
  },

  props: {
    strategy: {
      type: Object,
      required: true
    }
  },

  methods: {
    openStrategy({ id }) {
      this.$router.push(`/admin-panel-2/strategies/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.strategy-item__container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: solid lightgray thin;
  border-radius: 1rem;
  padding: 0.5rem;
  cursor: pointer;

  .strategy-item__body {
    display: flex;
    width: 100%;
    gap: 8px;
    flex-direction: column;
    margin: 0 8px;

    .strategy-item__body__title {
      text-transform: uppercase;
      text-align: center;

      .strategy-item__body__name {
        font-weight: bold;
      }
    }

    .strategy-item__body__workspaces {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;

      .strategy-item__body__workspace {
        flex: 1;
        text-align: center;
      }
    }
  }

  .strategy-item__actions {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 4px;

    .strategy-item__actions__id {
      font-size: 10px;
    }

    .strategy-item__action {
      cursor: pointer;
    }
  }

  &:hover {
    border-color: blue;
  }
}
</style>

<style lang="scss">
.strategy-item__container {
  .strategy-item__actions {
    display: flex;
    gap: 16px;
    align-items: center;

    .strategy-item__action {
      padding: 0;

      i:before {
        font-size: 1.5rem;
      }
    }

    .el-button + .el-button {
      margin: 0 !important;
    }
  }
}
</style>
