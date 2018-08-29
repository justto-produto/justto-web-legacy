<template>
  <div id="app">
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700,900');
html{
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  color: #424242;
}
body, html, #app, section{
  height: 100%;
  margin: 0;
}
.el-form-item__error{
  right: 0;
  top: -25px !important;
  left: unset !important;
}
.el-radio.is-bordered.is-checked{
  background-color: #f5f7fa;
}
.el-form--label-top .el-form-item__label{
  color: #adadad !important;
  font-size: 12px !important;
  line-height: 30px !important;
  padding: 0 !important;
}
</style>
