<template>
  <article class="reports-container">
    <div class="reports-container__list">
      <el-link
        class="el-button reports-container__list-item"
        href="/#/reports/management"
        :underline="false"
      >
        Relatório Gerencial
      </el-link>

      <el-link
        class="el-button reports-container__list-item"
        href="/#/reports/managerial"
        :underline="false"
      >
        Relatório Gestão
      </el-link>
      <!-- <el-button class="reports-container__list-item">
        Relatório Gerencial
      </el-button>

      <el-button class="reports-container__list-item">
        Relatório Gestão
      </el-button> -->
    </div>

    <div class="reports-container__report">
      <router-view />
    </div>
  </article>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.reports-container {
  display: flex;

  .reports-container__list {
    width: 200px;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 8px;
    border-right: $--border-base;

    .reports-container__list-item {
      margin: 0;
    }
  }

  .reports-container__report {
    display: flex;
    width: calc(100vw - 200px - 58px);
  }
}
</style>
