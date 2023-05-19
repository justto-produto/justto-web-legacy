<template>
  <article class="workspaces-view__container">
    <p class="workspace-view__title">
      Workspaces:
    </p>

    <div class="workspaces-view__items">
      <el-tag
        v-for="item in workspaces"
        :key="`workspace#${item.id}`"
        size="small"
        class="workspaces-view__item"
      >
        {{ item.name }}
      </el-tag>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    workspaces: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.workspaces-view__container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 4px;
  padding: 4px 4px 8px;
  font-weight: 500;
  background-color: $--pj-color-disabled-blue;

  .workspace-view__title {
    margin: 0;
    text-align: center;
  }

  .workspaces-view__items {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;

    .workspaces-view__item {
      flex: 1;
      text-align: center;
    }
  }
}
</style>
