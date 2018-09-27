<template lang="html">
  <div class="back-button" @click="$router.push(to)">
    <jus-icon icon="back"/> Voltar
  </div>
</template>

<script>
export default {
  name: 'BackButton',
  props: ['to']
}
</script>

<style lang="scss">
.back-button {
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
