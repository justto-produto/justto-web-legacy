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
  }
</style>
