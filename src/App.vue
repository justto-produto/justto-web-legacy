<template>
  <div id="app">
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    // this.$stomp.subscribe('teste')
  }
}
</script>
