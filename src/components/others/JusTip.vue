<template>
  <div class="jus-tip">
    <a class="jus-tip__trigger">
      <span class="jus-tip__throbber"/>
    </a>
  </div>
</template>

<script>
export default {
  name: 'JusTip'
}
</script>

<style lang="scss">

.jus-tip {
  .jus-tip {
    visibility: visible;
    top: 0px;
    right: -4px;
    position: absolute;
    z-index: 998;
  }
  .jus-tip__trigger {
    align-items: center;
    display: flex;
    height: 50px;
    justify-content: center;
    position: relative;
    width: 50px;
  }
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
  @keyframes throbber-fade {
    0%,to {
      opacity: .5
    }
    40%,60% {
      opacity: .8
    }
  }
  @keyframes throbber-pulse {
    0%,to {
      transform: scale3d(.5,.5,1)
    }
    50% {
      transform: scaleX(1)
    }
  }
}
</style>
