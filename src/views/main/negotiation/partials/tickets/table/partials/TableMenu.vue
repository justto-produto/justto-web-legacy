<template>
  <article
    class="ticket-table-menu"
    :class="{'keep-original': keepOriginal}"
  >
    <el-popover
      ref="menuPopover"
      placement="bottom-end"
      trigger="click"
      popper-class="ticket-table-menu__popover"
    >
      <MenuOptions @hide="handleHide" />

      <el-button
        slot="reference"
        :type="keepOriginal ? 'default' : 'text'"
      >
        <span class="ticket-table-menu__icon">
          <jus-icon icon="omnichannel-menu" />
        </span>
      </el-button>
    </el-popover>
  </article>
</template>

<script>
export default {
  components: {
    MenuOptions: () => import('./MenuOptions')
  },

  props: {
    keepOriginal: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleHide() {
      if (this.$refs?.menuPopover) {
        this.$refs.menuPopover.showPopper = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.ticket-table-menu:not(.keep-original) {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  margin: 3.5pc 1.1pc 0 0;

  .el-button {
    padding: 8px 0;

    .ticket-table-menu__icon {
      display: flex;
      align-items: center;
      gap: 4px;

      img {
        width: 24px;
      }
    }
  }
}

.ticket-table-menu.keep-original {
  margin-left: 10px;

  .el-button {
    padding: 12px 20px;

    img {
      height: 15px;
    }
  }
}
</style>

<style lang="scss">
.ticket-table-menu__popover {
  margin-top: 0 !important;
}
</style>
