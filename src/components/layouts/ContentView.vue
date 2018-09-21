<template lang="html">
  <div class="content-view">
    <h1><slot name="title"></slot></h1>
    <div class="display-flex">
      <el-card class="content-view__main-card">
        <slot name="main"></slot>
      </el-card>
      <div v-if="this.$slots['aside']">
        <el-card v-if="sideCard" class="content-view__card">
          <slot name="aside"></slot>
        </el-card>
        <div v-else class="content-view__card content-view__card--transparent">
          <slot name="aside"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sideCard: Boolean
  }
}
</script>

<style lang="scss">
.content-view {
  margin: 10px 20px 0;
  .content-view__main-card {
    width: 100%;
    min-height: calc( 100vh - 180px );
    margin-bottom: 20px;
  }
  .content-view__card {
    margin-left: 20px;
    margin-right: 20px;
    width: 300px;
    position: sticky;
    top: 40px;
    &.content-view__card--transparent {
      padding:  0 20px;
      width: 260px;
    }
  }
}
</style>
