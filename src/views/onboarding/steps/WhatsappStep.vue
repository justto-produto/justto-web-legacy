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
    <el-button :disabled="!$store.getters.isWhatsappConnected" type="primary" @click="$emit('onboarding:step:next')">Próximo</el-button>
    <el-button type="text" @click="nextStep()">Pular</el-button>
  </div>
</template>

<script>
import JusWhatsapp from '@/components/layouts/JusWhatsapp'

export default {
  components: {
    JusWhatsapp
  },
  data () {
    return {
      number: ''
    }
  },
  methods: {
    syncWhats () {
      window.analytics.track('WhatsApp sincronizado', { number: this.$store.state.whatsappModule.number })
    },
    nextStep () {
      window.analytics.track('Pulada a sincronização de WhatsApp')
      $emit('onboarding:step:next')
    }
  }
}
</script>

<style lang="scss">
</style>
