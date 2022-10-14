<template>
  <article class="ticket-table-menu">
    <el-popover
      ref="menuPopover"
      placement="bottom-end"
      trigger="click"
      popper-class="ticket-table-menu__popover"
    >
      <MenuOptions @hide="handleHide" />

      <el-button
        slot="reference"
        size="small"
        type="text"
      >
        <span class="ticket-table-menu__icon">
          <jus-icon icon="omnichannel-menu" />
          <!-- <i class="el-icon-caret-bottom" /> -->
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
@import '@/styles/colors.scss';

.ticket-table-menu {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  margin: 3.5pc 1pc 0 0;

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
</style>

<style lang="scss">
.ticket-table-menu__popover {
  margin-top: 0 !important;
}
</style>
