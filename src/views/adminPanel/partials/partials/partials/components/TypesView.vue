<template>
  <article class="types-view__container">
    <p class="types-view__title">
      Tipos:
    </p>

    <el-select
      v-if="active"
      :value="types"
      filterable
      multiple
      placeholder="Selecione tipos"
      @change="handleEdit"
    >
      <el-option
        v-for="(type, index) in defaultStrategyTypes"
        :key="index"
        :label="$t(`strategyTypes.${type}`).toUpperCase()"
        :value="type"
      />
    </el-select>

    <div
      v-else
      class="types-view__items"
    >
      <el-tag
        v-for="type in types"
        :key="`type#${type}`"
        size="small"
        class="types-view__item"
      >
        {{ $tc(`strategyTypes.${type}`) }}
      </el-tag>
    </div>
  </article>
</template>

<script>
const defaultStrategyTypes = ['COMMUNICATION', 'PAYMENT', 'RECOVERY', 'OBLIGATION', 'DISCOUNT', 'MULTI_PARTY_NEGOTIATION', 'LEGAL_MKT']

export default {
  props: {
    types: {
      type: Array,
      required: true
    },

    active: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({ defaultStrategyTypes }),

  methods: {
    handleEdit(types) {
      this.$emit('edit', types)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.types-view__container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 4px;
  padding: 4px 4px 8px;
  font-weight: 500;

  .types-view__title {
    margin: 0;
    text-align: center;
  }

  .types-view__items {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;

    .types-view__item {
      flex: 1;
      text-align: center;
      text-transform: uppercase;
    }
  }
}
</style>
