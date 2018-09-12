<template lang="html">
  <el-container class="content-view">
    <el-main class="content-view__left">
      <slot name="content-title"></slot>
      <el-card class="content-view__card">
        <slot name="content-left"></slot>
      </el-card>
    </el-main>
    <el-aside width="300px" class="content-view__right">
      <slot name="content-right"></slot>
    </el-aside>
  </el-container>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.content-view {
  .content-view__left {
    margin: 0 0 40px 20px;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .content-view__card {
    height: 100%;
  }
  .content-view__right {
    padding: 125px 30px 40px;
    margin: auto;
  }
}
</style>
