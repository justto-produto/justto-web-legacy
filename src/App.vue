<template>
  <div id="app">
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat');
html{
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  color: #424242;
}
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
.el-form-item__error{
  right: 0;
  top: -25px !important;
  left: unset !important;
}
</style>
