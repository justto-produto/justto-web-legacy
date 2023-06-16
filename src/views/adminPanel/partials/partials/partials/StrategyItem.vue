<template>
  <article
    :class="{'strategy-item__container__active': isActive}"
    class="strategy-item__container prevent-select"
    @click="openStrategy(strategy)"
  >
    <div class="strategy-item__body">
      <div class="strategy-item__body__title">
        <span class="strategy-item__body__name">
          {{ strategy.name }}
        </span>
      </div>

      <WorkspacesView
        :workspaces="strategy.workspaces || []"
        :active="isActive"
        class="strategy-item__body__workspaces"
        @edit="handleEditWorkspaces"
      />

      <TypesView
        :types="strategy.types || []"
        :active="isActive"
        class="strategy-item__body__types"
        @edit="handleEditTypes"
      />
    </div>

    <i
      class="el-icon-edit strategy-item__edit pointer"
    />
  </article>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  name: 'StrategyItem',

  components: {
    TypesView: () => import('./components/TypesView'),
    WorkspacesView: () => import('./components/WorkspacesView')
  },

  props: {
    strategy: {
      type: Object,
      required: true
    }
  },

  computed: {
    isActive() {
      return Number(this.strategy?.id || -2) === Number(this.$route?.params?.id || -1)
    }
  },

  methods: {
    ...mapActions(['updateStrategy']),

    ...mapMutations(['setActiveStrategy']),

    openStrategy({ id }) {
      this.setActiveStrategy(id)
      this.$router.push(`/admin-panel-2/strategies/${id}`)
    },

    handleEditWorkspaces(workspaces) {
      const strategy = { ...this.strategy, workspaces }

      this.handleEditStrategy(strategy)
    },

    handleEditTypes(types = []) {
      const strategy = { ...this.strategy, types }

      this.handleEditStrategy(strategy)
    },

    handleEditStrategy(strategy) {
      this.updateStrategy(strategy).then(() => this.$jusNotification({
        type: 'success',
        message: 'Ação executada com sucesso!'
      })).catch(error => this.$jusNotification({ error }))
      this.$jusSegment('EDIT_STRATEGY', { strategy })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.strategy-item__container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: solid lightgray thin;
  border-radius: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  position: relative;

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

  .strategy-item__edit {
    visibility: hidden;
    position: absolute;
    top: 0;
    right: 0;
    margin: 9px 1px 0 0;
  }

  &.strategy-item__container__active, &:hover {
    border-color: transparent;
    -webkit-box-shadow: 0px 0px 8px 0px rgba(1,142,240,1);
    -moz-box-shadow: 0px 0px 8px 0px rgba(1,142,240,1);
    box-shadow: 0px 0px 8px 0px rgba(1,142,240,1);

    .strategy-item__edit {
      visibility: visible;
    }
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
