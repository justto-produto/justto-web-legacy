<template>
  <article class="ticket-table-menu">
    <el-popover
      placement="bottom-end"
      trigger="click"
      popper-class="ticket-table-menu__popover"
    >
      <MenuOptions />

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
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.ticket-table-menu {
  position: absolute;
  top: 0;
  right: 0;
  margin: 25px 0px 0 0;

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
