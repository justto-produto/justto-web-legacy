<template>
  <article class="strategy-details">
    <h3 class="strategy-details__title">
      {{ strategy.name }}
    </h3>

    <div class="strategy-details__actions">
      <el-tooltip
        :content="`Estratégia está ${strategy.privateStrategy ? 'privada' : 'pública'}`"
        placement="bottom-start"
      >
        <el-button
          type="secondary"
          circle
          :icon="strategy.privateStrategy ? 'el-icon-lock' : 'el-icon-unlock'"
          class="strategy-item__action"
        />
      </el-tooltip>

      <el-tooltip
        :content="`Estratégia está ${strategy.active ? 'ativa' : 'inativa'}`"
        placement="bottom"
      >
        <el-button
          type="secondary"
          circle
          :icon="strategy.active ? 'el-icon-open' : 'el-icon-turn-off'"
          class="strategy-item__action"
        />
      </el-tooltip>

      <el-tooltip
        content="Copiar estratégia"
        placement="bottom-end"
      >
        <el-button
          type="secondary"
          circle
          icon="el-icon-copy-document"
          class="strategy-item__action"
        />
      </el-tooltip>

      <el-tooltip
        content="Apagar estratégia"
        placement="bottom-end"
      >
        <el-button
          type="secondary"
          circle
          icon="el-icon-delete"
          class="strategy-item__action"
        />
      </el-tooltip>
    </div>

    <div class="strategy-details__form">
      <el-form
        ref="form"
        :model="form"
        label-position="top"
      >
        <el-form-item label="Workspaces">
          <el-select
            v-model="form.strategies"
            placeholder="Selecione as Workspaces"
            multiple
            filterable
          >
            <el-option
              v-for="item in workspaces"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Tipos">
          <el-select
            v-model="form.types"
            filterable
            multiple
            placeholder="Selecione tipos"
          >
            <el-option
              v-for="(type, index) in defaultStrategyTypes"
              :key="index"
              :label="$t(`strategyTypes.${type}`).toUpperCase()"
              :value="type"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'

const defaultStrategyTypes = ['COMMUNICATION', 'PAYMENT', 'RECOVERY', 'OBLIGATION', 'DISCOUNT', 'MULTI_PARTY_NEGOTIATION', 'LEGAL_MKT']

export default {
  name: 'StrategyDetails',

  data: () => ({
    form: {
      strategies: [],
      types: []
    },

    defaultStrategyTypes
  }),

  computed: {
    ...mapGetters({
      getStrategy: 'getStrategiesById',
      workspaces: 'getAvailableWorkspaces'
    }),

    strategy() {
      return this.getStrategy(this.$route?.params?.id || -1)
    }
  },

  watch: {
    '$route.params.id': {
      deep: true,
      handler: 'handlePopulateForm'
    }
  },

  mounted() {
    this.handlePopulateForm()
  },

  methods: {
    async handlePopulateForm() {
      await this.$nextTick()
      this.form.strategies = (this.strategy?.workspaces || []).map(({ id }) => id)
      this.form.types = this.strategy?.types || []
    }
  }
}
</script>

<style lang="scss" scoped>
.strategy-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  width: 100%;

  .strategy-details__title  {
    text-align: center;
    margin: 0;
    padding: 0 8px;
    font-weight: 600;
  }

  .strategy-details__actions {
    display: flex;
    width: 100%;
    justify-content: space-evenly;

    .el-button {
      margin: 0;
    }
  }

  .strategy-details__form {
    display: flex;
    flex-direction: column;
    padding: 0 4px;
  }
}
</style>
