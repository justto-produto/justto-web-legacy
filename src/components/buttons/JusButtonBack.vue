<template lang="html">
  <div class="jus-button-back" @click="$router.push(to)">
    <JusIcon icon="back"/> Voltar
  </div>
</template>

<script>
export default {
  name: 'JusButtonBack',
  props: {
    to: {
      default: '',
      type: String
    }
  }
}
</script>

<style lang="scss">
.jus-button-back {
  position: absolute;
  top: 36px;
  left: 36px;
  color: initial;
  cursor: pointer;
  img{
    vertical-align: middle;
    margin-right: 4px;
  }
}
</style>
