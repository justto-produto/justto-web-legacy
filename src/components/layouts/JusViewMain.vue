<template>
  <div class="jus-main-view">
    <h1 v-if="this.$slots['title']"><slot name="title"/></h1>
    <div class="jus-main-view__horizontal">
      <el-card class="jus-main-view__main-card">
        <slot name="main"/>
      </el-card>
      <div v-if="this.$slots['aside']">
        <el-card
          :class="{'jus-main-view__side-card--transparent': !sideCard}"
          class="jus-main-view__side-card"
          :style="{width: sideCardWidth + 'px'}">
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
    sideCard: {
      default: false,
      type: Boolean
    },
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
  min-height: calc( 100vh - 180px );
}
.jus-main-view__side-card {
  margin-left: 20px;
  position: sticky;
  top: 40px;
  &.jus-main-view__side-card--transparent {
    padding:  0 20px;
    width: 260px;
  }
  .jus-main-view__aside-action {
    min-width: 100%;
  }
}
</style>
