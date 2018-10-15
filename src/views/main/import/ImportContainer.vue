<template>
  <div class="import-container">
    <h1>Novos casos</h1>
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
    >h1 {
      margin-left: 20px;
    }
  }
</style>
