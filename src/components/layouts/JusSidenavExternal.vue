<template>
  <div class="jus-sidenav-external">
    <a href="#" @click="$router.push('/')">
      <img class="jus-sidenav-externa__logo" src="@/assets/logo.svg">
    </a>
  </div>
</template>

<script>

export default {
  name: 'JusSidenavexternal'
}
</script>

<style lang="scss">
.jus-sidenav-external{
  height: 100%;
  background-color: #f7f7f7;
}
.jus-sidenav-externa__logo{
  margin: 40px;
}
</style>
