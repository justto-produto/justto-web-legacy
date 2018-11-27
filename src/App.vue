<template>
  <div id="app">
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('my')
  }
}
</script>
