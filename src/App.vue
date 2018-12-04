<template>
  <div id="app">
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  beforeCreate () {
    if (this.$store.getters.isLoggedIn) {
      Promise.all([this.$store.dispatch('myAccount'), this.$store.dispatch('myWorkspace')]).then(() => {
        if (!this.$store.getters.hasWorkspace) {
          this.$router.push('onboarding')
        }
      })
    }
  }
}
</script>
