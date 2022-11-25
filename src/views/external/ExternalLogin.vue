<template>
  <div class="external-view">
    <el-container>
      <el-aside
        width="50%"
        class="hidden-sm-and-down"
      >
        <jus-sidenav-external />
      </el-aside>

      <el-main class="display-flex position-relative">
        <jus-button-back to="/login" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'ExternalLogin',

  components: {
    JusSidenavExternal: () => import('@/components/layouts/JusSidenavExternal')
  }
}
</script>

<style lang="scss">
  .external-view {
    height: 100vh;
  }
</style>
