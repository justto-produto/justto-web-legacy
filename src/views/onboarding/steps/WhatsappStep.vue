<template>
  <div class="onboarding-step-content onboarding-whatsapp-step">
    <div class="onboarding-step-content__title">
      <h2>Whatsapp</h2>
      <p>
        Mais adiante você poderá ver as mensagens que nosso sistema enviará. Contudo, é importante que você sincronize
        o número que a sua equipe utiliza para fazer contato com as partes, para que as respostas sejam capturadas
        pela plataforma.
      </p>
    </div>
    <jus-whatsapp :number.sync="number" />
    <el-button type="primary" @click="nextStep()">Próximo</el-button>
  </div>
</template>

<script>
export default {
  components: {
    JusWhatsapp: () => import('@/components/layouts/JusWhatsapp')
  },
  data () {
    return {
      number: ''
    }
  },
  methods: {
    nextStep () {
      window.analytics.track('Pulada a sincronização de WhatsApp')
      this.$emit('onboarding:step:next')
    }
  }
}
</script>

<style lang="scss">
</style>
