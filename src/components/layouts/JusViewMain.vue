<template>
  <div class="jus-main-view">
    <h1 v-if="this.$slots['title']"><slot name="title"/></h1>
    <div class="jus-main-view__horizontal">
      <el-card class="jus-main-view__main-card">
        <slot name="main"/>
      </el-card>
      <div v-if="this.$slots['aside']">
        <el-card
          :style="{width: sideCardWidth + 'px'}"
          class="jus-main-view__side-card">
          <slot name="aside"/>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JusViewMain',
  props: {
    sideCardWidth: {
      default: '300',
      type: String
    }
  }
}
</script>

<style lang="scss">
.jus-main-view {
  position: relative;
  margin: 0 20px 20px;
}
.jus-main-view__horizontal {
  display: flex;
}
.jus-main-view__main-card {
  width: 100%;
  height: calc( 100vh - 180px );
  overflow-y: auto;
}
.jus-main-view__side-card {
  display: flex;
  margin-left: 20px;
  // position: sticky;
  top: 20px;
  height: calc( 100vh - 180px );
  overflow-y: auto;
  > .el-card__body {
    margin: auto;
  }
  .el-card {
    margin-bottom: 20px;
  }
}
.jus-main-view__aside-action {
  min-width: 100%;
}
</style>
