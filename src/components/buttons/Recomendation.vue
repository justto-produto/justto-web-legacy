<template>
  <article class="recomendations-container">
    <el-popover
      placement="top-start"
      title="Titulo da recomendação aqui"
      width="200"
      trigger="hover"
    >
      <span slot="reference">
        <JusIcon icon="recomendation-lamp" />
      </span>

      <div>
        Recomendações aqui
      </div>
    </el-popover>
  </article>
</template>

<script>
export default {

}
</script>

<style scoped>
.recomendations-container {
  cursor: pointer;

  position: absolute;
  top: 0;
  right: 0;

  margin: 4px 8px 0 0;
}
</style>
