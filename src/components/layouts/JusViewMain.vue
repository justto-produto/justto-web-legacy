<template>
  <div :class="{'fullScreen': fullScreen}" class="jus-main-view">
    <!-- TITLE SLOT -->
    <div v-if="this.$slots['title']" class="jus-main-view__title">
      <slot name="title"/>
    </div>
    <div v-loading="loadingContainer" class="jus-main-view__container">
      <!-- LEFT CARD SLOT -->
      <div v-if="this.$slots['left-card']">
        <el-card
          :style="{width: leftCardWidth + 'px'}"
          class="jus-main-view__left-card">
          <slot name="left-card"/>
        </el-card>
      </div>
      <!-- ACTIONS SLOT -->
      <slot name="actions"/>
      <!-- MAIN CARD SLOT -->
      <el-card
        v-loading="loadingMain"
        element-loading-text="Carregando disputas..."
        class="jus-main-view__main-card">
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
    },
    loadingMain: {
      default: false,
      type: Boolean
    },
    loadingContainer: {
      default: false,
      type: Boolean
    },
    fullScreen: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<style lang="scss">
.jus-main-view {
  height: calc(100% - 60px);
  &__title {
    margin: 40px 20px 0px;
    padding-bottom: 20px;
    h1 {
      font-weight: 500;
      margin: 20px 0 0;
      img {
        margin: 0 10px 2px 0;
      }
    }
  }
  &__container {
    overflow-x: auto;
    padding: 20px;
    display: flex;
    height: calc(100% - 37px);
    > .el-loading-mask {
      background-color: rgba(246, 245, 246, 0.89);
      margin: 20px;
    }
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
    height: 100%;
    overflow-y: auto;
    .el-card__body {
      width: 100%;
    }
  }
  &--full-height {
    height: auto;
  }
  &.fullScreen {
    height: 100%;
    .jus-main-view__container {
      height: 100%;
    }
    .jus-main-view__right-card {
      height: 100%;
    }
  }
}
</style>
