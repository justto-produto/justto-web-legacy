<template>
  <transition name="modal">
    <div class="jus-modal__mask">
      <div class="jus-modal__wrapper">
        <el-card class="jus-modal__container">
          <div class="jus-modal__header">
            <slot name="header"/>
          </div>
          <div class="jus-modal__body">
            <slot name="body"/>
          </div>
          <div class="jus-modal__footer">
            <slot name="footer"/>
          </div>
        </el-card>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'JusModal'
}
</script>

<style lang="scss">
.jus-modal__mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0, 0.5);
  display: table;
  transition: opacity .3s ease;
}
.jus-modal__wrapper {
  display: table-cell;
  vertical-align: middle;
}
.jus-modal__container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}
.jus-modal__header {
  width: 100%;
}
.jus-modal__body {
  margin: 20px 0;
  width: 100%;
}
.jus-modal__footer {
  width: 100%;
}
</style>
