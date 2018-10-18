<template lang="html">
  <div class="main-view">
    <h1 v-if="this.$slots['title']"><slot name="title"/></h1>
    <div class="display-flex">
      <el-card class="main-view__main-card">
        <slot name="main"/>
      </el-card>
      <div v-if="this.$slots['aside']">
        <el-card v-if="sideCard" class="main-view__card">
          <slot name="aside"/>
        </el-card>
        <div v-else class="main-view__card main-view__card--transparent">
          <slot name="aside"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JusViewMain',
  props: {
    sideCard: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<style lang="scss">
.main-view {
  position: relative;
  margin: 0 20px 20px;
  .main-view__main-card {
    width: 100%;
    min-height: calc( 100vh - 180px );
  }
  .main-view__card {
    margin-left: 20px;
    width: 300px;
    position: sticky;
    top: 40px;
    &.main-view__card--transparent {
      padding:  0 20px;
      width: 260px;
    }
  }
}
</style>
