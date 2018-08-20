<template>
  <div id="app">
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>

<style>
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";
body, html, #app{
  height: 100%;
  margin: 0;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .3s
}
.fade-enter, .fade-leave-to {
    opacity: 0
}
</style>
