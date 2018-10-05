<template lang="html">
  <div class="onboarding-step-content">
    <div class="onboarding-step-content__title">
      <h2>Whatsapp</h2>
      <p>
        Cadastre o número que o seu escritório utiliza para fazer contato com as partes, utilizando o QR CODE abaixo:
      </p>
    </div>
    <img src="@/assets/qrcode.svg" style="border: 1px solid #eee; margin-bottom: 20px;" @click="scan = !scan">
    <div class="">
      Status:
      <strong style="margin: 0 10px">{{ message }}</strong>
      <JusStatusDot :type="type"/>
    </div>
    <el-button :disabled="!scan" type="primary" @click="$emit('onboarding:step:next')">Próximo</el-button>
    <el-button type="text" @click="$emit('onboarding:step:next')">Pular</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      scan: false
    }
  },
  computed: {
    message () {
      return this.scan ? 'CONEXÃO ATIVA' : 'AGUARDANDO ESCANEAMENTO'
    },
    type () {
      return this.scan ? 'success' : 'warning'
    }
  }
}
</script>

<style lang="scss">
</style>
