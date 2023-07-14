<template>
  <article class="party-address__container">
    <div>{{ rua }}</div>
    <div>{{ cidade }}</div>
  </article>
</template>

<script>
export default {
  props: {
    address: {
      type: Object,
      required: true
    }
  },

  computed: {
    rua() {
      const {
        complemento,
        numero,
        tipoLogradouro,
        bairro,
        logradouro
      } = this.address

      return `${tipoLogradouro} ${logradouro}${complemento ? ' - ' + complemento : ''}, ${numero ? 'nº ' + numero : 's/n'} - ${bairro}`
    },

    cidade() {
      const {
        cidade,
        uf,
        cep
      } = this.address

      return `${cidade} - ${uf}, ${cep}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .party-address__container {
    margin: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    padding: 6px 3px 6px 18px;
    border-radius: 4px;
    -webkit-transition: 0.2s ease-out all;
    transition: 0.2s ease-out all;
    position: relative;
  }
</style>
