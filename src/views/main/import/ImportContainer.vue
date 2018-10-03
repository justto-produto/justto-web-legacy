<template>
  <div class="import-container">
    <h1>Importação</h1>
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'Import'
}
</script>

<style lang="scss">
  .import-container {
    margin: 10px 20px 20px;
    .view-import__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .step-main {
      margin-top: 60px;
      >h2, >p {
        text-align: center;
      }
      button{
        width: 100%;
        max-width: 400px;
        margin: auto;
        display: block;
      }
    }

  }
</style>
