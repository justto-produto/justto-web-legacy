<template>
  <transition name="modal">
    <div class="jus-modal__mask">
      <div class="jus-modal__wrapper">
        <el-card class="jus-modal__container">
          <div class="jus-modal__header">
            <button class="jus-modal__close" @click="$emit('modal:close')">
              <i class="el-icon-close" />
            </button>
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
.jus-modal {
  &__mask {
    position: fixed;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0, 0.5);
    display: table;
    transition: opacity .3s ease;
  }
  &__wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  &__container {
    width: 600px;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
  }
  &__header {
    position: relative;
    width: 100%;
  }
  &__body {
    padding-top: 20px;
    width: 100%;
  }
  &__footer {
    text-align: right;
    padding-top: 20px;
  }
  &__close {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
