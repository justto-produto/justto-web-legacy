<template>
  <div
    :class="{'fullScreen': fullScreen}"
    class="jus-main-view"
  >
    <!-- TITLE SLOT -->
    <!-- <div v-if="this.$slots['title']" class="jus-main-view__title">
      <slot name="title"/>
    </div> -->
    <div
      v-loading="loadingContainer"
      class="jus-main-view__container"
    >
      <!-- LEFT CARD SLOT -->
      <div v-if="this.$slots['left-card']">
        <el-card
          :style="{width: leftCardWidth + 'px'}"
          class="jus-main-view__left-card"
        >
          <slot name="left-card" />
        </el-card>
      </div>
      <!-- MAIN CARD SLOT -->
      <el-card
        v-loading="loadingMain"
        element-loading-text="Carregando disputas..."
        class="jus-main-view__main-card"
      >
        <slot name="main" />
      </el-card>
      <!-- RIGHT CARD SLOT -->
      <div v-if="this.$slots['right-card']">
        <el-card
          :class="{'jus-main-view__zero-width': rightCardCollapsed}"
          :style="{width: rightCardWidth + 'px'}"
          class="jus-main-view__right-card"
        >
          <slot name="right-card" />
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
      type: String,
    },
    rightCardCollapsed: {
      default: false,
      type: Boolean,
    },
    leftCardWidth: {
      default: '300',
      type: String,
    },
    loadingMain: {
      default: false,
      type: Boolean,
    },
    loadingContainer: {
      default: false,
      type: Boolean,
    },
    fullScreen: {
      default: false,
      type: Boolean,
    },
  },
}
</script>

<style lang="scss">
.jus-main-view {
  height: 100%;
  min-width: 1024px;
  // &__title {
  //   margin: 20px 20px 0px 24px;
  //   h1 {
  //     font-weight: 500;
  //     margin: 20px 0 0;
  //     img {
  //       margin: 0 10px 2px 0;
  //     }
  //   }
  // }
  &__container {
    overflow-x: auto;
    padding: 20px;
    display: flex;
    height: 100%;
    > .el-loading-mask {
      background-color: rgba(246, 245, 246, 0.89);
      margin: 20px;
    }

    @media (max-height: 680px) {
      padding: 5px;
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
    margin-top: 10px;
    margin-left: -4px;
    background-color: #F7F7F7;
    .el-card__body {
      padding-left: 24px;
    }
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
      height: calc(100% - 20px);
    }
  }
  &__zero-width{
    width: 0 !important;
  }
}
</style>
