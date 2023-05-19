<template>
  <article class="strategy-details">
    <h3 class="strategy-details__title">
      {{ strategy.name }}
    </h3>

    <div class="strategy-details__actions">
      <!-- <el-tooltip
        content="ID da Estratégia."
        placement="bottom-start"
      >
        <el-button
          type="secondary"
          circle
          class="strategy-item__action strategy-item__actions__id"
        >
          #{{ strategy.id }}
        </el-button>
      </el-tooltip> -->

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
  </article>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StrategyDetails',

  computed: {
    ...mapGetters(['getStrategiesById']),

    strategy() {
      return this.getStrategiesById(this.$route?.params?.id || -1)
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
}
</style>
