<template>
  <div class="jus-main-view">
    <!-- TITLE SLOT -->
    <div v-if="this.$slots['title']" class="jus-main-view__title">
      <slot name="title"/>
    </div>
    <div class="jus-main-view__container">
      <!-- LEFT CARD SLOT -->
      <div v-if="this.$slots['left-card']">
        <el-card
          :style="{width: leftCardWidth + 'px'}"
          class="jus-main-view__left-card">
          <slot name="left-card"/>
        </el-card>
      </div>
      <!-- MAIN CARD SLOT -->
      <el-card class="jus-main-view__main-card">
        <slot name="main"/>
      </el-card>
      <!-- RIGHT CARD SLOT -->
      <div v-if="this.$slots['right-card']">
        <el-card
          :style="{width: rightCardWidth + 'px'}"
          class="jus-main-view__right-card">
          <slot name="right-card"/>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JusViewMain',
  props: {
    rightCardWidth: {
      default: '300',
      type: String
    },
    leftCardWidth: {
      default: '300',
      type: String
    }
  }
}
</script>

<style lang="scss">
.jus-main-view {
  height: calc(100% - 20px);
  &__title {
    h1 {
      font-weight: 500;
    }
  }
  &__container {
    padding-top: 20px;
    display: flex;
    height: calc(100% - 43px);
  }
  &__main-card {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  &__left-card {
    margin-right: 20px;
  }
  &__right-card {
    margin-left: 20px;
  }
  &__left-card, &__right-card {
    display: flex;
    max-height: 100%;
    overflow-y: auto;
    .el-card__body {
      width: 100%;
    }
  }
}
</style>
