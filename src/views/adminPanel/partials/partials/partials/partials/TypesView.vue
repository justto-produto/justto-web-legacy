<template>
  <article class="types-view__container">
    <p class="types-view__title">
      Tipos:
    </p>

    <div class="types-view__items">
      <el-tag
        v-for="type in types"
        :key="`type#${type}`"
        size="small"
        effect="plain"
        class="types-view__item"
      >
        {{ $tc(`strategyTypes.${type}`) }}
      </el-tag>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    types: {
      type: Array,
      required: true
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
  background-color: $--color-primary-light-9;

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
