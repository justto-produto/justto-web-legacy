<template>
  <div class="jus-button-back" @click="$router.push(to)">
    <jus-icon icon="back"/> Voltar
  </div>
</template>

<script>

/**
 * Botão flutuante com ícone de voltar.
 */
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
  top: 40px;
  left: 20px;
  color: initial;
  cursor: pointer;
  img{
    vertical-align: middle;
    margin-right: 10px;
  }
}
</style>
