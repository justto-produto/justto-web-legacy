<template>
  <div class="external-sidenav">
    <a href="#" @click="$router.push('/')">
      <img class="external-sidenav__logo" src="@/assets/logo.svg">
    </a>
  </div>
</template>

<style lang="scss">
.external-sidenav{
  background-color: #fafafa;
  height: 100%;
  .external-sidenav__logo{
    margin: 40px;
  }
}
</style>
