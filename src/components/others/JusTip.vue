<template>
  <div class="jus-tip">
    <span
      class="jus-tip__throbber"
      @click="open"
    />
  </div>
</template>

<script>
export default {
  name: 'JusTip',
  methods: {
    open() {
      this.$confirm('Essa é uma dica pra você ficar esperto ;)', 'Dica!', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Beleza',
        cancelButtonText: 'Não exibir mais dicas',
        cancelButtonClass: 'is-plain'
      }).catch(() => {
        this.$message({
          message: 'Ok'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.jus-tip {
  visibility: visible;
  top: 12px;
  right: 8px;
  position: absolute;
  .jus-tip__throbber {
    background: #ff8e00;
    border-radius: 100%;
    box-shadow: 0 0 0 2px #ff8e00;
    display: block  !important;
    height: 14px !important;
    position: relative;
    width: 14px !important;
    visibility: visible !important;
    overflow: initial !important;
    &:before {
      animation-delay: .2s;
      animation-duration: 1.5s;
      animation-fill-mode: forwards;
      animation-iteration-count: infinite;
      animation-name: throbber-pulse,throbber-fade;
      animation-timing-function: ease-in-out;
      background: hsla(0,0%,100%,.4);
      border: 2px solid hsla(0,0%,100%,.1);
      border-radius: 100%;
      box-shadow: 0 0 0 2px #ff8e00;
      content: "";
      display: block;
      height: 22px;
      left: 50%;
      margin: -13px 0 0 -13px;
      pointer-events: none;
      position: absolute;
      top: 50%;
      width: 22px;
    }
  }
}
</style>
