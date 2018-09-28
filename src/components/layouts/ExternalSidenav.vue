<template>
  <div class="external-sidenav">
    <a href="#" @click="$router.push('/')">
      <img class="external-sidenav__logo" src="@/assets/logo.svg">
    </a>
  </div>
</template>

<style lang="scss">
.external-sidenav{
  height: 100%;
  background-color: #f7f7f7;
  .external-sidenav__logo{
    margin: 40px;
  }
}
</style>
